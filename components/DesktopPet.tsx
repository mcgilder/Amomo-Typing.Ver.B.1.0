import React, { useState } from 'react';
import { PetItem, PetAccessory } from '../types';
import { playSoundEffect } from '../utils';

export const INITIAL_PETS: PetItem[] = [
  {
    id: 'cat',
    name: '阿墨小猫',
    species: '橘猫',
    avatarEmoji: '🐱',
    pixelArt: '🐱',
    level: 1,
    exp: 0,
    enchantLevel: 0,
    evolutionStage: 1,
    hunger: 80,
    happiness: 90,
    unlocked: true,
    cost: 0,
    accessory: 'none',
    cheerPhrases: [
      '喵呜！打得真准，手指像飞一样！',
      '太棒啦！小猫为你转圈圈庆祝喵！',
      '喵~ 连击好厉害，继续保持！',
      '给你点赞，继续加油！',
      '神速小达人，喵！'
    ],
    mistakePhrases: [
      '喵~ 别急，深呼吸再看一眼键位！',
      '没关系，按错也是成长的一步喵！',
      '喵呜~ 慢慢来，找准位置！'
    ]
  },
  {
    id: 'dog',
    name: '汪汪队长',
    species: '柴犬',
    avatarEmoji: '🐶',
    pixelArt: '🐶',
    level: 1,
    exp: 0,
    enchantLevel: 0,
    evolutionStage: 1,
    hunger: 70,
    happiness: 85,
    unlocked: true,
    cost: 0,
    accessory: 'none',
    cheerPhrases: [
      '汪汪！太厉害啦！',
      '主人冲呀！速度破纪录啦！',
      '汪！手速快如闪电！',
      '棒极了，你是打字冠军！'
    ],
    mistakePhrases: [
      '汪呜~ 稳住手型，再试一次！',
      '不气馁，小队长永远支持你！'
    ]
  },
  {
    id: 'dino',
    name: '萌萌小恐龙',
    species: '暴龙宝宝',
    avatarEmoji: '🦖',
    pixelArt: '🦖',
    level: 1,
    exp: 0,
    enchantLevel: 0,
    evolutionStage: 1,
    hunger: 60,
    happiness: 80,
    unlocked: false,
    cost: 60,
    accessory: 'none',
    cheerPhrases: [
      '嗷呜！恐龙之力爆发！',
      '踩碎所有难打的单词，嗷！',
      '太快啦！霸王龙都追不上你！'
    ],
    mistakePhrases: [
      '嗷~ 调整一下呼吸，大步向前！',
      '恐龙宝宝给你加油，再来！'
    ]
  },
  {
    id: 'penguin',
    name: '探险企鹅',
    species: '极地企鹅',
    avatarEmoji: '🐧',
    pixelArt: '🐧',
    level: 1,
    exp: 0,
    enchantLevel: 0,
    evolutionStage: 1,
    hunger: 75,
    happiness: 80,
    unlocked: false,
    cost: 100,
    accessory: 'none',
    cheerPhrases: [
      '嘎嘎！冰爽超快连击！',
      '在键盘上滑雪喽！',
      '极速冲刺，太酷啦！'
    ],
    mistakePhrases: [
      '嘎！稳住脚蹼，慢慢滑！',
      '看准字母再按，加油！'
    ]
  },
  {
    id: 'unicorn',
    name: '幻彩独角兽',
    species: '魔法独角兽',
    avatarEmoji: '🦄',
    pixelArt: '🦄',
    level: 1,
    exp: 0,
    enchantLevel: 0,
    evolutionStage: 1,
    hunger: 90,
    happiness: 95,
    unlocked: false,
    cost: 150,
    accessory: 'none',
    cheerPhrases: [
      '✨ 魔法光芒！全对通关！',
      '🌟 你的手指散发着奇迹光芒！',
      '💫 完美敲击，太优雅啦！'
    ],
    mistakePhrases: [
      '✨ 挥动魔杖，消除错误，再来一次！',
      '魔法正在充能中，慢慢看哦！'
    ]
  },
  {
    id: 'robot',
    name: '像素小机甲',
    species: '智能管家',
    avatarEmoji: '🤖',
    pixelArt: '🤖',
    level: 1,
    exp: 0,
    enchantLevel: 0,
    evolutionStage: 1,
    hunger: 100,
    happiness: 90,
    unlocked: false,
    cost: 200,
    accessory: 'none',
    cheerPhrases: [
      '哔哔！检测到超高准确率！',
      '系统提示：速度超越99%的小朋友！',
      '能量全满，极速运转！'
    ],
    mistakePhrases: [
      '哔... 重新校准键位坐标中！',
      '保持正确指法，重新输入！'
    ]
  }
];

