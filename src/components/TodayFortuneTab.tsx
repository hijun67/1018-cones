import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SAMPLE_TODAY_FORTUNE } from '../data/fortuneData';
import { calculateSaju } from '../utils/sajuCalculator';
import { useUser } from '../context/UserContext';
import { 
  Sparkles, Coins, Heart, Briefcase, Activity, Clock, Compass, Coffee, 
  Gift, Share2, Check, RefreshCw, User, Lock, Unlock, Plus, Trash2, ArrowUpRight, AlertCircle, CheckCircle2,
  AlertTriangle, ShieldAlert, ChevronDown, Users, LogOut, FileText
} from 'lucide-react';
import { UserRound } from 'lucide-react';

export const TodayFortuneTab: React.FC = () => {
  const { 
    profiles, 
    activeProfile, 
    activeProfileId, 
    setActiveProfileId, 
    saveProfile, 
    createNextAcquaintance, 
    deleteProfile, 
    openGoogleModal, 
    openMyInfoModal,
    openReportModal,
    signOut,
    clearAllDataAndCache,
    isRegistered,
    currentGoogleEmail,
    restoredNotice,
    clearRestoredNotice,
  } = useUser();

  // Registration / Edit Form inputs
  const [formName, setFormName] = useState('');
  const [formYear, setFormYear] = useState<number>(1995);
  const [formMonth, setFormMonth] = useState<number>(7);
  const [formDay, setFormDay] = useState<number>(7);
  const [formHour, setFormHour] = useState<number>(12);
  const [formIsUnknownHour, setFormIsUnknownHour] = useState<boolean>(true);
  const [formGender, setFormGender] = useState<'male' | 'female'>('male');
  const [formCalendarType, setFormCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [formRelationship, setFormRelationship] = useState<string>('본인');

  const [fortune, setFortune] = useState(SAMPLE_TODAY_FORTUNE);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if active profile has submitted birth info
  const hasBirthInfo = Boolean(
    activeProfile?.isBirthInfoCompleted &&
    activeProfile?.birthYear &&
    activeProfile?.birthMonth &&
    activeProfile?.birthDay
  );

  const [showForm, setShowForm] = useState(!hasBirthInfo);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Sync form inputs when active profile changes
  useEffect(() => {
    if (activeProfile) {
      setFormName(activeProfile.name || '');
      setFormYear(activeProfile.birthYear ?? 1995);
      setFormMonth(activeProfile.birthMonth ?? 7);
      setFormDay(activeProfile.birthDay ?? 7);
      setFormHour(activeProfile.birthHour ?? 12);
      setFormIsUnknownHour(activeProfile.isUnknownHour ?? true);
      setFormGender(activeProfile.gender ?? 'male');
      setFormCalendarType(activeProfile.calendarType ?? 'solar');
      setFormRelationship(activeProfile.relationship || '본인');

      // CRITICAL: ONLY compute and show fortune if birth info is explicitly completed!
      if (activeProfile.isBirthInfoCompleted && activeProfile.birthYear && activeProfile.birthMonth && activeProfile.birthDay) {
        setShowForm(false);

        // Compute personalized fortune based on profile Saju
        const saju = calculateSaju(
          activeProfile.birthYear,
          activeProfile.birthMonth,
          activeProfile.birthDay,
          activeProfile.isUnknownHour ? 12 : activeProfile.birthHour,
          activeProfile.gender,
          activeProfile.calendarType
        );

        // Deterministic personalized seed
        const seed = (activeProfile.birthYear * 7 + activeProfile.birthMonth * 13 + activeProfile.birthDay) % 15;
        const personalizedScore = 85 + seed;
        
        const customNumbers = [
          ((seed * 3) % 45) + 1,
          ((seed * 7 + 5) % 45) + 1,
          ((seed * 11 + 12) % 45) + 1,
          ((seed * 13 + 23) % 45) + 1,
          ((seed * 17 + 31) % 45) + 1,
          ((seed * 19 + 41) % 45) + 1,
        ].sort((a, b) => a - b);

        setFortune({
          date: '2026년 10월 1일 (목)',
          totalScore: personalizedScore,
          title: `${activeProfile.name}님의 오늘 운세 - ${saju.dayMaster.title}의 기운이 융성하는 길일`,
          summary: `${activeProfile.name}님의 사주 일간(${saju.dayMaster.stem})과 2026년 丙午年(병오년) 오늘 날짜의 일진이 만나, 오행 중 '${saju.dominantElement}'의 기운이 강력하게 추동력을 실어줍니다. ${saju.natureAnalysis}`,
          easySummary: `${activeProfile.name}님, 오늘은 혼자 모든 짐을 짊어지려 하지 말고 주변에 손을 내밀면 일이 시원하게 풀리는 날이에요! 특히 오후 시간에 유익한 제안이나 생각지 못한 용돈·성과가 깃들 수 있습니다. 다만 기분이 너무 좋아져서 충동구매를 하거나 가까운 사람에게 말을 툭 던져 상처를 주지 않도록 조심하세요.`,
          elements: {
            wealth: {
              score: Math.min(100, personalizedScore + 3),
              easyText: '돈 들어올 구멍은 생기지만, 기분파로 크게 쓸 위험이 있으니 5만 원 이상 지출은 내일로 미루세요.',
              text: `${activeProfile.name}님의 사주에 내재된 재물운이 오늘 날짜의 금전 기운과 부합하여 막힘없는 자금 순환이 일어납니다. 본업에서의 성과 보너스나 작은 재테크, 뜻밖의 할인 혜택 등 실속 있는 금전적 이익을 기대할 수 있는 날입니다. 그러나 수중에 돈이 돌기 시작하면 마음이 느슨해져 지인의 달콤한 투자 유혹에 넘어가거나 충동결제를 감행하기 쉽습니다. 따라서 오늘 얻은 잉여 자금은 즉시 저축으로 묶어두고 계획에 없던 지출은 철저히 통제해야만 온전한 부(富)로 축적됩니다.`,
              warning: '주변 지인의 달콤한 투자 유혹이나 온라인 쇼핑의 마감 임박 할인 광고에 이끌려 필요 없는 물건을 충동결제할 위험이 큽니다.',
              advice: '오늘 생기는 잉여 자금은 곧바로 비상금 통장이나 안전 저축으로 묶어두시고, 5만 원 이상의 비필수 지출은 장바구니에 담아둔 채 내일 다시 결제 여부를 결정하세요.',
            },
            love: {
              score: Math.max(75, personalizedScore - 4),
              easyText: '서로 마음은 통하지만 사소한 말 한마디로 오해가 생길 수 있으니, 서운함은 직설적으로 따지지 마세요.',
              text: `닫혀 있던 마음의 문이 활짝 열리고 상대방과 진솔한 정서적 교감을 나눌 수 있는 따뜻한 날입니다. 싱글인 경우 취미 생활이나 친숙한 모임에서 평소와 다른 매력을 풍기며 호감 어린 눈길을 받을 수 있습니다. 연인이나 배우자와는 사소한 배려 한마디로 지난 오해를 사르르 녹이고 깊은 신뢰를 다질 수 있습니다. 다만 서로 너무 편해진 나머지 상대방의 수고를 당연하게 여기고 과거의 서운했던 기억을 불쑥 꺼내어 분위기를 얼어붙게 만들 위험이 있습니다.`,
              warning: '상대방의 사소한 말투나 표정에 예민하게 반응하여 과거의 섭섭한 기억을 끄집어내 분위기를 얼어붙게 만들 위험이 있습니다.',
              advice: '서운한 점이 느껴지더라도 그 자리에서 따지기보다는 "당신이 이렇게 해주면 참 고마울 것 같아"라는 긍정적인 부탁의 말로 순화하여 표현하세요.',
            },
            career: {
              score: Math.min(99, personalizedScore + 2),
              easyText: '머리 회전과 아이디어는 최고지만, 서두르다 중요한 서류 숫자를 틀릴 수 있으니 2번 정독하세요.',
              text: `두뇌 회전이 맑고 명쾌하여 오랫동안 풀리지 않던 까다로운 업무나 학업 과제의 돌파구를 찾아냅니다. 중요한 회의나 발표, 제안서 제출, 계약 체결 등 결단력이 필요한 순간에 확실하게 본인의 실력을 증명할 수 있습니다. 하지만 본인의 자신감이 너무 앞서 동료들의 신중한 반론을 무시하거나 사소한 오타, 첨부파일 누락 등 디테일한 부분에서 잔실수를 저지를 위험이 있습니다. 독단적으로 밀어붙이지 말고 주변 동료들과 공유하며 크로스체크를 진행해야 명예가 온전히 보전됩니다.`,
              warning: '자신감이 앞서 서류의 핵심 조항이나 일정, 이메일 수신자 명단 등을 대충 확인하고 넘어가다 불필요한 번복을 겪을 위험이 있습니다.',
              advice: '중요한 문서는 제출하기 전 반드시 두 번 이상 눈으로 소리 내어 정독하시고, 일이 잘 풀렸을 때는 "함께해 준 동료들 덕분"이라고 공을 돌리세요.',
            },
            health: {
              score: Math.max(80, personalizedScore - 2),
              easyText: '몸 컨디션은 활기차지만, 과신하고 늦게까지 무리하면 뒷목 결림이나 급체가 올 수 있으니 온수를 자주 드세요.',
              text: `생체 리듬이 안정적이며 활력이 넘쳐 아침부터 개운한 기분으로 하루의 일정을 소화할 수 있습니다. 피로 누적이 덜하고 집중력이 오래 유지되므로 고도의 몰입이 필요한 작업을 진행하기에 최적입니다. 그러나 컨디션이 좋다고 하여 자신의 체력을 과신하고 식사를 제때 챙기지 않거나 무리한 야근을 자처할 수 있습니다. 모니터를 장시간 응시하다 뒷목 결림, 편두통, 식후 급체로 인한 속 쓰림이 발생할 위험이 있으니 적절한 휴식이 필수적입니다.`,
              warning: '모니터나 스마트폰을 장시간 들여다보다 뒷목 당김이나 편두통, 식후 급체로 인한 속 쓰림이 발생할 위험이 있습니다.',
              advice: `1시간마다 가볍게 목과 어깨를 돌려주는 3분 스트레칭을 잊지 마시고, 추천 음식인 ${saju.remedyFood}을 섭취하고 ${saju.remedyColor} 계열의 소품을 소지하여 오행의 기운을 다스리세요.`,
            },
          },
          hourlyFlow: {
            morning: {
              time: '06:00 ~ 12:00',
              title: '맑은 영감과 순조로운 출발',
              narrative: `${activeProfile.name}님의 사주에 상쾌한 목(木)과 금(金)의 기운이 스며들어 하루의 시작이 가볍고 명쾌합니다. 오전 중에는 복잡한 서류 정리나 두뇌를 써야 하는 중요한 기획 업무를 우선적으로 처리하세요. 단, 출근길이나 이동 시 마음이 급해 소지품을 흘리거나 발을 헛디딜 수 있으니 평소보다 10분 여유 있게 출발하세요.`,
            },
            afternoon: {
              time: '12:00 ~ 18:00',
              title: '오늘의 황금 피크 시간대',
              narrative: `하루 중 기운이 가장 왕성하게 뻗어 나가는 핵심 시간대로 재물과 성취의 운이 동시에 활성화됩니다. 중요한 협상, 미팅, 결재 요청, 제안 발표는 이 황금 시간대에 배치하여 적극적으로 밀어붙이세요. 단, 매사가 순조롭다고 하여 주변 사람들에게 자랑하거나 말을 가볍게 던지면 사소한 시샘을 살 수 있으니 겸양을 지키세요.`,
            },
            evening: {
              time: '18:00 ~ 22:00',
              title: '관계의 회복과 감정의 여유',
              narrative: `바쁜 일과를 마무리하고 긴장이 풀리며 소중한 사람들과의 정겨운 대화와 맛있는 식사가 마음을 채워주는 시간입니다. 그동안 소식 전하지 못했던 친구나 가족에게 따뜻한 안부 메시지를 건네면 예상 밖의 기쁜 소식이 되돌아옵니다. 다만 외식이나 모임에서 기분에 취해 지출 한도를 훌쩍 넘기지 않도록 스스로 자제선을 그어두어야 합니다.`,
            },
            night: {
              time: '22:00 ~ 06:00',
              title: '심신 정화와 숙면의 충전',
              narrative: `낮 동안 소모했던 체력과 감정을 음(陰)의 고요한 기운으로 정화하고 내일을 위해 재충전하는 소중한 밤입니다. 잠들기 30분 전에는 스마트폰을 멀리 두고 따뜻한 차를 마시며 하루 동안 감사했던 일 한 가지를 떠올려보세요. 늦은 시간 야식을 먹거나 무거운 잡념을 침대까지 가져가면 수면 리듬이 깨져 내일 기운을 떨어뜨릴 수 있습니다.`,
            },
          },
          luckyElements: {
            number: customNumbers,
            color: {
              name: saju.remedyColor,
              hex: saju.lackingElement === '목' ? '#10b981' : saju.lackingElement === '화' ? '#ef4444' : saju.lackingElement === '토' ? '#f59e0b' : saju.lackingElement === '금' ? '#94a3b8' : '#3b82f6',
              desc: `사주에서 보완이 필요한 '${saju.lackingElement}'의 기운을 보강해주는 색상`,
            },
            direction: saju.lackingElement === '목' ? '동쪽' : saju.lackingElement === '화' ? '남쪽' : saju.lackingElement === '토' ? '중앙/남서' : saju.lackingElement === '금' ? '서쪽' : '북쪽',
            food: saju.remedyFood,
            animal: '백호 (강인한 수호와 추진력의 기운)',
            item: '황동 열쇠고리, 금빛 만년필 또는 원석 팔찌',
          },
          aphorism: {
            phrase: '적선지가 필유여경(積善之家 必有餘慶)',
            source: '주역(周易) 문언전',
            meaning: '선을 쌓은 집안에는 반드시 대를 이어 경사스러운 복이 넘쳐난다. 오늘 베푼 작은 친절이 내일의 거대한 행운으로 되돌아옵니다.',
          },
        });
      } else {
        setShowForm(true);
      }
    } else {
      setShowForm(true);
    }
  }, [activeProfile]);

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
    });
  };

  const handleShare = () => {
    if (!hasBirthInfo) {
      alert('이름과 생년월일시를 먼저 입력하시면 맞춤 운세를 공유하실 수 있습니다.');
      return;
    }
    const person = activeProfile ? `${activeProfile.name}님의 ` : '';
    navigator.clipboard.writeText(
      `[운수 - ${person}오늘의 운세] 점수: ${fortune.totalScore}점! "${fortune.title}"\n행운 번호: ${fortune.luckyElements.number.join(', ')}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReroll = () => {
    if (!hasBirthInfo) return;
    setIsRefreshing(true);
    setTimeout(() => {
      handleCelebrate();
      setIsRefreshing(false);
    }, 400);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('이름(성함)을 입력해주세요.');
      return;
    }

    if (!formYear || !formMonth || !formDay) {
      alert('생년월일을 정확히 입력해주세요.');
      return;
    }

    saveProfile({
      id: activeProfileId || undefined,
      name: formName.trim(),
      gender: formGender,
      birthYear: formYear,
      birthMonth: formMonth,
      birthDay: formDay,
      birthHour: formIsUnknownHour ? 12 : formHour,
      isUnknownHour: formIsUnknownHour,
      calendarType: formCalendarType,
      relationship: formRelationship,
    });

    setShowForm(false);
    handleCelebrate();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Restored Google Account Notice Banner */}
      {restoredNotice && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-3 text-emerald-200 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="font-semibold">{restoredNotice}</p>
          </div>
          <button
            onClick={clearRestoredNotice}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-colors shrink-0"
          >
            확인
          </button>
        </div>
      )}

      {/* Top Banner: Notice & Mandatory Birth Info Form */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#141b2d] to-[#1d162a] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>정통 사주 오행 기반 이름·생년월일시 입력 필수</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-kr">
              {hasBirthInfo ? `${activeProfile?.name}님의 맞춤 사주 운수 프로필` : '내 정보(이름, 생년월일시) 입력 & 운세 산출'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {hasBirthInfo 
                ? `${activeProfile?.label} (${activeProfile?.birthYear}년 ${activeProfile?.birthMonth}월 ${activeProfile?.birthDay}일 ${activeProfile?.isUnknownHour ? '12시(정오) 기준' : `${activeProfile?.birthHour}시`} 출생) 맞춤 사주 분석 중` 
                : '※ 중요: 이메일 저장만으로는 운세가 나오지 않습니다. 반드시 본인의 이름과 생년월일시를 입력하셔야 나만의 진짜 운수·운세가 계산되어 공개됩니다.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeProfile?.isGoogleAuth || currentGoogleEmail ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentGoogleEmail || activeProfile?.googleEmail}</span>
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
                  title="로그아웃 시 내정보가 화면에서 감춰집니다"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openGoogleModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md shadow-white/10 transition-all hover:scale-105 active:scale-95"
              >
                <UserRound className="w-4 h-4 text-slate-900" />
                <span>내 정보 저장</span>
              </button>
            )}

            {hasBirthInfo && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>{showForm ? '정보 폼 접기' : '내 정보 수정 / 지인 추가'}</span>
              </button>
            )}

            {isRegistered && (
              <button
                onClick={openMyInfoModal}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                title="내 정보와 내가 추가한 지인 정보 관리 창 열기"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>내정보 창 (본인 & 지인)</span>
              </button>
            )}

            <button
              onClick={openReportModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 hover:from-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="사주 & 오늘의 운세 전체 리포트 PDF 다운로드"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>전체 리포트 PDF</span>
            </button>
          </div>
        </div>

        {/* 운세 대상 선택 Bar (내정보2를 빼고 내정보 클릭 시 본인정보 및 지인추가한 정보 표시) */}
        {isRegistered && (
          <div className="pt-3 pb-1 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-amber-500/50 text-xs font-bold text-white transition-all shadow-md group"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300">운세 대상:</span>
                <span className="text-amber-300 font-bold underline decoration-amber-400/50 underline-offset-4">
                  {activeProfile?.relationship === '본인'
                    ? `내 정보 (${activeProfile?.name || '본인'})`
                    : `${activeProfile?.name || '지인'} (${activeProfile?.relationship || '지인'})`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover Dropdown: 본인정보 & 지인추가한 정보 */}
              {isProfileMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-84 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl p-3.5 z-40 animate-fadeIn space-y-3">
                  <div className="px-1 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 font-serif-kr flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      운세 대상 선택
                    </span>
                    <span className="text-[10px] text-slate-400">총 {profiles.length}명 등록됨</span>
                  </div>

                  {/* 1. 본인 정보 (내 정보) */}
                  <div>
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-[11px] font-bold text-slate-400">👤 본인 정보</span>
                      <span className="text-[10px] text-amber-400 font-semibold">내 정보</span>
                    </div>
                    {profiles[0] && (
                      <div
                        onClick={() => {
                          setActiveProfileId(profiles[0].id);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                          activeProfileId === profiles[0].id
                            ? 'bg-amber-500/20 border-2 border-amber-400 text-white shadow-sm'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{profiles[0].name || '본인'}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold">
                                내 정보 (본인)
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              {profiles[0].isBirthInfoCompleted && profiles[0].birthYear
                                ? `${profiles[0].birthYear}년 ${profiles[0].birthMonth}월 ${profiles[0].birthDay}일`
                                : '생년월일 미입력'}
                            </p>
                          </div>
                        </div>
                        {activeProfileId === profiles[0].id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. 지인 추가한 정보 */}
                  <div>
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-[11px] font-bold text-slate-400">👥 추가된 지인 정보</span>
                      <span className="text-[10px] text-slate-400">{profiles.slice(1).length}명</span>
                    </div>
                    {profiles.slice(1).length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center text-[11px] text-slate-400">
                        추가된 지인이 없습니다. 아래 버튼으로 지인을 추가해보세요.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar pr-1">
                        {profiles.slice(1).map((p, idx) => {
                          const isSelected = activeProfileId === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setActiveProfileId(p.id);
                                setIsProfileMenuOpen(false);
                              }}
                              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-amber-500/20 border-2 border-amber-400 text-white shadow-sm'
                                  : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                                  {p.name ? p.name.charAt(0) : idx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white">{p.name || `지인 ${idx + 1}`}</span>
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-semibold">
                                      {p.relationship || '지인'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">
                                    {p.isBirthInfoCompleted && p.birthYear
                                      ? `${p.birthYear}년 ${p.birthMonth}월 ${p.birthDay}일`
                                      : '생년월일 미입력'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProfile(p.id);
                                  }}
                                  className="p-1 hover:text-red-400 text-slate-500 transition-colors"
                                  title="지인 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. 내정보 & 지인 관리창 열기 & 새 지인 추가 버튼 */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openMyInfoModal();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>내정보 & 지인 관리창 열기</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newOne = createNextAcquaintance();
                        setFormName(newOne.name);
                        setShowForm(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ 새 지인 정보 추가하기</span>
                    </button>
                  </div>

                  {/* 4. 로그아웃 및 캐시 삭제 */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="화면에서 내 정보를 숨기고 로그아웃"
                    >
                      <LogOut className="w-3 h-3 text-slate-400" />
                      <span>로그아웃</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        clearAllDataAndCache();
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-300 border border-red-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="브라우저에 저장된 모든 캐시와 내정보 완전 삭제"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>캐시 삭제</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {activeProfile?.relationship === '본인' ? '👤 본인 운세 열람 중' : `👥 지인(${activeProfile?.name || '지인'}) 운세 열람 중`}
              </span>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>{showForm ? '정보 폼 접기' : '내 정보 수정 / 지인 추가'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Input Form (Required to view fortune) */}
        {(showForm || !hasBirthInfo) && (
          <form onSubmit={handleSubmitProfile} className="mt-5 p-5 rounded-2xl bg-slate-800/60 border border-amber-500/40 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <span className="text-xs sm:text-sm font-bold text-amber-400 font-serif-kr flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                {activeProfile ? `${activeProfile.label}의 이름과 생년월일시 입력 (필수)` : '이름과 생년월일시 입력 후 운세 확인하기'}
              </span>
              <span className="text-[11px] text-slate-300">
                입력 즉시 사주 오행 계산 및 운세 공개
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  이름 (성함) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">관계 구분</label>
                <select
                  value={formRelationship}
                  onChange={(e) => setFormRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                >
                  <option value="본인">본인 (나)</option>
                  <option value="가족">가족 (부모/형제)</option>
                  <option value="배우자/연인">배우자 / 연인</option>
                  <option value="자녀">자녀</option>
                  <option value="친구">친구</option>
                  <option value="동료/지인">동료 / 지인</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">성별</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setFormGender('male')}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${formGender === 'male' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                  >
                    남성
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormGender('female')}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${formGender === 'female' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                  >
                    여성
                  </button>
                </div>
              </div>

              {/* Calendar Type */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">양력 / 음력</label>
                <select
                  value={formCalendarType}
                  onChange={(e) => setFormCalendarType(e.target.value as 'solar' | 'lunar')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                >
                  <option value="solar">양력 (Solar)</option>
                  <option value="lunar">음력 (Lunar)</option>
                </select>
              </div>
            </div>

            {/* Birth Date & Hour */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Year */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  출생 연도 <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1920"
                  max="2030"
                  required
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                />
              </div>

              {/* Month */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  출생 월 <span className="text-red-400">*</span>
                </label>
                <select
                  value={formMonth}
                  onChange={(e) => setFormMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>

              {/* Day */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  출생 일 <span className="text-red-400">*</span>
                </label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}일</option>
                  ))}
                </select>
              </div>

              {/* Hour with "Unknown" checkbox */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">태어난 시(時)</label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsUnknownHour}
                      onChange={(e) => {
                        setFormIsUnknownHour(e.target.checked);
                        if (e.target.checked) setFormHour(12);
                      }}
                      className="accent-amber-500 rounded"
                    />
                    <span className="text-[11px] text-amber-300">모름(12시기준)</span>
                  </label>
                </div>
                <select
                  disabled={formIsUnknownHour}
                  value={formHour}
                  onChange={(e) => setFormHour(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none disabled:opacity-60"
                >
                  <option value={0}>자시 (23:30 ~ 01:30)</option>
                  <option value={2}>축시 (01:30 ~ 03:30)</option>
                  <option value={4}>인시 (03:30 ~ 05:30)</option>
                  <option value={6}>묘시 (05:30 ~ 07:30)</option>
                  <option value={8}>진시 (07:30 ~ 09:30)</option>
                  <option value={10}>사시 (09:30 ~ 11:30)</option>
                  <option value={12}>오시 (11:30 ~ 13:30 / 12시 정오)</option>
                  <option value={14}>미시 (13:30 ~ 15:30)</option>
                  <option value={16}>신시 (15:30 ~ 17:30)</option>
                  <option value={18}>유시 (17:30 ~ 19:30)</option>
                  <option value={20}>술시 (19:30 ~ 21:30)</option>
                  <option value={22}>해시 (21:30 ~ 23:30)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-amber-200/90 font-medium">
                {formIsUnknownHour ? '※ 태어난 시각을 모를 경우 12:00 정오 기준 사주가 적용됩니다.' : '※ 입력하신 시진을 반영하여 사주팔자 시주(時柱)를 계산합니다.'}
              </span>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>나의 정보 입력하고 운수·운세 확인하기</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Hero Banner: Today's Fortune Master Score */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#151c2e] to-[#1e172e] border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-500/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{hasBirthInfo ? `${activeProfile?.name}님의 실시간 종합 기운` : '이름·생년월일시 입력 대기 중'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif-kr tracking-tight leading-snug">
              {hasBirthInfo ? fortune.title : '이름과 생년월일시를 입력하면 운세가 산출됩니다'}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {hasBirthInfo 
                ? fortune.summary 
                : '이메일 저장만으로는 개인의 운수가 계산되지 않습니다. 상단 폼에 본인의 이름, 생년월일, 태어난 시(모르면 12시기준)를 입력하시면 회원님의 사주 오행에 맞춘 정확한 일일 운세와 분야별 지침이 펼쳐집니다.'}
            </p>

            {/* Easy Summary Callout Box (오늘 운세 - 쉬운 말표현 추가) */}
            {hasBirthInfo && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left space-y-1 shadow-inner">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  💬 오늘의 쉬운 말 요약 (한눈에 보는 하루 흐름)
                </span>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                  {fortune.easySummary}
                </p>
              </div>
            )}

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={hasBirthInfo ? handleCelebrate : () => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{hasBirthInfo ? '행운 기운 받기 (길운 축하)' : '정보 입력하고 운세 확인'}</span>
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium transition-all flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
                <span>{copied ? '복사 완료!' : '운세 공유'}</span>
              </button>
              {hasBirthInfo && (
                <button
                  onClick={handleReroll}
                  disabled={isRefreshing}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>기운 갱신</span>
                </button>
              )}
            </div>
          </div>

          {/* Radial Luck Score Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-amber-500/20 shadow-inner">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-slate-800 fill-none" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-amber-400 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={hasBirthInfo ? 264 - (264 * fortune.totalScore) / 100 : 264}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-amber-400 font-cinzel">
                  {hasBirthInfo ? fortune.totalScore : '?'}
                </span>
                <span className="text-xs font-bold text-amber-200/80">운수 지수</span>
                <span className="mt-0.5 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-serif-kr">
                  {hasBirthInfo 
                    ? (fortune.totalScore >= 90 ? '운수대통(運數大通)' : fortune.totalScore >= 80 ? '중길(中吉)' : '소길(小吉)') 
                    : '입력 대기'}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              {hasBirthInfo ? `${activeProfile?.name}님의 사주 복합 지수` : '생년월일시 입력 시 계산'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Daily Life with Extended 3~4 Lines, Warnings & Remedies */}
      <div className="space-y-4">
        {!hasBirthInfo ? (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">
                  ※ 중요 안내: 이메일 저장으로는 운세가 나오지 않습니다.
                </p>
                <p className="text-slate-300 text-xs mt-0.5">
                  상단의 <strong>이름과 생년월일시(모르면 12시기준)</strong>를 입력하셔야 나만을 위한 정밀 맞춤 사주 4대 운수가 산출되어 표시됩니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1 transition-all"
            >
              <span>이름·생년월일시 입력하기</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{activeProfile?.name}님의 맞춤 운수 활성화됨:</strong> {activeProfile?.birthYear}년 {activeProfile?.birthMonth}월 {activeProfile?.birthDay}일 {activeProfile?.isUnknownHour ? '12시(정오) 기준' : `${activeProfile?.birthHour}시`} 사주팔자와 2026년 오늘 일진이 결합된 맞춤 운세입니다.
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-bold shrink-0">{activeProfile?.label}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-white font-serif-kr flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              분야별 4대 심층 운수 (길흉 및 대처법 상세 해설)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              좋은 흐름뿐만 아니라 도사린 위험 요소와 이를 피하는 구체적인 대처법까지 함께 제시합니다
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {hasBirthInfo ? `${activeProfile?.name}님 맞춤 분석` : '이름·생년월일시 입력 필요'}
          </span>
        </div>

        {/* If no birth info is entered: Blurred / Locked Cards with Call to Action */}
        {!hasBirthInfo ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 p-8 text-center bg-slate-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 filter blur-sm select-none opacity-30 pointer-events-none">
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <h3 className="font-bold text-white">재물운 (財物運)</h3>
                <p className="text-slate-400 text-xs mt-2">금전 흐름과 횡재수 분석</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <h3 className="font-bold text-white">애정운 (愛情運)</h3>
                <p className="text-slate-400 text-xs mt-2">인연과 마음의 교감 분석</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <h3 className="font-bold text-white">학업·사업운 (事業運)</h3>
                <p className="text-slate-400 text-xs mt-2">성취와 결단력 분석</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <h3 className="font-bold text-white">건강·심신운 (健康運)</h3>
                <p className="text-slate-400 text-xs mt-2">생체 활력과 안정 분석</p>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-kr mb-1">
                4대 심층 운수 잠김
              </h3>
              <p className="text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
                사주 운세는 태어난 연·월·일·시(오행)를 바탕으로 계산됩니다.<br />
                상단 폼에 <strong>이름과 생년월일시</strong>를 입력하시면 4대 심층 운세가 즉시 산출됩니다.
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>이름·생년월일시 입력하고 운세 확인</span>
              </button>
            </div>
          </div>
        ) : (
          /* Unlocked Cards with 3~4 Lines Text + Warning + Advice */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Wealth */}
            <div className="rounded-2xl bg-slate-900/70 border border-amber-500/20 p-5 hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/5 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Coins className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 font-serif-kr text-base">재물운 (財物運)</h3>
                    <span className="text-xs text-amber-400/90">금전 흐름과 수입·지출</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-cinzel">{fortune.elements.wealth.score}</span>
                  <span className="text-xs text-slate-400">점</span>
                </div>
              </div>

              {/* Easy-to-understand 1-line layman summary */}
              {fortune.elements.wealth.easyText && (
                <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/95 font-medium flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0 font-bold">💬 쉬운 말:</span>
                  <span>{fortune.elements.wealth.easyText}</span>
                </div>
              )}

              {/* 3~4 lines of narrative (good & bad aspects) */}
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {fortune.elements.wealth.text}
              </p>

              {/* Warning Box */}
              <div className="p-3 rounded-xl bg-red-950/25 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">주의할 점 (위험 요소): </strong>
                  <span>{fortune.elements.wealth.warning}</span>
                </div>
              </div>

              {/* Advice Box */}
              <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">조심 및 액막이 대처법: </strong>
                  <span>{fortune.elements.wealth.advice}</span>
                </div>
              </div>
            </div>

            {/* Love */}
            <div className="rounded-2xl bg-slate-900/70 border border-pink-500/20 p-5 hover:border-pink-500/40 transition-all hover:shadow-lg hover:shadow-pink-500/5 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 font-serif-kr text-base">애정운 (愛情運)</h3>
                    <span className="text-xs text-pink-400/90">인연과 마음의 교감</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-pink-400 font-cinzel">{fortune.elements.love.score}</span>
                  <span className="text-xs text-slate-400">점</span>
                </div>
              </div>

              {/* Easy-to-understand 1-line layman summary */}
              {fortune.elements.love.easyText && (
                <div className="px-3 py-2 rounded-xl bg-pink-500/10 border border-pink-500/25 text-xs text-pink-200/95 font-medium flex items-start gap-1.5">
                  <span className="text-pink-400 shrink-0 font-bold">💬 쉬운 말:</span>
                  <span>{fortune.elements.love.easyText}</span>
                </div>
              )}

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {fortune.elements.love.text}
              </p>

              <div className="p-3 rounded-xl bg-red-950/25 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">주의할 점 (갈등 소지): </strong>
                  <span>{fortune.elements.love.warning}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-pink-950/25 border border-pink-500/30 text-xs text-pink-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-pink-400">조심 및 화합 대처법: </strong>
                  <span>{fortune.elements.love.advice}</span>
                </div>
              </div>
            </div>

            {/* Career & Study */}
            <div className="rounded-2xl bg-slate-900/70 border border-blue-500/20 p-5 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/5 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 font-serif-kr text-base">학업·사업운 (事業運)</h3>
                    <span className="text-xs text-blue-400/90">성취와 결단력</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-400 font-cinzel">{fortune.elements.career.score}</span>
                  <span className="text-xs text-slate-400">점</span>
                </div>
              </div>

              {/* Easy-to-understand 1-line layman summary */}
              {fortune.elements.career.easyText && (
                <div className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200/95 font-medium flex items-start gap-1.5">
                  <span className="text-blue-400 shrink-0 font-bold">💬 쉬운 말:</span>
                  <span>{fortune.elements.career.easyText}</span>
                </div>
              )}

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {fortune.elements.career.text}
              </p>

              <div className="p-3 rounded-xl bg-red-950/25 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">주의할 점 (업무 실수): </strong>
                  <span>{fortune.elements.career.warning}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/25 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-400">조심 및 성공 대처법: </strong>
                  <span>{fortune.elements.career.advice}</span>
                </div>
              </div>
            </div>

            {/* Health */}
            <div className="rounded-2xl bg-slate-900/70 border border-emerald-500/20 p-5 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/5 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 font-serif-kr text-base">건강·심신운 (健康運)</h3>
                    <span className="text-xs text-emerald-400/90">생체 활력과 안정</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-cinzel">{fortune.elements.health.score}</span>
                  <span className="text-xs text-slate-400">점</span>
                </div>
              </div>

              {/* Easy-to-understand 1-line layman summary */}
              {fortune.elements.health.easyText && (
                <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-200/95 font-medium flex items-start gap-1.5">
                  <span className="text-emerald-400 shrink-0 font-bold">💬 쉬운 말:</span>
                  <span>{fortune.elements.health.easyText}</span>
                </div>
              )}

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {fortune.elements.health.text}
              </p>

              <div className="p-3 rounded-xl bg-red-950/25 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">주의할 점 (건강 위험): </strong>
                  <span>{fortune.elements.health.warning}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400">조심 및 보양 대처법: </strong>
                  <span>{fortune.elements.health.advice}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hourly Flow: Narrative Only (No Progress Bar, 3~4 Lines of Narrative) */}
      {hasBirthInfo && (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white font-serif-kr flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              오늘 하루 시간대별 기운 흐름 (서술형 심층 풀이)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              시간대별 변화하는 기운의 성격과 주의사항을 서술형으로 꼼꼼히 전해드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(fortune.hourlyFlow).map(([key, item]) => {
              const label = key === 'morning' ? '오전' : key === 'afternoon' ? '오후' : key === 'evening' ? '저녁' : '밤';
              return (
                <div key={key} className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {label} ({item.time})
                    </span>
                    <span className="text-xs font-semibold text-slate-200 font-serif-kr">
                      {item.title}
                    </span>
                  </div>
                  {/* 3~4 lines of narrative (NO progress bar) */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.narrative}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lucky Elements Section: Locked / Empty initially until birth info entered */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white font-serif-kr flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              오늘의 개운(開運) 행운 요소
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {hasBirthInfo 
                ? `${activeProfile?.name}님의 사주에 부족한 오행을 보강해주는 맞춤형 길운 아이템` 
                : '이름과 생년월일시를 입력하면 나만의 맞춤 행운 요소가 공개됩니다.'}
            </p>
          </div>
          {hasBirthInfo && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5" />
              맞춤 해금됨
            </span>
          )}
        </div>

        {/* If no birth info is entered: Display items with blurred / locked state */}
        {!hasBirthInfo ? (
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 filter blur-md select-none opacity-30 pointer-events-none">
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 mb-2 block">행운의 숫자 (로또 추천수)</span>
                <div className="flex gap-2">
                  {[7, 14, 21, 28, 33, 42].map((n, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">{n}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 mb-2 block">행운의 색상</span>
                <p className="text-sm font-bold text-white">로열 앰버 골드</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 mb-2 block">행운의 방위</span>
                <p className="text-sm font-bold text-white">남동쪽</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 mb-2 block">추천 보양 음식</span>
                <p className="text-sm font-bold text-white">버섯 전골</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 mb-2 block">수호 동물</span>
                <p className="text-sm font-bold text-white">백호</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 mb-2 block">소지하면 좋은 물건</span>
                <p className="text-sm font-bold text-white">황동 열쇠고리</p>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/75 backdrop-blur-sm rounded-2xl border border-amber-500/40">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white font-serif-kr mb-1">
                개운(開運) 행운 요소 잠김
              </h3>
              <p className="text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
                행운의 로또 번호, 맞춤 색상, 방위, 음식 등은 회원님의 사주 오행에 맞춰 정확하게 계산됩니다.
                이름과 생년월일시를 입력하시면 즉시 열람하실 수 있습니다.
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              >
                <Unlock className="w-4 h-4 text-slate-950" />
                <span>이름·생년월일시 입력하고 잠금 해제</span>
              </button>
            </div>
          </div>
        ) : (
          /* Unlocked Personalized Lucky Elements */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Lucky Numbers (Lotto) */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {activeProfile?.name}님의 맞춤 로또 추천 번호
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {fortune.luckyElements.number.map((num, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20 font-cinzel"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            {/* Lucky Color */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fortune.luckyElements.color.hex }} />
                오행 보완 행운 색상
              </span>
              <p className="text-sm font-bold text-white mb-0.5">{fortune.luckyElements.color.name}</p>
              <p className="text-xs text-slate-400">{fortune.luckyElements.color.desc}</p>
            </div>

            {/* Lucky Direction */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5" />
                기운 돋우는 행운의 방위
              </span>
              <p className="text-sm font-bold text-white">{fortune.luckyElements.direction}</p>
            </div>

            {/* Lucky Food */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <Coffee className="w-3.5 h-3.5" />
                추천 기운 보양식
              </span>
              <p className="text-sm font-bold text-white">{fortune.luckyElements.food}</p>
            </div>

            {/* Lucky Animal */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                수호 동물
              </span>
              <p className="text-sm font-bold text-white">{fortune.luckyElements.animal}</p>
            </div>

            {/* Lucky Item */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <Gift className="w-3.5 h-3.5" />
                소지하면 좋은 개운 물품
              </span>
              <p className="text-sm font-bold text-white">{fortune.luckyElements.item}</p>
            </div>
          </div>
        )}
      </div>

      {/* Daily Aphorism / Classic Wisdom */}
      <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-6 text-center space-y-2">
        <span className="text-xs font-bold text-amber-400 font-serif-kr">【 오늘의 명리 명언 】</span>
        <h3 className="text-lg sm:text-xl font-black text-amber-200 font-serif-kr tracking-wide">
          "{fortune.aphorism.phrase}"
        </h3>
        <p className="text-xs text-amber-300/80 font-medium">출처: {fortune.aphorism.source}</p>
        <p className="text-xs text-slate-300 max-w-xl mx-auto pt-1 leading-relaxed">
          {fortune.aphorism.meaning}
        </p>
      </div>
    </div>
  );
};
