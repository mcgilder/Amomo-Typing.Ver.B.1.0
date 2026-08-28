import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TypingStats, Achievement, ExerciseItem, Mode } from '../types';
import { playSoundEffect } from '../utils';

interface StatisticsProps {
  stats: TypingStats[];
  achievements?: Achievement[];
  coins?: number;
  onStartTargetedPractice?: (weakKeys: string[]) => void;
  onClearHistory?: () => void;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: '初试身手',
    description: '完成第 1 次打字练习',
    icon: '🌱',
    rewardCoins: 20,
    unlocked: true,
    unlockedAt: '今日',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'speed_demon',
    title: '神速小手指',
    description: '单次练习打字速度达到 25 WPM',
    icon: '⚡',
    rewardCoins: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'perfect_accuracy',
    title: '百发百中',
    description: '单次练习准确率达到 100%',
    icon: '🎯',
    rewardCoins: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'combo_master',
    title: '连击大宗师',
    description: '在练习中达成 15 次无失误连击',
    icon: '🔥',
    rewardCoins: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'story_reader',
    title: '故事探索家',
    description: '通过 AI 生成并阅读 3 篇童话故事',
    icon: '📖',
    rewardCoins: 60,
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'pet_friend',
    title: '最佳好伙伴',
    description: '将桌面宠物提升至 2 级',
    icon: '🐱',
    rewardCoins: 80,
    unlocked: false,
    progress: 1,
    maxProgress: 2
  },
  {
    id: 'persistent_hero',
    title: '坚持不懈',
    description: '累计练习时长超过 15 分钟',
    icon: '⏳',
    rewardCoins: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'frog_champion',
    title: '青蛙过河王',
    description: '在青蛙过河小游戏中顺利通关',
    icon: '🐸',
    rewardCoins: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
];

