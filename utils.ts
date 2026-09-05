
import { pinyin } from 'pinyin-pro';

/**
 * Rich Authentic Praises in Cantonese, Mandarin, and English
 * Note: Cantonese praises MUST use native colloquial characters (白话口语字) 
 * so that neural TTS engines pronounce them naturally without mechanical dissonance!
 */
export const CANTONESE_PRAISES = [
  '真係好叻仔喎！',
  '好犀利呀，打得又快又準！',
  '手指飛咁快，畀個讚你！',
  '好嘢！一粒字都冇錯！',
  '勁呀！連擊爆燈啦！',
  '做得好！繼續保持呢個節奏！',
  '嘩！簡直係打字小神童！',
  '好快手！一氣呵成！',
  '你好醒目呀，繼續衝！',
  '太勁啦，完全難你唔倒！',
  '滿分！真係好有天份！',
  '好威水喎，神獸都為你歡呼！'
];

export const MANDARIN_PRAISES = [
  '太棒啦！打得真准！',
  '哇，你的手指好快！',
  '太厉害啦，继续加油！',
  '一字不差，超棒！',
  '阿墨墨真是个打字小能手！',
  '哇塞，满分通关！',
  '节奏感太棒了！'
];

export const ENGLISH_PRAISES = [
  'Awesome!',
  'Super fast!',
  'Great job!',
  'Brilliant!',
  'Spot on!',
  "You're a typing star!"
];

export const getRandomPraise = (dialect: 'cantonese' | 'mandarin' | 'english' = 'cantonese'): { text: string; lang: 'zh-HK' | 'zh-CN' | 'en-US' } => {
  if (dialect === 'cantonese') {
    const text = CANTONESE_PRAISES[Math.floor(Math.random() * CANTONESE_PRAISES.length)];
    return { text, lang: 'zh-HK' };
  } else if (dialect === 'english') {
    const text = ENGLISH_PRAISES[Math.floor(Math.random() * ENGLISH_PRAISES.length)];
    return { text, lang: 'en-US' };
  } else {
    const text = MANDARIN_PRAISES[Math.floor(Math.random() * MANDARIN_PRAISES.length)];
    return { text, lang: 'zh-CN' };
  }
};

/**
 * 15 Distinct High-Contrast Candy Colors Palette
 * Strictly mapped to word index 1..15 from easy to challenge
 */
export interface VocabPaletteItem {
  index: number;
  name: string;
  pill: string;
  badge: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  numberTag: string;
}

export const VOCAB_15_COLOR_PALETTE: VocabPaletteItem[] = [
  { index: 1, name: '嫩芽绿', pill: 'bg-[#E5F6EC] text-[#357F43] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#6BCB77] text-white', bgLight: 'bg-[#E5F6EC]', borderColor: 'border-[#C8EED4]', textColor: 'text-[#357F43]', numberTag: 'bg-[#6BCB77] text-white' },
  { index: 2, name: '暖阳橙', pill: 'bg-[#FFE9E0] text-[#E0633A] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#FF8A5C] text-white', bgLight: 'bg-[#FFE9E0]', borderColor: 'border-[#FFD1BE]', textColor: 'text-[#E0633A]', numberTag: 'bg-[#FF8A5C] text-white' },
  { index: 3, name: '晴空蓝', pill: 'bg-[#E3F2FA] text-[#2E93C4] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#4FB8E7] text-white', bgLight: 'bg-[#E3F2FA]', borderColor: 'border-[#BBE2F2]', textColor: 'text-[#2E93C4]', numberTag: 'bg-[#4FB8E7] text-white' },
  { index: 4, name: '草莓粉', pill: 'bg-[#FFE9F0] text-[#D14D72] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#FF8FAB] text-white', bgLight: 'bg-[#FFE9F0]', borderColor: 'border-[#FFD3E0]', textColor: 'text-[#D14D72]', numberTag: 'bg-[#FF8FAB] text-white' },
  { index: 5, name: '梦幻紫', pill: 'bg-[#F3E9FA] text-[#8258C7] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#A57DE0] text-white', bgLight: 'bg-[#F3E9FA]', borderColor: 'border-[#E2D0F2]', textColor: 'text-[#8258C7]', numberTag: 'bg-[#A57DE0] text-white' },
  { index: 6, name: '薄荷青', pill: 'bg-[#E2F7F3] text-[#2A9D8C] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#5FD0C8] text-white', bgLight: 'bg-[#E2F7F3]', borderColor: 'border-[#C4EBE5]', textColor: 'text-[#2A9D8C]', numberTag: 'bg-[#5FD0C8] text-white' },
  { index: 7, name: '蜜桔橘', pill: 'bg-[#FFEFE3] text-[#D97B29] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#FFA94D] text-white', bgLight: 'bg-[#FFEFE3]', borderColor: 'border-[#FFD9AE]', textColor: 'text-[#D97B29]', numberTag: 'bg-[#FFA94D] text-white' },
  { index: 8, name: '星光蓝', pill: 'bg-[#E8EEFF] text-[#4A6FE3] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#7C9AF5] text-white', bgLight: 'bg-[#E8EEFF]', borderColor: 'border-[#D3DEFF]', textColor: 'text-[#4A6FE3]', numberTag: 'bg-[#7C9AF5] text-white' },
  { index: 9, name: '樱花粉', pill: 'bg-[#FFEDF3] text-[#E0559B] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#FF9ECB] text-white', bgLight: 'bg-[#FFEDF3]', borderColor: 'border-[#FFD4E8]', textColor: 'text-[#E0559B]', numberTag: 'bg-[#FF9ECB] text-white' },
  { index: 10, name: '柠檬黄', pill: 'bg-[#FFF8DE] text-[#A98A00] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#FFE066] text-[#7A4A00]', bgLight: 'bg-[#FFF8DE]', borderColor: 'border-[#FFEFB0]', textColor: 'text-[#A98A00]', numberTag: 'bg-[#FFE066] text-[#7A4A00]' },
  { index: 11, name: '湖水青', pill: 'bg-[#E0F4F7] text-[#1D8A9E] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#4DC3D9] text-white', bgLight: 'bg-[#E0F4F7]', borderColor: 'border-[#BEE7EE]', textColor: 'text-[#1D8A9E]', numberTag: 'bg-[#4DC3D9] text-white' },
  { index: 12, name: '栗子棕', pill: 'bg-[#F5EDE6] text-[#8B5E3C] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#B08968] text-white', bgLight: 'bg-[#F5EDE6]', borderColor: 'border-[#E5D5C5]', textColor: 'text-[#8B5E3C]', numberTag: 'bg-[#B08968] text-white' },
  { index: 13, name: '西瓜红', pill: 'bg-[#FFE8E8] text-[#D64545] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#FF7B7B] text-white', bgLight: 'bg-[#FFE8E8]', borderColor: 'border-[#FFD1D1]', textColor: 'text-[#D64545]', numberTag: 'bg-[#FF7B7B] text-white' },
  { index: 14, name: '葡萄紫', pill: 'bg-[#F3E8FA] text-[#8E44AD] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#B678E0] text-white', bgLight: 'bg-[#F3E8FA]', borderColor: 'border-[#E4CEF5]', textColor: 'text-[#8E44AD]', numberTag: 'bg-[#B678E0] text-white' },
  { index: 15, name: '青柠绿', pill: 'bg-[#F0F9E2] text-[#6B8E23] font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-[#9CCB3B] text-white', bgLight: 'bg-[#F0F9E2]', borderColor: 'border-[#DDEEC2]', textColor: 'text-[#6B8E23]', numberTag: 'bg-[#9CCB3B] text-white' }
];

