import { GoogleGenAI } from "@google/genai";
import { StoryData, StoryWordItem } from "../types";
import { getPinyin } from "../utils";

// ============================================================
// 多模型接入层
// 优先级：智谱 GLM-4-Flash（国内直连，免费）→ Gemini（AI Studio 环境）→ 内置预设故事
// ============================================================

// 从 process.env（Vite define / AI Studio 注入）或 import.meta.env 读取配置
const getEnvValue = (keys: string[]): string => {
  for (const k of keys) {
    try {
      if (typeof process !== 'undefined' && process.env && (process.env as any)[k]) {
        return (process.env as any)[k] as string;
      }
    } catch { /* 浏览器环境无 process */ }
    try {
      const env = (import.meta as any).env || {};
      if (env[k]) return env[k] as string;
    } catch { /* ignore */ }
  }
  return "";
};

const ZHIPU_KEYS = ['ZHIPU_API_KEY', 'VITE_ZHIPU_API_KEY', 'GLM_API_KEY', 'VITE_GLM_API_KEY'];
const GEMINI_KEYS = ['GEMINI_API_KEY', 'API_KEY'];

export const hasZhipuKey = (): boolean => !!getEnvValue(ZHIPU_KEYS);
export const hasGeminiKey = (): boolean => !!getEnvValue(GEMINI_KEYS);
export const hasAnyAIKey = (): boolean => hasZhipuKey() || hasGeminiKey();

// 智谱 GLM 调用（OpenAI 兼容接口）：模型按速度优先尝试并记忆可用项；
// 支持 SSE 流式输出（onAccumulate 回调边生成边推送已生成文本）
// 注意：glm-4.5 系列是思考型模型（TTFB 高达 1-2 分钟），必须禁用思考；优先非思考的 glm-4-flash
const ZHIPU_MODELS = ['glm-4-flash', 'glm-4-flashx', 'glm-4.5-flash'];
let resolvedZhipuModel: string | null = null;

