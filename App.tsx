import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Mode, Tab, TypingStats, ExerciseItem, PetItem, PetAccessory, Achievement } from './types';
import { TEXTBOOK_RESOURCES, KEYBOARD_LAYOUT } from './constants';
import {
  speakDirect,
  prewarmSpeech,
  playPraiseAndExample,
  playPraiseVoice,
  splitSyllables,
  getSyllableColor,
  playSoundEffect,
  getPinyinWithTones
} from './utils';
import Keyboard from './components/Keyboard';
import Statistics, { INITIAL_ACHIEVEMENTS } from './components/Statistics';
import TypingGame from './components/TypingGame';
import StoryGenerator from './components/StoryGenerator';
import DesktopPet, { INITIAL_PETS, ACCESSORIES, FoodItem } from './components/DesktopPet';
import FloatingCompanion from './components/FloatingCompanion';

const LOCAL_STORAGE_KEY_STATS = 'amomo_typing_stats_v2';
const LOCAL_STORAGE_KEY_PETS = 'amomo_typing_pets_v2';
const LOCAL_STORAGE_KEY_COINS = 'amomo_typing_coins_v2';
const LOCAL_STORAGE_KEY_ACC = 'amomo_typing_accessories_v2';
const LOCAL_STORAGE_KEY_ACHIEVEMENTS = 'amomo_typing_achievements_v2';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PRACTICE);
  const [mode, setMode] = useState<Mode>(Mode.ENGLISH);
  const [selectedBook, setSelectedBook] = useState<string>('GRADE 1-Fall');
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isWaitingForSpace, setIsWaitingForSpace] = useState(false);

  // Custom Practice/Story title
  const [customPracticeTitle, setCustomPracticeTitle] = useState<string>('');
  const [gameCustomWords, setGameCustomWords] = useState<ExerciseItem[] | undefined>(undefined);
  const [gameCustomTitle, setGameCustomTitle] = useState<string | undefined>(undefined);

  // Praise and Audio Settings
  const [praiseDialect, setPraiseDialect] = useState<'cantonese' | 'mandarin' | 'english'>('cantonese');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Combo and Real-time Action state for Companion
  const [combo, setCombo] = useState<number>(0);
  const [maxComboInSession, setMaxComboInSession] = useState<number>(0);
  const [lastAction, setLastAction] = useState<'correct' | 'error' | 'idle' | 'level_up' | 'victory' | null>(null);

  // Persistent Economy & Pets
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COINS);
      return saved ? parseInt(saved, 10) : 50;
    } catch {
      return 50;
    }
  });

  const [pets, setPets] = useState<PetItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PETS);
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [currentPetId, setCurrentPetId] = useState<string>('cat');

  const [accessories, setAccessories] = useState<PetAccessory[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACC);
      return saved ? JSON.parse(saved) : ACCESSORIES;
    } catch {
      return ACCESSORIES;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  // Persistent Stats History
  const [sessionStats, setSessionStats] = useState<TypingStats[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentStats, setCurrentStats] = useState({
    correct: 0,
    total: 0,
    startTime: 0,
    errors: {} as Record<string, number>
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COINS, coins.toString());
    } catch (e) {}
  }, [coins]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PETS, JSON.stringify(pets));
    } catch (e) {}
  }, [pets]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACC, JSON.stringify(accessories));
    } catch (e) {}
  }, [accessories]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {}
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_STATS, JSON.stringify(sessionStats));
    } catch (e) {}
  }, [sessionStats]);

  // Current active pet
  const activePet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  // Current equipped accessory
  const activeAccessory = useMemo(() => {
    return accessories.find(a => a.id === activePet?.accessory);
  }, [accessories, activePet]);

  // Handle textbook updates
  useEffect(() => {
    if (customPracticeTitle) return;
    const firstBook = mode === Mode.ENGLISH ? 'GRADE 1-Fall' : '语文一年级上册';
    setSelectedBook(firstBook);
    updateList(firstBook, mode, isRandom);
  }, [mode]);

  useEffect(() => {
    if (selectedBook && !customPracticeTitle) {
      updateList(selectedBook, mode, isRandom);
    }
  }, [isRandom]);

  const updateList = (book: string, currentMode: Mode, random: boolean) => {
    setCustomPracticeTitle('');
    let list = [...(TEXTBOOK_RESOURCES[currentMode === Mode.ENGLISH ? '英语' : '语文']?.[book] || [])];
    if (random) {
      list = list.sort(() => Math.random() - 0.5);
    }
    setExerciseList(list);
    setCurrentIndex(0);
    setInputBuffer('');
    setIsWaitingForSpace(false);
    setIsStarted(false);
    setCombo(0);
  };

  // Prewarm speech whenever target item changes
  useEffect(() => {
    const currentItem = exerciseList[currentIndex];
    if (currentItem && isStarted) {
      const textToRead = mode === Mode.ENGLISH ? currentItem.text : (currentItem.chinese || currentItem.text);
      const lang = mode === Mode.ENGLISH ? 'en-US' : 'zh-CN';
      prewarmSpeech(textToRead, currentItem.example, lang);
    }
  }, [currentIndex, exerciseList, isStarted, mode]);

  const readCurrentItem = (item: ExerciseItem) => {
    if (!item || !soundEnabled) return;
    const textToRead = mode === Mode.ENGLISH ? item.text : (currentItemChineseOrText(item));
    speakDirect(textToRead, mode === Mode.ENGLISH ? 'en-US' : 'zh-CN');
  };

  const currentItemChineseOrText = (item: ExerciseItem) => {
    return item.chinese || item.text;
  };

  const handleStartStop = () => {
    if (!isStarted) {
      setIsStarted(true);
      setCurrentStats({ correct: 0, total: 0, startTime: Date.now(), errors: {} });
      setCombo(0);
      setMaxComboInSession(0);
      playSoundEffect('click');
      if (exerciseList[0]) {
        readCurrentItem(exerciseList[0]);
      }
    } else {
      finishPracticeSession();
    }
  };

  const finishPracticeSession = () => {
    setIsStarted(false);
    setIsWaitingForSpace(false);
    const durationSeconds = Math.max(1, Math.round((Date.now() - currentStats.startTime) / 1000));
    const durationMinutes = durationSeconds / 60;
    const wpm = Math.round(currentStats.correct / (durationMinutes || 1));
    const accuracy = Math.round((currentStats.correct / (currentStats.total || 1)) * 100);
    const coinsEarned = Math.max(5, Math.round(currentStats.correct * 0.5) + (accuracy > 90 ? 10 : 0));

    // Save stat
    const newStat: TypingStats = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
      speed: wpm,
      accuracy: isNaN(accuracy) ? 100 : accuracy,
      timeSpent: durationSeconds,
      bookName: customPracticeTitle || selectedBook || '自由打字练习',
      mode: mode,
      correctCount: currentStats.correct,
      totalCount: currentStats.total,
      maxCombo: maxComboInSession,
      errors: currentStats.errors,
      coinsEarned: coinsEarned
    };

    setSessionStats(prev => [...prev, newStat]);
    setCoins(c => c + coinsEarned);
    playSoundEffect('victory');

    // Experience for pet
    awardPetExp(coinsEarned * 2);

    // Check Achievements
    checkAchievements(wpm, accuracy, maxComboInSession);
  };

  const awardPetExp = (expAmount: number) => {
    setPets(prevPets =>
      prevPets.map(p => {
        if (p.id === currentPetId) {
          const newExp = p.exp + expAmount;
          const expNeeded = p.level * 50;
          if (newExp >= expNeeded) {
            setLastAction('level_up');
            playSoundEffect('victory');
            return {
              ...p,
              level: p.level + 1,
              exp: newExp - expNeeded,
              happiness: Math.min(100, p.happiness + 20)
            };
          }
          return { ...p, exp: newExp };
        }
        return p;
      })
    );
  };

  const checkAchievements = (wpm: number, accuracy: number, topCombo: number) => {
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;
        let newProgress = ach.progress;

        if (ach.id === 'speed_demon' && wpm >= 25) shouldUnlock = true;
        if (ach.id === 'perfect_accuracy' && accuracy === 100 && currentStats.total >= 5) shouldUnlock = true;
        if (ach.id === 'combo_master' && topCombo >= 15) shouldUnlock = true;

        if (shouldUnlock) {
          setCoins(c => c + ach.rewardCoins);
          return { ...ach, unlocked: true, unlockedAt: '刚刚', progress: ach.maxProgress };
        }
        return { ...ach, progress: newProgress };
      })
    );
  };

  const [wordsCompletedSinceLastPraise, setWordsCompletedSinceLastPraise] = useState<number>(0);
  const praiseThreshold = useRef<number>(Math.floor(Math.random() * 4) + 6); // Random 6-9 words

  const handleSuccess = async () => {
    playSoundEffect('correct');
    setIsWaitingForSpace(true);
    setLastAction('correct');
    setCoins(c => c + 1);

    const currentItem = exerciseList[currentIndex];
    if (!currentItem) return;

    // Immediately read current word's example sentence or pronunciation cleanly without delay
    if (soundEnabled && currentItem.example) {
      playPraiseAndExample(
        praiseDialect,
        currentItem.example,
        mode === Mode.ENGLISH ? 'en-US' : 'zh-CN'
      );
    }
  };

  const nextWord = () => {
    const nextIdx = currentIndex + 1;
    const newCount = wordsCompletedSinceLastPraise + 1;
    setWordsCompletedSinceLastPraise(newCount);

    // Random periodic praise every 5-10 words triggered upon appearing next word
    if (newCount >= praiseThreshold.current) {
      setWordsCompletedSinceLastPraise(0);
      praiseThreshold.current = Math.floor(Math.random() * 4) + 6;
      if (soundEnabled) {
        // Trigger lively praise in background as next word appears
        setTimeout(() => {
          playPraiseVoice(praiseDialect);
        }, 150);
      }
    }

    if (nextIdx < exerciseList.length) {
      setCurrentIndex(nextIdx);
      setInputBuffer('');
      setIsWaitingForSpace(false);
      readCurrentItem(exerciseList[nextIdx]);
    } else {
      setLastAction('victory');
      finishPracticeSession();
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isStarted || activeTab !== Tab.PRACTICE) return;

      if (isWaitingForSpace) {
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          playSoundEffect('click');
          nextWord();
        }
        return;
      }

      const currentTarget = exerciseList[currentIndex]?.text.toLowerCase() || '';
      const char = e.key.toLowerCase();

      if (e.key.length > 1 && e.key !== ' ') return;

      e.preventDefault();
      setCurrentStats(prev => ({ ...prev, total: prev.total + 1 }));

      if (char === currentTarget[inputBuffer.length]) {
        const nextBuffer = inputBuffer + char;
        setInputBuffer(nextBuffer);
        setCurrentStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxComboInSession) {
          setMaxComboInSession(newCombo);
        }

        if (newCombo > 0 && newCombo % 5 === 0) {
          playSoundEffect('combo');
        } else {
          playSoundEffect('click');
        }

        if (nextBuffer === currentTarget) {
          handleSuccess();
        }
      } else {
        // Mistake
        playSoundEffect('error');
        setCombo(0);
        setLastAction('error');
        const expectedChar = currentTarget[inputBuffer.length];
        if (expectedChar) {
          const key = expectedChar.toUpperCase();
          setCurrentStats(prev => ({
            ...prev,
            errors: { ...prev.errors, [key]: (prev.errors[key] || 0) + 1 }
          }));
        }
      }
    },
    [isStarted, activeTab, isWaitingForSpace, inputBuffer, currentIndex, exerciseList, combo, maxComboInSession]
  );

  const currentSyllables = useMemo(() => {
    if (mode === Mode.CHINESE || !exerciseList[currentIndex]) return [];
    return splitSyllables(exerciseList[currentIndex].text);
  }, [currentIndex, mode, exerciseList]);

  const progress = Math.round(((currentIndex + (inputBuffer.length / (exerciseList[currentIndex]?.text.length || 1))) / (exerciseList.length || 1)) * 100);

  // Targeted Weak Key Practice Launcher
  const handleStartTargetedPractice = (weakKeys: string[]) => {
    const drillItems: ExerciseItem[] = [];
    const allWords = Object.values(TEXTBOOK_RESOURCES['英语']).flat();
    
    allWords.forEach(w => {
      const match = weakKeys.some(k => w.text.toLowerCase().includes(k.toLowerCase()));
      if (match && drillItems.length < 15) {
        drillItems.push(w);
      }
    });

    if (drillItems.length === 0) {
      weakKeys.forEach(k => {
        drillItems.push({
          text: `${k.toLowerCase()}${k.toLowerCase()}${k.toLowerCase()}`,
          chinese: `易错键 ${k} 特训`,
          phonetic: `/${k.toLowerCase()}/`,
          translation: `易错键 ${k} 特训`,
          example: `Practice key ${k} carefully!`
        });
      });
    }

    setCustomPracticeTitle(`易错键特训: [${weakKeys.slice(0, 4).join(', ')}]`);
    setExerciseList(drillItems);
    setCurrentIndex(0);
    setInputBuffer('');
    setIsWaitingForSpace(false);
    setIsStarted(false);
    setActiveTab(Tab.PRACTICE);
  };

  // Launch Practice from AI Story
  const handleStartPracticeWithStoryWords = (items: ExerciseItem[], storyTitle: string) => {
    setCustomPracticeTitle(`故事词汇: ${storyTitle}`);
    setExerciseList(items);
    setCurrentIndex(0);
    setInputBuffer('');
    setIsWaitingForSpace(false);
    setIsStarted(false);
    setActiveTab(Tab.PRACTICE);
  };

  // Launch Game from AI Story
  const handleStartGameWithStoryWords = (items: ExerciseItem[], storyTitle: string) => {
    setGameCustomWords(items);
    setGameCustomTitle(storyTitle);
    setActiveTab(Tab.GAME);
  };

  // Pet Actions
  const handleSelectPet = (id: string) => {
    playSoundEffect('pop');
    setCurrentPetId(id);
  };

  const handleUnlockPet = (id: string, cost: number) => {
    if (coins < cost) {
      playSoundEffect('error');
      return;
    }
    playSoundEffect('victory');
    setCoins(c => c - cost);
    setPets(prev => prev.map(p => p.id === id ? { ...p, unlocked: true } : p));
    setCurrentPetId(id);
  };

  const handleFeedPet = (food: FoodItem) => {
    if (coins < food.cost) {
      playSoundEffect('error');
      return;
    }
    playSoundEffect('coin');
    setCoins(c => c - food.cost);
    setPets(prev =>
      prev.map(p => {
        if (p.id === currentPetId) {
          const newHunger = Math.min(100, p.hunger + food.hungerAdd);
          const newHappy = Math.min(100, p.happiness + food.happyAdd);
          return { ...p, hunger: newHunger, happiness: newHappy };
        }
        return p;
      })
    );
    awardPetExp(15);
  };

  const handlePetPet = () => {
    playSoundEffect('pop');
    setPets(prev =>
      prev.map(p => {
        if (p.id === currentPetId) {
          return { ...p, happiness: Math.min(100, p.happiness + 5) };
        }
        return p;
      })
    );
    awardPetExp(5);
  };

  const handleEquipAccessory = (accId: string) => {
    playSoundEffect('pop');
    setPets(prev =>
      prev.map(p => (p.id === currentPetId ? { ...p, accessory: accId } : p))
    );
  };

  const handleUnlockAccessory = (accId: string, cost: number) => {
    if (coins < cost) {
      playSoundEffect('error');
      return;
    }
    playSoundEffect('victory');
    setCoins(c => c - cost);
    setAccessories(prev =>
      prev.map(a => (a.id === accId ? { ...a, unlocked: true } : a))
    );
    handleEquipAccessory(accId);
  };

  const handleEnchantPet = (petId: string, cost: number) => {
    if (coins < cost) {
      playSoundEffect('error');
      return;
    }
    setCoins(c => c - cost);
    setPets(prev =>
      prev.map(p => {
        if (p.id === petId) {
          const nextEnchant = (p.enchantLevel || 0) + 1;
          const nextStage = nextEnchant >= 3 ? 3 : nextEnchant >= 1 ? 2 : 1;
          return {
            ...p,
            enchantLevel: nextEnchant,
            evolutionStage: Math.max(p.evolutionStage || 1, nextStage) as 1 | 2 | 3,
            happiness: 100,
            hunger: 100
          };
        }
        return p;
      })
    );
    awardPetExp(40);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-[#f8fbff] text-gray-800 outline-none select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Top Main Navigation */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white/95 backdrop-blur-md shadow-sm border-b-2 border-blue-100 sticky top-0 z-30 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md">
            墨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-gray-800 font-kids">
                阿墨墨打字通
              </h1>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                儿童护眼专属
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">人教版同步 • 拼音英语 • AI分级童话 • 萌宠相伴</p>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => { playSoundEffect('click'); setActiveTab(Tab.PRACTICE); }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === Tab.PRACTICE
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>⌨️</span> 学习打字
          </button>

          <button
            onClick={() => { playSoundEffect('click'); setActiveTab(Tab.STORY); }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === Tab.STORY
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>📖</span> AI 故事词汇
          </button>

          <button
            onClick={() => { playSoundEffect('click'); setActiveTab(Tab.GAME); }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === Tab.GAME
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>🎮</span> 趣味游戏
          </button>

          <button
            onClick={() => { playSoundEffect('click'); setActiveTab(Tab.PET); }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === Tab.PET
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>🐱</span> 萌宠庄园
          </button>

          <button
            onClick={() => { playSoundEffect('click'); setActiveTab(Tab.STATS); }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === Tab.STATS
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>📊</span> 成长档案
          </button>
        </div>

        {/* Right Status (Coins & Audio Settings) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl shadow-inner">
            <span className="text-xl">🪙</span>
            <span className="text-base font-black text-amber-900">{coins}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg border transition-all ${
              soundEnabled ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}
            title={soundEnabled ? '语音音效开启' : '静音模式'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 p-3 md:p-5 flex flex-col items-center max-w-[1800px] w-full mx-auto">
        {/* TAB 1: PRACTICE */}
        {activeTab === Tab.PRACTICE && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            {/* Top Toolbar for Practice */}
            <div className="w-full flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-blue-50 flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Language Switch */}
                <div className="flex p-1 bg-gray-100 rounded-2xl">
                  <button
                    onClick={() => {
                      setMode(Mode.ENGLISH);
                      setCustomPracticeTitle('');
                    }}
                    className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${
                      mode === Mode.ENGLISH && !customPracticeTitle
                        ? 'bg-white shadow-md text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    🔤 英语
                  </button>
                  <button
                    onClick={() => {
                      setMode(Mode.CHINESE);
                      setCustomPracticeTitle('');
                    }}
                    className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${
                      mode === Mode.CHINESE && !customPracticeTitle
                        ? 'bg-white shadow-md text-orange-600'
                        : 'text-gray-500'
                    }`}
                  >
                    🇨🇳 语文拼音
                  </button>
                </div>

                {/* Textbook Selector or Custom Title */}
                {customPracticeTitle ? (
                  <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
                    <span>✨ {customPracticeTitle}</span>
                    <button
                      onClick={() => {
                        setCustomPracticeTitle('');
                        updateList(selectedBook, mode, isRandom);
                      }}
                      className="text-purple-400 hover:text-purple-600 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <select
                    className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl text-xs md:text-sm font-black outline-none text-blue-950 min-w-[220px]"
                    value={selectedBook}
                    onChange={(e) => {
                      setSelectedBook(e.target.value);
                      updateList(e.target.value, mode, isRandom);
                    }}
                  >
                    {Object.keys(TEXTBOOK_RESOURCES[mode === Mode.ENGLISH ? '英语' : '语文']).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                )}

                {/* Order Toggle */}
                <button
                  onClick={() => setIsRandom(!isRandom)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-black transition-all ${
                    isRandom
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span>{isRandom ? '🔀' : '➡'}</span>
                  <span>{isRandom ? '随机乱序' : '教材顺序'}</span>
                </button>

                {/* Praise Dialect Selector */}
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600">
                  <span>🗣️ 夸奖音效:</span>
                  <select
                    value={praiseDialect}
                    onChange={(e) => setPraiseDialect(e.target.value as any)}
                    className="bg-transparent font-black text-blue-600 outline-none cursor-pointer"
                  >
                    <option value="cantonese">粤语（好叻啊 / 犀利）</option>
                    <option value="mandarin">普通话（太棒了 / 神速）</option>
                    <option value="english">English (Awesome / Great)</option>
                  </select>
                </div>
              </div>

              {/* Start / Stop Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleStartStop}
                  className={`px-8 py-3 rounded-2xl text-base md:text-lg font-black shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                    isStarted
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
                  }`}
                >
                  <span>{isStarted ? '⏹ 结束练习' : '▶ 开始练习'}</span>
                </button>
              </div>
            </div>

            {/* Target Word Practice Card */}
            <div className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-4 border-blue-50/50 flex flex-col items-center min-h-[420px] justify-center relative overflow-hidden">
              {/* Progress Bar */}
              <div
                className="absolute top-0 left-0 h-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>

              {/* Top Progress & Combo Pill */}
              <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-xs font-bold text-gray-400">
                <span>
                  进度: {currentIndex + 1} / {exerciseList.length || 1} 词
                </span>
                {combo > 1 && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-black text-xs animate-bounce border border-amber-300">
                    🔥 连击 Combo x{combo}
                  </span>
                )}
              </div>

              {!isStarted ? (
                <div className="text-center flex flex-col items-center gap-4 py-8">
                  <div className="text-8xl animate-bounce">🎒</div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-700 font-kids">
                    准备好练习打字了吗？
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 max-w-md">
                    跟着屏幕提示与键盘指法提示，敲击对应字母，开启快乐打字之旅！
                  </p>
                  <button
                    onClick={handleStartStop}
                    className="mt-2 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all active:scale-95"
                  >
                    立即开始 🚀
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  {/* Chinese PinYin Mode */}
                  {mode === Mode.CHINESE ? (
                    <>
                      {/* Big Hanzi */}
                      <div className="text-7xl md:text-9xl font-black text-orange-600 mb-4 font-kids leading-none filter drop-shadow-sm">
                        {exerciseList[currentIndex]?.chinese}
                      </div>

                      {/* Tone Pinyin Display */}
                      <div className="text-base md:text-xl font-bold text-gray-400 mb-4 font-pinyin">
                        {getPinyinWithTones(exerciseList[currentIndex]?.chinese || '')}
                      </div>

                      {/* Typing Pinyin letters with highlight */}
                      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
                        {exerciseList[currentIndex]?.text.split('').map((char, i) => {
                          const isTyped = i < inputBuffer.length;
                          const isCurrentChar = i === inputBuffer.length && !isWaitingForSpace;

                          return (
                            <div key={i} className="relative flex flex-col items-center">
                              <span
                                className={`text-6xl md:text-8xl font-black transition-all font-mono leading-none ${
                                  isTyped ? 'text-gray-300' : 'text-blue-600'
                                }`}
                              >
                                {char}
                              </span>
                              {isCurrentChar && (
                                <div className="absolute -bottom-3 w-full h-2.5 bg-yellow-400 rounded-full animate-bounce"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    /* English Mode with Syllable Colors & Visual Space Display */
                    <div className="flex flex-col items-center">
                      <div className="flex flex-wrap justify-center items-center gap-y-3 mb-6">
                        {(() => {
                          let charCounter = 0;
                          return currentSyllables.map((syllable, sIndex) => {
                            const syllableColor = getSyllableColor(sIndex);
                            return (
                              <div key={sIndex} className="flex items-center">
                                {syllable.split('').map((char, cIndex) => {
                                  const globalIdx = charCounter++;
                                  const isTyped = globalIdx < inputBuffer.length;
                                  const isCurrent = globalIdx === inputBuffer.length && !isWaitingForSpace;
                                  const isSpace = char === ' ';

                                  if (isSpace) {
                                    return (
                                      <div key={cIndex} className="relative mx-2 flex flex-col items-center">
                                        <div
                                          className={`px-3 py-1.5 rounded-xl border-2 border-dashed flex items-center justify-center font-mono font-bold text-sm md:text-base transition-all ${
                                            isTyped
                                              ? 'bg-gray-100 text-gray-400 border-gray-300'
                                              : isCurrent
                                              ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse scale-105 shadow-sm'
                                              : 'bg-blue-50 text-blue-400 border-blue-200'
                                          }`}
                                        >
                                          <span>␣ 空格</span>
                                        </div>
                                        {isCurrent && (
                                          <div className="absolute -bottom-3 w-3/4 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                                        )}
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={cIndex} className="relative">
                                      <span
                                        className={`text-6xl md:text-8xl font-black transition-all leading-none font-mono ${
                                          isTyped ? 'text-gray-300' : syllableColor
                                        }`}
                                      >
                                        {char}
                                      </span>
                                      {isCurrent && (
                                        <div className="absolute -bottom-3 w-full h-2.5 bg-yellow-400 rounded-full animate-bounce"></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Audio, Translation & Example Section */}
                  <div className="min-h-24 flex flex-col items-center justify-center">
                    {isWaitingForSpace ? (
                      <div className="flex flex-col items-center animate-fade-in text-center">
                        <p className="text-xl md:text-3xl text-emerald-600 font-black mb-3 italic leading-tight font-kids">
                          "{exerciseList[currentIndex]?.example}"
                        </p>
                        <div className="bg-amber-100 text-amber-900 border border-amber-300 px-6 py-2 rounded-full text-base md:text-lg font-black animate-pulse flex items-center gap-2 shadow-sm">
                          <span>⌨️</span> 按下 [ 空格键 Space ] 挑战下一个单词
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {mode === Mode.ENGLISH && (
                          <>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl md:text-4xl font-black text-blue-600 font-kids">
                                {exerciseList[currentIndex]?.translation}
                              </span>
                              <button
                                onClick={() => readCurrentItem(exerciseList[currentIndex])}
                                className="w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm transition-transform active:scale-90"
                                title="重听单词发音"
                              >
                                🔊
                              </button>
                            </div>
                            {exerciseList[currentIndex]?.phonetic && (
                              <span className="text-base md:text-lg italic font-mono text-gray-400">
                                {exerciseList[currentIndex]?.phonetic}
                              </span>
                            )}
                          </>
                        )}
                        {mode === Mode.CHINESE && (
                          <button
                            onClick={() => readCurrentItem(exerciseList[currentIndex])}
                            className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 border border-orange-200"
                          >
                            <span>🔊 点击朗读读音</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Virtual Keyboard & Live Stats */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Keyboard
                  targetKey={
                    isStarted && !isWaitingForSpace
                      ? exerciseList[currentIndex]?.text[inputBuffer.length] || ''
                      : isWaitingForSpace
                      ? ' '
                      : ''
                  }
                />
              </div>

              {/* Stats Card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-[2.5rem] shadow-lg border border-blue-50 flex flex-col justify-around gap-4">
                <div className="text-center">
                  <span className="text-gray-400 text-xs font-bold block mb-1">精准击键</span>
                  <span className="text-5xl font-black text-blue-600 font-kids">
                    {currentStats.correct}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">次无误击打</span>
                </div>

                <div className="text-center border-t border-gray-100 pt-4">
                  <span className="text-gray-400 text-xs font-bold block mb-1">即时速度 (WPM)</span>
                  <span className="text-5xl font-black text-emerald-500 font-kids">
                    {Math.round(
                      currentStats.correct / (((Date.now() - currentStats.startTime) / 1000 / 60) || 1)
                    )}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">字 / 分钟</span>
                </div>

                <div className="text-center border-t border-gray-100 pt-4">
                  <span className="text-gray-400 text-xs font-bold block mb-1">本次已赚取</span>
                  <span className="text-3xl font-black text-amber-500 font-kids flex items-center justify-center gap-1">
                    <span>+{Math.max(1, Math.round(currentStats.correct * 0.5))}</span>
                    <span className="text-xl">🪙</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI STORY GENERATOR */}
        {activeTab === Tab.STORY && (
          <StoryGenerator
            onStartPracticeWithWords={handleStartPracticeWithStoryWords}
            onStartGameWithWords={handleStartGameWithStoryWords}
          />
        )}

        {/* TAB 3: GAMES */}
        {activeTab === Tab.GAME && (
          <TypingGame
            customWordList={gameCustomWords}
            customTitle={gameCustomTitle}
            onEarnCoins={(amount) => {
              setCoins(c => c + amount);
              awardPetExp(amount * 2);
            }}
          />
        )}

        {/* TAB 4: PET SANCTUARY */}
        {activeTab === Tab.PET && (
          <DesktopPet
            pets={pets}
            currentPetId={currentPetId}
            coins={coins}
            accessories={accessories}
            onSelectPet={handleSelectPet}
            onUnlockPet={handleUnlockPet}
            onFeedPet={handleFeedPet}
            onPetPet={handlePetPet}
            onEquipAccessory={handleEquipAccessory}
            onUnlockAccessory={handleUnlockAccessory}
            onEnchantPet={handleEnchantPet}
          />
        )}

        {/* TAB 5: STATS & ACHIEVEMENTS */}
        {activeTab === Tab.STATS && (
          <Statistics
            stats={sessionStats}
            achievements={achievements}
            coins={coins}
            onStartTargetedPractice={handleStartTargetedPractice}
            onClearHistory={() => setSessionStats([])}
          />
        )}
      </main>

      {/* Floating Desktop Pet Companion (Always visible cheering) */}
      <FloatingCompanion
        pet={activePet}
        accessory={activeAccessory}
        combo={combo}
        lastAction={lastAction}
      />
    </div>
  );
};

export default App;