export const getPaletteByIndex = (idx: number): VocabPaletteItem => {
  return VOCAB_15_COLOR_PALETTE[Math.max(0, idx) % VOCAB_15_COLOR_PALETTE.length];
};

/**
 * Web Audio FX Engine (Zero latency retro audio synthesizer)
 */
let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

export type SoundEffectType =
  | 'click'
  | 'correct'
  | 'error'
  | 'combo'
  | 'victory'
  | 'frog_jump'
  | 'frog_splash'
  | 'mole_hit'
  | 'car_engine'
  | 'car_horn'
  | 'coin'
  | 'laser'
  | 'pop'
  | 'splash'
  | 'whoosh'
  | 'bubble'
  | 'sparkle'
  | 'bell'
  | 'wind'
  | 'cat_happy'   // 开心喵喵笑（两声上扬）
  | 'cat_sad';     // 可怜喵叫（一声下降）

export const playSoundEffect = (type: SoundEffectType, volume: number = 0.25) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume, now);

    if (type === 'click') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'cat_happy') {
      // 开心喵喵：两声短促上扬的"喵喵！"（模拟猫叫的 m→iao 滑音）
      const meow = (start: number, base: number, dur: number, vol: number) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        // "m"低起→"ia"上扬→"o"收尾的频率曲线
        osc.frequency.setValueAtTime(base * 0.75, start);
        osc.frequency.linearRampToValueAtTime(base * 1.25, start + dur * 0.35);
        osc.frequency.linearRampToValueAtTime(base * 1.05, start + dur);
        // 加颤音让声音更像猫
        const vib = ctx.createOscillator();
        const vibGain = ctx.createGain();
        vib.frequency.value = 22;
        vibGain.gain.value = base * 0.06;
        vib.connect(vibGain);
        vibGain.connect(osc.frequency);
        // 低通滤波柔化锯齿波毛刺
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2200;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(vol, start + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(lp);
        lp.connect(g);
        g.connect(ctx.destination);
        osc.start(start); osc.stop(start + dur + 0.02);
        vib.start(start); vib.stop(start + dur + 0.02);
      };
      meow(now, 620, 0.20, volume * 0.55);            // 第一声"喵"
      meow(now + 0.24, 760, 0.18, volume * 0.5);      // 第二声更高的"喵!"
    } else if (type === 'cat_sad') {
      // 可怜喵：一声长而缓慢下降的"喵…"，带微颤
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.linearRampToValueAtTime(560, now + 0.25);
      osc.frequency.linearRampToValueAtTime(330, now + 0.55);
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.value = 14;
      vibGain.gain.value = 28;
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1500;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(volume * 0.5, now + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.62);
      vib.start(now); vib.stop(now + 0.62);
    } else if (type === 'car_horn') {
      // Cheerful friendly car honk beep-beep
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(435, now);
      osc2.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc1.connect(gain);
      osc2.connect(gain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.16);
    } else if (type === 'correct') {
      // Cheerful rising major third arpeggio
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        noteGain.gain.setValueAtTime(volume * 0.5, now + i * 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.12);
        osc.connect(noteGain);
        noteGain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.15);
      });
    } else if (type === 'error') {
      // Soft gentle low double-boop
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'combo') {
      // Sparkly combo bell
      const freqs = [783.99, 1046.50, 1318.51, 1567.98];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        noteGain.gain.setValueAtTime(volume * 0.6, now + i * 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);
        osc.connect(noteGain);
        noteGain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.22);
      });
    } else if (type === 'coin') {
      // Bright mario-like coin chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain);
      osc1.start(now);
      osc1.stop(now + 0.35);
    } else if (type === 'frog_jump') {
      // Boing sound
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'frog_splash') {
      // Splash noise
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'mole_hit') {
      // Whack cartoon thud & squeak
      const osc1 = ctx.createOscillator();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(900, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.15);

      gain.gain.setValueAtTime(volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain);
      osc2.connect(gain);
      osc1.start(now);
      osc2.start(now + 0.05);
      osc1.stop(now + 0.1);
      osc2.stop(now + 0.18);
    } else if (type === 'car_engine') {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.25);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'laser') {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.07);
      gain.gain.setValueAtTime(volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'victory') {
      // Victory fanfare (C - E - G - high C)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        noteGain.gain.setValueAtTime(volume * 0.7, now + i * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + (i === 3 ? 0.6 : 0.25));
        osc.connect(noteGain);
        noteGain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + (i === 3 ? 0.65 : 0.28));
      });
    } else if (type === 'splash') {
      // Water splash: filtered noise burst with downward sweep
      const bufferSize = 0.25 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.22);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noiseSrc.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSrc.start(now);
      noiseSrc.stop(now + 0.25);
    } else if (type === 'whoosh') {
      // Movement whoosh: rapid frequency sweep
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'bubble') {
      // Fish bubble: wobbly pop
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.1);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'sparkle') {
      // Magic sparkle: quick high arpeggio
      const freqs = [1318.51, 1567.98, 2093.0, 2637.0];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);
        noteGain.gain.setValueAtTime(volume * 0.35, now + i * 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.15);
        osc.connect(noteGain);
        noteGain.connect(ctx.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.16);
      });
    } else if (type === 'bell') {
      // Temple bell for milestones: rich harmonic with long decay
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(660, now);
      osc2.frequency.setValueAtTime(990, now);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc1.connect(gain);
      osc2.connect(gain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.0);
      osc2.stop(now + 1.0);
    } else if (type === 'wind') {
      // Mountain wind: gentle noise swell
      const bufferSize = 0.6 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(1200, now + 0.3);
      filter.frequency.linearRampToValueAtTime(300, now + 0.55);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      noiseSrc.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSrc.start(now);
      noiseSrc.stop(now + 0.6);
    }
  } catch (err) {
    // AudioContext autoplay restrictions or error fallback
  }
};

