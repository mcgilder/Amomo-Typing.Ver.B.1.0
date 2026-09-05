import React, { useState, useMemo, useCallback } from 'react';
import { HabitItem } from '../types';
import { playSoundEffect } from '../utils';

// ============ 每日好习惯奖励登记 ============
// 7 种内置好习惯：孩子定每日目标，家长设置每次分值，按日期登记打卡。
// 每次登记即得积分（同步转化为金币）；孩子可设定自己的心愿目标，
// 家长配置奖励清单，孩子用积分余额兑换奖励。
// 数据存 localStorage（amomo_typing_habits_v2 / amomo_typing_habit_rewards_v2）。

const LS_KEY = 'amomo_typing_habits_v2';
const LS_KEY_REWARDS = 'amomo_typing_habit_rewards_v2';

const DEFAULT_HABITS: HabitItem[] = [
  { id: 'exercise', name: '体育锻炼', emoji: '🏃', targetPerDay: 1, pointsPerTime: 3, records: {} },
  { id: 'express', name: '清晰表达自己想法', emoji: '🗣️', targetPerDay: 1, pointsPerTime: 3, records: {} },
  { id: 'polite', name: '礼貌对待师长', emoji: '🙏', targetPerDay: 2, pointsPerTime: 2, records: {} },
  { id: 'idea', name: '小脑袋冒出新点子', emoji: '💡', targetPerDay: 1, pointsPerTime: 3, records: {} },
  { id: 'eyes', name: '爱护眼睛', emoji: '👀', targetPerDay: 3, pointsPerTime: 1, records: {} },
  { id: 'water', name: '好好喝水', emoji: '💧', targetPerDay: 3, pointsPerTime: 1, records: {} },
  { id: 'poop', name: '拉臭臭', emoji: '🚽', targetPerDay: 1, pointsPerTime: 3, records: {} },
];

export interface RewardItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;      // 兑换所需积分
  redeemed: number;  // 已兑换次数
}

interface RewardStore {
  points: number;    // 积分余额（打卡 earned，兑换 consumed）
  goal: string;      // 孩子自己定的心愿目标
  rewards: RewardItem[];
}

const DEFAULT_REWARDS: RewardItem[] = [
  { id: 'rw_icecream', name: '冰淇淋一个', emoji: '🍦', cost: 20, redeemed: 0 },
  { id: 'rw_cartoon', name: '动画片 30 分钟', emoji: '📺', cost: 30, redeemed: 0 },
  { id: 'rw_game', name: '亲子游戏 1 局', emoji: '🎲', cost: 40, redeemed: 0 },
  { id: 'rw_book', name: '新绘本一本', emoji: '📚', cost: 60, redeemed: 0 },
  { id: 'rw_park', name: '游乐园半天', emoji: '🎡', cost: 200, redeemed: 0 },
];

const todayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const dateStrOf = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'];

const loadHabits = (): HabitItem[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_HABITS;
    const parsed = JSON.parse(raw) as HabitItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_HABITS;
    // 兼容后续新增的内置习惯
    const ids = new Set(parsed.map(h => h.id));
    const merged = [...parsed, ...DEFAULT_HABITS.filter(d => !ids.has(d.id))];
    return merged.map(h => ({ ...h, records: h.records || {} }));
  } catch {
    return DEFAULT_HABITS;
  }
};

const loadRewardStore = (): RewardStore => {
  try {
    const raw = localStorage.getItem(LS_KEY_REWARDS);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<RewardStore>;
      return {
        points: typeof parsed.points === 'number' ? parsed.points : 0,
        goal: typeof parsed.goal === 'string' ? parsed.goal : '',
        rewards: Array.isArray(parsed.rewards) && parsed.rewards.length > 0 ? parsed.rewards : DEFAULT_REWARDS
      };
    }
  } catch { /* ignore */ }
  return { points: 0, goal: '', rewards: DEFAULT_REWARDS };
};