const callZhipuOnce = async (
  url: string, key: string, model: string, prompt: string,
  onAccumulate?: (acc: string) => void
): Promise<{ ok: boolean; text?: string; status?: number }> => {
  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: '你是为6-8岁小朋友创作双语故事的童话作家，只输出严格JSON，不要任何多余文字。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.8,
    stream: !!onAccumulate,
    // GLM-4.5 系列为思考型模型：禁用思考，否则首字要等 1-2 分钟
    ...(model.includes('4.5') ? { thinking: { type: 'disabled' } } : {})
  });
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` };

  const resp = await fetch(url, { method: 'POST', headers, body });
  if (!resp.ok) return { ok: false, status: resp.status };

  // 非流式：一次性取回
  if (!onAccumulate || !resp.body) {
    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content;
    return text ? { ok: true, text } : { ok: false };
  }

  // 流式：解析 SSE data 行，累积 delta.content
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let acc = '';
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith('data:')) continue;
      const payload = t.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        const j = JSON.parse(payload);
        const delta = j?.choices?.[0]?.delta?.content;
        if (delta) { acc += delta; onAccumulate(acc); }
      } catch { /* 半包数据忽略 */ }
    }
  }
  return acc ? { ok: true, text: acc } : { ok: false };
};

const callZhipu = async (prompt: string, key: string, onAccumulate?: (acc: string) => void): Promise<string | null> => {
  const endpoints = [
    'https://open.bigmodel.cn/api/paas/v4/chat/completions', // 直连
    '/zhipu-api/chat/completions'                              // Vite 代理（本地开发）
  ];
  const models = resolvedZhipuModel ? [resolvedZhipuModel] : ZHIPU_MODELS;

  for (const url of endpoints) {
    for (const model of models) {
      try {
        const r = await callZhipuOnce(url, key, model, prompt, onAccumulate);
        if (r.ok && r.text) {
          resolvedZhipuModel = model;   // 记住可用模型，后续请求不再试错
          return r.text;
        }
        // 400/404：模型名不存在 → 换下一个模型；其他错误也继续尝试
        console.warn(`Zhipu ${model} @ ${url} 不可用:`, r.status);
      } catch (e) {
        console.warn(`Zhipu API ${url} 不可达:`, e);
        break; // 网络层失败 → 换端点
      }
    }
  }
  return null;
};

// Gemini 调用（AI Studio 部署环境使用）
const callGemini = async (prompt: string, key: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return response.text || null;
  } catch (e) {
    console.warn('Gemini 调用失败:', e);
    return null;
  }
};

// 统一调用入口：返回模型输出的原始文本，全部失败返回 null
// onAccumulate（可选）：流式生成过程中持续回调已累积文本（仅智谱支持）
const callLLM = async (prompt: string, onAccumulate?: (acc: string) => void): Promise<string | null> => {
  const zhipuKey = getEnvValue(ZHIPU_KEYS);
  if (zhipuKey) {
    const text = await callZhipu(prompt, zhipuKey, onAccumulate);
    if (text) return text;
  }
  const geminiKey = getEnvValue(GEMINI_KEYS);
  if (geminiKey) {
    const text = await callGemini(prompt, geminiKey);
    if (text) return text;
  }
  return null;
};

// 从模型输出中稳健提取 JSON（容忍 ```json 围栏、前后杂文、嵌套括号）
const extractJson = (text: string): any | null => {
  if (!text) return null;
  let t = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  try { return JSON.parse(t); } catch { /* 继续提取 */ }
  const s = t.search(/[{[]/);
  if (s === -1) return null;
  const openCh = t[s];
  const closeCh = openCh === '{' ? '}' : ']';
  let depth = 0, inStr = false, esc = false;
  for (let i = s; i < t.length; i++) {
    const ch = t[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === openCh) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(t.slice(s, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
};

/**
 * Built-in Preset Stories for offline & instant play
 * Each story comes with 15 tiered vocabulary words (1-5 Lv.1, 6-10 Lv.2, 11-15 Lv.3)
 */
export const PRESET_STORIES: StoryData[] = [
  {
    id: "preset_basketball",
    topic: "激战篮球总决赛",
    titleZh: "热血篮球总决赛与冠军时刻",
    titleEn: "The Basketball Championship and Golden Victory",
    storyZh: "今天阳光灿烂，小熊和精力充沛的伙伴们参加了一场盛大的篮球赛。赛场上两支球队竞争激烈。在最后一分钟，小熊送出了一记漂亮的传球，兔子高高跃起把篮球投向球框。哨声吹响，比分锁定！大家赢得了最终的胜利，成为最棒的冠军！全场观众为他们送上了最热烈的喝彩与庆祝！",
    storyZhHk: "今日陽光燦爛，小熊同精力充沛嘅朋友仔參加咗一場好大型嘅籃球賽。||賽場上面兩支球隊鬥得好犀利。||喺最後一分鐘，小熊送出一記好靚嘅傳球，兔子高高咁跳起，將個籃球投落個籃框度。||哨聲一吹，比分鎖定喇！||大家贏咗最終嘅勝利，成為最叻嘅冠軍！||全場觀眾都畀佢哋最熱烈嘅歡呼同慶祝吖！",
    storyEn: "On a sunny day, Little Bear and his energetic friends joined a grand basketball match. Two great teams played hard. In the final minute, Little Bear made a wonderful pass, and Bunny leaped high to throw the basketball into the hoop. The whistle blew. They won the sweet victory and became proud champions! The whole crowd gave loud cheers to celebrate this great game!",
    createdAt: Date.now() - 50000,
    words: [
      { word: "game", phonetic: "/ɡeɪm/", translation: "篮球赛", level: 1, example: "We played a fun game." },
      { word: "ball", phonetic: "/bɔːl/", translation: "篮球", level: 1, example: "Throw the ball to me." },
      { word: "team", phonetic: "/tiːm/", translation: "球队", level: 1, example: "Our team is strong." },
      { word: "pass", phonetic: "/pɑːs/", translation: "传球", level: 1, example: "Make a quick pass." },
      { word: "hoop", phonetic: "/huːp/", translation: "球框", level: 1, example: "The ball goes through the hoop." },
      { word: "victory", phonetic: "/ˈvɪktəri/", translation: "胜利", level: 2, example: "We celebrate our victory." },
      { word: "champion", phonetic: "/ˈtʃæmpiən/", translation: "冠军", level: 2, example: "They are proud champions." },
      { word: "whistle", phonetic: "/ˈwɪsl/", translation: "哨声", level: 2, example: "The referee blew the whistle." },
      { word: "cheer", phonetic: "/tʃɪə/", translation: "喝彩", level: 2, example: "Fans cheer for the team." },
      { word: "celebrate", phonetic: "/ˈselɪbreɪt/", translation: "庆祝", level: 2, example: "Let us celebrate together." },
      { word: "energetic", phonetic: "/ˌenəˈdʒetɪk/", translation: "精力充沛的", level: 3, example: "He is an energetic player." },
      { word: "basketball", phonetic: "/ˈbɑːskɪtbɔːl/", translation: "篮球", level: 3, example: "I love basketball." },
      { word: "wonderful", phonetic: "/ˈwʌndəfl/", translation: "漂亮的", level: 3, example: "What a wonderful play!" },
      { word: "audience", phonetic: "/ˈɔːdiəns/", translation: "观众", level: 3, example: "The audience clapped happily." },
      { word: "determination", phonetic: "/dɪˌtɜːmɪˈneɪʃn/", translation: "毅力", level: 3, example: "Victory comes from determination." }
    ]
  },
  {
    id: "preset_ultraman",
    topic: "奥特曼打怪兽",
    titleZh: "光之巨人与水晶小怪兽",
    titleEn: "The Giant of Light and Crystal Monster",
    storyZh: "在一颗美丽的蓝色星球上，突然出现了一只由闪亮水晶组成的小怪兽。小怪兽肚子很饿，正在四处寻找发光的能量石。奥特曼带着温暖的光芒飞来了。他没有使用光线攻击，而是变出了许多美味的果实，和小怪兽成为了好朋友！",
    storyZhHk: "喺一顆好靚嘅藍色星球上面，突然間出現咗一隻用閃令令水晶組成嘅小怪獸。||小怪獸個肚好餓，周圍搵識發光嘅能量石。||奧特曼帶住溫暖嘅光芒飛咗嚟喇。||佢冇用光線攻擊，反而變咗好多好好食嘅果實出嚟，同小怪獸做好朋友吖！",
    storyEn: "On a beautiful blue planet, a tiny monster made of shiny crystal appeared. It was very hungry and looking for glowing energy stones. Ultraman flew down gently with warm light. Instead of attacking, he created delicious fruits, and they became great friends forever!",
    createdAt: Date.now() - 100000,
    words: [
      { word: "sun", phonetic: "/sʌn/", translation: "太阳", level: 1, example: "The sun is warm." },
      { word: "light", phonetic: "/laɪt/", translation: "光芒", level: 1, example: "The light is bright." },
      { word: "friend", phonetic: "/frend/", translation: "好朋友", level: 1, example: "We are good friends." },
      { word: "star", phonetic: "/stɑː/", translation: "星星", level: 1, example: "Stars shine at night." },
      { word: "fruit", phonetic: "/fruːt/", translation: "果实", level: 1, example: "Sweet and fresh fruit." },
      { word: "monster", phonetic: "/ˈmɒnstə/", translation: "怪兽", level: 2, example: "The little monster is cute." },
      { word: "crystal", phonetic: "/ˈkrɪstl/", translation: "水晶", level: 2, example: "A shiny crystal stone." },
      { word: "planet", phonetic: "/ˈplænɪt/", translation: "星球", level: 2, example: "Earth is a blue planet." },
      { word: "energy", phonetic: "/ˈenədʒi/", translation: "能量", level: 2, example: "The sun gives us energy." },
      { word: "attack", phonetic: "/əˈtæk/", translation: "攻击", level: 2, example: "Choose peace over attack." },
      { word: "delicious", phonetic: "/dɪˈlɪʃəs/", translation: "美味的", level: 3, example: "The apples are delicious." },
      { word: "protect", phonetic: "/prəˈtekt/", translation: "守护", level: 3, example: "Heroes protect the world." },
      { word: "universe", phonetic: "/ˈjuːnɪvɜːs/", translation: "宇宙", level: 3, example: "The universe is vast." },
      { word: "glowing", phonetic: "/ˈɡləʊɪŋ/", translation: "发光的", level: 3, example: "A glowing magic lamp." },
      { word: "peaceful", phonetic: "/ˈpiːsfl/", translation: "和平的", level: 3, example: "We live in a peaceful world." }
    ]
  },
  {
    id: "preset_dinosaur",
    topic: "小恐龙森林历险记",
    titleZh: "小霸王龙找彩虹",
    titleEn: "Little T-Rex and the Rainbow Quest",
    storyZh: "森林深处住着一只喜欢奔跑的小恐龙阿雷。雨过天晴后，天空中架起了一道美丽的七彩虹桥。阿雷跨过清澈的小溪，穿过高大的密林，收集了许多五颜六色的花朵，开启了一场奇妙的冒险，把惊喜送给了恐龙妈妈。",
    storyZhHk: "森林入面住咗一隻好鍾意奔跑嘅小恐龍阿雷。||落完雨之後，天上面出現咗一道好靚嘅七彩彩虹橋。||阿雷跨過清澈嘅小溪，穿過好高好大嘅密林，執咗好多五顏六色嘅花朵，展開咗一場好奇妙嘅冒險，仲將驚喜送畀恐龍媽媽添！",
    storyEn: "Deep in the green forest lived a little dinosaur named Ray who loved running. After the rain, a rainbow appeared in the sky. Ray jumped over the clear stream, ran through the tall trees, gathered colorful flowers, and started a grand adventure for his mother.",
    createdAt: Date.now() - 200000,
    words: [
      { word: "rain", phonetic: "/reɪn/", translation: "雨水", level: 1, example: "Rain falls from clouds." },
      { word: "tree", phonetic: "/triː/", translation: "密林", level: 1, example: "The tree is tall." },
      { word: "flower", phonetic: "/ˈflaʊə/", translation: "花朵", level: 1, example: "A pretty red flower." },
      { word: "run", phonetic: "/rʌn/", translation: "奔跑", level: 1, example: "Run in the park." },
      { word: "leaf", phonetic: "/liːf/", translation: "树叶", level: 1, example: "A green leaf falls." },
      { word: "rainbow", phonetic: "/ˈreɪnbəʊ/", translation: "彩虹", level: 2, example: "Look at the colorful rainbow." },
      { word: "forest", phonetic: "/ˈfɒrɪst/", translation: "森林", level: 2, example: "Birds sing in the forest." },
      { word: "stream", phonetic: "/striːm/", translation: "小溪", level: 2, example: "Clear water flows in the stream." },
      { word: "bridge", phonetic: "/brɪdʒ/", translation: "虹桥", level: 2, example: "Cross the wooden bridge." },
      { word: "surprise", phonetic: "/səˈpraɪz/", translation: "惊喜", level: 2, example: "What a nice surprise!" },
      { word: "adventure", phonetic: "/ədˈventʃə/", translation: "冒险", level: 3, example: "We start a grand adventure." },
      { word: "dinosaur", phonetic: "/ˈdaɪnəsɔː/", translation: "恐龙", level: 3, example: "The dinosaur is huge." },
      { word: "mysterious", phonetic: "/mɪˈstɪəriəs/", translation: "神秘的", level: 3, example: "A mysterious cave." },
      { word: "magnificent", phonetic: "/mæɡˈnɪfɪsnt/", translation: "壮丽的", level: 3, example: "A magnificent castle." },
      { word: "courageous", phonetic: "/kəˈreɪdʒəs/", translation: "勇敢的", level: 3, example: "Be a courageous explorer." }
    ]
  },
  {
    id: "preset_cat_magic",
    topic: "魔法猫咪城堡",
    titleZh: "会飞的魔法小黑猫",
    titleEn: "The Flying Magic Kitten",
    storyZh: "在云朵之上的魔法城堡里，有一只戴着金色铃铛的黑色小猫咪咪。它只要轻轻晃动魔法棒，就能变出彩虹糖果云朵，为整个童话小镇带来欢声笑语和甜甜的美梦。",
    storyZhHk: "喺雲朵上面嘅魔法城堡入面，住咗一隻戴住金色鈴鐺嘅黑色小貓咪咪。||佢只要輕輕咁搖吓支魔法棒，就可以變出彩虹糖果雲朵，畀成個童話小鎮都帶嚟歡笑聲同甜甜嘅好夢㗎！",
    storyEn: "In a magic castle above the clouds lived a little black kitten named Mimi with a golden bell. Whenever she waved her tiny wand, clouds turned into sweet rainbow candies, bringing laughter and joy to the fairy town.",
    createdAt: Date.now() - 300000,
    words: [
      { word: "cat", phonetic: "/kæt/", translation: "小猫", level: 1, example: "The cute cat is sleeping." },
      { word: "cloud", phonetic: "/klaʊd/", translation: "云朵", level: 1, example: "White clouds in the sky." },
      { word: "candy", phonetic: "/ˈkændi/", translation: "糖果", level: 1, example: "I like sweet candy." },
      { word: "bell", phonetic: "/bel/", translation: "铃铛", level: 1, example: "Jingle bell rings." },
      { word: "fly", phonetic: "/flaɪ/", translation: "飞翔", level: 1, example: "Birds fly high." },
      { word: "castle", phonetic: "/ˈkɑːsl/", translation: "城堡", level: 2, example: "A grand castle on the hill." },
      { word: "magic", phonetic: "/ˈmædʒɪk/", translation: "魔法", level: 2, example: "She has magic powers." },
      { word: "wand", phonetic: "/wɒnd/", translation: "魔法棒", level: 2, example: "Wave the magic wand." },
      { word: "town", phonetic: "/taʊn/", translation: "小镇", level: 2, example: "A quiet fairy town." },
      { word: "dream", phonetic: "/driːm/", translation: "美梦", level: 2, example: "Have a sweet dream." },
      { word: "laughter", phonetic: "/ˈlɑːftə/", translation: "欢声笑语", level: 3, example: "The room is full of laughter." },
      { word: "sparkle", phonetic: "/ˈspɑːkl/", translation: "闪耀", level: 3, example: "Stars sparkle at night." },
      { word: "whisper", phonetic: "/ˈwɪspə/", translation: "耳语", level: 3, example: "Whisper a secret." },
      { word: "enchanted", phonetic: "/ɪnˈtʃɑːntɪd/", translation: "魔法的", level: 3, example: "An enchanted garden." },
      { word: "celebration", phonetic: "/ˌselɪˈbreɪʃn/", translation: "庆典", level: 3, example: "Join our celebration." }
    ]
  },
  {
    id: "preset_space",
    topic: "太空宇航员探险",
    titleZh: "小小宇航员登月记",
    titleEn: "Little Astronaut on the Moon",
    storyZh: "小宇航员阿墨穿上洁白的宇航服，乘坐火箭飞向银河系。月球上的重力很小，他像袋鼠一样轻轻一跳就能蹦得老高，还在月球表面留下了一个可爱的小脚印！",
    storyZhHk: "小太空人阿墨著住雪白嘅太空衣，坐火箭飛上銀河系。||月球上面嘅地心吸力好細，佢好似袋鼠咁樣輕輕一跳就跳得好高，仲喺月球表面留低咗一個好得意嘅小腳印添！",
    storyEn: "Little astronaut Momo put on his white spacesuit and flew to the stars in a shiny rocket. With low gravity on the moon, he bounced high like a happy kangaroo and left tiny footprints on the lunar dust!",
    createdAt: Date.now() - 400000,
    words: [
      { word: "moon", phonetic: "/muːn/", translation: "月球", level: 1, example: "The moon shines at night." },
      { word: "star", phonetic: "/stɑː/", translation: "星星", level: 1, example: "Twinkle twinkle little star." },
      { word: "sky", phonetic: "/skaɪ/", translation: "天空", level: 1, example: "The sky is blue." },
      { word: "jump", phonetic: "/dʒʌmp/", translation: "跳跃", level: 1, example: "Jump high." },
      { word: "foot", phonetic: "/fʊt/", translation: "脚印", level: 1, example: "Footprints in snow." },
      { word: "rocket", phonetic: "/ˈrɒkɪt/", translation: "火箭", level: 2, example: "The rocket zooms into space." },
      { word: "galaxy", phonetic: "/ˈɡæləksi/", translation: "银河系", level: 2, example: "The milky way galaxy." },
      { word: "planet", phonetic: "/ˈplænɪt/", translation: "星球", level: 2, example: "Mars is a red planet." },
      { word: "suit", phonetic: "/suːt/", translation: "宇航服", level: 2, example: "Wear a spacesuit." },
      { word: "explore", phonetic: "/ɪkˈsplɔː/", translation: "探索", level: 2, example: "Explore new worlds." },
      { word: "astronaut", phonetic: "/ˈæstrənɔːt/", translation: "宇航员", level: 3, example: "An astronaut explores space." },
      { word: "gravity", phonetic: "/ˈɡrævəti/", translation: "重力", level: 3, example: "Zero gravity in space." },
      { word: "telescope", phonetic: "/ˈtelɪskəʊp/", translation: "望远镜", level: 3, example: "Look through a telescope." },
      { word: "satellite", phonetic: "/ˈsætəlaɪt/", translation: "卫星", level: 3, example: "A weather satellite." },
      { word: "constellation", phonetic: "/ˌkɒnstəˈleɪʃn/", translation: "星座", level: 3, example: "Find the Big Dipper constellation." }
    ]
  }
];

/**
 * Generate a Kid-Friendly Story with exact 10 or 15 Vocabulary Words via Gemini 3.7 Flash
 */
// 流式预览：从累积中的 JSON 文本里抓取已生成完（或生成中）的字段值
const unescapeJsonStr = (s: string): string =>
  s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

const grabPartial = (acc: string, field: string): string | undefined => {
  const m = acc.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`));
  return m ? unescapeJsonStr(m[1]) : undefined;
};

/** 故事流式生成进度（部分字段可能未生成完毕） */
export interface StoryProgress {
  titleZh?: string;
  storyZh?: string;
  storyZhHk?: string;
  storyEn?: string;
  wordsFound?: number;   // 已生成的生词条数
}

export const generateStoryWithVocabulary = async (
  topic: string,
  wordCount: number = 8,
  onProgress?: (p: StoryProgress) => void
): Promise<StoryData | null> => {
  // 无任何 AI 密钥：匹配最接近的内置预设故事
  if (!hasAnyAIKey()) {
    const matched = PRESET_STORIES.find(s => s.topic.includes(topic) || topic.includes(s.topic)) || PRESET_STORIES[0];
    return {
      ...matched,
      id: `story_${Date.now()}`,
      words: matched.words.slice(0, wordCount)
    };
  }

  try {
    const n1 = Math.max(3, Math.round(wordCount / 3));       // Level 1 数量
    const n3 = Math.max(2, Math.round(wordCount / 5));       // Level 3 数量
    const n2 = wordCount - n1 - n3;                          // Level 2 数量
    const zhLen = wordCount === 15 ? '160-210' : '105-145';
    const enLen = wordCount === 15 ? '110-145' : '72-105';

    const prompt = `# 任务：为主题"${topic}"创作一篇儿童双语故事（给6-8岁小朋友）

## 【故事质量铁律 —— 最高优先级】
1. **主题铁律**：故事的一切人、物、场景必须围绕"${topic}"展开。绝不允许出现与主题无关的角色或设定硬闯进来（例如赛车故事里不能突然冒出宇航员/魔法师，森林故事里不能出现机器人）。如果某个生词与主题冲突，宁可放弃那个词也要保住故事的逻辑！
2. **完整故事结构**（四幕，缺一不可）：
   - 开头：介绍主角和TA的小目标或小麻烦（1-2句）
   - 发展：主角遇到一个具体困难或挑战，有具体的行动过程（2-3句）
   - 高潮：困难被解决的关键瞬间，要有画面感（1-2句）
   - 结尾：主角的收获/成长，或温暖的小结局（1句）
3. **因果链条**：每一句都要承接上一句。人物做A是因为前文发生了B。绝对禁止"流水账式场景跳转"（例如：他穿过森林→跳过桥梁→来到城堡→遇到宇航员→庆祝胜利，这种没有因果的排列）。
4. **生动技巧**：多用角色的动作、对话、心理（"小赛车手握紧方向盘，心怦怦跳"），少用"美丽的、壮观的、神奇的"这类空泛形容词堆砌。

## 【反例警示】（禁止写成这样）
❌ 坏故事："小明穿越了森林，跳过了桥梁，来到城堡，遇到宇航员，一起庆祝胜利。"（场景硬跳、宇航员无来由、没有因果）
✅ 好故事："小赛车手阿明第一次参加森林卡丁车赛。弯道太多，他总是冲出赛道。教练教他：进弯前先松油门。决赛最后一圈，阿明深吸一口气，提前减速，稳稳过弯，第一个冲过终点线！"

## 【生词要求】
1. 生词总数：**恰好 ${wordCount} 个**（Level 1 恰好 ${n1} 个、Level 2 恰好 ${n2} 个、Level 3 恰好 ${n3} 个，按难度升序排列）！
2. 所有生词必须：①与"${topic}"主题强相关；②自然出现在故事正文中；③中文翻译为双字及以上规范词（严禁单字）。
3. 中文故事（storyZh）约${zhLen}字，英文故事（storyEn）约${enLen}词，都必须自然包含全部生词。

## 【粤语口语版（storyZhHk）】
逐句转写地道粤语口语（用係/喺/嘅/咗/唔/佢/哋/睇/嚟等白话字+"喇/吖/喎"语气词，像香港儿歌主持讲故事），用 || 分隔句子，句数与中文故事严格一一对应。

## 【输出 JSON】（只输出 JSON，不要任何其他文字）
{
  "titleZh": "中文标题",
  "titleEn": "英文标题",
  "storyZh": "中文故事正文",
  "storyZhHk": "粤语句子1||粤语句子2||...",
  "storyEn": "英文故事正文",
  "words": [
    { "word": "英文原词", "phonetic": "/音标/", "translation": "中文对应词", "level": 1, "example": "简短例句" }
  ]
}`;

    const raw = await callLLM(prompt, onProgress ? (acc: string) => {
      const p: StoryProgress = {};
      const t = grabPartial(acc, 'titleZh'); if (t) p.titleZh = t;
      const zh = grabPartial(acc, 'storyZh'); if (zh) p.storyZh = zh;
      const hk = grabPartial(acc, 'storyZhHk'); if (hk) p.storyZhHk = hk;
      const en = grabPartial(acc, 'storyEn'); if (en) p.storyEn = en;
      const wc = (acc.match(/"word"\s*:/g) || []).length; if (wc > 0) p.wordsFound = wc;
      if (p.titleZh || p.storyZh || p.storyZhHk || p.storyEn) onProgress(p);
    } : undefined);
    const parsed = extractJson(raw || '');
    if (parsed && parsed.titleZh && parsed.words && parsed.words.length > 0) {
      const got = parsed.words as any[];
      const norm = got.map((w: any, idx: number) => ({
        word: String(w.word || '').trim(),
        phonetic: w.phonetic || '',
        translation: String(w.translation || '').trim(),
        level: (w.level === 1 || w.level === 2 || w.level === 3 ? w.level : (idx < n1 ? 1 : idx < n1 + n2 ? 2 : 3)) as 1 | 2 | 3,
        example: w.example || ''
      })).filter(w => w.word && w.translation);
      // 去重后截取
      let finalWords = norm.filter((w, i, arr) => arr.findIndex(x => x.word.toLowerCase() === w.word.toLowerCase()) === i).slice(0, wordCount);

      // AI 偶尔少交付（如9个）：发一个快速小请求补齐到目标数量
      if (finalWords.length < wordCount) {
        const missing = wordCount - finalWords.length;
        try {
          const topUpPrompt = `为主题"${topic}"的儿童故事补充 ${missing} 个英文生词（与故事内容相关、难度适合6-8岁小朋友）。
已有生词（严禁重复）：${finalWords.map(w => w.word).join(', ')}。
只输出JSON数组，格式：[{"word":"英文词","phonetic":"/音标/","translation":"双字及以上中文词","level":1,"example":"简短例句"}]`;
          const raw2 = await callLLM(topUpPrompt);
          const extra = extractJson(raw2 || '');
          if (Array.isArray(extra)) {
            for (const w of extra) {
              if (finalWords.length >= wordCount) break;
              if (w?.word && w?.translation && !finalWords.some(f => f.word.toLowerCase() === String(w.word).trim().toLowerCase())) {
                finalWords.push({
                  word: String(w.word).trim(),
                  phonetic: w.phonetic || '',
                  translation: String(w.translation).trim(),
                  level: (w.level === 1 || w.level === 2 || w.level === 3 ? w.level : 2) as 1 | 2 | 3,
                  example: w.example || ''
                });
              }
            }
          }
        } catch { /* 补齐失败则保持现有数量 */ }
      }

      return {
        id: `story_${Date.now()}`,
        topic,
        titleZh: parsed.titleZh,
        titleEn: parsed.titleEn || '',
        storyZh: parsed.storyZh || '',
        storyZhHk: parsed.storyZhHk || '',
        storyEn: parsed.storyEn || '',
        words: finalWords,
        createdAt: Date.now()
      };
    }
    return null;
  } catch (error) {
    console.error("AI Story Generation failed:", error);
    const matched = PRESET_STORIES.find(s => s.topic.includes(topic) || topic.includes(s.topic)) || PRESET_STORIES[0];
    return {
      ...matched,
      id: `story_${Date.now()}`,
      words: matched.words.slice(0, wordCount)
    };
  }
};

/**
 * Generate Smart Exercise List
 */
export const generateSmartExercise = async (topic: string, isEnglish: boolean, count: number = 30) => {
  if (!hasAnyAIKey()) return null;

  try {
    const prompt = isEnglish
      ? `为6岁的小朋友生成${count}个关于"${topic}"的英文打字练习单词。返回JSON数组，每个对象必须包含: text(单词), phonetic(音标), translation(中文翻译), example(简单的英文例句)。确保单词难度适合初学者。只输出JSON，不要其他文字。`
      : `为6岁的小朋友生成${count}个关于"${topic}"的中文打字练习词语。返回JSON数组，每个对象必须包含: text(对应词语的拼音，全小写，不带声调，词语间用空格隔开), chinese(对应的汉字), example(简单的中文例句)。只输出JSON，不要其他文字。`;

    const raw = await callLLM(prompt);
    const data = extractJson(raw || '');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    console.error("AI 生成练习失败:", error);
    return null;
  }
};