/**
 * English Syllable Splitter (Rule-based, v2)
 *
 * 规则引擎（经全词库 573 词人工审计）：
 * 1. 后缀：音节-le（ta/ble、lit/tle、ap/ple）、-es/-ed 何时独立成块（watch/es、want/ed）
 *    与何时静音（names、liked、cake、horse 的魔法 e）
 * 2. 元音组内拆分：io/ia 各自成音节（li/on、pi/an/o），tion/sion 保持整体；
 *    元音间的 y 拆分（cray/on、play/er）；uie 特例（qui/et）
 * 3. 辅音簇：单个辅音归后一音节（wa/ter，用户指定兜底规则）；
 *    ck/ch 闭合前一音节（chick/en、teach/er）；th/sh/ph/wh/gh/qu 归后（mo/ther）；
 *    3+ 辅音簇优先把"合法音节起首组合"留给后一音节（mon/ster、grand/pa、
 *    bath/room、post/card），簇首二合字母闭合前一音节（black/board、eigh/teen）
 * 4. 常见不规则词（按拼写切分）走 OVERRIDE 词表
 * 5. 空格/连字符保留为独立块，支持短语（pencil box、hard-working）
 */

// 常见不规则词的标准切分（全部按原拼写切，拼接后与原词完全一致）
const SYLLABLE_OVERRIDE: Record<string, string[]> = {
  'seven': ['sev', 'en'], 'eleven': ['e', 'lev', 'en'],
  'seventeen': ['sev', 'en', 'teen'],
  'family': ['fam', 'i', 'ly'], 'animal': ['an', 'i', 'mal'],
  'elephant': ['el', 'e', 'phant'], 'vegetable': ['veg', 'e', 'ta', 'ble'],
  'birthday': ['birth', 'day'], 'river': ['riv', 'er'],
  'study': ['stud', 'y'], 'money': ['mon', 'ey'],
  'evening': ['eve', 'ning'], 'everyone': ['ev', 'ery', 'one'],
  'notebook': ['note', 'book'], 'homework': ['home', 'work'],
  'sometimes': ['some', 'times'],
  'body': ['bod', 'y'], 'panda': ['pan', 'da'], 'taxi': ['tax', 'i'],
  'shadow': ['shad', 'ow'], 'cinema': ['cin', 'e', 'ma'], 'comic': ['com', 'ic'],
  'second': ['sec', 'ond'], 'museum': ['mu', 'se', 'um'],
  'usually': ['u', 'su', 'al', 'ly'], 'very': ['ver', 'y'], 'many': ['man', 'y'],
  'idea': ['i', 'de', 'a'], 'poem': ['po', 'em'], 'science': ['sci', 'ence'],
  'heavier': ['heav', 'i', 'er'], 'healthy': ['health', 'y'], 'helpful': ['help', 'ful'],
  'hiking': ['hik', 'ing'], 'living': ['liv', 'ing'],
  'rainy': ['rain', 'y'], 'cloudy': ['cloud', 'y'], 'snowy': ['snow', 'y'],
  'playground': ['play', 'ground'], 'classmate': ['class', 'mate'],
  'businessman': ['busi', 'ness', 'man'], 'dictionary': ['dic', 'tion', 'ar', 'y'],
  'kitchen': ['kitch', 'en'], 'climbing': ['climb', 'ing'],
};

// 可以作为音节起首的辅音组合
const ONSET_CLUSTERS = [
  'bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr',
  'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'th', 'tr', 'tw', 'wh',
  'ph', 'sh', 'wr', 'qu', 'kn',
  'scr', 'shr', 'spl', 'spr', 'str', 'squ', 'thr',
];

// 辅音簇末尾最长的"合法音节起首"后缀的起始下标；找不到返回 -1
const longestOnsetSuffix = (c: string): number => {
  for (const len of [3, 2]) {
    if (c.length >= len + 1 && ONSET_CLUSTERS.includes(c.slice(c.length - len))) {
      return c.length - len;
    }
  }
  if (c.length >= 2) return c.length - 1; // 单个辅音总能做音节起首
  return -1;
};

const isVowelChar = (ch: string, idx: number): boolean =>
  'aeiou'.includes(ch) || (ch === 'y' && idx > 0);

