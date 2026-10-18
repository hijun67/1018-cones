import React, { useState, useEffect } from 'react';
import { calculateSaju, ELEMENT_INFO } from '../utils/sajuCalculator';
import { FiveElement, SajuResult } from '../types/fortune';
import { useUser } from '../context/UserContext';
import { Compass, Sparkles, User, Calendar, Clock, ShieldCheck, HeartHandshake, Utensils, Palette, Lock, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SajuAnalysisTab: React.FC = () => {
  const { profiles, activeProfile, activeProfileId, setActiveProfileId, saveProfile, openReportModal } = useUser();

  const [name, setName] = useState<string>(activeProfile?.name || '홍길동');
  const [year, setYear] = useState<number>(activeProfile?.birthYear ?? 1995);
  const [month, setMonth] = useState<number>(activeProfile?.birthMonth ?? 6);
  const [day, setDay] = useState<number>(activeProfile?.birthDay ?? 15);
  const [hour, setHour] = useState<number>(activeProfile?.birthHour ?? 12);
  const [isUnknownHour, setIsUnknownHour] = useState<boolean>(activeProfile?.isUnknownHour ?? true);
  const [gender, setGender] = useState<'male' | 'female'>(activeProfile?.gender ?? 'male');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>(activeProfile?.calendarType ?? 'solar');

  const hasBirthInfo = Boolean(
    activeProfile?.isBirthInfoCompleted &&
    activeProfile?.birthYear &&
    activeProfile?.birthMonth &&
    activeProfile?.birthDay
  );

  const [sajuResult, setSajuResult] = useState<SajuResult | null>(() => {
    if (activeProfile?.isBirthInfoCompleted && activeProfile.birthYear && activeProfile.birthMonth && activeProfile.birthDay) {
      return calculateSaju(
        activeProfile.birthYear,
        activeProfile.birthMonth,
        activeProfile.birthDay,
        activeProfile.isUnknownHour ? 12 : activeProfile.birthHour,
        activeProfile.gender,
        activeProfile.calendarType
      );
    }
    return null;
  });

  useEffect(() => {
    if (activeProfile) {
      setName(activeProfile.name || '');
      setYear(activeProfile.birthYear ?? 1995);
      setMonth(activeProfile.birthMonth ?? 6);
      setDay(activeProfile.birthDay ?? 15);
      setHour(activeProfile.birthHour ?? 12);
      setIsUnknownHour(activeProfile.isUnknownHour ?? true);
      setGender(activeProfile.gender ?? 'male');
      setCalendarType(activeProfile.calendarType ?? 'solar');

      if (activeProfile.isBirthInfoCompleted && activeProfile.birthYear && activeProfile.birthMonth && activeProfile.birthDay) {
        const res = calculateSaju(
          activeProfile.birthYear,
          activeProfile.birthMonth,
          activeProfile.birthDay,
          activeProfile.isUnknownHour ? 12 : activeProfile.birthHour,
          activeProfile.gender,
          activeProfile.calendarType
        );
        setSajuResult(res);
      } else {
        setSajuResult(null);
      }
    }
  }, [activeProfile]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    saveProfile({
      id: activeProfileId || undefined,
      name: name.trim(),
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      birthHour: isUnknownHour ? 12 : hour,
      isUnknownHour,
      gender,
      calendarType,
    });

    const result = calculateSaju(year, month, day, isUnknownHour ? 12 : hour, gender, calendarType);
    setSajuResult(result);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#10b981'],
    });
  };

  const getElementBadgeColor = (el: FiveElement) => {
    switch (el) {
      case '목': return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case '화': return 'bg-red-950/60 text-red-300 border-red-500/40';
      case '토': return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case '금': return 'bg-slate-800/80 text-slate-200 border-slate-400/40';
      case '수': return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Introduction Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e172e] border border-amber-500/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-kr">정통 사주팔자(四柱八字) & 오행 분석</h1>
              <p className="text-xs sm:text-sm text-slate-400">생년월일시로 풀어보는 천명과 오행 에너지 균형</p>
            </div>
          </div>

          {profiles.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-slate-400 shrink-0 font-medium">대상:</span>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    p.id === activeProfileId
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {p.label} ({p.name || '미입력'})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="mt-6 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            {/* Calendar Type */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> 구분
              </label>
              <select
                value={calendarType}
                onChange={(e) => setCalendarType(e.target.value as 'solar' | 'lunar')}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              >
                <option value="solar">양력</option>
                <option value="lunar">음력</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">출생 연도</label>
              <input
                type="number"
                min="1930"
                max="2030"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            {/* Month */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">출생 월</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>

            {/* Day */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">출생 일</label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}일</option>
                ))}
              </select>
            </div>

            {/* Hour with Unknown toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> 시(時)
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUnknownHour}
                    onChange={(e) => {
                      setIsUnknownHour(e.target.checked);
                      if (e.target.checked) setHour(12);
                    }}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-[10px] text-amber-300">12시</span>
                </label>
              </div>
              <select
                disabled={isUnknownHour}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none disabled:opacity-60"
              >
                <option value={0}>자시 (23:30 ~ 01:30)</option>
                <option value={2}>축시 (01:30 ~ 03:30)</option>
                <option value={4}>인시 (03:30 ~ 05:30)</option>
                <option value={6}>묘시 (05:30 ~ 07:30)</option>
                <option value={8}>진시 (07:30 ~ 09:30)</option>
                <option value={10}>사시 (09:30 ~ 11:30)</option>
                <option value={12}>오시 (11:30 ~ 13:30 / 12시)</option>
                <option value={14}>미시 (13:30 ~ 15:30)</option>
                <option value={16}>신시 (15:30 ~ 17:30)</option>
                <option value={18}>유시 (17:30 ~ 19:30)</option>
                <option value={20}>술시 (19:30 ~ 21:30)</option>
                <option value={22}>해시 (21:30 ~ 23:30)</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" /> 성별
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-700">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2 text-xs font-bold transition-all ${gender === 'male' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                >
                  남
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2 text-xs font-bold transition-all ${gender === 'female' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                >
                  여
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isUnknownHour ? '※ 태어난 시각을 모를 때는 12시(오시)를 기준으로 감정합니다.' : '※ 입력하신 시진을 바탕으로 시주(時柱)가 정밀 분석됩니다.'}
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>사주원국 정밀 분석하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* If birth info is NOT yet submitted */}
      {!hasBirthInfo || !sajuResult ? (
        <div className="p-10 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-serif-kr">
            사주 원국 분석 대기 중
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            상단 폼에 <strong>이름과 생년월일시</strong>를 입력하시고 [사주원국 정밀 분석하기] 버튼을 누르시면, 사주팔자 8글자와 오행 에너지 밸런스 결과가 즉시 산출됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* Saju 4 Pillars Table (四柱八字) */}
          <div className="rounded-3xl bg-slate-900/70 border border-amber-500/20 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-white font-serif-kr flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                {name}님의 사주 원국표 (四柱原局表)
              </h2>
              <button
                type="button"
                onClick={openReportModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 hover:from-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="정통 사주 & 종합 운세 전체 리포트 PDF 다운로드"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>정통 사주 전체 리포트 PDF 다운로드</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {/* Hour Pillar */}
              <div className="p-3 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700">
                <span className="text-xs font-bold text-slate-400">시주(時柱)</span>
                <p className="text-[10px] text-slate-500 mb-2">말년 / 자녀운</p>
                <div className={`p-2.5 rounded-xl border mb-2 ${getElementBadgeColor(sajuResult.fourPillars.hour.stemElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block">{sajuResult.fourPillars.hour.stemHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.hour.stem} ({sajuResult.fourPillars.hour.stemElement})</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${getElementBadgeColor(sajuResult.fourPillars.hour.branchElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block">{sajuResult.fourPillars.hour.branchHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.hour.branch} ({sajuResult.fourPillars.hour.branchAnimal})</span>
                </div>
              </div>

              {/* Day Pillar (Day Master) */}
              <div className="p-3 sm:p-5 rounded-2xl bg-amber-950/20 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10">
                <div className="inline-block px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black mb-1">
                  본인(나)
                </div>
                <span className="text-xs font-bold text-amber-300 block">일주(日柱)</span>
                <p className="text-[10px] text-amber-400/80 mb-2">중년 / 배우자운</p>
                <div className={`p-2.5 rounded-xl border mb-2 ${getElementBadgeColor(sajuResult.fourPillars.day.stemElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block text-amber-200">{sajuResult.fourPillars.day.stemHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.day.stem} ({sajuResult.fourPillars.day.stemElement})</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${getElementBadgeColor(sajuResult.fourPillars.day.branchElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block text-amber-200">{sajuResult.fourPillars.day.branchHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.day.branch} ({sajuResult.fourPillars.day.branchAnimal})</span>
                </div>
              </div>

              {/* Month Pillar */}
              <div className="p-3 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700">
                <span className="text-xs font-bold text-slate-400">월주(月柱)</span>
                <p className="text-[10px] text-slate-500 mb-2">청년 / 사회운</p>
                <div className={`p-2.5 rounded-xl border mb-2 ${getElementBadgeColor(sajuResult.fourPillars.month.stemElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block">{sajuResult.fourPillars.month.stemHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.month.stem} ({sajuResult.fourPillars.month.stemElement})</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${getElementBadgeColor(sajuResult.fourPillars.month.branchElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block">{sajuResult.fourPillars.month.branchHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.month.branch} ({sajuResult.fourPillars.month.branchAnimal})</span>
                </div>
              </div>

              {/* Year Pillar */}
              <div className="p-3 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700">
                <span className="text-xs font-bold text-slate-400">연주(年柱)</span>
                <p className="text-[10px] text-slate-500 mb-2">초년 / 조상운</p>
                <div className={`p-2.5 rounded-xl border mb-2 ${getElementBadgeColor(sajuResult.fourPillars.year.stemElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block">{sajuResult.fourPillars.year.stemHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.year.stem} ({sajuResult.fourPillars.year.stemElement})</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${getElementBadgeColor(sajuResult.fourPillars.year.branchElement)}`}>
                  <span className="text-2xl sm:text-3xl font-black font-serif-kr block">{sajuResult.fourPillars.year.branchHanja}</span>
                  <span className="text-xs font-bold">{sajuResult.fourPillars.year.branch} ({sajuResult.fourPillars.year.branchAnimal})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Five Elements (오행) Balance & Distribution */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-serif-kr flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {name}님의 오행(五行) 에너지 분포 (총 8자)
              </h2>
              <span className="text-xs text-slate-400">목·화·토·금·수 비율</span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {(['목', '화', '토', '금', '수'] as FiveElement[]).map((el) => {
                const count = sajuResult.elementCounts[el];
                const info = ELEMENT_INFO[el];
                const percentage = Math.round((count / 8) * 100);
                return (
                  <div key={el} className="p-3 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center flex flex-col justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block mb-0.5">{info.name}</span>
                      <span className="text-xs text-slate-400">{info.color}</span>
                    </div>
                    <div className="my-3">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400 font-cinzel">{count}</span>
                      <span className="text-xs text-slate-400">개</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%`, backgroundColor: info.hex }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalized Interpretation & Day Master Reading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-slate-900/70 border border-amber-500/20 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white font-serif-kr text-base">
                  나를 상징하는 기운: {sajuResult.dayMaster.title}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {sajuResult.natureAnalysis}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white font-serif-kr text-base">
                  오행 보완 맞춤 개운 처방전
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {sajuResult.fortuneAdvice}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">추천 색상</span>
                    <span className="font-bold text-white">{sajuResult.remedyColor}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                  <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">추천 음식</span>
                    <span className="font-bold text-white">{sajuResult.remedyFood}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
