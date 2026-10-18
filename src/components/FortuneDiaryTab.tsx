import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types/fortune';
import { CalendarHeart, Plus, Trash2, Smile, Award } from 'lucide-react';

export const FortuneDiaryTab: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('unsu_diary_entries');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'sample-1',
        date: '2026-09-29',
        score: 92,
        mood: '대길 (최고조)',
        memo: '회사에서 중요한 발표가 있었는데 팀장님과 임원분들의 큰 칭찬을 받았다. 오늘의 운수에서 나온 귀인 조언이 딱 맞았다.',
        tarotCardName: '19. 태양 (The Sun)',
      },
      {
        id: 'sample-2',
        date: '2026-09-28',
        score: 85,
        mood: '평온하고 순조로움',
        memo: '오후에 따뜻한 대추차를 마시며 사색의 시간을 가졌다. 주말 계획을 알차게 세움.',
      },
    ];
  });

  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<number>(90);
  const [mood, setMood] = useState<string>('대길 (매우 좋음)');
  const [memo, setMemo] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('unsu_diary_entries', JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memo.trim()) return;

    const newEntry: DiaryEntry = {
      id: `entry-${Date.now()}`,
      date,
      score,
      mood,
      memo: memo.trim(),
    };

    setEntries([newEntry, ...entries]);
    setMemo('');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-kr flex items-center gap-2">
          <CalendarHeart className="w-5 h-5 text-amber-400" />
          나의 운수(運數) 다이어리
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          매일의 운세 점수와 실제 하루의 감상, 행운의 순간을 기록하고 복을 쌓아보세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Write Form */}
        <form onSubmit={handleAddEntry} className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-amber-500/20 space-y-4">
          <h2 className="text-base font-bold text-white font-serif-kr flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            오늘의 운수 한 줄 기록하기
          </h2>

          <div>
            <label className="text-xs text-slate-400 block mb-1">기록 날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">오늘 체감 운수 점수: {score}점</label>
              <span className="text-xs font-bold text-amber-400">{score >= 90 ? '운수대통' : score >= 80 ? '길일' : '무난함'}</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">오늘의 기운 & 기분</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
            >
              <option value="대길 (매우 좋음)">대길(大吉) - 만사형통 기운 넘침</option>
              <option value="평온하고 순조로움">평온 - 잔잔하고 편안한 하루</option>
              <option value="생각지 못한 행운 발견">횡재수 - 뜻밖의 행운과 선물</option>
              <option value="지혜롭게 난관 극복">극복 - 어려운 문제를 잘 해결함</option>
              <option value="충전과 휴식이 필요한 날">휴식 - 심신 안정과 힐링</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">오늘의 운수 일기 / 감사한 일</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              placeholder="오늘 어떤 좋은 일이 있었나요? 운세에서 맞았던 부분이나 감사한 순간을 기록하세요."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>일기 저장하기</span>
          </button>
        </form>

        {/* Entries List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300">누적된 운수 기록 ({entries.length}개)</h2>
          </div>

          {entries.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
              아직 작성된 운세 일기가 없습니다. 첫 기록을 남겨보세요.
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{item.date}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                        {item.score}점
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                    <Smile className="w-3.5 h-3.5" />
                    <span>기운: {item.mood}</span>
                    {item.tarotCardName && (
                      <span className="text-purple-400 flex items-center gap-1 ml-2">
                        <Award className="w-3.5 h-3.5" />
                        {item.tarotCardName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {item.memo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
