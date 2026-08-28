
export enum Mode {
  ENGLISH = 'ENGLISH',
  CHINESE = 'CHINESE'
}

export enum Tab {
  PRACTICE = 'PRACTICE',
  GAME = 'GAME',
  STORY = 'STORY',
  PET = 'PET',
  STATS = 'STATS'
}

export interface ExerciseItem {
  text: string;        // 练习目标（英文单词或小写无音调拼音）
  chinese?: string;     // 对应的汉字
  pinyin?: string;      // 带声调的拼音显示（方便孩子看）
  phonetic?: string;    // 音标
  translation?: string; // 翻译
  example: string;      // 例句
  difficultyLevel?: 1 | 2 | 3;
}

export interface TypingStats {
  id?: string;
  date: string;         // YYYY-MM-DD
  timestamp?: number;
  speed: number;        // WPM / 字每分钟
  accuracy: number;     // 准确率 %
  timeSpent: number;    // 用时（秒）
  bookName?: string;
  mode?: Mode;
  correctCount?: number;
  totalCount?: number;
  maxCombo?: number;
  errors: Record<string, number>;
  coinsEarned?: number;
}

// 故事单词分级
export interface StoryWordItem {
  word: string;
  pinyin?: string;
  phonetic?: string;
  translation: string;
  level: 1 | 2 | 3; // 1: 基础萌芽, 2: 进阶成长, 3: 超能挑战
  example: string;
}

// AI生成小故事
export interface StoryData {
  id: string;
  topic: string;
  titleZh: string;
  titleEn: string;
  storyZh: string;
  storyEn: string;
  words: StoryWordItem[];
  createdAt: number;
}

// 桌面宠物定义
export interface PetItem {
  id: string;
  name: string;
  species: string;
  avatarEmoji: string;
  pixelArt: string;
  level: number;
  exp: number;
  enchantLevel?: number; // 附魔等级 0-5
  evolutionStage?: 1 | 2 | 3; // 1: 幼崽萌态, 2: 元素进阶, 3: 觉醒神兽
  hunger: number; // 0-100
  happiness: number; // 0-100
  unlocked: boolean;
  cost: number;
  accessory?: string;
  cheerPhrases: string[];
  mistakePhrases: string[];
}

// 宠物饰品
export interface PetAccessory {
  id: string;
  name: string;
  emoji: string;
  type: 'hat' | 'glasses' | 'badge' | 'wand';
  cost: number;
  unlocked: boolean;
}

// 成就系统
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