const splitSingleWord = (word: string): string[] => {
  const lower = word.toLowerCase();
  if (word.length <= 3) return [word];
  if (SYLLABLE_OVERRIDE[lower]) return SYLLABLE_OVERRIDE[lower];
  if (/[^a-z]/.test(lower)) return [word]; // 缩写/撇号词整体返回（i'm、let's、TV）
  const chars = lower.split('');
  const n = chars.length;
  const silent = new Array<boolean>(n).fill(false);

  // ---------- 后缀处理 ----------
  if (lower.endsWith('es')) {
    const stem = lower.slice(0, -2);
    const b1 = stem.slice(-1), b2 = stem.slice(-2);
    if (b1 === 's' || b1 === 'x' || b1 === 'z' || b2 === 'ch' || b2 === 'sh') {
      return [...splitSingleWord(stem), word.slice(-2)]; // 读 /ɪs/ 的 -es
    }
    silent[n - 2] = true; // 静音 e（names、grapes）
  } else if (lower.endsWith('ed')) {
    const b1 = lower.slice(0, -2).slice(-1);
    if (b1 === 't' || b1 === 'd') {
      return [...splitSingleWord(lower.slice(0, -2)), word.slice(-2)]; // 读 /ɪd/ 的 -ed
    }
    silent[n - 2] = true; // 静音（played、liked、jumped）
  } else if (chars[n - 1] === 'e') {
    const c1 = chars[n - 2], c2 = chars[n - 3];
    if (c1 === 'l' && c2 && !isVowelChar(c2, n - 3)) {
      return [...splitSingleWord(lower.slice(0, -3)), word.slice(-3)]; // 音节 le
    }
    if (c1 && !isVowelChar(c1, n - 2)) {
      silent[n - 1] = true; // 魔法 e（cake、horse、these）
    }
  }

  // ---------- 元音组（含组内拆分） ----------
  const isV = (i: number): boolean =>
    i >= 0 && i < n && isVowelChar(chars[i], i) && !silent[i];
  const groups: Array<[number, number]> = [];
  let i = 0;
  while (i < n) {
    if (isV(i)) {
      let j = i;
      while (isV(j + 1)) j++;
      if (i === j) {
        groups.push([i, j]);
      } else {
        let start = i;
        for (let k = i; k < j; k++) {
          let cut = false;
          if (chars[k] === 'i' && (chars[k + 1] === 'o' || chars[k + 1] === 'a')
            && chars[k - 1] !== 't' && chars[k - 1] !== 's') cut = true; // io/ia（tion/sion 除外）
          if (chars[k] === 'y' && k > i && k < j) cut = true; // 元音间的 y（crayon、player）
          if (lower.slice(i, j + 1) === 'uie' && chars[k] === 'i') cut = true; // quiet
          if (cut) { groups.push([start, k]); start = k + 1; }
        }
        groups.push([start, j]);
      }
      i = j + 1;
    } else i++;
  }
  if (groups.length <= 1) return [word];

  // ---------- 辅音簇切分 ----------
  const cuts = new Set<number>();
  for (let g = 0; g < groups.length - 1; g++) {
    const [, e1] = groups[g];
    const [s2] = groups[g + 1];
    const cs = e1 + 1, ce = s2 - 1;
    const len = ce - cs + 1;
    if (len <= 0) { cuts.add(s2); continue; }        // 元音相邻
    if (len === 1) { cuts.add(cs); continue; }       // 单辅音归后（开音节）
    const c = chars.slice(cs, ce + 1).join('');
    if (len === 2) {
      if (c === 'ck' || c === 'ch') cuts.add(cs + 2); // 闭合前一音节（chicken、pocket、teacher）
      else if (['th', 'sh', 'ph', 'wh', 'gh', 'qu'].includes(c)) cuts.add(cs); // 归后（mother）
      else cuts.add(cs + 1);                          // 中间切（rabbit、window、sister）
    } else {
      const head2 = c.slice(0, 2);
      if (['ck', 'ch', 'th', 'sh', 'ph', 'wh', 'gh'].includes(head2)) {
        cuts.add(cs + 2); // 簇首二合字母闭合前一音节（blackboard、bathroom、eighteen）
      } else {
        const on = longestOnsetSuffix(c);
        cuts.add(on >= 0 ? cs + on : cs + 1); // monster、grandpa、postcard、friendly
      }
    }
  }

  // ---------- 应用切分（保留原大小写） ----------
  const sorted = [...cuts].sort((a, b) => a - b);
  const out: string[] = [];
  let prev = 0;
  for (const c of sorted) { out.push(word.slice(prev, c)); prev = c; }
  out.push(word.slice(prev));
  return out.filter(s => s);
};

export const splitSyllables = (word: string): string[] => {
  if (!word) return [word];
  // 空格/连字符保留为独立块，支持多词短语与复合词
  const tokens = word.split(/([\s-]+)/).filter(t => t.length > 0);
  const out: string[] = [];
  for (const t of tokens) {
    if (/^[\s-]+$/.test(t)) { out.push(t.includes(' ') ? ' ' : t); continue; }
    out.push(...splitSingleWord(t));
  }
  return out.length ? out : [word];
};

/**
 * Generate Pinyin for Chinese text (tone-free for keyboard typing)
 */
export const getPinyin = (text: string): string => {
  try {
    return pinyin(text, { toneType: 'none', type: 'string', v: true });
  } catch (e) {
    return text;
  }
};

/**
 * Generate Pinyin with tone symbols for visual reading
 */
export const getPinyinWithTones = (text: string): string => {
  try {
    return pinyin(text, { toneType: 'symbol', type: 'string' });
  } catch (e) {
    return text;
  }
};

