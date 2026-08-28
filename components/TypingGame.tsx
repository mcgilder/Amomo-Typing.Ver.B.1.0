import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TEXTBOOK_RESOURCES } from '../constants';
import { ExerciseItem, Mode } from '../types';
import { playSoundEffect } from '../utils';

interface GameItem {
  typing: string;
  display: string;
  phonetic?: string;
}

interface TypingGameProps {
  customWordList?: ExerciseItem[];
  customTitle?: string;
  onEarnCoins?: (amount: number) => void;
  onRecordGameStat?: (gameName: string, score: number, accuracy: number) => void;
}

// ----------------------------------------------------
// GAME 1: FROG RIVER MAZE CROSSING (小青蛙寻母迷宫跳跃)
// ----------------------------------------------------
interface FrogGameProps {
  wordList: GameItem[];
  onEarnCoins?: (amount: number) => void;
  onBack: () => void;
}

interface MazePad {
  id: number;
  stepIndex: number;
  item: GameItem;
  typed: string;
  label: string;
  icon: string;
}

const FrogGameComponent: React.FC<FrogGameProps> = ({ wordList, onEarnCoins, onBack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to TOTAL_STEPS
  const [mazePads, setMazePads] = useState<MazePad[]>([]);
  const [score, setScore] = useState<number>(0);
  const [reunions, setReunions] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [jumpDirection, setJumpDirection] = useState<'right' | 'left' | 'up'>('right');
  const [isSuccessModal, setIsSuccessModal] = useState<boolean>(false);

  const TOTAL_STEPS = 6; // Widescreen 6-stage river maze

  const PAD_ICONS = ['🍀', '🪷', '🌿', '🪵', '🪨', '🌸'];

  const initMaze = () => {
    const pool = wordList.length > 0 ? wordList : [
      { typing: 'sun', display: '太阳' },
      { typing: 'cat', display: '猫咪' },
      { typing: 'fish', display: '小鱼' },
      { typing: 'tree', display: '大树' },
      { typing: 'star', display: '星星' },
      { typing: 'frog', display: '青蛙' },
      { typing: 'duck', display: '小鸭' }
    ];

    const pads: MazePad[] = [];
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)] || pool[0];
      pads.push({
        id: Date.now() + i * 100,
        stepIndex: i,
        item,
        typed: '',
        label: `荷叶 #${i + 1}`,
        icon: PAD_ICONS[i % PAD_ICONS.length]
      });
    }
    setMazePads(pads);
    setCurrentStep(0);
    setIsJumping(false);
  };

  useEffect(() => {
    initMaze();
  }, [wordList]);

  const handleInputChar = (char: string) => {
    if (!isPlaying || isJumping || currentStep >= TOTAL_STEPS) return;

    const currentPad = mazePads[currentStep];
    if (!currentPad) return;

    const targetChar = currentPad.item.typing[currentPad.typed.length]?.toLowerCase();

    if (char.toLowerCase() === targetChar) {
      playSoundEffect('click');
      const newTyped = currentPad.typed + char;

      if (newTyped.toLowerCase() === currentPad.item.typing.toLowerCase()) {
        // Complete current word on this lily pad, perform powerful leap to next pad!
        setIsJumping(true);
        playSoundEffect('frog_jump');
        setJumpDirection(currentStep % 2 === 0 ? 'right' : 'up');

        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setScore(s => s + 30 + combo * 5);
        setCombo(c => c + 1);
        onEarnCoins?.(3);

        setTimeout(() => {
          setIsJumping(false);
          if (nextStep >= TOTAL_STEPS) {
            // Reached Frog Mom!
            playSoundEffect('victory');
            setReunions(r => r + 1);
            setScore(s => s + 100);
            onEarnCoins?.(20);
            setIsSuccessModal(true);
            setTimeout(() => {
              setIsSuccessModal(false);
              initMaze();
            }, 2200);
          }
        }, 450);
      } else {
        setMazePads(prev =>
          prev.map((p, idx) => (idx === currentStep ? { ...p, typed: newTyped } : p))
        );
      }
    } else {
      playSoundEffect('error');
      setCombo(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        handleInputChar(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mazePads, currentStep, isPlaying, isJumping, combo]);

  const currentPad = currentStep < TOTAL_STEPS ? mazePads[currentStep] : null;
  const nextRequiredKey = currentPad ? currentPad.item.typing[currentPad.typed.length]?.toUpperCase() : '';

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-5xl animate-fade-in mx-auto px-2">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4 rounded-3xl shadow-lg border-2 border-emerald-300 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🐸</span>
          <div>
            <h3 className="font-black font-kids text-lg leading-tight flex items-center gap-2">
              <span>小青蛙寻母迷宫跳跃</span>
              <span className="text-xs bg-emerald-800/90 text-yellow-300 px-2.5 py-0.5 rounded-full border border-emerald-400">
                迷宫河道 6 连跳
              </span>
            </h3>
            <span className="text-xs text-emerald-100 font-bold">
              成功找到青蛙妈妈: <b className="text-yellow-300 text-sm">{reunions}</b> 次
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-black">
          <span className="bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-400">
            ⭐ 冒险积分: <b className="text-yellow-300 text-base">{score}</b>
          </span>
          <span className="bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-400 text-amber-300">
            🔥 连击: x{combo}
          </span>
        </div>
      </div>

      {/* Main Widescreen River Maze Stage */}
      <div className="relative w-full h-[420px] md:h-[450px] bg-gradient-to-b from-teal-800 via-sky-600 to-emerald-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-900 flex flex-col justify-between p-4 select-none">
        {/* Animated Water Surface & Ripple Lighting */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black"></div>

        {/* North Sanctuary: Frog Mom Riverbank */}
        <div className="w-full h-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 rounded-2xl flex items-center justify-between px-6 text-sm font-black text-emerald-100 shadow border border-emerald-500 z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span>金色荷花圣地 · 青蛙妈妈在这里等着你</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce filter drop-shadow">🐸👑</span>
            <span className="text-xs bg-amber-400 text-amber-950 px-2.5 py-1 rounded-xl font-black">
              青蛙妈妈
            </span>
          </div>

          {currentStep >= TOTAL_STEPS ? (
            <span className="text-lg font-black text-yellow-300 animate-bounce flex items-center gap-1.5">
              <span>🎉</span> 母子团聚大胜利！
            </span>
          ) : (
            <span className="text-xs text-yellow-200">
              还差 <b className="text-white text-base">{TOTAL_STEPS - currentStep}</b> 步跳到妈妈怀抱
            </span>
          )}
        </div>

        {/* 6-Pad Winding Maze Pathway (Widescreen layout) */}
        <div className="grid grid-cols-6 gap-2 md:gap-4 my-auto z-10 px-2 items-center">
          {mazePads.map((pad, idx) => {
            const isTarget = idx === currentStep;
            const isPassed = idx < currentStep;
            // Zigzag height displacement to simulate a winding maze
            const yOffset = idx % 2 === 0 ? 'translate-y-2' : '-translate-y-3';

            return (
              <div
                key={pad.id}
                className={`flex flex-col items-center justify-center relative transition-transform ${yOffset}`}
              >
                {/* Stepping Lily Pad / Rock */}
                <button
                  onClick={() => {
                    const char = pad.item.typing[pad.typed.length];
                    if (char) handleInputChar(char);
                  }}
                  className={`w-full max-w-[120px] aspect-square rounded-3xl flex flex-col items-center justify-center p-2 shadow-xl transition-all duration-300 relative border-3 cursor-pointer active:scale-95 ${
                    isTarget
                      ? 'bg-emerald-50 border-amber-400 scale-108 ring-6 ring-amber-300/70 shadow-amber-300/80 animate-pulse'
                      : isPassed
                      ? 'bg-emerald-900/60 border-emerald-950 opacity-60'
                      : 'bg-emerald-200/90 border-emerald-400 hover:bg-emerald-100'
                  }`}
                >
                  {/* Step icon */}
                  <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                    <span>{pad.icon}</span>
                    <span className="hidden md:inline">#{idx + 1}</span>
                  </span>

                  {/* Word translation */}
                  <span className="text-xs md:text-sm font-black text-emerald-950 text-center line-clamp-1 mt-0.5">
                    {pad.item.display}
                  </span>

                  {/* Typing Word with High-Contrast Highlight */}
                  <div className="flex text-xs md:text-sm font-black font-mono mt-1 flex-wrap justify-center gap-0.5">
                    {pad.item.typing.split('').map((char, charIdx) => {
                      const isTyped = charIdx < pad.typed.length;
                      const isNext = isTarget && charIdx === pad.typed.length;

                      return (
                        <span
                          key={charIdx}
                          className={`px-0.5 md:px-1 py-0.2 md:py-0.5 rounded text-xs font-bold ${
                            isTyped
                              ? 'text-yellow-950 bg-yellow-300 font-black'
                              : isNext
                              ? 'text-white bg-rose-500 animate-bounce font-black shadow-md scale-110'
                              : 'text-emerald-900'
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>

                  {isTarget && (
                    <span className="text-[9px] font-black text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded-full mt-1">
                      按键或点击
                    </span>
                  )}
                </button>

                {/* Animated Leaping Frog Avatar */}
                {isTarget && (
                  <div
                    className={`absolute -top-10 text-4xl md:text-5xl filter drop-shadow-2xl z-30 transition-all duration-300 ${
                      isJumping
                        ? `animate-frog-arc ${
                            jumpDirection === 'right' ? 'rotate-12' : '-rotate-12'
                          }`
                        : 'animate-bounce'
                    }`}
                  >
                    🐸
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* South Starting Riverbank */}
        <div className="w-full h-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 rounded-2xl flex items-center justify-between px-6 text-sm font-black text-emerald-100 shadow border border-emerald-500 z-10">
          <div className="flex items-center gap-2">
            <span>🌱 起步草地</span>
            {currentStep === 0 && <span className="text-2xl animate-bounce">🐸</span>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-yellow-300 font-black text-xs md:text-sm">
              当前目标按键:
            </span>
            {nextRequiredKey ? (
              <span className="px-3.5 py-1 bg-amber-400 text-amber-950 rounded-xl font-mono text-base md:text-lg font-black shadow-md animate-pulse">
                [ {nextRequiredKey} ]
              </span>
            ) : (
              <span className="text-emerald-200 font-black">🎉 到达终点</span>
            )}
          </div>
        </div>

        {/* Victory Modal */}
        {isSuccessModal && (
          <div className="absolute inset-0 bg-black/75 rounded-3xl flex flex-col items-center justify-center text-white z-40 p-6 animate-fade-in">
            <span className="text-6xl animate-bounce mb-2">🐸❤️🐸👑</span>
            <h3 className="text-2xl md:text-3xl font-black font-kids text-yellow-300">
              太棒啦！小青蛙找到妈妈了！
            </h3>
            <p className="text-sm font-bold text-gray-200 mt-2">
              获得奖励金币: <b className="text-yellow-400 text-lg">+20</b> 🪙
            </p>
          </div>
        )}
      </div>

      {/* On-Screen Virtual Controls */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border-2 border-emerald-100 shadow-md">
        <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
          <span>💡</span> 敲击键盘字母让青蛙蓄力跳向下一片荷叶，或直接用鼠标/手指点击荷叶！
        </div>

        <div className="flex items-center gap-3">
          {nextRequiredKey && (
            <button
              onClick={() => handleInputChar(nextRequiredKey)}
              className="px-5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-xs md:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>👇 快速输入:</span>
              <span className="font-mono text-base bg-white px-2 py-0.5 rounded-lg shadow-xs">{nextRequiredKey}</span>
            </button>
          )}

          <button
            onClick={initMaze}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow active:scale-95 transition-all"
          >
            🔄 换一组迷宫
          </button>

          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-black text-xs shadow active:scale-95 transition-all"
          >
            返回选择
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// GAME 2: WHACK-A-MOLE (打地鼠趣味大作战 - 极速响应版)
// ----------------------------------------------------
interface MoleGameProps {
  wordList: GameItem[];
  onEarnCoins?: (amount: number) => void;
  onBack: () => void;
}

interface ActiveMole {
  id: number;
  holeIndex: number;
  item: GameItem;
  targetKey: string;
  spawnTime: number;
  duration: number; // ms
  isHit: boolean;
}

const WhackMoleGameComponent: React.FC<MoleGameProps> = ({ wordList, onEarnCoins, onBack }) => {
  const [moles, setMoles] = useState<ActiveMole[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [moleSpeed, setMoleSpeed] = useState<'NORMAL' | 'FAST'>('NORMAL');
  const [hammerHole, setHammerHole] = useState<number | null>(null);

  const pool = useMemo(() => {
    return wordList.length > 0 ? wordList : [
      { typing: 'apple', display: '苹果' },
      { typing: 'bear', display: '小熊' },
      { typing: 'star', display: '星星' },
      { typing: 'duck', display: '鸭子' },
      { typing: 'fish', display: '小鱼' },
      { typing: 'frog', display: '青蛙' },
      { typing: 'cake', display: '蛋糕' },
      { typing: 'lion', display: '狮子' }
    ];
  }, [wordList]);

  // 1. Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      playSoundEffect('victory');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. Active Mole Spawner (Continuous robust loop)
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = moleSpeed === 'FAST' ? 900 : 1300;
    const moleDuration = moleSpeed === 'FAST' ? 3000 : 4000;

    const spawner = setInterval(() => {
      const now = Date.now();
      setMoles(prev => {
        // Clean expired
        const alive = prev.filter(m => !m.isHit && now - m.spawnTime < m.duration);

        // Max 3 moles on screen simultaneously
        if (alive.length >= 3) return alive;

        const occupiedHoles = new Set(alive.map(m => m.holeIndex));
        const freeHoles = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(h => !occupiedHoles.has(h));

        if (freeHoles.length === 0) return alive;

        const chosenHole = freeHoles[Math.floor(Math.random() * freeHoles.length)];
        const randomWord = pool[Math.floor(Math.random() * pool.length)];
        const key = randomWord.typing[0]?.toUpperCase() || 'A';

        playSoundEffect('pop', 0.15);

        return [
          ...alive,
          {
            id: now + Math.random(),
            holeIndex: chosenHole,
            item: randomWord,
            targetKey: key,
            spawnTime: now,
            duration: moleDuration,
            isHit: false
          }
        ];
      });
    }, spawnInterval);

    return () => clearInterval(spawner);
  }, [isGameOver, moleSpeed, pool]);

  const whackHole = (holeIdx: number) => {
    setHammerHole(holeIdx);
    setTimeout(() => setHammerHole(null), 250);

    const targetMole = moles.find(m => m.holeIndex === holeIdx && !m.isHit);
    if (!targetMole) return;

    playSoundEffect('mole_hit');
    setHits(h => h + 1);
    setScore(s => s + 20 + combo * 4);
    setCombo(c => c + 1);
    onEarnCoins?.(2);

    setMoles(prev =>
      prev.map(m => (m.id === targetMole.id ? { ...m, isHit: true } : m))
    );

    setTimeout(() => {
      setMoles(prev => prev.filter(m => m.id !== targetMole.id));
    }, 350);
  };

  // Keyboard hit listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      const key = e.key.toUpperCase();

      const matchedMole = moles.find(m => !m.isHit && m.targetKey === key);

      if (matchedMole) {
        whackHole(matchedMole.holeIndex);
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        playSoundEffect('error', 0.1);
        setCombo(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moles, isGameOver, combo]);

  const restartGame = () => {
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setHits(0);
    setIsGameOver(false);
    setMoles([]);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-5xl animate-fade-in mx-auto px-2">
      {/* Header Bar */}
      <div className="flex flex-wrap justify-between items-center w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 rounded-3xl shadow-lg border-2 border-amber-300 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🔨</span>
          <div>
            <h3 className="font-black font-kids text-lg leading-tight flex items-center gap-2">
              <span>打地鼠趣味大作战</span>
              <span className="text-xs bg-amber-800 text-yellow-200 px-2.5 py-0.5 rounded-full border border-amber-400">
                按对应首字母抢打
              </span>
            </h3>
            <span className="text-xs text-amber-100 font-bold">
              击中地鼠: <b className="text-yellow-200 text-sm">{hits}</b> 只
            </span>
          </div>
        </div>

        {/* Speed Switcher */}
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-2xl border border-white/20">
          <button
            onClick={() => setMoleSpeed('NORMAL')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              moleSpeed === 'NORMAL' ? 'bg-amber-400 text-amber-950 shadow' : 'text-white'
            }`}
          >
            🌿 轻松模式
          </button>
          <button
            onClick={() => setMoleSpeed('FAST')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              moleSpeed === 'FAST' ? 'bg-rose-500 text-white shadow' : 'text-white'
            }`}
          >
            ⚡ 极速连击
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm font-black">
          <span className="bg-amber-800/80 px-3 py-1.5 rounded-xl border border-amber-400">
            ⏳ 倒计时: <b className="text-yellow-200 text-base">{timeLeft}s</b>
          </span>
          <span className="bg-amber-800/80 px-3 py-1.5 rounded-xl border border-amber-400">
            ⭐ 得分: <b className="text-yellow-200 text-base">{score}</b>
          </span>
          <span className="bg-amber-800/80 px-3 py-1.5 rounded-xl border border-amber-400 text-amber-200">
            🔥 连击: x{combo}
          </span>
        </div>
      </div>

      {/* 3x3 Mole Lawn Stage */}
      <div className="relative w-full bg-gradient-to-b from-lime-600 via-emerald-600 to-green-700 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-emerald-900 select-none">
        <div className="grid grid-cols-3 gap-4 md:gap-7 max-w-2xl mx-auto">
          {Array.from({ length: 9 }).map((_, idx) => {
            const mole = moles.find(m => m.holeIndex === idx);
            const isHammerHere = hammerHole === idx;

            return (
              <div
                key={idx}
                onClick={() => whackHole(idx)}
                className="relative h-28 md:h-36 bg-amber-950 rounded-3xl border-4 border-amber-800 shadow-inner flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 group transition-transform"
              >
                {/* Soil Mound Texture */}
                <div className="absolute -bottom-2 inset-x-0 h-10 bg-amber-900 rounded-t-full border-t-2 border-amber-700 z-10 flex items-center justify-center text-[10px] text-amber-300/60 font-black">
                  🌱 洞穴 #{idx + 1}
                </div>

                {/* Animated Mole Avatar */}
                {mole && (
                  <div
                    className={`absolute inset-x-2 bottom-3 flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-100 border-3 border-amber-400 shadow-xl z-20 transition-all duration-200 ${
                      mole.isHit
                        ? 'animate-ping bg-rose-200 border-rose-500 scale-90'
                        : 'animate-bounce'
                    }`}
                  >
                    <span className="text-3xl md:text-4xl">
                      {mole.isHit ? '😵' : '🐹'}
                    </span>

                    {/* Word translation & Giant Target Key Badge */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                        {mole.targetKey}
                      </span>
                      <span className="text-xs md:text-sm font-black text-gray-900 line-clamp-1">
                        {mole.item.display}
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-600 font-mono font-bold">
                      {mole.item.typing}
                    </span>
                  </div>
                )}

                {/* Hammer Strike Overlay */}
                {isHammerHere && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none text-5xl animate-ping">
                    🔨
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/75 rounded-3xl flex flex-col items-center justify-center text-white z-40 p-6 animate-fade-in">
            <span className="text-5xl animate-bounce mb-2">🏆</span>
            <h3 className="text-2xl md:text-3xl font-black font-kids text-yellow-300">
              游戏时间到！打地鼠小高手！
            </h3>
            <p className="text-sm font-bold text-gray-200 mt-2">
              最终得分: <b className="text-yellow-400 text-2xl">{score}</b> | 击中地鼠: {hits} 只
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={restartGame}
                className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm shadow-md transition-transform active:scale-95"
              >
                🔄 再玩一次
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm transition-transform active:scale-95"
              >
                返回菜单
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border-2 border-amber-100 shadow-md">
        <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
          <span>💡</span> 敲击地鼠头上的红色字母键（例如：按 [A] 打出 apple 地鼠），或直接点击地鼠！
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={restartGame}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow active:scale-95 transition-all"
          >
            🔄 重新开始
          </button>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-black text-xs shadow active:scale-95 transition-all"
          >
            返回选择
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// GAME 3: VERTICAL SPEED RACER (竖向极速赛车避障冲刺)
// ----------------------------------------------------
interface RaceGameProps {
  wordList: GameItem[];
  onEarnCoins?: (amount: number) => void;
  onBack: () => void;
}

interface ObstacleItem {
  id: number;
  lane: 0 | 1 | 2;
  y: number; // 0% (top) to 100% (bottom)
  type: 'OBSTACLE' | 'BONUS_WORD';
  icon: string;
  label: string;
  item?: GameItem;
  targetKey?: string;
  hasDodged?: boolean;
}

const SpeedRacerGameComponent: React.FC<RaceGameProps> = ({ wordList, onEarnCoins, onBack }) => {
  const [carLane, setCarLane] = useState<0 | 1 | 2>(1); // 0: Left, 1: Center, 2: Right
  const [obstacles, setObstacles] = useState<ObstacleItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(100);
  const [nitroActive, setNitroActive] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);
  const [dodgeMessage, setDodgeMessage] = useState<string | null>(null);

  const pool = useMemo(() => {
    return wordList.length > 0 ? wordList : [
      { typing: 'car', display: '小汽车' },
      { typing: 'fast', display: '飞快' },
      { typing: 'win', display: '获胜' },
      { typing: 'road', display: '公路' },
      { typing: 'star', display: '能量星' }
    ];
  }, [wordList]);

  // Spawner for Obstacles and Bonus Words
  useEffect(() => {
    const OBSTACLE_ICONS = [
      { icon: '🚧', label: '施工路障' },
      { icon: '🪨', label: '巨大滚石' },
      { icon: '🛢️', label: '滑溜油桶' },
      { icon: '🍌', label: '香蕉皮' }
    ];

    const spawner = setInterval(() => {
      const randomLane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
      const isBonus = Math.random() > 0.45; // 55% obstacles, 45% bonus words

      if (isBonus) {
        const randomItem = pool[Math.floor(Math.random() * pool.length)] || pool[0];
        const targetKey = randomItem.typing[0]?.toUpperCase() || 'A';

        setObstacles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            lane: randomLane,
            y: 0,
            type: 'BONUS_WORD',
            icon: '⭐',
            label: randomItem.display,
            item: randomItem,
            targetKey
          }
        ]);
      } else {
        const pickObs = OBSTACLE_ICONS[Math.floor(Math.random() * OBSTACLE_ICONS.length)];
        setObstacles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            lane: randomLane,
            y: 0,
            type: 'OBSTACLE',
            icon: pickObs.icon,
            label: pickObs.label
          }
        ]);
      }
    }, 1400);

    return () => clearInterval(spawner);
  }, [pool]);

  // Physics animation loop
  useEffect(() => {
    let animFrame: number;

    const updatePhysics = () => {
      setObstacles(prev => {
        const updated: ObstacleItem[] = [];
        const speedStep = nitroActive ? 1.6 : 0.95;

        for (const obs of prev) {
          const nextY = obs.y + speedStep;

          // Player Car position is at y = 78%..88%
          if (nextY >= 75 && nextY <= 88) {
            if (obs.type === 'BONUS_WORD' && obs.lane === carLane) {
              // Collected Bonus Word Checkpoint!
              playSoundEffect('coin');
              setScore(s => s + 35 + combo * 5);
              setCombo(c => c + 1);
              onEarnCoins?.(3);
              setNitroActive(true);
              setSpeed(180);
              setTimeout(() => {
                setNitroActive(false);
                setSpeed(100);
              }, 600);
              continue; // Collected!
            } else if (obs.type === 'OBSTACLE' && obs.lane === carLane) {
              // Hit obstacle!
              playSoundEffect('error');
              setCombo(0);
              setSpeed(60);
              setTimeout(() => setSpeed(100), 500);
            }
          }

          // Dodge detection: when an obstacle safely passes the car without hitting
          if (obs.type === 'OBSTACLE' && nextY > 88 && !obs.hasDodged) {
            obs.hasDodged = true;
            // Trigger cheerful car horn sound on successful dodge!
            playSoundEffect('car_horn');
            setScore(s => s + 10);
            setDodgeMessage('📣 完美避让鸣笛! +10');
            setTimeout(() => setDodgeMessage(null), 800);
          }

          if (nextY < 105) {
            updated.push({ ...obs, y: nextY });
          }
        }
        return updated;
      });

      animFrame = requestAnimationFrame(updatePhysics);
    };

    animFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrame);
  }, [carLane, nitroActive, combo]);

  const shiftToLane = (lane: 0 | 1 | 2) => {
    playSoundEffect('car_engine');
    setCarLane(lane);
  };

  // Keyboard controls
  const handleKeyTrigger = (key: string) => {
    const upper = key.toUpperCase();

    // 1. If key matches upcoming bonus word, steer directly to that lane!
    const nearestBonus = [...obstacles]
      .filter(o => o.type === 'BONUS_WORD' && o.targetKey === upper && o.y < 85)
      .sort((a, b) => b.y - a.y)[0];

    if (nearestBonus) {
      shiftToLane(nearestBonus.lane);
      return;
    }

    // 2. Direct steering keys
    if (upper === 'A' || upper === 'J' || upper === 'ARROWLEFT') {
      shiftToLane(carLane > 0 ? ((carLane - 1) as 0 | 1 | 2) : 0);
    } else if (upper === 'D' || upper === 'L' || upper === 'ARROWRIGHT') {
      shiftToLane(carLane < 2 ? ((carLane + 1) as 0 | 1 | 2) : 2);
    } else if (upper === 'S' || upper === 'K' || upper === 'ARROWDOWN') {
      shiftToLane(1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        shiftToLane(carLane > 0 ? ((carLane - 1) as 0 | 1 | 2) : 0);
      } else if (e.key === 'ArrowRight') {
        shiftToLane(carLane < 2 ? ((carLane + 1) as 0 | 1 | 2) : 2);
      } else if (e.key === 'ArrowDown') {
        shiftToLane(1);
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        handleKeyTrigger(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carLane, obstacles]);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-5xl animate-fade-in mx-auto px-2">
      {/* Race Header */}
      <div className="flex flex-wrap justify-between items-center w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 rounded-3xl shadow-lg border-2 border-blue-300 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🏎️</span>
          <div>
            <h3 className="font-black font-kids text-lg leading-tight flex items-center gap-2">
              <span>竖向极速赛车冲刺</span>
              <span className="text-xs bg-blue-900/90 text-yellow-300 px-2.5 py-0.5 rounded-full border border-blue-400">
                机械抖动 · 尾气推进
              </span>
            </h3>
            <span className="text-xs text-blue-100 font-bold">
              时速仪表盘: <b className="text-yellow-300 text-base">{speed} km/h</b>
            </span>
          </div>
        </div>

        {dodgeMessage && (
          <div className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-xl shadow animate-bounce">
            {dodgeMessage}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm font-black">
          <span className="bg-blue-800/80 px-3 py-1.5 rounded-xl border border-blue-400">
            ⭐ 赛道积分: <b className="text-yellow-300 text-base">{score}</b>
          </span>
          <span className="bg-blue-800/80 px-3 py-1.5 rounded-xl border border-blue-400 text-amber-300">
            🔥 连击: x{combo}
          </span>
        </div>
      </div>

      {/* Tall Vertical 3-Lane Highway Track (Height = 520px) */}
      <div className="relative w-full h-[500px] md:h-[540px] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-950 flex select-none">
        {/* Left Road Shoulder with Red/White Kerbs */}
        <div className="w-6 md:w-10 bg-red-600 border-r-4 border-white flex flex-col justify-around py-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-5 bg-white opacity-85 shadow-sm"></div>
          ))}
        </div>

        {/* 3 Vertical Lanes Container */}
        <div className="flex-1 grid grid-cols-3 relative divide-x-2 divide-dashed divide-yellow-400/90 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
          {/* Lane 0 (Left), Lane 1 (Center), Lane 2 (Right) */}
          {[0, 1, 2].map(laneIdx => (
            <div
              key={laneIdx}
              onClick={() => shiftToLane(laneIdx as 0 | 1 | 2)}
              className="relative h-full flex flex-col items-center cursor-pointer hover:bg-white/5 transition-colors"
            >
              {/* Lane Identifier */}
              <div className="absolute top-2 text-[10px] font-black text-gray-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-gray-700">
                {laneIdx === 0 ? '左道 (A/←)' : laneIdx === 1 ? '中道 (S/↓)' : '右道 (D/→)'}
              </div>

              {/* Player Vertical Sports Car */}
              {carLane === laneIdx && (
                <div
                  className={`absolute bottom-6 flex flex-col items-center transition-all duration-200 z-30 ${
                    nitroActive ? 'scale-115' : ''
                  }`}
                >
                  {/* Headlight Beams illuminating forward road */}
                  <div className="w-16 h-28 bg-gradient-to-t from-yellow-300/40 via-yellow-100/20 to-transparent rounded-t-full -mb-4 pointer-events-none filter blur-xs"></div>

                  {/* Vertical Car Body with Mechanical Idle Rumble Animation */}
                  <div className="relative animate-car-rumble flex flex-col items-center">
                    {/* Roof indicator */}
                    <div className="w-10 h-16 bg-gradient-to-b from-blue-500 via-indigo-600 to-blue-700 rounded-2xl border-2 border-blue-300 shadow-2xl flex flex-col items-center justify-between p-1">
                      <div className="w-6 h-3 bg-cyan-200 rounded-t-md shadow-inner"></div>
                      <span className="text-[10px] font-black text-white">⚡</span>
                      <div className="w-6 h-2 bg-rose-500 rounded-b-md shadow-inner"></div>
                    </div>

                    {/* Dual Exhaust Pipes with Puffed Animation */}
                    <div className="flex justify-between w-8 mt-0.5">
                      <span className="text-xs animate-exhaust-puff">💨</span>
                      <span className="text-xs animate-exhaust-puff delay-100">💨</span>
                    </div>
                  </div>

                  {nitroActive && (
                    <span className="text-[10px] font-black text-yellow-300 bg-black/80 px-2 py-0.5 rounded-full mt-1 animate-pulse border border-yellow-400">
                      🔥 涡轮氮气加速!
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Falling Obstacles & Bonus Checkpoints */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              style={{
                top: `${obs.y}%`,
                left: `${obs.lane * 33.33 + 3}%`,
                width: '27%'
              }}
              className={`absolute z-20 flex flex-col items-center p-2 rounded-2xl shadow-2xl pointer-events-none transition-transform duration-100 ${
                obs.type === 'BONUS_WORD'
                  ? 'bg-gradient-to-b from-amber-300 to-yellow-400 border-2 border-yellow-200 text-gray-950 scale-105'
                  : 'bg-gradient-to-b from-rose-500 to-red-600 border-2 border-rose-300 text-white animate-pulse'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xl md:text-2xl">{obs.icon}</span>
                {obs.type === 'BONUS_WORD' && obs.targetKey && (
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                    {obs.targetKey}
                  </span>
                )}
              </div>

              <span className="text-xs font-black line-clamp-1 mt-0.5">
                {obs.label}
              </span>

              {obs.type === 'BONUS_WORD' && obs.item && (
                <span className="text-[10px] font-bold opacity-80 font-mono">
                  {obs.item.typing}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right Road Shoulder */}
        <div className="w-6 md:w-10 bg-red-600 border-l-4 border-white flex flex-col justify-around py-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-5 bg-white opacity-85 shadow-sm"></div>
          ))}
        </div>
      </div>

      {/* Lane Shift Buttons for Kids */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border-2 border-blue-100 shadow-md">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => shiftToLane(0)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm shadow transition-all active:scale-95 ${
              carLane === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👈 左车道 (A / ←)
          </button>
          <button
            onClick={() => shiftToLane(1)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm shadow transition-all active:scale-95 ${
              carLane === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚗 中车道 (S / ↓)
          </button>
          <button
            onClick={() => shiftToLane(2)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm shadow transition-all active:scale-95 ${
              carLane === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👉 右车道 (D / →)
          </button>
        </div>

        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-black text-xs shadow active:scale-95 transition-all"
        >
          返回选择
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// MAIN CONTAINER & GAME HUB
// ----------------------------------------------------
export const TypingGame: React.FC<TypingGameProps> = ({
  customWordList,
  customTitle,
  onEarnCoins,
  onRecordGameStat
}) => {
  const [activeGame, setActiveGame] = useState<'FROG' | 'MOLE' | 'RACE' | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode>(Mode.ENGLISH);
  const [selectedBook, setSelectedBook] = useState<string>('GRADE 1-Fall');

  const currentWordList: GameItem[] = useMemo(() => {
    if (customWordList && customWordList.length > 0) {
      return customWordList.map(item => ({
        typing: item.text,
        display: item.chinese || item.text,
        phonetic: item.phonetic
      }));
    }
    const langKey = selectedMode === Mode.ENGLISH ? '英语' : '语文';
    const items = TEXTBOOK_RESOURCES[langKey]?.[selectedBook] || [];

    return items.map(item => ({
      typing: item.text,
      display: selectedMode === Mode.ENGLISH ? item.text : (item.chinese || item.text),
      phonetic: item.phonetic
    }));
  }, [selectedBook, selectedMode, customWordList]);

  if (activeGame === 'FROG') {
    return (
      <FrogGameComponent
        wordList={currentWordList}
        onEarnCoins={onEarnCoins}
        onBack={() => setActiveGame(null)}
      />
    );
  }

  if (activeGame === 'MOLE') {
    return (
      <WhackMoleGameComponent
        wordList={currentWordList}
        onEarnCoins={onEarnCoins}
        onBack={() => setActiveGame(null)}
      />
    );
  }

  if (activeGame === 'RACE') {
    return (
      <SpeedRacerGameComponent
        wordList={currentWordList}
        onEarnCoins={onEarnCoins}
        onBack={() => setActiveGame(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 animate-fade-in mx-auto px-4">
      {/* Game Selection Hub Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <h2 className="text-2xl md:text-3xl font-black font-kids">趣味打字游戏乐园</h2>
          </div>
          <p className="text-xs md:text-sm text-amber-100 mt-1">
            {customTitle ? `正在使用专属词库: ${customTitle}` : '边玩游戏边记单词，练就无敌飞速神手指！'}
          </p>
        </div>

        {/* Mode switcher if not custom story */}
        {!customWordList && (
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/20">
            <button
              onClick={() => setSelectedMode(Mode.ENGLISH)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedMode === Mode.ENGLISH ? 'bg-white text-orange-950 shadow-md' : 'text-white'
              }`}
            >
              🔤 英语单词
            </button>
            <button
              onClick={() => setSelectedMode(Mode.CHINESE)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedMode === Mode.CHINESE ? 'bg-white text-orange-950 shadow-md' : 'text-white'
              }`}
            >
              🇨🇳 语文拼音
            </button>
          </div>
        )}
      </div>

      {/* 3 Interactive Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game 1: Frog Crossing */}
        <div
          onClick={() => {
            playSoundEffect('click');
            setActiveGame('FROG');
          }}
          className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-lg hover:shadow-2xl hover:border-emerald-400 hover:scale-102 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl mb-3 group-hover:animate-bounce shadow-xs">
              🐸
            </div>
            <h3 className="text-xl font-black text-gray-900 font-kids">小青蛙寻母迷宫跳跃</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 leading-relaxed">
              全屏河道迷宫，荷叶浮水与倒木石桥，按键蓄力跳跃，护送小青蛙找到青蛙妈妈！
            </p>
          </div>

          <button className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2">
            <span>🚀 启程寻母</span>
          </button>
        </div>

        {/* Game 2: Whack-a-Mole */}
        <div
          onClick={() => {
            playSoundEffect('click');
            setActiveGame('MOLE');
          }}
          className="bg-white rounded-3xl p-6 border-3 border-amber-200 shadow-lg hover:shadow-2xl hover:border-amber-400 hover:scale-102 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-3 group-hover:animate-bounce shadow-xs">
              🔨
            </div>
            <h3 className="text-xl font-black text-gray-900 font-kids">打地鼠趣味大作战</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 leading-relaxed">
              即时活跃钻洞地鼠，敲击首字母或直接敲打，轻松与极速双模式，疯狂连击！
            </p>
          </div>

          <button className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2">
            <span>🚀 挥锤开打</span>
          </button>
        </div>

        {/* Game 3: Speed Racer */}
        <div
          onClick={() => {
            playSoundEffect('click');
            setActiveGame('RACE');
          }}
          className="bg-white rounded-3xl p-6 border-3 border-blue-200 shadow-lg hover:shadow-2xl hover:border-blue-400 hover:scale-102 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-4xl mb-3 group-hover:animate-bounce shadow-xs">
              🏎️
            </div>
            <h3 className="text-xl font-black text-gray-900 font-kids">竖向极速赛车冲刺</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 leading-relaxed">
              深邃竖向赛道，车体机械抖动与尾气喷射，敏捷避开路障触发汽车鸣笛，收集能量狂飙！
            </p>
          </div>

          <button className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2">
            <span>🚀 踩下油门</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingGame;
