/**
 * Edge TTS 本地服务插件（Vite dev server 中间件）
 * 把微软 Edge 浏览器"大声朗读"同源的神经音色通过 /api/tts 暴露给前端。
 * 免费、无需密钥，音色与 Azure 神经音色同款（粤语曉曼 / 普通话晓晓 / 英语 Aria 等）。
 * 协议：wss://speech.platform.bing.com consumer 端点 + Sec-MS-GEC 时间窗鉴权
 */
import type { Plugin } from 'vite';
import crypto from 'crypto';
import { WebSocket } from 'ws';

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const WSS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';

// Sec-MS-GEC 鉴权令牌（与 edge-tts 官方实现完全一致）
// 注意：哈希字符串是 ticks 在前、TOKEN 在后！
function secMsGec(): string {
  let seconds = Math.floor(Date.now() / 1000) + 11644473600; // Unix epoch → Windows epoch（秒）
  seconds -= seconds % 300;                                    // 对齐 5 分钟窗口
  const ticks = BigInt(seconds) * 10000000n;                  // 转 100ns 单位（超出JS安全整数，用BigInt）
  return crypto.createHash('sha256')
    .update(`${ticks}${TRUSTED_CLIENT_TOKEN}`, 'ascii')
    .digest('hex')
    .toUpperCase();
}

// 每个连接随机生成 muid（官方 DRM.generate_muid 逻辑）
function genMuid(): string {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

// Edge 要求的 X-Timestamp 格式
function xTimestamp(): string {
  const d = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const p = (n: number) => String(n).padStart(2, '0');
  return `${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${p(d.getUTCDate())} ${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string));
}

// 单次合成：返回 mp3 Buffer（pitch: 音高微调 Hz，用于分块朗读的语气变化）
function synthesize(voice: string, text: string, rate: number, pitch: number = 0): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const connectionId = crypto.randomUUID().replace(/-/g, '');
    const url = `${WSS_URL}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec()}&Sec-MS-GEC-Version=1-143.0.3650.75&ConnectionId=${connectionId}`;

    const ws = new WebSocket(url, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': `muid=${genMuid()};`
      }
    });

    const chunks: Buffer[] = [];
    let settled = false;
    const finish = (err: Error | null, audio?: Buffer) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { ws.close(); } catch { /* ignore */ }
      if (err) reject(err); else resolve(audio!);
    };
    const timer = setTimeout(() => finish(new Error('TTS timeout 15s')), 15000);

    ws.on('open', () => {
      // 1) speech.config
      ws.send([
        `X-Timestamp:${xTimestamp()}`,
        'Content-Type:application/json; charset=utf-8',
        'Path:speech.config',
        '',
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
              }
            }
          }
        })
      ].join('\r\n'));

      // 2) SSML：换行符转成句号（神经音色会在句号处自然停顿；Edge 接口不支持 <break> 标签）
      const lang = voice.split('-').slice(0, 2).join('-');
      const rateStr = `${rate >= 0 ? '+' : ''}${rate}%`;
      const pitchStr = `${pitch >= 0 ? '+' : ''}${pitch}Hz`;
      const normalized = text.replace(/\r?\n+/g, '。').replace(/。{2,}/g, '。');
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voice}'><prosody rate='${rateStr}' pitch='${pitchStr}'>${escapeXml(normalized)}</prosody></voice></speak>`;
      ws.send([
        `X-RequestId:${crypto.randomUUID().replace(/-/g, '')}`,
        'Content-Type:application/ssml+xml',
        `X-Timestamp:${xTimestamp()}Z`,
        'Path:ssml',
        '',
        ssml
      ].join('\r\n'));
    });

    ws.on('message', (data: any, isBinary: boolean) => {
      const buf: Buffer = Buffer.isBuffer(data) ? data : Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data);
      if (isBinary) {
        // 二进制帧：[2字节头长度][头文本][音频数据]
        if (buf.length > 2) {
          const headerLen = buf.readUInt16BE(0);
          if (buf.length > 2 + headerLen) {
            chunks.push(buf.subarray(2 + headerLen));
          }
        }
      } else {
        const msg = buf.toString('utf8');
        if (msg.includes('Path:turn.end')) {
          finish(null, Buffer.concat(chunks));
        }
      }
    });

    ws.on('error', (err: Error) => finish(err));
    ws.on('close', () => { if (!settled) finish(new Error('socket closed early')); });
  });
}

export function edgeTtsPlugin(): Plugin {
  return {
    name: 'edge-tts-server',
    configureServer(server) {
      server.middlewares.use('/api/tts', (req, res) => {
        const url = new URL(req.url || '/', 'http://localhost');
        const text = (url.searchParams.get('text') || '').slice(0, 600);
        const voice = url.searchParams.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const rate = Number(url.searchParams.get('rate') || '0');
        const pitch = Number(url.searchParams.get('pitch') || '0');

        if (!text) { res.statusCode = 400; res.end('missing text'); return; }
        // 音色白名单校验（防注入）
        if (!/^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(voice)) { res.statusCode = 400; res.end('bad voice'); return; }

        synthesize(voice, text, Math.max(-50, Math.min(50, rate)), Math.max(-50, Math.min(50, pitch)))
          .then(audio => {
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'no-store');
            res.end(audio);
          })
          .catch((err: Error) => {
            console.error('[edge-tts]', err.message);
            res.statusCode = 502;
            res.end('tts failed');
          });
      });
    }
  };
}