export const Statistics: React.FC<StatisticsProps> = ({
  stats,
  achievements = INITIAL_ACHIEVEMENTS,
  coins = 0,
  onStartTargetedPractice,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHARTS' | 'WEAK_KEYS' | 'ACHIEVEMENTS' | 'LOGS'>('OVERVIEW');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Aggregated Stats
  const totalSessions = stats.length;
  const totalWords = stats.reduce((acc, s) => acc + (s.correctCount || (s.speed > 0 ? Math.round(s.speed * (s.timeSpent / 60)) : 10)), 0);
  const totalTimeSeconds = stats.reduce((acc, s) => acc + (s.timeSpent || 0), 0);
  const totalMinutes = Math.max(1, Math.round(totalTimeSeconds / 60));
  const maxSpeed = stats.length > 0 ? Math.max(...stats.map(s => s.speed || 0)) : 0;
  const avgAccuracy = stats.length > 0 ? Math.round(stats.reduce((acc, s) => acc + (s.accuracy || 0), 0) / stats.length) : 100;

  // Aggregated Weak Keys (All-time errors)
  const aggregatedErrors: Record<string, number> = {};
  stats.forEach(s => {
    if (s.errors) {
      Object.entries(s.errors).forEach(([k, count]) => {
        const upper = k.toUpperCase();
        aggregatedErrors[upper] = (aggregatedErrors[upper] || 0) + (count as number);
      });
    }
  });

  const errorData = Object.entries(aggregatedErrors)
    .map(([key, count]) => ({ name: key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // Time Series Chart Data (Last 10 sessions)
  const chartData = stats.slice(-10).map((s, idx) => ({
    name: `第${idx + 1}次`,
    date: s.date ? s.date.slice(5) : `0${idx + 1}`,
    speed: s.speed || 0,
    accuracy: s.accuracy || 0,
    time: Math.round((s.timeSpent || 0) / 60)
  }));

  const handleGenerateDrill = () => {
    if (errorData.length === 0) {
      playSoundEffect('error');
      return;
    }
    playSoundEffect('victory');
    const weakKeyList = errorData.map(e => e.name);
    onStartTargetedPractice?.(weakKeyList);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-2">
            <span>📊 阿墨墨成长档案</span>
            <span>•</span>
            <span>全阶段数据记录</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">打字成长与成就看板</h1>
          <p className="text-xs md:text-sm text-emerald-100 mt-1 max-w-xl">
            记录每一次练习的点滴进步，分析易错按键，点亮荣誉勋章！
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              playSoundEffect('pop');
              setShowCertificate(true);
            }}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>📜 领取学习奖状</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🌟 成绩总览
        </button>
        <button
          onClick={() => setActiveTab('CHARTS')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all ${
            activeTab === 'CHARTS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📈 进步趋势图
        </button>
        <button
          onClick={() => setActiveTab('WEAK_KEYS')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all ${
            activeTab === 'WEAK_KEYS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎯 易错键特训
        </button>
        <button
          onClick={() => setActiveTab('ACHIEVEMENTS')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all ${
            activeTab === 'ACHIEVEMENTS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🏅 荣誉勋章
        </button>
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs md:text-sm transition-all ${
            activeTab === 'LOGS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📋 历史流水
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="flex flex-col gap-6">
          {/* 4 Big Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-sm flex flex-col items-center text-center">
              <span className="text-3xl mb-1">⚡</span>
              <span className="text-xs text-gray-500 font-bold">最高打字速度</span>
              <span className="text-3xl font-black text-blue-600 mt-1">{maxSpeed}</span>
              <span className="text-[11px] text-gray-400">字 / 分钟 (WPM)</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-sm flex flex-col items-center text-center">
              <span className="text-3xl mb-1">🎯</span>
              <span className="text-xs text-gray-500 font-bold">综合平均准确率</span>
              <span className="text-3xl font-black text-emerald-600 mt-1">{avgAccuracy}%</span>
              <span className="text-[11px] text-gray-400">精准敲击达人</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-sm flex flex-col items-center text-center">
              <span className="text-3xl mb-1">📚</span>
              <span className="text-xs text-gray-500 font-bold">累计打字词数</span>
              <span className="text-3xl font-black text-purple-600 mt-1">{totalWords}</span>
              <span className="text-[11px] text-gray-400">个中英文单词</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm flex flex-col items-center text-center">
              <span className="text-3xl mb-1">🪙</span>
              <span className="text-xs text-gray-500 font-bold">已赚取墨墨金币</span>
              <span className="text-3xl font-black text-amber-500 mt-1">{coins}</span>
              <span className="text-[11px] text-gray-400">可投喂和装扮宠物</span>
            </div>
          </div>

          {/* Quick Snapshot Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
              <h3 className="text-base font-black text-gray-800 mb-4 flex items-center justify-between">
                <span>📈 速度进步曲线</span>
                <span className="text-xs text-blue-600 font-normal">最近 {chartData.length} 次练习</span>
              </h3>
              <div className="h-56">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} textAnchor="end" />
                      <YAxis axisLine={false} tickLine={false} unit="字" />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    完成练习后即可显示速度走势图
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-gray-800 mb-2 flex items-center justify-between">
                  <span>🎯 易错键位雷达</span>
                  <span className="text-xs text-rose-500 font-normal">需重点关注</span>
                </h3>
                <p className="text-xs text-gray-500 mb-4">系统已自动统计最容易打错的键位：</p>
                <div className="flex flex-wrap gap-2">
                  {errorData.length > 0 ? (
                    errorData.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                        <span className="w-6 h-6 bg-rose-500 text-white rounded-lg flex items-center justify-center font-black text-sm">
                          {e.name}
                        </span>
                        <span className="text-xs text-rose-800 font-bold">错 {e.count} 次</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                      🎉 表现太棒了！近期没有频繁出错的键位！
                    </div>
                  )}
                </div>
              </div>

              {errorData.length > 0 && (
                <button
                  onClick={handleGenerateDrill}
                  className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs md:text-sm shadow-md hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>🎯 立即开启易错键针对性特训</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHARTS */}
      {activeTab === 'CHARTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
            <h3 className="text-base font-black text-gray-800 mb-4">📈 打字速度 (WPM)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '15px' }} />
                  <Line type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
            <h3 className="text-base font-black text-gray-800 mb-4">🎯 准确率走势 (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[60, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '15px' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEAK KEYS */}
      {activeTab === 'WEAK_KEYS' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-black text-gray-800">🎯 易错键位统计与专项特训</h3>
            <p className="text-xs text-gray-500">
              通过分析历史敲击数据，自动识别小朋友最容易按错的键位（如 b/d、p/q、或左手小指键位等），一键生成针对性强化练习！
            </p>
          </div>

          <div className="h-64">
            {errorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '15px' }} />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {errorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                目前还没有错误记录，继续保持完美的打字手感吧！
              </div>
            )}
          </div>

          {errorData.length > 0 && (
            <button
              onClick={handleGenerateDrill}
              className="py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-sm shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>🚀 立即为我生成「易错按键强化特训」</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 4: ACHIEVEMENTS */}
      {activeTab === 'ACHIEVEMENTS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border-2 flex flex-col items-center text-center justify-between transition-all ${
                ach.unlocked
                  ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-yellow-50 shadow-md'
                  : 'border-gray-200 bg-gray-50/70 opacity-70'
              }`}
            >
              <div className="text-4xl my-2">{ach.icon}</div>
              <div className="font-black text-gray-800 text-base">{ach.title}</div>
              <div className="text-xs text-gray-500 mt-1 mb-3">{ach.description}</div>

              <div className="w-full">
                {ach.unlocked ? (
                  <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                    ✨ 已达成 (+{ach.rewardCoins}🪙)
                  </span>
                ) : (
                  <span className="inline-block bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-bold">
                    🔒 奖励 {ach.rewardCoins} 🪙
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: LOGS */}
      {activeTab === 'LOGS' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-800">📋 练习历史流水</h3>
            {stats.length > 0 && onClearHistory && (
              <button
                onClick={() => {
                  if (window.confirm('确定要清空所有打字历史记录吗？')) {
                    onClearHistory();
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold"
              >
                清空历史
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-3">日期</th>
                  <th className="p-3">教材/模式</th>
                  <th className="p-3">打字速度</th>
                  <th className="p-3">准确率</th>
                  <th className="p-3">用时</th>
                  <th className="p-3">金币奖励</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.length > 0 ? (
                  stats.slice().reverse().map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium">{s.date}</td>
                      <td className="p-3 font-bold text-gray-800">{s.bookName || '打字练习'}</td>
                      <td className="p-3 font-black text-blue-600">{s.speed} WPM</td>
                      <td className="p-3 font-black text-emerald-600">{s.accuracy}%</td>
                      <td className="p-3">{s.timeSpent} 秒</td>
                      <td className="p-3 text-amber-600 font-bold">+{s.coinsEarned || 10} 🪙</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400">
                      暂无历史记录，去练习一局吧！
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 p-8 rounded-3xl border-8 border-yellow-300 shadow-2xl max-w-lg w-full text-center relative animate-fade-in text-amber-950">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-6xl mb-2">🏆</div>
            <h2 className="text-2xl font-black text-amber-900">阿墨墨打字小达人奖状</h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto my-3 rounded-full"></div>

            <p className="text-sm font-bold text-gray-700 leading-relaxed my-4">
              亲爱的小朋友：<br />
              你在阿墨墨打字通中勤奋练习，最高打字速度达到 <span className="text-blue-600 text-lg font-black">{maxSpeed} WPM</span>，综合准确率高达 <span className="text-emerald-600 text-lg font-black">{avgAccuracy}%</span>，累计完成 <span className="text-purple-600 text-lg font-black">{totalWords}</span> 个单词！特发此状，以资鼓励！
            </p>

            <div className="bg-white/80 p-4 rounded-2xl border-2 border-amber-200 my-4 flex justify-around">
              <div>
                <div className="text-xs text-gray-500">累计专注</div>
                <div className="font-black text-base text-amber-950">{totalMinutes} 分钟</div>
              </div>
              <div className="w-px bg-amber-200"></div>
              <div>
                <div className="text-xs text-gray-500">荣誉勋章</div>
                <div className="font-black text-base text-amber-950">{achievements.filter(a => a.unlocked).length} 枚</div>
              </div>
            </div>

            <button
              onClick={() => {
                playSoundEffect('victory');
                setShowCertificate(false);
              }}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all active:scale-95"
            >
              🎉 太棒啦！继续加油
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