export const ACCESSORIES: PetAccessory[] = [
  { id: 'none', name: '默认', emoji: '✖️', type: 'hat', cost: 0, unlocked: true },
  { id: 'crown', name: '金色皇冠', emoji: '👑', type: 'hat', cost: 30, unlocked: false },
  { id: 'glasses', name: '酷炫墨镜', emoji: '🕶️', type: 'glasses', cost: 40, unlocked: false },
  { id: 'party_hat', name: '派对彩帽', emoji: '🥳', type: 'hat', cost: 25, unlocked: false },
  { id: 'magic_wand', name: '星星魔法棒', emoji: '🪄', type: 'wand', cost: 50, unlocked: false },
  { id: 'ribbon', name: '粉红蝴蝶结', emoji: '🎀', type: 'hat', cost: 20, unlocked: false },
  { id: 'medal', name: '冠军勋章', emoji: '🥇', type: 'badge', cost: 60, unlocked: false },
  { id: 'cape', name: '王者披风', emoji: '🦸', type: 'badge', cost: 80, unlocked: false },
  { id: 'halo', name: '神圣光环', emoji: '😇', type: 'hat', cost: 120, unlocked: false }
];

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  hungerAdd: number;
  happyAdd: number;
  cost: number;
}

export const FOODS: FoodItem[] = [
  { id: 'cookie', name: '能量小饼干', emoji: '🍪', hungerAdd: 15, happyAdd: 10, cost: 5 },
  { id: 'fish', name: '香脆小鱼干', emoji: '🐟', hungerAdd: 25, happyAdd: 20, cost: 10 },
  { id: 'burger', name: '快乐汉堡包', emoji: '🍔', hungerAdd: 40, happyAdd: 25, cost: 15 },
  { id: 'cake', name: '彩虹草莓蛋糕', emoji: '🍰', hungerAdd: 30, happyAdd: 40, cost: 20 },
  { id: 'icecream', name: '甜蜜冰淇淋', emoji: '🍦', hungerAdd: 20, happyAdd: 30, cost: 12 },
  { id: 'feast', name: '豪华烤肉大餐', emoji: '🍖', hungerAdd: 50, happyAdd: 50, cost: 35 }
];

