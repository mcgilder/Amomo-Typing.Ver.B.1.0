import React, { useState, useMemo, useCallback } from 'react';
import { HabitItem } from '../types';
import { playSoundEffect } from '../utils';

// ============ 每日好习惯奖励登记 ============
// 7 种内置好习惯：孩子定每日目标，家长设置每次分值，按日期登记打卡。
// 每次登记即得分（转化为金币奖励）；当日达标触发庆祝动画。
// 数据存 localStorage（amomo_typing_habits_v2），换 TRAE 账号/换电脑不丢失（同浏览器）。

const LS_KEY = 'amomo_typing_habits_v2';

const DEFAULT_HABITS: HabitItem[] = [
  { id: 'exercise', name: '体育锻炼', emoji: '🏃', targetPerDay: 1, pointsPerTime: 3, records: {} },
  { id: 'express', name: '清晰表达自己想法', emoji: '🗣️', targetPerDay: 1, pointsPerTime: 3, records: {} },
  { id: 'polite', name: '礼貌对待师长', emoji: '🙏', targetPerDay: 2, pointsPerTime: 2, records: {} },
  { id: 'idea', name: '小脑袋冒出新点子', emoji: '💡', targetPerDay: 1, pointsPerTime: 3, records: {} },
  { id: 'eyes', name: '爱护眼睛', emoji: '👀', targetPerDay: 3, pointsPerTime: 1, records: {} },
  { id: 'water', name: '好好喝水', emoji: '💧', targetPerDay: 3, pointsPerTime: 1, records: {} },
  { id: 'poop', name: '拉臭臭', emoji: '🚽', targetPerDay: 1, pointsPerTime: 3, records: {} },
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

interface HabitTrackerProps {
  onEarnCoins?: (amount: number) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ onEarnCoins }) => {
  const [habits, setHabits] = useState<HabitItem[]>(loadHabits);
  const [parentMode, setParentMode] = useState(false);
  const [celebrate, setCelebrate] = useState<string | null>(null); // 达标庆祝：habit id
  const today = todayStr();

  const persist = (next: HabitItem[]) => {
    setHabits(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
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
    // 撤销不退金币（简化处理，避免刷分漏洞）
  };

  const updateHabit = (id: string, patch: Partial<Pick<HabitItem, 'targetPerDay' | 'pointsPerTime'>>) => {
    persist(habits.map(h => h.id === id ? { ...h, ...patch } : h));
    playSoundEffect('click', 0.12);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-4 animate-fade-in mx-auto px-2">
      {/* 顶部横幅：今日日期 + 今日得分 + 近7天点阵 */}
      <div className="story-card p-5 flex flex-wrap items-center justify-between gap-4">
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
          <div className="bg-[#FFF3D6] px-5 py-2.5 rounded-2xl border-3 border-[#FFE3A3] shadow-[0_3px_0_rgba(232,163,23,0.3)] flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-[#8A5F00]">今日已得</span>
              <span className="text-xl font-black text-[#8A5F00]">{todayPoints} 分</span>
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
            title="家长设置每个习惯的目标与分值"
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

              {/* 打卡按钮 */}
              <div className="flex items-center gap-2 mt-1">
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
          每次打卡立刻得分（自动加入金币）！全部达成的那天会拿到满星 🌟 哦～
          {parentMode && <span className="text-[#8258C7]">（家长模式：可调整每个习惯的目标次数与分值）</span>}
        </p>
        <span className="text-[11px] font-black text-[#E0633A] bg-[#FFE9E0] px-3 py-1.5 rounded-full border-2 border-[#FFD1BE]">
          今日进度 {todayDone}/{todayTotal}
        </span>
      </div>
    </div>
  );
};

export default HabitTracker;
