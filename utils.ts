
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
  { index: 1, name: '翡翠绿', pill: 'bg-emerald-100 text-emerald-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-emerald-600 text-white', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-300', textColor: 'text-emerald-900', numberTag: 'bg-emerald-600 text-white' },
  { index: 2, name: '暖阳橙', pill: 'bg-amber-100 text-amber-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-amber-600 text-white', bgLight: 'bg-amber-50', borderColor: 'border-amber-300', textColor: 'text-amber-900', numberTag: 'bg-amber-600 text-white' },
  { index: 3, name: '晴空蓝', pill: 'bg-sky-100 text-sky-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-sky-600 text-white', bgLight: 'bg-sky-50', borderColor: 'border-sky-300', textColor: 'text-sky-900', numberTag: 'bg-sky-600 text-white' },
  { index: 4, name: '珊瑚粉', pill: 'bg-rose-100 text-rose-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-rose-600 text-white', bgLight: 'bg-rose-50', borderColor: 'border-rose-300', textColor: 'text-rose-900', numberTag: 'bg-rose-600 text-white' },
  { index: 5, name: '梦幻紫', pill: 'bg-purple-100 text-purple-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-purple-600 text-white', bgLight: 'bg-purple-50', borderColor: 'border-purple-300', textColor: 'text-purple-900', numberTag: 'bg-purple-600 text-white' },
  { index: 6, name: '海洋青', pill: 'bg-teal-100 text-teal-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-teal-600 text-white', bgLight: 'bg-teal-50', borderColor: 'border-teal-300', textColor: 'text-teal-900', numberTag: 'bg-teal-600 text-white' },
  { index: 7, name: '蜜桔橘', pill: 'bg-orange-100 text-orange-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-orange-600 text-white', bgLight: 'bg-orange-50', borderColor: 'border-orange-300', textColor: 'text-orange-900', numberTag: 'bg-orange-600 text-white' },
  { index: 8, name: '星空蓝', pill: 'bg-indigo-100 text-indigo-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-indigo-600 text-white', bgLight: 'bg-indigo-50', borderColor: 'border-indigo-300', textColor: 'text-indigo-900', numberTag: 'bg-indigo-600 text-white' },
  { index: 9, name: '樱花粉', pill: 'bg-pink-100 text-pink-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-pink-600 text-white', bgLight: 'bg-pink-50', borderColor: 'border-pink-300', textColor: 'text-pink-900', numberTag: 'bg-pink-600 text-white' },
  { index: 10, name: '嫩芽绿', pill: 'bg-lime-100 text-lime-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-lime-600 text-white', bgLight: 'bg-lime-50', borderColor: 'border-lime-300', textColor: 'text-lime-900', numberTag: 'bg-lime-600 text-white' },
  { index: 11, name: '薄荷蓝', pill: 'bg-cyan-100 text-cyan-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-cyan-600 text-white', bgLight: 'bg-cyan-50', borderColor: 'border-cyan-300', textColor: 'text-cyan-900', numberTag: 'bg-cyan-600 text-white' },
  { index: 12, name: '柠檬黄', pill: 'bg-yellow-100 text-yellow-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-yellow-600 text-white', bgLight: 'bg-yellow-50', borderColor: 'border-yellow-300', textColor: 'text-yellow-900', numberTag: 'bg-yellow-600 text-white' },
  { index: 13, name: '热情红', pill: 'bg-red-100 text-red-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-red-600 text-white', bgLight: 'bg-red-50', borderColor: 'border-red-300', textColor: 'text-red-900', numberTag: 'bg-red-600 text-white' },
  { index: 14, name: '宝石蓝', pill: 'bg-blue-100 text-blue-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-blue-600 text-white', bgLight: 'bg-blue-50', borderColor: 'border-blue-300', textColor: 'text-blue-900', numberTag: 'bg-blue-600 text-white' },
  { index: 15, name: '葡萄紫', pill: 'bg-fuchsia-100 text-fuchsia-950 font-bold px-1 py-0 rounded mx-0.5 inline leading-tight align-baseline shadow-2xs', badge: 'bg-fuchsia-600 text-white', bgLight: 'bg-fuchsia-50', borderColor: 'border-fuchsia-300', textColor: 'text-fuchsia-900', numberTag: 'bg-fuchsia-600 text-white' }
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
  | 'pop';

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
    }
  } catch (err) {
    // AudioContext autoplay restrictions or error fallback
  }
};

/**
 * Simple English Syllable Splitter (Heuristic-based)
 */
export const splitSyllables = (word: string): string[] => {
  if (!word || word.length <= 3) return [word];
  const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy](?![aeiouy]))*/gi;
  const result = word.match(syllableRegex);
  return result && result.length > 0 ? result : [word];
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

let isPraiseSpeaking = false;

/**
 * Speak immediately (for word preview upon index change)
 * Does NOT cancel if praise encouragement is currently playing!
 */
export const speakDirect = (text: string, lang: 'zh-CN' | 'en-US' | 'zh-HK' = 'zh-CN', forceCancel: boolean = false) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    // If praise voice is actively speaking, let it finish naturally without interrupting!
    if (isPraiseSpeaking && !forceCancel) {
      return;
    }
    if (forceCancel) {
      isPraiseSpeaking = false;
      window.speechSynthesis.cancel();
    }

    // If Cantonese requested, apply colloquial conversion so it sounds lively and authentic!
    const spokenText = lang === 'zh-HK' ? toCantoneseColloquial(text) : text;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = lang;
    // Optimal human prosody and melodic continuity
    utterance.rate = lang === 'en-US' ? 0.88 : (lang === 'zh-HK' ? 0.98 : 0.95);
    utterance.pitch = 1.0; // 1.0 preserves natural human tone contours and prevents robotic stutter
    const voice = getVoiceForLang(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS error:', e);
  }
};

/**
 * Play Praise Voice independently (when periodic milestone or praise is triggered)
 * Protected from keyboard interrupt so child hears the complete encouraging sentence!
 */
export const playPraiseVoice = (
  praiseDialect: 'cantonese' | 'mandarin' | 'english' = 'cantonese',
  onFinish?: () => void
) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onFinish?.();
    return;
  }
  try {
    const praise = getRandomPraise(praiseDialect);
    const praiseUtterance = new SpeechSynthesisUtterance(praise.text);
    praiseUtterance.lang = praise.lang;
    // Human-like energetic praise speed and natural pitch
    praiseUtterance.rate = praise.lang === 'zh-HK' ? 1.0 : 0.98;
    praiseUtterance.pitch = 1.02; // natural emotional lift without chipmunk effect
    const voice = getVoiceForLang(praise.lang);
    if (voice) praiseUtterance.voice = voice;
    
    isPraiseSpeaking = true;
    const cleanup = () => {
      isPraiseSpeaking = false;
      onFinish?.();
    };
    praiseUtterance.onend = cleanup;
    praiseUtterance.onerror = cleanup;
    
    window.speechSynthesis.speak(praiseUtterance);
  } catch (e) {
    isPraiseSpeaking = false;
    onFinish?.();
  }
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
};

/**
 * Color Generator for Syllables
 */
export const getSyllableColor = (index: number): string => {
  const colors = [
    'text-blue-600 font-bold',
    'text-emerald-600 font-bold',
    'text-amber-600 font-bold',
    'text-purple-600 font-bold',
    'text-rose-600 font-bold',
    'text-cyan-600 font-bold'
  ];
  return colors[index % colors.length];
};

