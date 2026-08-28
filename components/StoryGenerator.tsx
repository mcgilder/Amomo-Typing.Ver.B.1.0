import React, { useState, useMemo } from 'react';
import { StoryData, ExerciseItem } from '../types';
import { generateStoryWithVocabulary, PRESET_STORIES } from '../services/geminiService';
import { speakDirect, playSoundEffect, getPaletteByIndex } from '../utils';

interface StoryGeneratorProps {
  onStartPracticeWithWords: (items: ExerciseItem[], storyTitle: string) => void;
  onStartGameWithWords: (items: ExerciseItem[], storyTitle: string) => void;
}

const TOPIC_CHIPS = [
  { topic: '激战篮球总决赛', icon: '🏀' },
  { topic: '奥特曼打怪兽', icon: '⚡' },
  { topic: '小恐龙森林历险记', icon: '🦖' },
  { topic: '魔法猫咪城堡', icon: '🐱' },
  { topic: '太空宇航员探险', icon: '🚀' },
  { topic: '深海小纵队寻宝', icon: '🐬' },
  { topic: '神奇动物狂欢节', icon: '🦁' },
  { topic: '超级赛车总动员', icon: '🏎️' }
];

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  onStartPracticeWithWords,
  onStartGameWithWords
}) => {
  const [customTopic, setCustomTopic] = useState<string>('');
  const [wordCountMode, setWordCountMode] = useState<10 | 15>(10);
  const [baseStory, setBaseStory] = useState<StoryData>(PRESET_STORIES[0]);
  const [activeTier, setActiveTier] = useState<1 | 2 | 3 | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const [activeReadingSentence, setActiveReadingSentence] = useState<string | null>(null);

  // Active story with trimmed words based on wordCountMode (10 or 15)
  const currentStory = useMemo(() => {
    return {
      ...baseStory,
      words: baseStory.words.slice(0, wordCountMode)
    };
  }, [baseStory, wordCountMode]);

  const handleGenerate = async (topicToUse: string, countToUse: 10 | 15 = wordCountMode) => {
    if (!topicToUse.trim()) return;
    playSoundEffect('click');
    setIsLoading(true);
    try {
      const result = await generateStoryWithVocabulary(topicToUse.trim(), countToUse);
      if (result) {
        setBaseStory(result);
        playSoundEffect('victory');
      } else {
        playSoundEffect('error');
      }
    } catch (e) {
      playSoundEffect('error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWords = useMemo(() => {
    return currentStory.words.filter(w => {
      if (activeTier === 'ALL') return true;
      return w.level === activeTier;
    });
  }, [currentStory, activeTier]);

  const handleImportToPractice = () => {
    playSoundEffect('coin');
    const items: ExerciseItem[] = filteredWords.map(w => ({
      text: w.word,
      chinese: w.translation,
      phonetic: w.phonetic,
      translation: w.translation,
      example: w.example,
      difficultyLevel: w.level
    }));
    onStartPracticeWithWords(items, currentStory.titleZh);
  };

  const handleImportToGame = () => {
    playSoundEffect('coin');
    const items: ExerciseItem[] = filteredWords.map(w => ({
      text: w.word,
      chinese: w.translation,
      phonetic: w.phonetic,
      translation: w.translation,
      example: w.example,
      difficultyLevel: w.level
    }));
    onStartGameWithWords(items, currentStory.titleZh);
  };

  // Split Chinese text by sentence enders without forced line breaks
  const splitChineseSentences = (text: string): string[] => {
    const matched = text.match(/[^。！？!?\n]+[。！？!?]?|\n+/g);
    return matched ? matched.filter(s => s.trim().length > 0) : [text];
  };

  // Split English text by sentence enders without forced line breaks
  const splitEnglishSentences = (text: string): string[] => {
    const matched = text.match(/[^.!?\n]+[.!?]?|\n+/g);
    return matched ? matched.filter(s => s.trim().length > 0) : [text];
  };

  // Render tokens within a Chinese sentence (Click to speak ONLY - no auto speak on hover)
  const renderSentenceTokensZh = (sentence: string, sentIdx: number) => {
    if (!sentence || !currentStory.words.length) return sentence;

    // Filter valid translations and sort by length descending to match longer phrases first
    const sortedWordsWithIndex = currentStory.words
      .map((w, origIndex) => ({ ...w, origIndex }))
      .filter(w => w.translation && w.translation.trim().length > 0)
      .sort((a, b) => b.translation.length - a.translation.length);

    if (!sortedWordsWithIndex.length) return sentence;

    // Safe regex generation for all vocabulary words
    const pattern = new RegExp(
      `(${sortedWordsWithIndex.map(w => escapeRegExp(w.translation)).join('|')})`,
      'g'
    );

    const parts = sentence.split(pattern);
    return parts.map((part, pIdx) => {
      const match = sortedWordsWithIndex.find(w => w.translation === part);
      if (match) {
        const palette = getPaletteByIndex(match.origIndex);
        const isHovered = hoveredWordIndex === match.origIndex;

        return (
          <span
            key={`w-${sentIdx}-${pIdx}`}
            className={`inline align-baseline font-bold px-1 py-0 mx-0.5 rounded cursor-pointer select-none box-decoration-clone transition-all duration-150 leading-tight ${
              isHovered ? 'flowing-word-box' : palette.pill
            }`}
            onMouseEnter={() => setHoveredWordIndex(match.origIndex)}
            onMouseLeave={() => setHoveredWordIndex(null)}
            title={`点击发音: ${match.word} (${match.phonetic})`}
            onClick={(e) => {
              e.stopPropagation();
              speakDirect(match.word, 'en-US', true);
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={`t-${sentIdx}-${pIdx}`}>{part}</span>;
    });
  };

  // Render tokens within an English sentence (Click to speak ONLY - no auto speak on hover)
  const renderSentenceTokensEn = (sentence: string, sentIdx: number) => {
    if (!sentence || !currentStory.words.length) return sentence;

    const sortedWordsWithIndex = currentStory.words
      .map((w, origIndex) => ({ ...w, origIndex }))
      .filter(w => w.word && w.word.trim().length > 0)
      .sort((a, b) => b.word.length - a.word.length);

    if (!sortedWordsWithIndex.length) return sentence;

    const pattern = new RegExp(
      `\\b(${sortedWordsWithIndex.map(w => escapeRegExp(w.word)).join('|')})\\b`,
      'gi'
    );

    const parts = sentence.split(pattern);
    return parts.map((part, pIdx) => {
      const match = sortedWordsWithIndex.find(
        w => w.word.toLowerCase() === part.toLowerCase()
      );
      if (match) {
        const palette = getPaletteByIndex(match.origIndex);
        const isHovered = hoveredWordIndex === match.origIndex;

        return (
          <span
            key={`w-en-${sentIdx}-${pIdx}`}
            className={`inline align-baseline font-bold px-1 py-0 mx-0.5 rounded cursor-pointer select-none box-decoration-clone transition-all duration-150 leading-tight ${
              isHovered ? 'flowing-word-box' : palette.pill
            }`}
            onMouseEnter={() => setHoveredWordIndex(match.origIndex)}
            onMouseLeave={() => setHoveredWordIndex(null)}
            title={`点击发音: ${match.word}`}
            onClick={(e) => {
              e.stopPropagation();
              speakDirect(match.word, 'en-US', true);
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={`t-en-${sentIdx}-${pIdx}`}>{part}</span>;
    });
  };

  const chineseSentences = useMemo(() => splitChineseSentences(currentStory.storyZh), [currentStory.storyZh]);
  const englishSentences = useMemo(() => splitEnglishSentences(currentStory.storyEn), [currentStory.storyEn]);

  return (
    <div className="w-full max-w-[1760px] px-2 md:px-4 flex flex-col gap-4 animate-fade-in mx-auto">
      {/* 1. Top Story Generator Banner: Widescreen, Extra Large Font & Single-Row Topics */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-3xl p-4 md:p-5 text-white shadow-lg flex flex-col gap-3 relative overflow-hidden border border-purple-400/30">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Magnified Input Box (+50% Font Size) */}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customTopic) {
                  handleGenerate(customTopic);
                }
              }}
              placeholder="✨ 输入主题（如：奥特曼打怪兽、恐龙探险、赛车争霸...）"
              className="flex-1 px-5 py-3 rounded-2xl bg-white/95 text-gray-900 placeholder-gray-400 font-black text-base md:text-xl focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-inner"
            />
            <button
              onClick={() => handleGenerate(customTopic)}
              disabled={isLoading || !customTopic.trim()}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-base md:text-lg transition-all shadow-md flex items-center gap-2 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-spin text-xl">🪄</span>
              ) : (
                <span>生成故事 🚀</span>
              )}
            </button>
          </div>

          {/* Word Count Switch: 10 Words (2 cols) vs 15 Words (3 cols) */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0 self-center xl:self-auto">
            <span className="text-sm font-black text-purple-200 px-2 flex items-center gap-1">
              <span>🎯</span> 篇幅:
            </span>
            <button
              onClick={() => {
                playSoundEffect('click');
                setWordCountMode(10);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                wordCountMode === 10
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🌱</span> 10 词 (2列)
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                setWordCountMode(15);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                wordCountMode === 15
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🚀</span> 15 词 (3列)
            </button>
          </div>
        </div>

        {/* Recommended Topics: 1 Single Neat Row Across Full Widescreen */}
        <div className="flex items-center gap-2 overflow-x-auto xl:overflow-visible flex-nowrap scrollbar-none pt-0.5">
          <span className="text-sm text-purple-200 font-black flex items-center gap-1 shrink-0">
            <span>🔥</span> 热门:
          </span>
          {TOPIC_CHIPS.map((chip) => (
            <button
              key={chip.topic}
              onClick={() => {
                setCustomTopic(chip.topic);
                handleGenerate(chip.topic);
              }}
              disabled={isLoading}
              className="bg-white/15 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all border border-white/20 active:scale-95 shadow-2xs shrink-0 cursor-pointer"
            >
              <span>{chip.icon}</span>
              <span>{chip.topic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Synchronized Stage: Story Left (Upper & Lower Stack) & Compact Word Cards Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* Left: Expanded Story Reading Stage (8 cols for 10-words mode, 7 cols for 15-words mode) */}
        <div className={`${wordCountMode === 15 ? 'xl:col-span-7' : 'xl:col-span-8'} bg-white rounded-3xl p-4 md:p-5 border-2 border-purple-100 shadow-md flex flex-col justify-between`}>
          {/* Compact Single-Row Header: Single Chinese Title + Compact Inline Voice Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2.5 gap-2">
            {/* 1-Line Chinese Title Only */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs md:text-sm font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 shrink-0">
                {currentStory.topic}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 font-kids truncate">
                {currentStory.titleZh}
              </h2>
            </div>

            {/* Compressed Voice Action Buttons Inline with Title */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Colloquial Cantonese Storyteller */}
              <button
                onClick={() => speakDirect(currentStory.storyZh, 'zh-HK', true)}
                className="text-xs md:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1.5 rounded-xl font-black hover:opacity-95 shadow-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                title="粤语口语讲故事"
              >
                <span>🗣️</span> 粤语
              </button>

              {/* Mandarin Voice */}
              <button
                onClick={() => speakDirect(currentStory.storyZh, 'zh-CN', true)}
                className="text-xs md:text-sm bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-black shadow-2xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                title="普通话朗读"
              >
                <span>🔊</span> 国语
              </button>

              {/* English Voice */}
              <button
                onClick={() => speakDirect(currentStory.storyEn, 'en-US', true)}
                className="text-xs md:text-sm bg-sky-50 text-sky-950 border border-sky-300 hover:bg-sky-100 px-3 py-1.5 rounded-xl font-black shadow-2xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                title="英文朗读"
              >
                <span>🔤</span> 英文
              </button>
            </div>
          </div>

          {/* Bilingual Dual Reading Areas: Side-by-Side (左右关系) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2.5 flex-1">
            {/* 1. Chinese Story Box (Left) */}
            <div className="bg-amber-50/75 p-3.5 md:p-4 rounded-2xl border border-amber-200/90 flex flex-col shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-950 bg-amber-200/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>📖</span> 中文故事
                </span>
                <span className="text-xs text-amber-700/80 font-bold">点句朗读 · 点词发音</span>
              </div>

              {/* Flowing Chinese Paragraph (+10% Font Size) */}
              <p className="text-gray-900 text-[1.22rem] md:text-[1.36rem] leading-[1.8] tracking-wide font-sans m-0 flex-1">
                {chineseSentences.map((sent, sentIdx) => {
                  const isReading = activeReadingSentence === sent;
                  const isContainingHoveredWord = hoveredWordIndex !== null && currentStory.words[hoveredWordIndex] && (
                    Boolean(currentStory.words[hoveredWordIndex].translation && sent.includes(currentStory.words[hoveredWordIndex].translation))
                  );

                  return (
                    <span
                      key={sentIdx}
                      onClick={() => {
                        setActiveReadingSentence(sent);
                        speakDirect(sent, 'zh-CN', true);
                      }}
                      className={`inline cursor-pointer select-none rounded px-0.5 transition-colors duration-150 box-decoration-clone ${
                        isReading
                          ? 'bg-amber-200/90 text-amber-950 font-medium'
                          : isContainingHoveredWord
                          ? 'bg-amber-100/60 text-amber-950'
                          : 'hover:bg-amber-100/40'
                      }`}
                      title="点击朗读本句"
                    >
                      {renderSentenceTokensZh(sent, sentIdx)}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* 2. English Story Box (Right) */}
            <div className="bg-sky-50/75 p-3.5 md:p-4 rounded-2xl border border-sky-200/90 flex flex-col shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-sky-950 bg-sky-200/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>🌟</span> English Story
                </span>
                <span className="text-xs text-sky-700/80 font-bold">Click to Read</span>
              </div>

              {/* Flowing English Paragraph (+10% Font Size) */}
              <p className="text-gray-900 text-[1.22rem] md:text-[1.36rem] leading-[1.8] tracking-wide font-sans m-0 flex-1">
                {englishSentences.map((sent, sentIdx) => {
                  const isReading = activeReadingSentence === sent;
                  const isContainingHoveredWord = hoveredWordIndex !== null && currentStory.words[hoveredWordIndex] && (
                    Boolean(currentStory.words[hoveredWordIndex].word && new RegExp(`\\b${escapeRegExp(currentStory.words[hoveredWordIndex].word)}\\b`, 'i').test(sent))
                  );

                  return (
                    <span
                      key={sentIdx}
                      onClick={() => {
                        setActiveReadingSentence(sent);
                        speakDirect(sent, 'en-US', true);
                      }}
                      className={`inline cursor-pointer select-none rounded px-0.5 transition-colors duration-150 box-decoration-clone ${
                        isReading
                          ? 'bg-sky-200/90 text-sky-950 font-medium'
                          : isContainingHoveredWord
                          ? 'bg-sky-100/60 text-sky-950'
                          : 'hover:bg-sky-100/40'
                      }`}
                      title="Click to read sentence"
                    >
                      {renderSentenceTokensEn(sent, sentIdx)}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Fixed 5-Row Compact Vocabulary Deck (4 cols for 10-words, 5 cols for 15-words) */}
        <div className={`${wordCountMode === 15 ? 'xl:col-span-5' : 'xl:col-span-4'} bg-white rounded-3xl p-4 md:p-5 border-2 border-indigo-100 shadow-md flex flex-col justify-between`}>
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-1.5 font-kids">
              <span>🎯 核心单词</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-black">
                {filteredWords.length} 词
              </span>
            </h3>

            {/* Tier Filters */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-black">
              <button
                onClick={() => setActiveTier('ALL')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  activeTier === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setActiveTier(1)}
                className={`px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer ${
                  activeTier === 1
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>🌱</span> Lv.1
              </button>
              <button
                onClick={() => setActiveTier(2)}
                className={`px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer ${
                  activeTier === 2
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>🌿</span> Lv.2
              </button>
              <button
                onClick={() => setActiveTier(3)}
                className={`px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer ${
                  activeTier === 3
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>🌳</span> Lv.3
              </button>
            </div>
          </div>

          {/* Grid Layout: Exactly 5 items per column (2 cols if 10 words, 3 cols if 15 words) */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${wordCountMode === 15 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'} gap-2 my-2`}>
            {filteredWords.map((item) => {
              const origIndex = currentStory.words.findIndex(w => w.word === item.word);
              const actualIdx = origIndex >= 0 ? origIndex : 0;
              const palette = getPaletteByIndex(actualIdx);
              const isHovered = hoveredWordIndex === actualIdx;

              return (
                <div
                  key={item.word}
                  onMouseEnter={() => setHoveredWordIndex(actualIdx)}
                  onMouseLeave={() => setHoveredWordIndex(null)}
                  onClick={() => speakDirect(item.word, 'en-US', true)}
                  className={`p-0.5 rounded-2xl transition-all duration-200 group cursor-pointer ${
                    isHovered ? 'flowing-gold-card scale-102 shadow-lg' : 'bg-transparent'
                  }`}
                >
                  <div
                    className={`p-2 rounded-[14px] border flex items-center gap-2 transition-all duration-150 ${
                      isHovered
                        ? `${palette.bgLight} ${palette.borderColor}`
                        : 'bg-gray-50/90 border-gray-200 hover:bg-white hover:border-indigo-300 hover:shadow-2xs'
                    }`}
                    title="点击朗读发音"
                  >
                    {/* Index Badge */}
                    <span className={`w-5 h-5 rounded-full ${palette.numberTag} text-xs font-black flex items-center justify-center shrink-0 shadow-2xs`}>
                      {actualIdx + 1}
                    </span>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {/* Word (Prominent & Clear) */}
                        <span className="text-xl md:text-2xl font-black text-gray-900 font-kids tracking-wide truncate">
                          {item.word}
                        </span>
                        {/* Phonetic (+40% enlarged font size) */}
                        {item.phonetic && (
                          <span className="text-sm md:text-base text-gray-600 font-mono font-medium italic">
                            {item.phonetic}
                          </span>
                        )}
                      </div>

                      {/* Translation (+40% enlarged font size) */}
                      <span className={`text-base md:text-lg font-black ${palette.textColor} truncate mt-0.5`}>
                        {item.translation}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Launchers */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleImportToPractice}
              className="py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⌨️</span>
              <span>打字练习</span>
            </button>

            <button
              onClick={handleImportToGame}
              className="py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🎮</span>
              <span>玩小游戏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