interface HabitTrackerProps {
  onEarnCoins?: (amount: number) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ onEarnCoins }) => {
  const [habits, setHabits] = useState<HabitItem[]>(loadHabits);
  const [store, setStore] = useState<RewardStore>(loadRewardStore);
  const [parentMode, setParentMode] = useState(false);
  const [celebrate, setCelebrate] = useState<string | null>(null); // 达标庆祝：habit id
  const [celebrateReward, setCelebrateReward] = useState<string | null>(null); // 兑换庆祝：reward id
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState('');
  // 家长新增奖励的临时输入
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(30);
  const [newRewardEmoji, setNewRewardEmoji] = useState('🎁');
  const today = todayStr();

  const persist = (next: HabitItem[]) => {
    setHabits(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  // 家长模式状态上报到 main（矮视口 CSS 钩子：设置视图单独缩放保证不滚动）
  React.useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.setAttribute('data-parent-mode', parentMode ? '1' : '0');
    return () => { main?.removeAttribute('data-parent-mode'); };
  }, [parentMode]);

  const persistStore = (next: RewardStore) => {
    setStore(next);
    localStorage.setItem(LS_KEY_REWARDS, JSON.stringify(next));
  };

  const todayCount = useCallback((h: HabitItem) => h.records[today] || 0, [today]);

  // 今日总得分 / 总目标
  const { todayPoints, todayDone, todayTotal } = useMemo(() => {
    let pts = 0, done = 0, total = 0;
    for (const h of habits) {
      const c = h.records[today] || 0;
      const eff = Math.min(c, h.targetPerDay);
      done += eff;
      total += h.targetPerDay;
      pts += eff * h.pointsPerTime;
    }
    return { todayPoints: pts, todayDone: done, todayTotal: total };
  }, [habits, today]);

  // 最近 7 天（含今天）每日达成数
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const ds = dateStrOf(i - 6);
      const d = new Date(ds + 'T00:00:00');
      let done = 0, total = 0;
      for (const h of habits) {
        const c = Math.min(h.records[ds] || 0, h.targetPerDay);
        done += c;
        total += h.targetPerDay;
      }
      return { ds, label: WEEKDAY_ZH[d.getDay()], done, total, isToday: ds === today };
    });
  }, [habits, today]);

  // 积分余额最接近且买得起的奖励（用于目标进度提示）
  const nextAffordable = useMemo(() => {
    const sorted = [...store.rewards].sort((a, b) => a.cost - b.cost);
    return sorted.find(r => r.cost > store.points) || sorted[sorted.length - 1];
  }, [store.rewards, store.points]);

  const handleCheckIn = (h: HabitItem) => {
    const cur = h.records[today] || 0;
    if (cur >= h.targetPerDay) {
      playSoundEffect('pop', 0.14);
      return; // 今日已达标
    }
    const next = cur + 1;
    const nextHabits = habits.map(x =>
      x.id === h.id ? { ...x, records: { ...x.records, [today]: next } } : x
    );
    persist(nextHabits);
    onEarnCoins?.(h.pointsPerTime);
    // 积分余额同步累加（用于兑换奖励）
    persistStore({ ...store, points: store.points + h.pointsPerTime });
    if (next >= h.targetPerDay) {
      // 达标庆祝！
      playSoundEffect('victory', 0.28);
      playSoundEffect('sparkle', 0.2);
      setCelebrate(h.id);
      setTimeout(() => setCelebrate(null), 1800);
    } else {
      playSoundEffect('coin', 0.2);
    }
  };

  const handleUndo = (h: HabitItem) => {
    const cur = h.records[today] || 0;
    if (cur <= 0) return;
    const next = cur - 1;
    const records = { ...h.records };
    if (next <= 0) delete records[today]; else records[today] = next;
    persist(habits.map(x => x.id === h.id ? { ...x, records } : x));
    playSoundEffect('click', 0.12);
    // 撤销不退金币/积分（简化处理，避免刷分漏洞）
  };

  const updateHabit = (id: string, patch: Partial<Pick<HabitItem, 'targetPerDay' | 'pointsPerTime'>>) => {
    persist(habits.map(h => h.id === id ? { ...h, ...patch } : h));
    playSoundEffect('click', 0.12);
  };

  // ===== 孩子目标 =====
  const startEditGoal = () => {
    setGoalDraft(store.goal);
    setEditingGoal(true);
    playSoundEffect('click', 0.12);
  };
  const confirmGoal = () => {
    persistStore({ ...store, goal: goalDraft.trim().slice(0, 30) });
    setEditingGoal(false);
    playSoundEffect('victory', 0.2);
  };

  // ===== 奖励兑换 =====
  const handleRedeem = (r: RewardItem) => {
    if (store.points < r.cost) {
      playSoundEffect('error', 0.15);
      return;
    }
    persistStore({
      ...store,
      points: store.points - r.cost,
      rewards: store.rewards.map(x => x.id === r.id ? { ...x, redeemed: x.redeemed + 1 } : x)
    });
    playSoundEffect('victory', 0.3);
    playSoundEffect('sparkle', 0.25);
    setCelebrateReward(r.id);
    setTimeout(() => setCelebrateReward(null), 2200);
  };

  // ===== 家长管理奖励 =====
  const addReward = () => {
    const name = newRewardName.trim();
    if (!name) return;
    persistStore({
      ...store,
      rewards: [...store.rewards, { id: `rw_${Date.now()}`, name, emoji: newRewardEmoji || '🎁', cost: Math.max(1, Math.min(9999, newRewardCost || 1)), redeemed: 0 }]
    });
    setNewRewardName('');
    setNewRewardCost(30);
    playSoundEffect('victory', 0.18);
  };
  const updateReward = (id: string, patch: Partial<Pick<RewardItem, 'name' | 'cost' | 'emoji'>>) => {
    persistStore({ ...store, rewards: store.rewards.map(r => r.id === id ? { ...r, ...patch } : r) });
    playSoundEffect('click', 0.12);
  };
  const removeReward = (id: string) => {
    persistStore({ ...store, rewards: store.rewards.filter(r => r.id !== id) });
    playSoundEffect('click', 0.12);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-4 animate-fade-in mx-auto px-2">
      {/* 顶部横幅：今日日期 + 今日得分 + 积分余额 + 孩子目标 + 家长设置 */}
      <div className="story-card p-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-4xl animate-float-y select-none">🌟</span>
            <div>
              <h2 className="text-2xl font-black text-[#5B4636] font-kids">好习惯打卡</h2>
              <p className="text-xs text-[#8A6F5C] font-bold mt-0.5">
                今天是 {today.replace(/-/g, ' / ')} · 坚持好习惯，天天有奖励！
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* 今日得分 */}
          <div className="bg-[#FFF3D6] px-4 py-2 rounded-2xl border-3 border-[#FFE3A3] shadow-[0_3px_0_rgba(232,163,23,0.3)] flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-[#8A5F00]">今日已得</span>
              <span className="text-xl font-black text-[#8A5F00]">{todayPoints} 分</span>
            </div>
          </div>

          {/* 积分余额（可兑换） */}
          <div className="bg-[#E5F6EC] px-4 py-2 rounded-2xl border-3 border-[#B8E8C6] shadow-[0_3px_0_rgba(72,167,87,0.25)] flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-[#357F43]">积分余额</span>
              <span className="text-xl font-black text-[#357F43]">{store.points} 分</span>
            </div>
          </div>

          {/* 家长模式开关 */}
          <button
            onClick={() => { playSoundEffect('click'); setParentMode(p => !p); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black border-3 transition-all ${
              parentMode
                ? 'bg-[#8258C7] text-white border-[#6A3FB0] shadow-[0_3px_0_#6A3FB0]'
                : 'bg-white text-[#8A6F5C] border-[#FFE8C8] hover:border-[#FFC94D]'
            }`}
            title="家长设置每个习惯的目标与分值、管理奖励"
          >
            {parentMode ? '✅ 家长模式中' : '🔒 家长设置'}
          </button>
        </div>

        {/* 近 7 天达成点阵 */}
        <div className="w-full flex items-center gap-1.5 justify-center flex-wrap">
          <span className="text-[11px] font-black text-[#8A6F5C] mr-1">近 7 天：</span>
          {last7.map(d => {
            const pct = d.total > 0 ? d.done / d.total : 0;
            return (
              <div
                key={d.ds}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl border-2 ${
                  d.isToday ? 'border-[#FF8A5C] bg-[#FFE9E0]' : 'border-[#FFE8C8] bg-[#FFF8EE]'
                }`}
                title={`${d.ds}：${d.done}/${d.total}`}
              >
                <span className="text-[10px] font-black text-[#8A6F5C]">{d.label}</span>
                <span className="text-sm font-black select-none">
                  {pct >= 1 ? '🌟' : pct >= 0.6 ? '😀' : pct > 0 ? '🙂' : '·'}
                </span>
                <span className="text-[9px] font-bold text-[#8A6F5C]">{d.done}/{d.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 孩子目标 + 奖励兑换（家长设置面板在下方，此卡始终展示孩子视角） */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左：我的目标（孩子自己改） */}
        <div className="lg:col-span-5 story-card p-4 flex flex-col justify-center gap-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🎯</span>
            <span className="text-sm font-black text-[#E0633A]">我的目标</span>
            {!editingGoal && !parentMode && (
              <button
                onClick={startEditGoal}
                className="w-6 h-6 rounded-lg bg-[#FFE9E0] hover:bg-[#FFD1BE] text-[#E0633A] text-xs flex items-center justify-center border border-[#FFD1BE] transition-all active:scale-90"
                title="修改我的目标"
              >
                ✏️
              </button>
            )}
          </div>
          {editingGoal ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={goalDraft}
                onChange={e => setGoalDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); confirmGoal(); }
                  if (e.key === 'Escape') setEditingGoal(false);
                }}
                maxLength={30}
                placeholder="例如：攒够积分去动物园！"
                className="flex-1 px-3 py-2 rounded-xl border-3 border-[#FFC94D] bg-white font-black text-sm text-[#5B4636] focus:outline-none focus:ring-4 focus:ring-[#FFC94D]/40"
              />
              <button onClick={confirmGoal} className="btn-candy btn-grass px-3 py-2 text-xs" title="保存（回车）">✓</button>
              <button onClick={() => setEditingGoal(false)} className="px-3 py-2 rounded-xl bg-[#F5EBDA] text-[#8A6F5C] text-xs font-black" title="取消（Esc）">✕</button>
            </div>
          ) : (
            <p className={`text-lg md:text-xl font-black font-kids leading-snug ${store.goal ? 'text-[#5B4636]' : 'text-[#C4AE97]'}`}>
              {store.goal || '点 ✏️ 写下你的小心愿吧！'}
            </p>
          )}
          {/* 距离最近奖励的进度 */}
          {nextAffordable && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-[#F5EBDA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6BCB77] to-[#48A757] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (store.points / nextAffordable.cost) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-black text-[#357F43] whitespace-nowrap">
                距「{nextAffordable.emoji}{nextAffordable.name}」还差 {Math.max(0, nextAffordable.cost - store.points)} 分
              </span>
            </div>
          )}
        </div>

        {/* 右：奖励兑换架 */}
        <div className="lg:col-span-7 story-card p-4 flex flex-col gap-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl select-none">🎁</span>
              <span className="text-sm font-black text-[#8258C7]">奖励兑换</span>
              <span className="text-[11px] font-bold text-[#8A6F5C]">用积分换奖励，兑换后记得找爸爸妈妈兑现哦！</span>
            </div>
            <span className="text-xs font-black text-[#357F43] bg-[#E5F6EC] px-3 py-1 rounded-full border-2 border-[#B8E8C6] whitespace-nowrap">
              💎 {store.points} 分
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
            {store.rewards.map(r => {
              const affordable = store.points >= r.cost;
              const celebrating = celebrateReward === r.id;
              return (
                <div
                  key={r.id}
                  className={`relative rounded-2xl border-3 p-2 flex flex-col items-center gap-1 transition-all ${
                    celebrating
                      ? 'border-[#FFC94D] bg-[#FFF3D6] scale-105 shadow-lg'
                      : affordable
                      ? 'border-[#B8E8C6] bg-white hover:border-[#6BCB77] hover:shadow-md'
                      : 'border-[#F5EBDA] bg-[#FFFBF5] opacity-80'
                  }`}
                >
                  {/* 兑换庆祝 */}
                  {celebrating && (
                    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center rounded-2xl bg-[#FFF3D6]/95">
                      {['🎉', '✨', '🎊', '⭐'].map((e, i) => (
                        <span key={i} className="absolute text-xl animate-confetti select-none"
                          style={{ left: `${12 + i * 22}%`, animationDelay: `${i * 0.1}s` }}>{e}</span>
                      ))}
                      <span className="text-[11px] font-black text-[#8A5F00] text-center leading-tight px-1">
                        兑换成功！<br />找爸妈兑现 🎉
                      </span>
                    </div>
                  )}
                  <span className="text-2xl select-none">{r.emoji}</span>
                  <span className="text-[11px] font-black text-[#5B4636] text-center leading-tight min-h-[2em] flex items-center">{r.name}</span>
                  <span className="text-[10px] font-black text-[#8258C7] bg-[#F3E9FA] px-2 py-0.5 rounded-full">
                    💎 {r.cost} 分{r.redeemed > 0 ? ` · 已换${r.redeemed}次` : ''}
                  </span>
                  <button
                    onClick={() => handleRedeem(r)}
                    disabled={!affordable}
                    className={`w-full py-1 rounded-xl text-xs font-black transition-all active:scale-95 ${
                      affordable
                        ? 'btn-candy btn-grass'
                        : 'bg-[#F5EBDA] text-[#C4AE97] cursor-not-allowed'
                    }`}
                    title={affordable ? '用积分兑换' : `还差 ${r.cost - store.points} 分`}
                  >
                    {affordable ? '兑换 🎉' : `差 ${r.cost - store.points} 分`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 家长模式：奖励管理 */}
          {parentMode && (
            <div className="mt-1 pt-2.5 border-t-2 border-[#F5EBDA] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black text-[#8258C7]">🎁 管理奖励：</span>
                {store.rewards.map(r => (
                  <span key={r.id} className="flex items-center gap-1 bg-[#F3E9FA] rounded-xl pl-2 pr-1 py-1 border-2 border-[#E2D0F2]">
                    <input
                      value={r.emoji}
                      onChange={e => updateReward(r.id, { emoji: e.target.value.slice(0, 2) })}
                      className="w-7 text-center text-sm bg-transparent outline-none"
                      title="奖励图标"
                    />
                    <input
                      value={r.name}
                      onChange={e => updateReward(r.id, { name: e.target.value.slice(0, 20) })}
                      className="w-20 px-1 text-[11px] font-black text-[#5B4636] bg-transparent outline-none border-b-2 border-[#E2D0F2] focus:border-[#8258C7]"
                      title="奖励名称"
                    />
                    <input
                      type="number" min={1} max={9999}
                      value={r.cost}
                      onChange={e => updateReward(r.id, { cost: Math.max(1, Math.min(9999, Number(e.target.value) || 1)) })}
                      className="w-12 px-1 text-[11px] font-black text-[#8258C7] text-center bg-white/70 rounded-md outline-none"
                      title="所需积分"
                    />
                    <span className="text-[10px] text-[#8258C7]">分</span>
                    <button
                      onClick={() => removeReward(r.id)}
                      className="w-5 h-5 rounded-md bg-white text-[#E0678A] text-[10px] font-black flex items-center justify-center hover:bg-[#FFE9E0] transition-all active:scale-90"
                      title="删除该奖励"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              {/* 新增奖励 */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black text-[#8A6F5C]">➕ 新增：</span>
                <input
                  value={newRewardEmoji}
                  onChange={e => setNewRewardEmoji(e.target.value.slice(0, 2))}
                  className="w-9 text-center text-sm rounded-lg border-2 border-[#E2D0F2] bg-white py-1 outline-none focus:border-[#8258C7]"
                  title="图标"
                />
                <input
                  value={newRewardName}
                  onChange={e => setNewRewardName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addReward(); } }}
                  placeholder="奖励名称（如：周末露营）"
                  maxLength={20}
                  className="w-40 px-2 py-1 rounded-lg border-2 border-[#E2D0F2] bg-white text-xs font-bold text-[#5B4636] outline-none focus:border-[#8258C7]"
                />
                <input
                  type="number" min={1} max={9999}
                  value={newRewardCost}
                  onChange={e => setNewRewardCost(Number(e.target.value))}
                  className="w-16 px-1 py-1 rounded-lg border-2 border-[#E2D0F2] bg-white text-xs font-black text-[#8258C7] text-center outline-none focus:border-[#8258C7]"
                  title="所需积分"
                />
                <span className="text-[11px] text-[#8A6F5C] font-bold">分</span>
                <button onClick={addReward} className="btn-candy btn-grape px-3 py-1 text-xs">添加</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 习惯卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {habits.map(h => {
          const cur = todayCount(h);
          const done = cur >= h.targetPerDay;
          const pct = Math.min(100, (cur / h.targetPerDay) * 100);
          return (
            <div
              key={h.id}
              className={`story-card p-4 flex flex-col items-center gap-2 relative overflow-hidden transition-all ${
                done ? 'border-[#6BCB77]' : ''
              }`}
            >
              {/* 达标庆祝 */}
              {celebrate === h.id && (
                <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                  {['🎉', '⭐', '🎊', '✨', '🌟'].map((e, i) => (
                    <span key={i} className="absolute text-2xl animate-confetti select-none"
                      style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 0.1}s` }}>{e}</span>
                  ))}
                  <span className="bg-[#6BCB77] text-white font-black text-sm px-4 py-1.5 rounded-full border-3 border-white shadow-lg animate-bounce select-none z-10">
                    达成目标！+{h.pointsPerTime} 分 🎉
                  </span>
                </div>
              )}

              <span className={`text-4xl select-none ${done ? 'animate-breathe' : ''}`}>{h.emoji}</span>
              <span className="font-black text-[#5B4636] text-sm text-center leading-tight">{h.name}</span>

              {/* 进度点 */}
              <div className="flex items-center gap-1.5 my-0.5">
                {Array.from({ length: h.targetPerDay }, (_, i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      i < cur ? 'bg-[#6BCB77] border-[#48A757] scale-110' : 'bg-white border-[#FFE8C8]'
                    }`}
                  />
                ))}
              </div>

              {/* 进度条 */}
              <div className="w-full h-2.5 bg-[#F5EBDA] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-gradient-to-r from-[#6BCB77] to-[#48A757]' : 'bg-gradient-to-r from-[#FFC94D] to-[#E8A317]'}`}
                  style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[11px] font-black text-[#8A6F5C]">
                {done ? `✅ 今日达成！${cur}/${h.targetPerDay}` : `今日 ${cur}/${h.targetPerDay} · 每次 +${h.pointsPerTime} 分`}
              </span>

              {/* 打卡按钮（家长模式下隐藏：家长只调参数不打卡，保证设置视图不超高） */}
              <div className={`flex items-center gap-2 mt-1 ${parentMode ? 'hidden' : ''}`}>
                <button
                  onClick={() => handleUndo(h)}
                  disabled={cur <= 0}
                  className="w-9 h-9 rounded-xl bg-white text-[#8A6F5C] border-2 border-[#FFE8C8] font-black text-sm disabled:opacity-30 hover:border-[#FF8A5C] transition-all active:scale-90"
                  title="撤销一次（误点用）"
                >
                  −1
                </button>
                <button
                  onClick={() => handleCheckIn(h)}
                  disabled={done}
                  className={`btn-candy px-5 py-2 text-sm ${done ? 'btn-grass opacity-70' : 'btn-grass'}`}
                >
                  {done ? '已完成 ✨' : `打卡 +1`}
                </button>
              </div>

              {/* 家长模式：编辑目标与分值 */}
              {parentMode && (
                <div className="w-full mt-1.5 pt-2.5 border-t-2 border-[#F5EBDA] flex items-center justify-center gap-2 flex-wrap">
                  <label className="flex items-center gap-1 text-[10px] font-black text-[#8A6F5C]">
                    每日目标
                    <input
                      type="number" min={1} max={9}
                      value={h.targetPerDay}
                      onChange={e => updateHabit(h.id, { targetPerDay: Math.max(1, Math.min(9, Number(e.target.value) || 1)) })}
                      className="w-12 px-1.5 py-1 rounded-lg border-2 border-[#E2D0F2] bg-[#F3E9FA] text-center font-black text-[#8258C7] outline-none"
                    />
                    次
                  </label>
                  <label className="flex items-center gap-1 text-[10px] font-black text-[#8A6F5C]">
                    每次得分
                    <input
                      type="number" min={1} max={20}
                      value={h.pointsPerTime}
                      onChange={e => updateHabit(h.id, { pointsPerTime: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
                      className="w-12 px-1.5 py-1 rounded-lg border-2 border-[#E2D0F2] bg-[#F3E9FA] text-center font-black text-[#8258C7] outline-none"
                    />
                    分
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div className="story-card p-4 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-[#8A6F5C] font-bold flex items-center gap-1.5">
          <span>💡</span>
          每次打卡立刻得分（同步加进金币）！积分攒够就能兑换上面的奖励；全部达成的那天会拿到满星 🌟 哦～
          {parentMode && <span className="text-[#8258C7]">（家长模式：可调整目标次数、分值与奖励清单）</span>}
        </p>
        <span className="text-[11px] font-black text-[#E0633A] bg-[#FFE9E0] px-3 py-1.5 rounded-full border-2 border-[#FFD1BE]">
          今日进度 {todayDone}/{todayTotal}
        </span>
      </div>
    </div>
  );
};

export default HabitTracker;
