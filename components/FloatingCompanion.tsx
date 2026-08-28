import React, { useState, useEffect } from 'react';
import { PetItem, PetAccessory } from '../types';
import { playSoundEffect } from '../utils';

interface FloatingCompanionProps {
  pet: PetItem;
  accessory?: PetAccessory;
  combo: number;
  lastAction: 'correct' | 'error' | 'idle' | 'level_up' | 'victory' | null;
  customMessage?: string;
}

export const FloatingCompanion: React.FC<FloatingCompanionProps> = ({
  pet,
  accessory,
  combo,
  lastAction,
  customMessage
}) => {
  const [bubble, setBubble] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [motionAction, setMotionAction] = useState<string>('');

  const evoStage = pet.evolutionStage || (pet.level >= 5 ? 3 : pet.level >= 3 ? 2 : 1);

  useEffect(() => {
    if (customMessage) {
      setBubble(customMessage);
      setMotionAction('animate-bounce');
      const timer = setTimeout(() => {
        setBubble('');
        setMotionAction('');
      }, 3500);
      return () => clearTimeout(timer);
    }

    if (lastAction === 'correct') {
      if (combo > 0 && combo % 5 === 0) {
        setMotionAction('animate-bounce');
        const cheers = [
          `🔥 连击 x${combo}！太神速啦！`,
          `🌟 连击 x${combo}！手指起飞！`,
          `✨ 连击 x${combo}！太厉害啦！`
        ];
        setBubble(cheers[Math.floor(Math.random() * cheers.length)]);
        const timer = setTimeout(() => {
          setBubble('');
          setMotionAction('');
        }, 2200);
        return () => clearTimeout(timer);
      }
    } else if (lastAction === 'error') {
      setMotionAction('animate-shake');
      const mistake = pet.mistakePhrases[Math.floor(Math.random() * pet.mistakePhrases.length)] || '看准键位，再来一次！';
      setBubble(mistake);
      const timer = setTimeout(() => {
        setBubble('');
        setMotionAction('');
      }, 2500);
      return () => clearTimeout(timer);
    } else if (lastAction === 'level_up' || lastAction === 'victory') {
      setMotionAction('animate-spin');
      setBubble('🎉 恭喜通关！神兽之力升级啦！');
      const timer = setTimeout(() => {
        setBubble('');
        setMotionAction('');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastAction, combo, customMessage, pet]);

  const handleClick = () => {
    playSoundEffect('pop');
    setMotionAction('animate-bounce');
    const cheer = pet.cheerPhrases[Math.floor(Math.random() * pet.cheerPhrases.length)] || '主人加油！';
    setBubble(cheer);
    setTimeout(() => {
      setBubble('');
      setMotionAction('');
    }, 3000);
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-40 bg-white/95 p-2.5 rounded-full shadow-lg border-2 border-amber-300 cursor-pointer hover:scale-110 transition-transform flex items-center gap-1.5 backdrop-blur-md"
        title="点击展开桌面宠物伴侣"
      >
        <span className="text-2xl">{pet.avatarEmoji}</span>
        <span className="text-xs font-black text-amber-900 pr-1">伴侣</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none select-none">
      {/* Speech Bubble */}
      {bubble && (
        <div className="bg-white px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-300 text-amber-950 font-black text-xs md:text-sm max-w-[240px] text-center mb-2 animate-fade-in pointer-events-auto relative">
          {bubble}
          <div className="absolute -bottom-2 right-8 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white"></div>
        </div>
      )}

      {/* Floating Pet Card */}
      <div 
        className="pointer-events-auto bg-gradient-to-b from-amber-50 to-orange-100 p-2.5 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center gap-2.5 backdrop-blur-md transition-all hover:shadow-2xl"
      >
        <div 
          onClick={handleClick}
          className={`relative cursor-pointer transition-transform duration-150 ${motionAction || 'hover:scale-110'}`}
        >
          <div className={`w-13 h-13 bg-white rounded-full flex items-center justify-center text-3xl shadow-md border-2 transition-all ${
            evoStage === 3 ? 'border-yellow-400 ring-2 ring-amber-300 shadow-yellow-200' : evoStage === 2 ? 'border-sky-300 ring-1 ring-sky-200' : 'border-yellow-200'
          }`}>
            {pet.avatarEmoji}
          </div>
          {evoStage === 3 && (
            <div className="absolute -top-2 -left-1 text-sm animate-bounce">👑</div>
          )}
          {accessory && accessory.id !== 'none' && (
            <div className={`absolute filter drop-shadow pointer-events-none ${
              accessory.type === 'glasses'
                ? 'top-2.5 left-1/2 -translate-x-1/2 text-sm z-10'
                : accessory.type === 'wand'
                ? '-right-2 bottom-0 text-base rotate-12 z-10'
                : accessory.type === 'badge'
                ? '-bottom-1 left-1/2 -translate-x-1/2 text-sm z-10'
                : '-top-3 left-1/2 -translate-x-1/2 text-xl z-10' // Center on top of head!
            }`}>
              {accessory.emoji}
            </div>
          )}
        </div>

        <div className="flex flex-col pr-1 cursor-pointer" onClick={handleClick}>
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-amber-950 font-kids">{pet.name}</span>
            <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-black">
              Lv.{pet.level}
            </span>
            {evoStage >= 2 && (
              <span className="text-[9px] bg-purple-600 text-white px-1 py-0.2 rounded font-bold">
                {evoStage === 3 ? '神兽' : '进阶'}
              </span>
            )}
          </div>
          <div className="text-[10px] text-amber-800 font-medium">
            {combo > 1 ? `🔥 Combo x${combo}` : '陪你一起快乐打字'}
          </div>
        </div>

        {/* Minimize Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
          className="text-gray-400 hover:text-gray-600 p-1 text-xs font-black"
          title="最小化伴侣"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default FloatingCompanion;