/**
 * Natural voice ranking & scoring system
 */
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && window.speechSynthesis) {
  const updateVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

/**
 * High quality voice selector with Neural/Natural priority ranking
 */
export const getVoiceForLang = (lang: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const target = lang.toLowerCase().replace('_', '-');

  // Voice scoring helper
  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0;
    const vLang = v.lang.toLowerCase().replace('_', '-');
    const vName = v.name.toLowerCase();

    const isHK = target.includes('hk') || target.includes('cantonese') || target.includes('yue');
    const isZH = !isHK && (target.includes('zh') || target.includes('cmn'));
    const isEN = target.includes('en');

    if (isHK) {
      if (!vLang.includes('hk') && !vLang.includes('yue') && !vName.includes('cantonese') && !vName.includes('香港') && !vName.includes('粵語') && !vName.includes('粤语')) {
        return -1000;
      }
      // Top tier: Microsoft Natural & Neural Cantonese voices
      if (vName.includes('natural') || vName.includes('online')) score += 100;
      if (vName.includes('hiumaan') || vName.includes('hiugaai') || vName.includes('wanlung')) score += 80;
      // Google Cantonese
      if (vName.includes('google') || vName.includes('chrome')) score += 70;
      // Apple Enhanced / Siri
      if (vName.includes('enhanced') || vName.includes('sin-ji') || vName.includes('sinji') || vName.includes('tracy')) score += 65;
      // Penalize robotic desktop legacy SAPI voices
      if (vName.includes('desktop') || vName.includes('legacy')) score -= 40;
    } else if (isZH) {
      if (!vLang.includes('zh-cn') && !vLang.includes('cmn') && !vLang.includes('zh') && !vName.includes('chinese') && !vName.includes('普通话') && !vName.includes('国语')) {
        return -1000;
      }
      // Exclude HK from Mandarin
      if (vLang.includes('hk') || vName.includes('cantonese')) return -1000;

      // Top tier: Microsoft Natural / Online (Xiaoxiao, Yunxi, etc. sound remarkably human)
      if (vName.includes('natural') || vName.includes('online')) score += 100;
      if (vName.includes('xiaoxiao') || vName.includes('yunxi') || vName.includes('xiaoyi') || vName.includes('yunjian') || vName.includes('yunyang')) score += 80;
      // Google Neural Mandarin
      if (vName.includes('google') || vName.includes('chrome')) score += 70;
      // Apple Enhanced Mandarin
      if (vName.includes('enhanced') || vName.includes('ting-ting') || vName.includes('tingting') || vName.includes('meijia') || vName.includes('zhiwei')) score += 65;
      // Penalize robotic desktop SAPI voices (e.g. Huihui desktop)
      if (vName.includes('desktop') || vName.includes('legacy')) score -= 40;
    } else if (isEN) {
      if (!vLang.startsWith('en')) return -1000;
      if (vName.includes('natural') || vName.includes('online')) score += 100;
      if (vName.includes('jenny') || vName.includes('aria') || vName.includes('guy')) score += 80;
      if (vName.includes('google') || vName.includes('chrome')) score += 70;
      if (vName.includes('samantha') || vName.includes('siri') || vName.includes('enhanced')) score += 65;
      if (vName.includes('desktop') || vName.includes('legacy')) score -= 40;
    }

    return score;
  };

  const ranked = [...voices]
    .map(v => ({ voice: v, score: scoreVoice(v) }))
    .filter(item => item.score > -500)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    return ranked[0].voice;
  }

  // Fallback match
  const matched = voices.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(target.slice(0, 2)));
  return matched[0] || voices[0] || null;
};

// ============================================================
// Edge 神经语音层（通过 Vite 本地服务 /api/tts，免费无密钥）
// 音色与 Edge 浏览器"大声朗读"同源（微软 Azure 神经音色）：
//   粤语曉曼 / 普通话晓晓 / 英语 Aria —— 全部真人级自然音质
// 优先使用；服务不可用时自动回退浏览器 speechSynthesis
// ============================================================

const EDGE_VOICES: Record<string, string> = {
  'zh-HK': 'zh-HK-HiuMaanNeural',   // 粤语 · 曉曼（自然亲切）
  'zh-CN': 'zh-CN-XiaoxiaoNeural',  // 普通话 · 晓晓（温柔清晰）
  'en-US': 'en-US-AriaNeural'       // 英语 · Aria（明亮标准）
};

// 儿童友好基础语速（百分比，负数放慢）
const EDGE_BASE_RATES: Record<string, number> = {
  'zh-HK': -4,
  'zh-CN': -6,
  'en-US': -12
};

let edgeTtsFailCount = 0;
let edgeTtsDead = false;            // 连续失败后停用，直接走浏览器TTS
let currentEdgeAudio: HTMLAudioElement | null = null;
let currentEdgeStop: (() => void) | null = null;
let isPraiseSpeaking = false;        // 夸奖语音播放锁
const edgeAudioCache = new Map<string, string>();  // key → blobURL
let speechSeq = 0;                   // 朗读会话序号：打断后旧分块循环自动退出

/** 统一打断：立即停止所有正在进行的朗读（Edge 音频 + 浏览器 TTS + 分块队列） */
export const stopAllSpeech = () => {
  speechSeq++;                       // 使进行中的分块播放循环失效
  // 打断 Edge 神经语音播放
  if (currentEdgeAudio) {
    try { currentEdgeAudio.pause(); currentEdgeAudio.currentTime = 0; } catch { /* ignore */ }
    currentEdgeAudio = null;
  }
  if (currentEdgeStop) {
    try { currentEdgeStop(); } catch { /* ignore */ }
    currentEdgeStop = null;
  }
  // 打断浏览器 speechSynthesis 队列
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch { /* ignore */ }
  isPraiseSpeaking = false;
};

/** 长文本按句分块（≤maxLen）：分块合成+顺序播放，首句即出声，杜绝整篇等待与超时 */
const splitSpeechChunks = (text: string, maxLen = 70): string[] => {
  const sentences = text.replace(/\r?\n+/g, '。').match(/[^。！？!?.]+[。！？!?.]*|.+/g) || [text];
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    const t = s.trim();
    if (!t) continue;
    if (cur && (cur + t).length > maxLen) { chunks.push(cur); cur = t; }
    else cur += t;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [text];
};

const markEdgeResult = (ok: boolean) => {
  if (ok) { edgeTtsFailCount = 0; return; }
  edgeTtsFailCount++;
  if (edgeTtsFailCount >= 3) edgeTtsDead = true;
};

