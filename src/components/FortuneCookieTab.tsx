import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FORTUNE_COOKIES } from '../data/fortuneData';
import { Cookie, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export const FortuneCookieTab: React.FC = () => {
  const [isCracked, setIsCracked] = useState(false);
  const [cookieIndex, setCookieIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentCookie = FORTUNE_COOKIES[cookieIndex % FORTUNE_COOKIES.length];

  const handleCrack = () => {
    if (!isCracked) {
      setIsCracked(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#ef4444', '#fbbf24'],
      });
    }
  };

  const handleNextCookie = () => {
    setIsCracked(false);
    setCookieIndex((prev) => prev + 1);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(
      `[운수 포춘쿠키]\n"${currentCookie.message}"\n${currentCookie.koreanQuote} (${currentCookie.authorOrSource})\n행운의 숫자: ${currentCookie.luckyNumbers.join(', ')}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn text-center">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-white font-serif-kr flex items-center justify-center gap-2">
          <Cookie className="w-6 h-6 text-amber-400" />
          운수대통 황금 포춘쿠키
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          바삭한 쿠키를 터치하여 오늘의 귀중한 지혜와 행운의 번호를 확인하세요
        </p>
      </div>

      {/* Interactive Cookie Arena */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-[#181d2e] to-[#0d121f] border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center min-h-[380px]">
        {!isCracked ? (
          <div className="space-y-6 flex flex-col items-center">
            {/* Unbroken Cookie Visual */}
            <div
              onClick={handleCrack}
              className="cursor-pointer group relative transform transition-transform hover:scale-105 active:scale-95"
            >
              <div className="w-48 h-36 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-2xl shadow-amber-500/30 flex items-center justify-center relative border-4 border-amber-600/40">
                <div className="w-20 h-10 border-b-4 border-amber-800/40 rounded-full" />
                <span className="absolute text-xs font-bold text-amber-950 font-cinzel tracking-widest uppercase">
                  UNSU LUCK
                </span>
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                터치하여 쪼개기
              </span>
            </div>

            <p className="text-xs text-slate-400">
              쿠키를 클릭하면 행운의 주문서가 펼쳐집니다.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn w-full">
            {/* Broken Cookie visual parts */}
            <div className="flex items-center justify-center gap-6">
              <div className="w-20 h-24 rounded-l-full bg-gradient-to-br from-amber-500 to-amber-700 -rotate-12 shadow-lg border border-amber-400/40" />
              <div className="w-20 h-24 rounded-r-full bg-gradient-to-bl from-amber-500 to-amber-700 rotate-12 shadow-lg border border-amber-400/40" />
            </div>

            {/* Revealed Fortune Parchment */}
            <div className="p-6 rounded-2xl bg-[#fefce8] text-slate-900 border-2 border-amber-500/80 shadow-2xl space-y-3 transform -rotate-0.5 max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                <span className="text-[11px] font-bold text-amber-800 font-cinzel">LUCKY FORTUNE NOTE</span>
                <span className="text-[10px] text-amber-700 font-serif-kr">운수(運數)</span>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-900 font-serif-kr leading-relaxed">
                "{currentCookie.message}"
              </p>

              <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                <p className="font-bold">{currentCookie.koreanQuote}</p>
                <p className="text-[11px] text-amber-800">출처: {currentCookie.authorOrSource}</p>
              </div>

              {/* Lucky Numbers */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  행운 번호:
                </span>
                <div className="flex gap-1.5">
                  {currentCookie.luckyNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full bg-amber-800 text-amber-100 text-[11px] font-bold flex items-center justify-center"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopyMessage}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? '복사 완료!' : '문구 복사'}</span>
              </button>
              <button
                onClick={handleNextCookie}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다른 쿠키 열기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