// Evolution Title & Aura Data
export const EVOLUTION_DATA: Record<string, {
  stage1: { title: string; aura: string; bonus: string };
  stage2: { title: string; aura: string; bonus: string };
  stage3: { title: string; aura: string; bonus: string };
}> = {
  cat: {
    stage1: { title: '萌萌幼橘猫', aura: 'border-amber-200', bonus: '打字金币 +5%' },
    stage2: { title: '疾风灵纹飞猫', aura: 'border-orange-400 ring-4 ring-orange-200 shadow-orange-300', bonus: '打字金币 +20% & 连击保护' },
    stage3: { title: '✨ 墨金星穹神虎猫', aura: 'border-yellow-400 ring-8 ring-amber-300 shadow-2xl shadow-yellow-400', bonus: '打字金币 +50% & 全屏庆祝光芒' }
  },
  dog: {
    stage1: { title: '活泼小柴犬', aura: 'border-amber-200', bonus: '打字金币 +5%' },
    stage2: { title: '风暴斗篷先锋犬', aura: 'border-sky-400 ring-4 ring-sky-200 shadow-sky-300', bonus: '打字金币 +20% & 速度加成' },
    stage3: { title: '⚡ 雷霆战神天狼柴', aura: 'border-yellow-400 ring-8 ring-cyan-300 shadow-2xl shadow-cyan-400', bonus: '打字金币 +50% & 专属雷光轨迹' }
  },
  dino: {
    stage1: { title: '幼年绿恐龙', aura: 'border-emerald-200', bonus: '打字金币 +5%' },
    stage2: { title: '熔岩烈焰重甲龙', aura: 'border-red-400 ring-4 ring-orange-200 shadow-red-300', bonus: '打字金币 +25% & 力量暴击' },
    stage3: { title: '🔥 远古创世金翼神龙', aura: 'border-amber-400 ring-8 ring-red-300 shadow-2xl shadow-amber-400', bonus: '打字金币 +55% & 咆哮震屏动效' }
  },
  penguin: {
    stage1: { title: '极地小企鹅', aura: 'border-blue-200', bonus: '打字金币 +5%' },
    stage2: { title: '破冰滑雪酷企鹅', aura: 'border-cyan-400 ring-4 ring-cyan-200 shadow-cyan-300', bonus: '打字金币 +20% & 冰爽节奏' },
    stage3: { title: '❄️ 极光寒霜领主帝企鹅', aura: 'border-indigo-400 ring-8 ring-blue-300 shadow-2xl shadow-indigo-400', bonus: '打字金币 +50% & 极光漫天' }
  },
  unicorn: {
    stage1: { title: '幻彩小独角兽', aura: 'border-pink-200', bonus: '打字金币 +8%' },
    stage2: { title: '灵光星耀圣角兽', aura: 'border-purple-400 ring-4 ring-pink-200 shadow-purple-300', bonus: '打字金币 +25% & 魔法消除' },
    stage3: { title: '🦄 永恒星穹梦幻天角兽', aura: 'border-pink-400 ring-8 ring-purple-300 shadow-2xl shadow-pink-400', bonus: '打字金币 +60% & 彩虹神迹' }
  },
  robot: {
    stage1: { title: '微型智控小机甲', aura: 'border-gray-200', bonus: '打字金币 +8%' },
    stage2: { title: '超能激光巡航机兵', aura: 'border-blue-400 ring-4 ring-blue-200 shadow-blue-300', bonus: '打字金币 +25% & 辅助瞄准' },
    stage3: { title: '🌌 未来量子创世神机', aura: 'border-cyan-400 ring-8 ring-purple-300 shadow-2xl shadow-cyan-400', bonus: '打字金币 +60% & 矩阵护盾' }
  }
};

interface DesktopPetProps {
  pets: PetItem[];
  currentPetId: string;
  coins: number;
  accessories: PetAccessory[];
  onSelectPet: (id: string) => void;
  onUnlockPet: (id: string, cost: number) => void;
  onFeedPet: (food: FoodItem) => void;
  onPetPet: () => void;
  onEquipAccessory: (accId: string) => void;
  onUnlockAccessory: (accId: string, cost: number) => void;
  onEnchantPet?: (petId: string, cost: number) => void;
}