/** Edge 神经语音朗读：返回是否成功（失败时由调用方回退浏览器TTS） */
export const edgeTtsSpeak = (
  text: string,
  lang: 'zh-CN' | 'en-US' | 'zh-HK',
  opts?: { rate?: number; pitch?: number; voice?: string; onFinish?: () => void }
): Promise<boolean> => {
  if (edgeTtsDead || !text) return Promise.resolve(false);
  const voice = opts?.voice || EDGE_VOICES[lang] || EDGE_VOICES['zh-CN'];
  const rate = opts?.rate ?? EDGE_BASE_RATES[lang] ?? 0;
  const pitch = opts?.pitch ?? 0;
  const key = `${voice}|${rate}|${pitch}|${text}`;

  return (async (): Promise<boolean> => {
    try {
      // 缓存命中则直接播放（预取保证打字练习零延迟）
      let url = edgeAudioCache.get(key);
      if (!url) {
        const resp = await fetch(`/api/tts?voice=${voice}&rate=${rate}&pitch=${pitch}&text=${encodeURIComponent(text)}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        if (blob.size < 200) throw new Error('empty audio');
        url = URL.createObjectURL(blob);
        // 缓存上限控制（FIFO 淘汰）
        if (edgeAudioCache.size > 150) {
          const firstKey = edgeAudioCache.keys().next().value;
          if (firstKey !== undefined) {
            const old = edgeAudioCache.get(firstKey);
            if (old) URL.revokeObjectURL(old);
            edgeAudioCache.delete(firstKey);
          }
        }
        edgeAudioCache.set(key, url);
      }

      // 打断上一段
      if (currentEdgeAudio) { currentEdgeAudio.pause(); currentEdgeStop?.(); }
      currentEdgeAudio = null; currentEdgeStop = null;

      const audio = new Audio(url);
      currentEdgeAudio = audio;
      await new Promise<void>((resolve) => {
        currentEdgeStop = () => resolve();
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
      currentEdgeAudio = null; currentEdgeStop = null;
      markEdgeResult(true);
      opts?.onFinish?.();
      return true;
    } catch {
      markEdgeResult(false);
      return false;
    }
  })();
};

/** 预取音频到缓存（不播放）：让下一个词的朗读零延迟 */
const prefetchEdgeTts = (text: string, lang: 'zh-CN' | 'en-US' | 'zh-HK', pitch: number = 0) => {
  if (edgeTtsDead || !text) return;
  const voice = EDGE_VOICES[lang] || EDGE_VOICES['zh-CN'];
  const rate = EDGE_BASE_RATES[lang] ?? 0;
  const key = `${voice}|${rate}|${pitch}|${text}`;
  if (edgeAudioCache.has(key)) return;
  fetch(`/api/tts?voice=${voice}&rate=${rate}&pitch=${pitch}&text=${encodeURIComponent(text)}`)
    .then(async resp => {
      if (!resp.ok) return;
      const blob = await resp.blob();
      if (blob.size < 200) return;
      if (edgeAudioCache.size > 150) {
        const firstKey = edgeAudioCache.keys().next().value;
        if (firstKey !== undefined) edgeAudioCache.delete(firstKey);
      }
      edgeAudioCache.set(key, URL.createObjectURL(blob));
    })
    .catch(() => { /* 静默，预取失败不影响功能 */ });
};

// Pre-warmed cache for current exercise item to remove latency
interface PrewarmedAudio {
  wordText: string;
  exampleText: string;
  wordUtterance?: SpeechSynthesisUtterance;
  exampleUtterance?: SpeechSynthesisUtterance;
}

let activePrewarmed: PrewarmedAudio | null = null;

/**
 * Pre-warms utterances for upcoming word and example sentence
 * Called immediately when target word is rendered so browser prepares TTS ahead of time!
 */
export const prewarmSpeech = (
  wordText: string,
  exampleText: string,
  lang: 'zh-CN' | 'en-US' | 'zh-HK' = 'zh-CN'
) => {
  // 预取 Edge 神经音频到缓存（主路径零延迟），同时保留浏览器预构建（回退路径）
  prefetchEdgeTts(wordText, lang);
  prefetchEdgeTts(exampleText, lang);

  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    const wordUtt = new SpeechSynthesisUtterance(wordText);
    wordUtt.lang = lang;
    wordUtt.rate = lang === 'en-US' ? 0.88 : 0.95;
    wordUtt.pitch = 1.0; // 1.0 preserves natural human tone contours
    const voice = getVoiceForLang(lang);
    if (voice) wordUtt.voice = voice;

    const exampleUtt = new SpeechSynthesisUtterance(exampleText);
    exampleUtt.lang = lang;
    exampleUtt.rate = lang === 'en-US' ? 0.88 : 0.95;
    exampleUtt.pitch = 1.0;
    if (voice) exampleUtt.voice = voice;

    activePrewarmed = {
      wordText,
      exampleText,
      wordUtterance: wordUtt,
      exampleUtterance: exampleUtt
    };
  } catch (e) {
    // Ignore pre-warm failure
  }
};

/**
 * Convert standard written / Mandarin Chinese children story text
 * into authentic, lively, colloquial spoken Cantonese (白话口语化)
 * so that TTS voices sound natural, animated, and friendly like a live storyteller!
 */
export const toCantoneseColloquial = (text: string): string => {
  if (!text) return '';

  let converted = text;

  // 1. Phrasal multi-word patterns (Replace longest phrases first)
  const phraseReplacements: [RegExp, string][] = [
    [/为什么/g, '點解'],
    [/怎么样/g, '點樣'],
    [/怎么/g, '點樣'],
    [/什么/g, '乜嘢'],
    [/什么时候/g, '幾時'],
    [/小伙伴们|伙伴们|朋友们/g, '好朋友仔'],
    [/小伙伴|伙伴/g, '好朋友仔'],
    [/小动物们/g, '小動物仔'],
    [/孩子们/g, '小朋友仔'],
    [/小熊/g, '小熊仔'],
    [/小狗/g, '小狗仔'],
    [/小猫/g, '貓咪仔'],
    [/小鸭/g, '小鴨仔'],
    [/小鸟/g, '小雀仔'],
    [/小恐龙/g, '小恐龍'],
    [/太棒了/g, '真係好叻呀'],
    [/高兴地|兴奋地/g, '好開心咁'],
    [/快乐地/g, '開開心心咁'],
    [/慢慢地/g, '慢慢咁'],
    [/悄悄地/g, '靜雞雞咁'],
    [/大声地/g, '大聲咁'],
    [/飞快地|飞快/g, '好快咁'],
    [/认真地/g, '好認真咁'],
    [/喜欢/g, '鍾意'],
    [/讨厌/g, '討厭'],
    [/聪明/g, '醒目'],
    [/可爱/g, '得意'],
    [/调皮/g, '百厭'],
    [/害怕/g, '好驚'],
    [/漂亮|好看/g, '好靚'],
    [/奇怪/g, '古怪'],
    [/一起/g, '一齊'],
    [/马上|立刻/g, '即刻'],
    [/连忙|赶快/g, '快快脆'],
    [/刚好/g, '啱啱'],
    [/差点/g, '爭啲'],
    [/经常/g, '成日'],
    [/这么/g, '咁'],
    [/那么/g, '咁'],
    [/好像/g, '好似'],
    [/带着/g, '帶住'],
    [/跟着/g, '跟住'],
    [/笑着/g, '笑住'],
    [/拿着/g, '攞住'],
    [/穿上/g, '著起'],
    [/跑进/g, '跑入'],
    [/走进/g, '行入'],
    [/跳进/g, '跳入'],
    [/掉进/g, '跌入'],
    [/摔倒/g, '跌親'],
    [/发现/g, '發覺'],
    [/赢得了/g, '贏咗'],
    [/夺得/g, '攞到'],
    [/取得了/g, '攞到咗'],
    [/获得了/g, '攞到咗'],
    [/回到了/g, '返到去'],
    [/回家/g, '返屋企'],
    [/喝彩/g, '拍手掌歡呼'],
    [/正在/g, '正喺度'],
    [/非常|十分|特别/g, '好'],
    [/但是|不过/g, '但係'],
    [/不是/g, '唔係'],
    [/不会/g, '唔識'],
    [/不能|不可以/g, '唔可以'],
    [/不要/g, '唔好'],
    [/不用/g, '唔使'],
    [/没有/g, '冇'],
    [/昨天/g, '琴日'],
    [/今天/g, '今日'],
    [/明天/g, '聽日'],
    [/现在/g, '而家'],
    [/他们|她们|它们/g, '佢哋'],
    [/我们/g, '我哋'],
    [/你们/g, '你哋'],
    [/这里/g, '呢度'],
    [/那里/g, '嗰度'],
    [/这个/g, '呢個'],
    [/那个/g, '嗰個'],
    [/这些/g, '呢啲'],
    [/那些/g, '嗰啲'],
    [/看着/g, '睇住'],
    [/看见|看到/g, '睇到'],
    [/寻找|去找/g, '搵'],
    [/找到/g, '搵到'],
    [/投进|投向|投掷/g, '射入'],
    [/扔|掷|扔向/g, '掟去'],
    [/跑去/g, '跑去'],
    [/走向/g, '行去'],
    [/跳向/g, '跳去'],
    [/玩耍/g, '玩'],
    [/说话|交谈/g, '講嘢'],
    [/跑过来/g, '跑過嚟'],
    [/走过来/g, '行過嚟'],
    [/看过来/g, '睇過嚟'],
    [/突然间|突然/g, '突然之間'],
    [/一下/g, '一吓'],
    [/一点点|一些/g, '少少'],
    [/很多|好多/g, '好多'],
    [/全都/g, '冚唪唥都']
  ];

  for (const [regex, rep] of phraseReplacements) {
    converted = converted.replace(regex, rep);
  }

  // 2. Single-character and grammatical particle conversions
  const singleReplacements: [RegExp, string][] = [
    [/的/g, '嘅'],
    [/看/g, '睇'],
    [/吃/g, '食'],
    [/喝/g, '飲'],
    [/走/g, '行'],
    [/跑/g, '跑'],
    [/给/g, '畀'],
    [/让/g, '令到'],
    [/是/g, '係'],
    [/在/g, '喺'],
    [/和|跟|与/g, '同埋'],
    [/不/g, '唔'],
    [/没/g, '冇'],
    [/它|他|她/g, '佢'],
    [/谁/g, '邊個'],
    [/哪/g, '邊'],
    [/把/g, '將'],
    [/了([。！？!?\n]|$)/g, '喇$1'],
    [/了/g, '咗']
  ];

  for (const [regex, rep] of singleReplacements) {
    converted = converted.replace(regex, rep);
  }

  // 3. Smooth prosody punctuation: normalize choppy multiple punctuations
  converted = converted
    .replace(/[；;]/g, '，')
    .replace(/，{2,}/g, '，')
    .replace(/！{2,}/g, '！')
    .replace(/。{2,}/g, '。');

  return converted;
};

/**
 * Speak immediately (for word preview upon index change)
 * Does NOT cancel if praise encouragement is currently playing!
 */
export const speakDirect = (
  text: string,
  lang: 'zh-CN' | 'en-US' | 'zh-HK' = 'zh-CN',
  forceCancel: boolean = false,
  opts?: { slow?: boolean }   // slow: 语速再减慢15%（英文长故事朗读用）
) => {
  if (typeof window === 'undefined') return;
  // 夸奖语音播报中且非强制打断：让夸奖说完
  if (isPraiseSpeaking && !forceCancel) {
    return;
  }
  // 每次新朗读前先打断上一段（切换语音/点句/点按钮都从这里进，保证即点即断）
  stopAllSpeech();
  const mySeq = speechSeq;
  const cancelled = () => mySeq !== speechSeq;

  // If Cantonese requested:已是地道粤语（含粤语口语字）则直接朗读，否则做普通话→粤语口语转换
  const isAlreadyCantonese = /係|喺|嘅|咗|唔|佢|哋|畀|嘢|嚟|睇|喇|喎|吖/.test(text);
  const spokenText = (lang === 'zh-HK' && !isAlreadyCantonese) ? toCantoneseColloquial(text) : text;

  // 优先 Edge 神经音色（晓晓/Aria/曉曼），失败回退浏览器
  // slow：语速整体 ×0.85（Edge rate 按速度百分比换算，浏览器按 rate 乘法）
  const edgeBase = EDGE_BASE_RATES[lang] ?? 0;
  const edgeRate = opts?.slow ? Math.round(((1 + edgeBase / 100) * 0.85 - 1) * 100) : edgeBase;
  const baseRate = lang === 'en-US' ? 0.88 : (lang === 'zh-HK' ? 0.98 : 0.95);

  // 浏览器回退朗读（speechSynthesis 自动排队，stopAllSpeech 里 cancel 清空队列）
  const browserSpeak = (txt: string) => {
    try {
      if (!window.speechSynthesis) return;
      if (forceCancel) isPraiseSpeaking = false;
      const utterance = new SpeechSynthesisUtterance(txt);
      utterance.lang = lang;
      utterance.rate = opts?.slow ? baseRate * 0.85 : baseRate;
      utterance.pitch = 1.0;
      const voice = getVoiceForLang(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  };

  // ===== 长文本（整篇故事）：按句分块顺序播放 =====
  // 首句即出声；播放第 i 块时预取第 i+1 块（消除句间卡顿）；
  // 奇数块音高 +3Hz 微交替，朗读更富语气变化
  const chunks = spokenText.length > 60 ? splitSpeechChunks(spokenText) : [spokenText];
  if (chunks.length > 1) {
    (async () => {
      let edgeBroken = false;
      for (let i = 0; i < chunks.length; i++) {
        if (cancelled()) return;
        if (i + 1 < chunks.length) prefetchEdgeTts(chunks[i + 1], lang, i % 2 === 0 ? 3 : 0);
        if (!edgeBroken) {
          const ok = await edgeTtsSpeak(chunks[i], lang, { rate: edgeRate, pitch: i % 2 === 1 ? 3 : 0 });
          if (cancelled()) return;
          if (ok) continue;
          edgeBroken = true;   // Edge 不可用：剩余块回退浏览器队列（自动按顺序播）
        }
        browserSpeak(chunks[i]);
      }
    })();
    return;
  }

  edgeTtsSpeak(spokenText, lang, { rate: edgeRate }).then((ok) => {
    if (ok) return;
    if (cancelled()) return;
    browserSpeak(spokenText);
  });
};

/**
 * Play Praise Voice independently (when periodic milestone or praise is triggered)
 * Protected from keyboard interrupt so child hears the complete encouraging sentence!
 */
export const playPraiseVoice = (
  praiseDialect: 'cantonese' | 'mandarin' | 'english' = 'cantonese',
  onFinish?: () => void
) => {
  const praise = getRandomPraise(praiseDialect);

  isPraiseSpeaking = true;
  const cleanup = () => {
    isPraiseSpeaking = false;
    onFinish?.();
  };

  // 优先 Edge 神经音色（英语夸奖用 Ana 童声，更活泼），失败回退浏览器
  edgeTtsSpeak(praise.text, praise.lang, {
    rate: 4,
    voice: praise.lang === 'en-US' ? 'en-US-AnaNeural' : undefined,
    onFinish: cleanup
  }).then((ok) => {
    if (ok) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onFinish?.();
      return;
    }

    try {
      const praiseUtterance = new SpeechSynthesisUtterance(praise.text);
      praiseUtterance.lang = praise.lang;
      // Human-like energetic praise speed and natural pitch
      praiseUtterance.rate = praise.lang === 'zh-HK' ? 1.0 : 0.98;
      praiseUtterance.pitch = 1.02; // natural emotional lift without chipmunk effect
      const voice = getVoiceForLang(praise.lang);
      if (voice) praiseUtterance.voice = voice;

      praiseUtterance.onend = cleanup;
      praiseUtterance.onerror = cleanup;

      window.speechSynthesis.speak(praiseUtterance);
    } catch (e) {
      isPraiseSpeaking = false;
      onFinish?.();
    }
  });
};

/**
 * Safe Example TTS: Plays example sentence or target audio cleanly without blocking next word
 */
export const playPraiseAndExample = (
  praiseDialect: 'cantonese' | 'mandarin' | 'english' = 'cantonese',
  exampleText: string,
  exampleLang: 'zh-CN' | 'en-US' = 'zh-CN',
  onFinish?: () => void
) => {
  if (!exampleText) {
    onFinish?.();
    return;
  }

  // 优先 Edge 神经音色读例句，失败回退浏览器
  edgeTtsSpeak(exampleText, exampleLang, { onFinish }).then((ok) => {
    if (ok) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onFinish?.();
      return;
    }

    try {
      if (!isPraiseSpeaking) {
        window.speechSynthesis.cancel();
      }
      const exampleUtterance = new SpeechSynthesisUtterance(exampleText);
      exampleUtterance.lang = exampleLang;
      exampleUtterance.rate = exampleLang === 'en-US' ? 0.88 : 0.95;
      exampleUtterance.pitch = 1.0;
      const exVoice = getVoiceForLang(exampleLang);
      if (exVoice) exampleUtterance.voice = exVoice;
      if (onFinish) exampleUtterance.onend = () => onFinish();

      window.speechSynthesis.speak(exampleUtterance);
    } catch (err) {
      onFinish?.();
    }
  });
};

/**
 * Color Generator for Syllables
 */
export const getSyllableColor = (index: number): string => {
  const colors = [
    'text-[#2E93C4] font-bold',
    'text-[#48A757] font-bold',
    'text-[#B8860B] font-bold',
    'text-[#8258C7] font-bold',
    'text-[#D14D72] font-bold',
    'text-[#1D8A9E] font-bold'
  ];
  return colors[index % colors.length];
};

