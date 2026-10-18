import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TALISMAN_TEMPLATES } from '../data/fortuneData';
import { useUser } from '../context/UserContext';
import { Shield, Sparkles, Download, Check, Play, Volume2, VolumeX, CheckCircle, Clock, FastForward, Lock } from 'lucide-react';

export const TalismanTab: React.FC = () => {
  const { activeProfile } = useUser();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('wealth');
  const [personName, setPersonName] = useState<string>(activeProfile?.name || '홍길동');
  const [wishText, setWishText] = useState<string>('올 한 해 모든 일이 술술 풀리고 큰 부와 행운을 이루게 하소서');
  const [isBlessed, setIsBlessed] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Ad simulation modal state
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync person name if activeProfile changes
  useEffect(() => {
    if (activeProfile?.name) {
      setPersonName(activeProfile.name);
    }
  }, [activeProfile]);

  // Ad countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAdOpen && adSecondsLeft > 0) {
      timer = setTimeout(() => {
        setAdSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isAdOpen && adSecondsLeft === 0) {
      // Ad finished!
      setIsAdOpen(false);
      setIsBlessed(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ef4444', '#dc2626', '#f59e0b', '#fbbf24', '#ffffff'],
      });
    }
    return () => clearTimeout(timer);
  }, [isAdOpen, adSecondsLeft]);

  const currentTemplate = TALISMAN_TEMPLATES.find((t) => t.id === selectedTemplateId) || TALISMAN_TEMPLATES[0];

  const handleStartAd = () => {
    setAdSecondsLeft(30);
    setIsAdOpen(true);
  };

  const handleSkipAdForTesting = () => {
    setAdSecondsLeft(0);
  };

  const handleDownloadImage = () => {
    if (!isBlessed) {
      alert('광고 30초를 시청하신 후 영험한 기운이 충전되면 부적을 저장하실 수 있습니다.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1000; // Perfect vertical card ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background: Traditional rich yellow card base
    ctx.fillStyle = '#fde047';
    ctx.fillRect(0, 0, 600, 1000);

    // Rounded card outer border
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 10;
    ctx.strokeRect(25, 25, 550, 950);

    // Inner filigree border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, 524, 924);

    // Top Card Label
    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 運 數 秘 傳 · LUCKY TALISMAN CARD ★', 300, 75);

    // Header Talisman Command
    ctx.font = 'bold 28px serif';
    ctx.fillText('【 敕令 萬事亨通 大吉 】', 300, 120);

    // Main Hanja Glyph (Vertical Cinnabar Style - 사자성어 한 줄 표시)
    ctx.fillStyle = '#b91c1c';
    ctx.font = '900 64px serif';
    ctx.fillText(currentTemplate.hanja, 300, 260);

    // Sacred Esoteric Glyphs
    ctx.font = 'bold 36px serif';
    ctx.fillText(currentTemplate.glyph, 300, 360);

    // Middle Divider Line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 410);
    ctx.lineTo(520, 410);
    ctx.stroke();

    // Person & Wish Box
    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 24px serif';
    ctx.fillText(`소원성취자: ${personName || '대통자'}`, 300, 470);

    ctx.font = '20px serif';
    ctx.fillText(`발원: ${wishText || currentTemplate.effect}`, 300, 530);

    // Seal of Authenticity
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 3;
    ctx.strokeRect(180, 600, 240, 60);
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 22px serif';
    ctx.fillText('【 運數 靈驗認證印 】', 300, 640);

    // Secret Mantra
    ctx.font = '16px serif';
    ctx.fillStyle = '#7f1d1d';
    ctx.fillText(`진언: ${currentTemplate.mantra.slice(0, 36)}...`, 300, 740);

    // Card Footer
    ctx.font = 'bold 16px serif';
    ctx.fillText(`2026 丙午年(병오년) 대한민국 운수비전`, 300, 840);
    ctx.font = '13px serif';
    ctx.fillText(`NO. UNSU-${Date.now().toString().slice(-8)}`, 300, 875);

    const link = document.createElement('a');
    link.download = `운수_행운부적카드_${personName}_${currentTemplate.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-kr flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            한국 전통 영험 디지털 행운 부적 카드
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            광고 30초를 시청하시면 천지신명의 영험한 기운이 담긴 세로형 수호 부적 카드가 즉시 정식 발행됩니다
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isBlessed ? (
            <button
              onClick={handleStartAd}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>부적 카드 발행 (광고 30초 시청)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                부적 발행 완료 (기운 충전됨)
              </span>
              <button
                onClick={handleDownloadImage}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                {downloadSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloadSuccess ? '저장 완료!' : '부적 카드 다운로드'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Choice of Talisman & Customization */}
        <div className="lg:col-span-6 space-y-6">
          {/* Template Selectors */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">원하는 부적 카드 종류 선택</label>
            <div className="space-y-2.5">
              {TALISMAN_TEMPLATES.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                      setIsBlessed(false);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/80 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white font-serif-kr text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {tpl.title}
                      </span>
                      <span className="text-xs text-amber-400 font-bold">{tpl.hanja}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{tpl.description}</p>
                    <div className="text-[11px] text-amber-300/80 bg-slate-800/50 p-2 rounded-lg">
                      <strong>효력:</strong> {tpl.effect}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalization Inputs */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-serif-kr">소원자 맞춤 정보 기입</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">소원 올리는 분 성함</label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">마음속 간절한 소원 문구</label>
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                rows={2}
                placeholder="간절히 바라는 소망을 적으세요"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            {!isBlessed && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  현재 미발행 상태입니다. 30초 광고를 시청하면 부적 카드가 발행됩니다.
                </span>
                <button
                  type="button"
                  onClick={handleStartAd}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shrink-0"
                >
                  광고 시청
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: The Visual Talisman Vertical Card (카드 세로 모양) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>세로형 프리미엄 수호 부적 카드 (Portrait Talisman Card)</span>
            </span>
          </div>

          {/* The Vertical Card Shell */}
          <div className="relative w-full max-w-[330px] sm:max-w-[350px] aspect-[9/16] min-h-[600px] rounded-[32px] bg-gradient-to-b from-[#fffbeb] via-[#fef08a] to-[#facc15] text-red-700 border-[6px] border-amber-600/80 p-5 sm:p-6 shadow-2xl shadow-amber-500/25 flex flex-col justify-between text-center select-none overflow-hidden group transition-transform duration-300 hover:scale-[1.02]">
            {/* Traditional Korean Filigree Double Border */}
            <div className="absolute inset-2.5 border-2 border-red-700/80 pointer-events-none rounded-[24px]" />
            <div className="absolute inset-4 border border-dashed border-red-500/50 pointer-events-none rounded-[20px]" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-red-800 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-red-800 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-red-800 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-red-800 pointer-events-none" />

            {/* Subtle Metallic Shimmer Reflection */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover:translate-x-1/4 transition-transform duration-1000" />

            {/* Glowing Aura if blessed */}
            {isBlessed && (
              <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
            )}

            {/* Card Header Top */}
            <div className="relative z-10 pt-1 space-y-1">
              <div className="flex items-center justify-between px-2 text-[9px] font-bold text-red-900 tracking-wider">
                <span className="font-cinzel">CARD NO. #001</span>
                <span className="px-2 py-0.5 rounded-full bg-red-700 text-yellow-100 text-[8px] font-black">
                  【 靈驗 神符 】
                </span>
                <span className="font-serif-kr">丙午年 限量</span>
              </div>
              <span className="text-sm sm:text-base font-black text-red-900 font-serif-kr tracking-widest block pt-1">
                【 敕 令 萬 事 亨 通 】
              </span>
              <p className="text-[10px] text-red-700 font-medium">천지신명 가호 · 소원성취 비전</p>
            </div>

            {/* Main Sacred Hanja Glyph Inscription (사자성어 폰트 크기 축소 및 한 줄 표시) */}
            <div className="relative z-10 my-2 py-1">
              <span className="text-3xl sm:text-4xl font-black font-serif-kr tracking-widest drop-shadow-sm block text-red-800 whitespace-nowrap">
                {currentTemplate.hanja}
              </span>
              <span className="text-sm sm:text-base font-bold tracking-wider mt-1.5 block text-red-700 whitespace-nowrap">
                {currentTemplate.glyph}
              </span>
            </div>

            {/* Personalized Prayer Card Box */}
            <div className="relative z-10 p-3 rounded-2xl bg-amber-200/70 border border-red-600/60 text-xs space-y-1 mx-1 shadow-inner backdrop-blur-sm">
              <p className="font-black text-red-950 text-xs sm:text-sm">
                소원자: {personName || '대통자(大通者)'}
              </p>
              <p className="text-[11px] sm:text-xs text-red-900 font-semibold leading-relaxed">
                "{wishText || currentTemplate.effect}"
              </p>
            </div>

            {/* Verification Seal when blessed */}
            <div className="relative z-10 py-1.5">
              {isBlessed ? (
                <div className="inline-block px-4 py-1.5 rounded-xl border-2 border-red-700 text-xs font-black text-red-950 bg-red-200/70 shadow-sm">
                  【 運數 靈驗認證印 · 發行完了 】
                </div>
              ) : (
                <div className="inline-block px-3 py-1 rounded-lg border border-dashed border-red-500 text-[10px] text-red-600 font-bold bg-amber-100/50">
                  [ 30초 광고 시청 후 영험 직인 날인 ]
                </div>
              )}
            </div>

            {/* Card Footer Mantra & Serial */}
            <div className="relative z-10 text-[10px] text-red-900 font-serif-kr pb-1 border-t border-red-600/25 pt-2 space-y-0.5">
              <p className="font-bold text-[10px] text-red-800">{currentTemplate.mantra.slice(0, 32)}...</p>
              <p className="text-[9px] text-red-700 font-mono tracking-wider">UNSU-TALISMAN-CARD-2026-VER</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isBlessed 
                ? '세로형 부적 카드가 성공적으로 발행되었습니다! 스마트폰 배경화면으로 저장하세요.' 
                : '광고 30초 시청 후 세로형 부적 카드를 고화질 이미지로 저장하실 수 있습니다.'}
            </span>
          </div>
        </div>
      </div>

      {/* 30-Second Advertisement Modal */}
      {isAdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl overflow-hidden text-white">
            {/* Ad Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                  AD SPONSOR
                </span>
                <span className="text-xs font-bold text-slate-200">행운 부적 기운 충전 광고</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                </button>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-black">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>남은 시간: {adSecondsLeft}초</span>
                </div>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-2 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-1000 ease-linear"
                style={{ width: `${((30 - adSecondsLeft) / 30) * 100}%` }}
              />
            </div>

            {/* Video / Commercial Screen Content */}
            <div className="relative p-8 text-center space-y-4 bg-gradient-to-b from-[#181126] via-[#101728] to-[#090e17] min-h-[260px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-3xl font-black text-slate-950 font-serif-kr shadow-xl shadow-amber-500/20 animate-pulse">
                運
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 font-cinzel tracking-widest uppercase">
                  UNSU PREMIUM DESTINY
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif-kr mt-1">
                  2026 丙午年 천기누설 비전
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  "하늘의 복과 땅의 재물이 당신의 문 앞에 당도합니다."<br />
                  광고 시청이 끝나면 당신의 이름이 각인된 세로형 수호 부적 카드가 즉시 완성됩니다.
                </p>
              </div>

              {/* Live Count Display */}
              <div className="py-2">
                <span className="text-4xl font-black text-amber-400 font-cinzel">
                  00:{adSecondsLeft < 10 ? `0${adSecondsLeft}` : adSecondsLeft}
                </span>
              </div>
            </div>

            {/* Ad Footer */}
            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>※ 광고를 끝까지 시청하셔야 부적 효력이 부여됩니다.</span>
              <button
                onClick={handleSkipAdForTesting}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
              >
                <FastForward className="w-3 h-3" />
                <span>건너뛰기 (테스트)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