export const DesktopPet: React.FC<DesktopPetProps> = ({
  pets,
  currentPetId,
  coins,
  accessories,
  onSelectPet,
  onUnlockPet,
  onFeedPet,
  onPetPet,
  onEquipAccessory,
  onUnlockAccessory,
  onEnchantPet
}) => {
  const [activeTab, setActiveTab] = useState<'PETS' | 'ENCHANT' | 'FOOD' | 'SHOP'>('PETS');
  const [petAnimation, setPetAnimation] = useState<string>('animate-pulse');
  const [bubbleText, setBubbleText] = useState<string>('');
  const [flyingFood, setFlyingFood] = useState<{ emoji: string; particles: string } | null>(null);
  const [showEvolutionCelebration, setShowEvolutionCelebration] = useState<boolean>(false);

  const currentPet = pets.find(p => p.id === currentPetId) || pets[0];
  const currentAccessory = accessories.find(a => a.id === currentPet.accessory);

  const enchantLvl = currentPet.enchantLevel || 0;
  const evoStage = (currentPet.evolutionStage || (currentPet.level >= 5 ? 3 : currentPet.level >= 3 ? 2 : 1)) as 1 | 2 | 3;
  const evoInfo = EVOLUTION_DATA[currentPet.id] || EVOLUTION_DATA.cat;
  const currentEvo = evoStage === 3 ? evoInfo.stage3 : evoStage === 2 ? evoInfo.stage2 : evoInfo.stage1;

  const enchantCost = (enchantLvl + 1) * 35;

  const handleInteract = () => {
    playSoundEffect('pop');
    setPetAnimation('animate-bounce');
    const quotes = [
      `喵呜！我是 ${currentEvo.title}，今天手速超快！`,
      '今天也要一起开心打字哦！',
      '有你陪我，我是全世界最幸福的宠物！',
      '你敲键盘的声音最好听啦！',
      '加油加油，去附魔台给我强化神兽之力吧！'
    ];
    setBubbleText(quotes[Math.floor(Math.random() * quotes.length)]);
    onPetPet();
    setTimeout(() => setPetAnimation(''), 1200);
    setTimeout(() => setBubbleText(''), 3500);
  };

  const handleFeed = (food: FoodItem) => {
    if (coins < food.cost) {
      playSoundEffect('error');
      setBubbleText('金币不够啦，快去练习打字赚金币吧！');
      setTimeout(() => setBubbleText(''), 2500);
      return;
    }
    playSoundEffect('coin');

    // Distinct 3D interactive animations & food particles for each food type
    let animClass = 'animate-pet-chew';
    let particleText = '🍪 ✨';
    let feedbackQuote = `好香呀！吃了${food.name}，元气满满！`;

    if (food.id === 'cookie') {
      animClass = 'animate-pet-chew';
      particleText = '🍪 ✨ 😋';
      feedbackQuote = '嘎吱嘎吱！香脆小饼干，手指力量满满！';
    } else if (food.id === 'fish') {
      animClass = 'animate-pet-gulp';
      particleText = '🐟 💫 🌊';
      feedbackQuote = '嗷呜一口吞！鲜美小鱼干，神速飞跃！';
    } else if (food.id === 'burger') {
      animClass = 'animate-pet-burger';
      particleText = '🍔 💖 💨';
      feedbackQuote = '大口吃汉堡！肚子圆滚滚好满足，体力全满！';
    } else if (food.id === 'cake') {
      animClass = 'animate-pet-cake';
      particleText = '🍰 🌈 🍓';
      feedbackQuote = '哇！彩虹草莓蛋糕！幸福得转圈圈，魔法满满！';
    } else if (food.id === 'icecream') {
      animClass = 'animate-pet-icecream';
      particleText = '🍦 ❄️ 🍧';
      feedbackQuote = '舔一舔冰淇淋，冰凉爽口！打字手速起飞！';
    } else if (food.id === 'feast') {
      animClass = 'animate-pet-feast';
      particleText = '🍖 🎆 🪙';
      feedbackQuote = '太豪华啦！烤肉盛宴唤醒远古神兽潜能！';
    }

    setPetAnimation(animClass);
    setFlyingFood({ emoji: food.emoji, particles: particleText });
    setBubbleText(feedbackQuote);
    onFeedPet(food);

    setTimeout(() => {
      setPetAnimation('');
      setFlyingFood(null);
    }, 1200);
    setTimeout(() => setBubbleText(''), 3200);
  };

  const handleEnchant = () => {
    if (coins < enchantCost) {
      playSoundEffect('error');
      setBubbleText(`需要 ${enchantCost} 墨墨金币才能进行神圣附魔哦！`);
      setTimeout(() => setBubbleText(''), 2500);
      return;
    }
    playSoundEffect('victory');
    setPetAnimation('animate-spin');
    setShowEvolutionCelebration(true);
    setBubbleText(`✨ 附魔成功！${currentPet.name} 获得了远古神力！`);
    onEnchantPet?.(currentPet.id, enchantCost);
    setTimeout(() => {
      setPetAnimation('');
      setShowEvolutionCelebration(false);
    }, 2000);
  };

  // Next level exp calculation
  const expNeeded = currentPet.level * 50;
  const expPercent = Math.min(100, Math.round((currentPet.exp / expNeeded) * 100));

  // Determine visual scale based on evolution stage
  const scaleClass = evoStage === 3 ? 'scale-125' : evoStage === 2 ? 'scale-110' : 'scale-100';

  return (
    <div className="w-full max-w-6xl flex flex-col gap-5 animate-fade-in">
      {/* Top Banner with Coins & Level */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 rounded-3xl p-5 shadow-md border-4 border-yellow-200 flex flex-wrap items-center justify-between gap-4 text-amber-950">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center text-4xl shadow-inner border-2 border-yellow-300 relative">
            {currentPet.avatarEmoji}
            {evoStage >= 2 && (
              <span className="absolute -top-2 -right-2 text-base">✨</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black font-kids">{currentPet.name}</h2>
              <span className="bg-amber-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-xs">
                Lv.{currentPet.level} {currentEvo.title}
              </span>
              {enchantLvl > 0 && (
                <span className="bg-purple-600 text-white text-xs px-2.5 py-0.5 rounded-full font-black shadow-xs flex items-center gap-1">
                  <span>⚡ 附魔 +{enchantLvl}</span>
                </span>
              )}
              {currentAccessory && currentAccessory.id !== 'none' && (
                <span className="text-xl" title={currentAccessory.name}>
                  {currentAccessory.emoji}
                </span>
              )}
            </div>
            <p className="text-xs text-amber-900 font-bold mt-1">
              当前形态加成: <span className="text-purple-900 bg-amber-200/80 px-2 py-0.5 rounded-md">{currentEvo.bonus}</span>
            </p>
          </div>
        </div>

        {/* Coins Wallet */}
        <div className="flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl border-2 border-amber-300 shadow-sm">
          <span className="text-3xl animate-bounce">🪙</span>
          <div className="flex flex-col">
            <span className="text-xs text-amber-700 font-bold">墨墨金币</span>
            <span className="text-2xl font-black text-amber-950">{coins}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Pet Room & Interaction (Bigger, 3D Pixel Aura) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 rounded-3xl p-6 border-4 border-sky-200 shadow-lg flex flex-col items-center justify-between relative overflow-hidden min-h-[420px] [perspective:1000px]">
          {/* Room Decor */}
          <div className="absolute top-4 left-6 text-2xl opacity-60 animate-pulse">☁️</div>
          <div className="absolute top-8 right-8 text-2xl opacity-70 animate-bounce">✨</div>
          <div className="absolute bottom-3 left-4 text-3xl opacity-40">🌱</div>
          <div className="absolute bottom-3 right-4 text-3xl opacity-40">🌼</div>

          {/* Flying Food Particle Animation during Feeding */}
          {flyingFood && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 animate-food-float">
              <span className="text-5xl">{flyingFood.emoji}</span>
              <span className="text-xl font-black mt-1 text-amber-600 filter drop-shadow">
                {flyingFood.particles}
              </span>
            </div>
          )}

          {/* Dialogue Bubble */}
          <div className="w-full flex justify-center h-16 items-center z-10">
            {bubbleText ? (
              <div className="bg-white px-5 py-2.5 rounded-2xl shadow-lg border-2 border-amber-300 text-amber-900 font-black text-xs md:text-sm max-w-xs text-center animate-fade-in relative">
                {bubbleText}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
              </div>
            ) : (
              <div className="text-xs text-sky-800 font-bold bg-white/80 px-4 py-1.5 rounded-full border border-sky-200 shadow-2xs">
                👆 点击神兽抚摸互动，或前往右侧喂食与附魔！
              </div>
            )}
          </div>

          {/* Pet Character Center (Large Pixel / 3D Layer with Glow) */}
          <div
            className={`flex flex-col items-center my-auto cursor-pointer select-none group transition-all duration-300 ${scaleClass}`}
            onClick={handleInteract}
          >
            <div className={`relative transition-transform duration-200 hover:scale-110 active:scale-95 ${petAnimation}`}>
              {/* Pet Main Sprite Circle */}
              <div
                className={`w-44 h-44 bg-white/90 rounded-full flex items-center justify-center text-8xl shadow-2xl border-4 backdrop-blur-sm relative transition-all ${
                  evoStage === 3
                    ? 'border-yellow-400 ring-8 ring-amber-300/80 shadow-amber-300'
                    : evoStage === 2
                    ? 'border-sky-400 ring-4 ring-sky-200 shadow-sky-200'
                    : 'border-white ring-2 ring-amber-200'
                }`}
              >
                {currentPet.avatarEmoji}

                {/* Stage 3 Golden Horn / Halo Aura */}
                {evoStage === 3 && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                    👑
                  </div>
                )}

                {/* Accessory Overlay: Center accessories on head */}
                {currentAccessory && currentAccessory.id !== 'none' && (
                  <div className={`absolute filter drop-shadow-xl pointer-events-none transition-all duration-300 ${
                    currentAccessory.type === 'glasses'
                      ? 'top-9 left-1/2 -translate-x-1/2 text-4xl z-20'
                      : currentAccessory.type === 'wand'
                      ? '-right-4 bottom-2 rotate-12 text-4xl z-20'
                      : currentAccessory.type === 'badge'
                      ? '-bottom-3 left-1/2 -translate-x-1/2 text-4xl z-20'
                      : '-top-7 left-1/2 -translate-x-1/2 text-5xl z-20' // Center on top of head!
                  }`}>
                    {currentAccessory.emoji}
                  </div>
                )}

                {/* Enchantment Element Sparkles */}
                {enchantLvl > 0 && (
                  <div className="absolute -bottom-2 -left-2 bg-purple-600 text-white text-[11px] px-2 py-0.5 rounded-full font-black shadow border border-purple-300">
                    +{enchantLvl}★
                  </div>
                )}
              </div>

              {/* Shadow on Floor */}
              <div className="w-40 h-7 bg-black/15 rounded-full mx-auto mt-3 blur-[3px]"></div>
            </div>
            <span className="text-xs font-black text-amber-900 bg-amber-200/90 px-3.5 py-1 rounded-full mt-3 group-hover:bg-amber-300 shadow-2xs">
              {currentEvo.title} ✨ 点我互动
            </span>
          </div>

          {/* Pet Status Bars */}
          <div className="w-full bg-white/95 p-4 rounded-2xl border-2 border-sky-200 shadow-sm flex flex-col gap-2.5 z-10">
            {/* Level & Exp */}
            <div>
              <div className="flex justify-between text-xs font-black text-gray-700 mb-1">
                <span>⭐ 经验成长 (Lv.{currentPet.level})</span>
                <span>{currentPet.exp} / {expNeeded} EXP</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-300 rounded-full"
                  style={{ width: `${expPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Hunger & Happiness */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-0.5">
                  <span>🍖 饱食度</span>
                  <span>{currentPet.hunger}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                    style={{ width: `${currentPet.hunger}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-0.5">
                  <span>💖 开心值</span>
                  <span>{currentPet.happiness}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                    style={{ width: `${currentPet.happiness}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tabbed Control Deck (Pets, Enchant, Food, Shop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg flex flex-col gap-5">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 pb-3 gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('PETS')}
              className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'PETS'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🐾 宠物乐园
            </button>
            <button
              onClick={() => setActiveTab('ENCHANT')}
              className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'ENCHANT'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✨ 附魔进化
            </button>
            <button
              onClick={() => setActiveTab('FOOD')}
              className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'FOOD'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🍔 美味投喂
            </button>
            <button
              onClick={() => setActiveTab('SHOP')}
              className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'SHOP'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👑 饰品装扮
            </button>
          </div>

          {/* Tab 1: Pets Selector */}
          {activeTab === 'PETS' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pets.map((p) => {
                const isSelected = p.id === currentPetId;
                const pStage = p.evolutionStage || (p.level >= 5 ? 3 : p.level >= 3 ? 2 : 1);
                const info = (EVOLUTION_DATA[p.id] || EVOLUTION_DATA.cat);
                const title = pStage === 3 ? info.stage3.title : pStage === 2 ? info.stage2.title : info.stage1.title;

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl my-1 relative">
                      {p.avatarEmoji}
                      {pStage >= 2 && <span className="absolute -top-1 -right-2 text-xs">✨</span>}
                    </div>
                    <div className="font-black text-gray-800 text-sm font-kids">{p.name}</div>
                    <div className="text-[11px] text-purple-700 font-bold mb-2 line-clamp-1">{title}</div>

                    {p.unlocked ? (
                      <button
                        onClick={() => {
                          playSoundEffect('click');
                          onSelectPet(p.id);
                        }}
                        disabled={isSelected}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                        }`}
                      >
                        {isSelected ? '已出战' : '出战'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (coins >= p.cost) {
                            playSoundEffect('coin');
                            onUnlockPet(p.id, p.cost);
                          } else {
                            playSoundEffect('error');
                          }
                        }}
                        className="w-full py-1.5 rounded-xl text-xs font-black bg-amber-500 text-white hover:bg-amber-600 shadow-xs flex items-center justify-center gap-1"
                      >
                        <span>🪙 {p.cost} 解锁</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Enchant & Evolution Altar */}
          {activeTab === 'ENCHANT' && (
            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-300 uppercase">神圣附魔台</span>
                    <h3 className="text-xl font-black text-amber-300 font-kids">
                      {currentPet.name} 的形态进化
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-purple-200 block">当前阶位</span>
                    <span className="text-sm font-black bg-purple-700/80 px-2.5 py-1 rounded-lg border border-purple-400/50">
                      {evoStage === 3 ? '🌟 觉醒神兽' : evoStage === 2 ? '⚡ 元素进阶' : '🌱 幼年萌态'}
                    </span>
                  </div>
                </div>

                {/* 3 Evolution Stages Progression */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className={`p-2.5 rounded-xl border flex flex-col items-center text-center ${evoStage >= 1 ? 'bg-white/15 border-emerald-400 text-emerald-200' : 'bg-black/20 border-white/10 opacity-50'}`}>
                    <span className="text-2xl mb-1">🌱</span>
                    <span className="text-xs font-black">1阶 幼年萌态</span>
                    <span className="text-[10px] text-gray-300 mt-0.5">基础体型</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col items-center text-center ${evoStage >= 2 ? 'bg-white/15 border-cyan-400 text-cyan-200' : 'bg-black/20 border-white/10 opacity-50'}`}>
                    <span className="text-2xl mb-1">⚡</span>
                    <span className="text-xs font-black">2阶 元素进阶</span>
                    <span className="text-[10px] text-gray-300 mt-0.5">体型+20% & 专属神光</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col items-center text-center ${evoStage >= 3 ? 'bg-white/15 border-amber-400 text-amber-200' : 'bg-black/20 border-white/10 opacity-50'}`}>
                    <span className="text-2xl mb-1">👑</span>
                    <span className="text-xs font-black">3阶 觉醒神兽</span>
                    <span className="text-[10px] text-gray-300 mt-0.5">体型+40% & 全屏华丽动效</span>
                  </div>
                </div>
              </div>

              {/* Enchant Action Box */}
              <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-purple-950">
                    消耗金币强化神兽附魔 (当前 +{enchantLvl})
                  </span>
                  <span className="text-xs text-purple-700 mt-0.5">
                    提升打字结算金币加成，升级至 Lv.3 / Lv.5 解锁全新形态进化！
                  </span>
                </div>

                <button
                  onClick={handleEnchant}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-sm shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
                >
                  <span>✨ 附魔</span>
                  <span className="bg-purple-800/80 px-2 py-0.5 rounded-lg text-xs">🪙 {enchantCost}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Food & Feed */}
          {activeTab === 'FOOD' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FOODS.map((food) => (
                <div
                  key={food.id}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/80 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-between text-center"
                >
                  <span className="text-4xl my-1">{food.emoji}</span>
                  <span className="font-black text-gray-800 text-sm">{food.name}</span>
                  <div className="text-[11px] text-emerald-700 font-bold my-1">
                    饱食+{food.hungerAdd} • 开心+{food.happyAdd}
                  </div>
                  <button
                    onClick={() => handleFeed(food)}
                    className="w-full mt-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>🪙 {food.cost} 投喂</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Accessories & Shop */}
          {activeTab === 'SHOP' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {accessories.map((acc) => {
                const isEquipped = currentPet.accessory === acc.id;
                return (
                  <div
                    key={acc.id}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                      isEquipped
                        ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-4xl my-1">{acc.emoji}</span>
                    <span className="font-black text-gray-800 text-sm">{acc.name}</span>
                    <div className="text-[11px] text-gray-500 my-1">
                      {acc.cost === 0 ? '免费默认' : `🪙 ${acc.cost} 金币`}
                    </div>

                    {acc.unlocked ? (
                      <button
                        onClick={() => {
                          playSoundEffect('click');
                          onEquipAccessory(acc.id);
                        }}
                        className={`w-full py-1.5 rounded-xl text-xs font-black transition-all ${
                          isEquipped
                            ? 'bg-pink-500 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                        }`}
                      >
                        {isEquipped ? '已穿戴' : '穿戴'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (coins >= acc.cost) {
                            playSoundEffect('coin');
                            onUnlockAccessory(acc.id, acc.cost);
                          } else {
                            playSoundEffect('error');
                          }
                        }}
                        className="w-full py-1.5 rounded-xl text-xs font-black bg-pink-500 text-white hover:bg-pink-600 shadow-xs flex items-center justify-center gap-1"
                      >
                        <span>🪙 {acc.cost} 购买</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopPet;
