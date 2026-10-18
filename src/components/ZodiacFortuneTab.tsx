import React, { useState, useEffect } from 'react';
import { CONSTELLATIONS, ZODIAC_SIGNS } from '../data/fortuneData';
import { useUser } from '../context/UserContext';
import { getZodiacIdByBirthYear, getConstellationIdByBirthDate } from '../utils/sajuCalculator';
import { 
  Sparkles, Moon, Sun, Heart, DollarSign, Briefcase, Compass, CheckCircle2, 
  ArrowRight, Layers
} from 'lucide-react';

export const ZodiacFortuneTab: React.FC = () => {
  const { activeProfile, saveProfile } = useUser();

  // Check if active profile has birth info completed
  const hasBirthInfo = Boolean(
    activeProfile?.isBirthInfoCompleted &&
    activeProfile?.birthYear &&
    activeProfile?.birthMonth &&
    activeProfile?.birthDay
  );

  // Quick inline birth form states for first-time or uncompleted profiles
  const [inlineName, setInlineName] = useState(activeProfile?.name || '본인');
  const [inlineYear, setInlineYear] = useState<number>(activeProfile?.birthYear || 1995);
  const [inlineMonth, setInlineMonth] = useState<number>(activeProfile?.birthMonth || 7);
  const [inlineDay, setInlineDay] = useState<number>(activeProfile?.birthDay || 7);
  const [inlineCalendar, setInlineCalendar] = useState<'solar' | 'lunar'>('solar');

  // Compute matched zodiac and constellation IDs
  const userZodiacId = hasBirthInfo && activeProfile?.birthYear
    ? getZodiacIdByBirthYear(activeProfile.birthYear)
    : null;

  const userConstellationId = hasBirthInfo && activeProfile?.birthMonth && activeProfile?.birthDay
    ? getConstellationIdByBirthDate(activeProfile.birthMonth, activeProfile.birthDay)
    : null;

  const matchedZodiac = userZodiacId ? ZODIAC_SIGNS.find((z) => z.id === userZodiacId) : null;
  const matchedConstellation = userConstellationId ? CONSTELLATIONS.find((c) => c.id === userConstellationId) : null;

  // View modes: 'dual' (both user's sign & constellation together), 'zodiac', 'constellation'
  const [mode, setMode] = useState<'dual' | 'zodiac' | 'constellation'>(hasBirthInfo ? 'dual' : 'zodiac');
  const [selectedZodiacId, setSelectedZodiacId] = useState<string>(() => userZodiacId || 'dragon');
  const [selectedConstellationId, setSelectedConstellationId] = useState<string>(() => userConstellationId || 'leo');

  // Reactively auto-select user's 띠 and 별자리 whenever activeProfile or birth info changes
  useEffect(() => {
    if (userZodiacId) {
      setSelectedZodiacId(userZodiacId);
    }
    if (userConstellationId) {
      setSelectedConstellationId(userConstellationId);
    }
    if (hasBirthInfo && mode !== 'dual') {
      // Keep mode intact or set dual
    }
  }, [activeProfile?.id, userZodiacId, userConstellationId, hasBirthInfo]);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineYear || !inlineMonth || !inlineDay) return;
    saveProfile({
      id: activeProfile?.id,
      name: inlineName.trim() || '본인',
      birthYear: inlineYear,
      birthMonth: inlineMonth,
      birthDay: inlineDay,
      calendarType: inlineCalendar,
    });
    setMode('dual');
  };

  const currentZodiac = ZODIAC_SIGNS.find((z) => z.id === selectedZodiacId) || ZODIAC_SIGNS[0];
  const currentConstellation = CONSTELLATIONS.find((c) => c.id === selectedConstellationId) || CONSTELLATIONS[0];

  const userZodiacObj = matchedZodiac || currentZodiac;
  const userConstellationObj = matchedConstellation || currentConstellation;

  const isCurrentZodiacMine = hasBirthInfo && currentZodiac.id === userZodiacId;
  const isCurrentConstellationMine = hasBirthInfo && currentConstellation.id === userConstellationId;

  // Helper renderers for zodiac card
  const renderZodiacCard = (z: typeof currentZodiac, isMine: boolean) => (
    <div className="rounded-3xl bg-slate-900/80 border border-amber-500/30 p-6 sm:p-7 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-inner">
            {z.symbol}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-white font-serif-kr">
                {z.name} ({z.hanja})
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                오늘의 길운: {z.luckyScore}점
              </span>
              {isMine && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md shadow-amber-500/30 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeProfile?.name}님의 선택된 띠 ({activeProfile?.birthYear}년생)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              해당 출생 연도: {z.years.slice(1, 6).join(', ')}년생 등
            </p>
          </div>
        </div>
      </div>

      {/* General Overview */}
      <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/20">
        <span className="text-xs font-bold text-amber-400 block mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          오늘의 띠별 총평
        </span>
        <p className="text-slate-200 text-sm leading-relaxed">{z.generalToday}</p>
      </div>

      {/* Specific Birth Year Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 font-serif-kr">출생 연도별 상세 운세</h3>
          {isMine && (
            <span className="text-xs text-amber-400 font-medium">
              ★ {activeProfile?.name}님의 출생 연도({activeProfile?.birthYear}년생) 강조됨
            </span>
          )}
        </div>

        {/* Dedicated Custom Card if user's birthYear is not in specificYears list */}
        {isMine && activeProfile?.birthYear && !z.specificYears.some((item) => item.year === activeProfile.birthYear) && (
          <div className="mb-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-950/30 to-slate-900 border-2 border-amber-400 flex items-start justify-between gap-3 shadow-md shadow-amber-500/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-xs">
                  ★ {activeProfile.name}님 출생 연도: {activeProfile.birthYear}년생 ({2026 - activeProfile.birthYear + 1}세)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                {activeProfile.name}님의 사주 기운과 {z.name}의 오늘 일진이 조화롭게 부합하여, 귀인의 조력으로 중요한 결정에서 대길한 결과를 맞이합니다. 서두르지 말고 자신의 페이스를 유지하세요.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-bold text-amber-400 font-cinzel">{z.luckyScore}</span>
              <span className="text-[10px] text-slate-400 block">점</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {z.specificYears.map((item) => {
            const isMyYear = isMine && item.year === activeProfile?.birthYear;
            return (
              <div
                key={item.year}
                className={`p-4 rounded-xl flex items-start justify-between gap-3 transition-all ${
                  isMyYear
                    ? 'bg-amber-500/20 border-2 border-amber-400 shadow-md shadow-amber-500/15 ring-1 ring-amber-400/50'
                    : 'bg-slate-800/40 border border-slate-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                        isMyYear
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {item.year}년생 ({item.age}세)
                    </span>
                    {isMyYear && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-black">
                        내 출생연도 선택됨
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isMyYear ? 'text-amber-100 font-medium' : 'text-slate-300'}`}>
                    {item.fortune}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-amber-400 font-cinzel">{item.rating}</span>
                  <span className="text-[10px] text-slate-500 block">점</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Helper renderer for constellation card
  const renderConstellationCard = (c: typeof currentConstellation, isMine: boolean) => (
    <div className="rounded-3xl bg-slate-900/80 border border-indigo-500/30 p-6 sm:p-7 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 shadow-inner">
            {c.symbol}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-white font-serif-kr">
                {c.name} ({c.english})
              </h2>
              {isMine && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-black flex items-center gap-1 shadow-md shadow-indigo-500/30 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeProfile?.name}님의 선택된 별자리 ({activeProfile?.birthMonth}월 {activeProfile?.birthDay}일)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">성좌 기간: {c.period}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-amber-400 font-cinzel">{c.score}</span>
          <span className="text-xs text-slate-400">점</span>
        </div>
      </div>

      {/* 3 Categories: Love, Money, Work */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-pink-500/20">
          <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5" />
            애정운
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.love}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-amber-500/20">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            금전운
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.money}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-blue-500/20">
          <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            직업·학업운
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.work}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span><strong>오늘의 럭키 가이드:</strong> {c.luckyTip}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Top Showcase Card: When birth info is entered, clearly show BOTH the selected 띠 and selected 별자리 */}
      {hasBirthInfo ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#12192c] via-[#0f172a] to-[#1e1735] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>생년월일 맞춤 매칭 완료</span>
                </span>
                <span className="text-xs font-bold text-white">
                  {activeProfile?.name}님의 정보: {activeProfile?.birthYear}년 {activeProfile?.birthMonth}월 {activeProfile?.birthDay}일 ({activeProfile?.calendarType === 'lunar' ? '음력' : '양력'})
                </span>
              </div>
              <p className="text-xs text-slate-300">
                입력하신 생년월일시를 분석하여 <strong>선택된 띠</strong>와 <strong>해당 날짜의 별자리</strong>가 자동 매칭되어 아래에 표시됩니다.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMode('dual')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  mode === 'dual'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-black'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>내 띠 & 별자리 동시보기</span>
              </button>
            </div>
          </div>

          {/* Dual Showcase Cards (내 띠 & 내 별자리) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: 선택된 띠 표시 */}
            <div 
              onClick={() => {
                setMode('zodiac');
                if (userZodiacId) setSelectedZodiacId(userZodiacId);
              }}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900 border-2 border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-amber-400">선택된 띠 (출생 연도 기준)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black tracking-tight flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  선택됨
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shrink-0">
                  {userZodiacObj.symbol}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white font-serif-kr">
                      {userZodiacObj.name} ({userZodiacObj.hanja})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {activeProfile?.birthYear}년생
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {userZodiacObj.generalToday}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-amber-400 font-cinzel">{userZodiacObj.luckyScore}</span>
                  <span className="text-[10px] text-slate-400 block">점</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-300 font-medium">
                <span>클릭하여 띠별 상세 풀이 보기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 2: 선택된 별자리 표시 */}
            <div 
              onClick={() => {
                setMode('constellation');
                if (userConstellationId) setSelectedConstellationId(userConstellationId);
              }}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-indigo-950/30 to-slate-900 border-2 border-indigo-500/50 hover:border-indigo-400 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-indigo-300">선택된 별자리 (출생 날짜 기준)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-400 text-slate-950 text-[10px] font-black tracking-tight flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  선택됨
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shrink-0">
                  {userConstellationObj.symbol}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white font-serif-kr">
                      {userConstellationObj.name} ({userConstellationObj.english})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {userConstellationObj.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    오늘의 럭키 팁: {userConstellationObj.luckyTip}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-indigo-400 font-cinzel">{userConstellationObj.score}</span>
                  <span className="text-[10px] text-slate-400 block">점</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-300 font-medium">
                <span>클릭하여 별자리 상세 풀이 보기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* If birth info is not entered yet: Inline Fast Input Form so user can see it right away! */
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif-kr">
                생년월일을 입력하시면 내 띠와 별자리가 자동으로 선택되어 표시됩니다
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                출생 연도에 따른 12간지 띠와 생년월일 날짜에 따른 황도 12성좌가 즉시 매칭됩니다.
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickSubmit} className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">이름</label>
              <input
                type="text"
                value={inlineName}
                onChange={(e) => setInlineName(e.target.value)}
                placeholder="이름"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">출생 연도</label>
              <input
                type="number"
                min="1920"
                max="2030"
                value={inlineYear}
                onChange={(e) => setInlineYear(parseInt(e.target.value) || 1995)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">월</label>
              <input
                type="number"
                min="1"
                max="12"
                value={inlineMonth}
                onChange={(e) => setInlineMonth(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">일</label>
              <input
                type="number"
                min="1"
                max="31"
                value={inlineDay}
                onChange={(e) => setInlineDay(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">양력/음력</label>
              <select
                value={inlineCalendar}
                onChange={(e) => setInlineCalendar(e.target.value as 'solar' | 'lunar')}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="solar">양력</option>
                <option value="lunar">음력</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-5 md:col-span-1">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/30 hover:scale-102 transition-transform"
              >
                내 띠·별자리 확인
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Navigation Modes: Dual View / 12간지 띠별 / 12성좌 별자리 */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-kr flex items-center gap-2">
            {mode === 'dual' ? (
              <>
                <Layers className="w-5 h-5 text-amber-400" />
                <span>내 띠 & 별자리 맞춤 종합 분석</span>
              </>
            ) : mode === 'zodiac' ? (
              <>
                <Moon className="w-5 h-5 text-amber-400" />
                <span>12간지 띠별 운세</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 text-amber-400" />
                <span>12성좌 별자리 운세</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {mode === 'dual'
              ? '생년월일로 산출된 내 띠와 별자리 운세를 한눈에 확인하실 수 있습니다.'
              : mode === 'zodiac'
              ? (hasBirthInfo ? `${activeProfile?.name}님의 출생 연도(${activeProfile?.birthYear}년생 ${matchedZodiac?.name})가 선택되어 있습니다.` : '12간지 동물 띠별 일일 운세')
              : (hasBirthInfo ? `${activeProfile?.name}님의 생일(${activeProfile?.birthMonth}월 ${activeProfile?.birthDay}일 ${matchedConstellation?.name})이 선택되어 있습니다.` : '12성좌 별자리 일일 운세')}
          </p>
        </div>

        {/* 3 View Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1 flex-wrap">
          {hasBirthInfo && (
            <button
              onClick={() => setMode('dual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'dual'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>동시보기</span>
            </button>
          )}

          <button
            onClick={() => {
              setMode('zodiac');
              if (userZodiacId) setSelectedZodiacId(userZodiacId);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'zodiac'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>12간지 띠별</span>
            {matchedZodiac && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-300 font-bold ml-0.5">
                {matchedZodiac.symbol} {matchedZodiac.name}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setMode('constellation');
              if (userConstellationId) setSelectedConstellationId(userConstellationId);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'constellation'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>별자리</span>
            {matchedConstellation && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-950 text-indigo-300 font-bold ml-0.5">
                {matchedConstellation.symbol} {matchedConstellation.name}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Display Area */}

      {/* Mode A: Dual View (User's Matched 띠 AND Matched 별자리 displayed together!) */}
      {mode === 'dual' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Section 1: Selected 띠 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-300 font-serif-kr flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" />
                <span>{activeProfile?.name}님의 선택된 띠: {userZodiacObj.name} ({activeProfile?.birthYear}년생)</span>
              </h2>
              <button
                onClick={() => setMode('zodiac')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>다른 띠 탐색하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {renderZodiacCard(userZodiacObj, true)}
          </div>

          {/* Section 2: Selected 별자리 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-indigo-300 font-serif-kr flex items-center gap-2">
                <Sun className="w-4 h-4 text-indigo-400" />
                <span>{activeProfile?.name}님의 선택된 별자리: {userConstellationObj.name} ({activeProfile?.birthMonth}월 {activeProfile?.birthDay}일)</span>
              </h2>
              <button
                onClick={() => setMode('constellation')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>다른 별자리 탐색하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {renderConstellationCard(userConstellationObj, true)}
          </div>
        </div>
      )}

      {/* Mode B: 12 Zodiac Animal Explorer */}
      {mode === 'zodiac' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 12 Zodiac Animal Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {ZODIAC_SIGNS.map((z) => {
              const isSelected = z.id === selectedZodiacId;
              const isMine = z.id === userZodiacId;
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZodiacId(z.id)}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 font-bold scale-105 shadow-xl shadow-amber-500/30 border-2 border-amber-300 z-10'
                      : isMine
                      ? 'bg-amber-950/40 border-2 border-amber-400 text-amber-200 hover:bg-amber-900/50 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {isMine && (
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] shadow-md tracking-tighter whitespace-nowrap animate-bounce">
                      ★ 내 띠 (선택됨)
                    </span>
                  )}
                  <span className="text-2xl mb-1">{z.symbol}</span>
                  <span className="text-xs font-semibold">{z.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-950 font-bold' : isMine ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                    {z.hanja.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Animal Detail Card */}
          {renderZodiacCard(currentZodiac, isCurrentZodiacMine)}
        </div>
      )}

      {/* Mode C: 12 Constellation Explorer */}
      {mode === 'constellation' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Constellation Selector */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {CONSTELLATIONS.map((c) => {
              const isSelected = c.id === selectedConstellationId;
              const isMine = c.id === userConstellationId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConstellationId(c.id)}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-bold scale-105 shadow-xl shadow-indigo-500/30 border-2 border-indigo-300 z-10'
                      : isMine
                      ? 'bg-indigo-950/50 border-2 border-indigo-400 text-indigo-200 hover:bg-indigo-900/50 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400/40'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {isMine && (
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 text-white font-black text-[9px] shadow-md tracking-tighter whitespace-nowrap animate-bounce">
                      ★ 내 별자리 (선택됨)
                    </span>
                  )}
                  <span className="text-2xl mb-1">{c.symbol}</span>
                  <span className="text-xs font-semibold">{c.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-indigo-100 font-bold' : isMine ? 'text-indigo-300 font-bold' : 'text-slate-500'}`}>
                    {c.period}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Constellation Card */}
          {renderConstellationCard(currentConstellation, isCurrentConstellationMine)}
        </div>
      )}
    </div>
  );
};
