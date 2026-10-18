import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TAROT_CARDS } from '../data/fortuneData';
import { TarotCard } from '../types/fortune';
import { Scroll, Sparkles, RefreshCw, Heart, Coins, Briefcase } from 'lucide-react';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel?: string;
  isFlipped: boolean;
}

export const TarotTab: React.FC = () => {
  const [spreadMode, setSpreadMode] = useState<'single' | 'three'>('single');
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const drawCards = (mode: 'single' | 'three') => {
    setIsShuffling(true);
    setCards([]);

    setTimeout(() => {
      // Shuffle TAROT_CARDS
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      if (mode === 'single') {
        const drawn: DrawnCard[] = [
          {
            card: shuffled[0],
            isReversed: Math.random() < 0.25,
            positionLabel: '오늘의 종합 조언',
            isFlipped: true,
          },
        ];
        setCards(drawn);
      } else {
        const labels = ['과거 (원인과 기반)', '현재 (현 상황과 도전)', '미래 (결과와 해법)'];
        const drawn: DrawnCard[] = [0, 1, 2].map((idx) => ({
          card: shuffled[idx],
          isReversed: Math.random() < 0.25,
          positionLabel: labels[idx],
          isFlipped: true,
        }));
        setCards(drawn);
      }
      setIsShuffling(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#f59e0b'],
      });
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-kr flex items-center gap-2">
            <Scroll className="w-5 h-5 text-purple-400" />
            신비로운 데일리 타로 리딩
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            직관과 잠재의식이 건네는 명쾌한 해답과 지혜로운 처방
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => {
                setSpreadMode('single');
                drawCards('single');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                spreadMode === 'single'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              원카드 (오늘의 운)
            </button>
            <button
              onClick={() => {
                setSpreadMode('three');
                drawCards('three');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                spreadMode === 'three'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              쓰리카드 (과거·현재·미래)
            </button>
          </div>

          <button
            onClick={() => drawCards(spreadMode)}
            disabled={isShuffling}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>카드 셔플</span>
          </button>
        </div>
      </div>

      {/* Main Reading Canvas */}
      {cards.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-purple-500/20 flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-28 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-950 border-2 border-dashed border-purple-500/50 flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-slate-300 text-sm">마음을 차분히 가라앉히고 질문을 떠올려보세요.</p>
          <button
            onClick={() => drawCards(spreadMode)}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
          >
            지금 카드 뽑기
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${spreadMode === 'single' ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
          {cards.map((drawn, idx) => {
            const { card, isReversed, positionLabel } = drawn;
            const content = isReversed ? card.reversed : card.upright;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900/80 border border-purple-500/30 p-6 space-y-5 hover:border-purple-500/50 transition-all shadow-xl shadow-purple-950/20"
              >
                {/* Position Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {positionLabel}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isReversed
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
                  </span>
                </div>

                {/* Card Illustration mockup */}
                <div className="relative mx-auto w-36 h-52 rounded-2xl bg-gradient-to-b from-[#2a174d] via-[#1d1238] to-[#0c0817] border-2 border-amber-400/60 p-3 shadow-2xl flex flex-col items-center justify-between text-center overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
                  <span className="text-[10px] text-amber-300 font-cinzel tracking-wider">TAROT ARCANUM</span>
                  <div className="my-auto transform transition-transform group-hover:scale-110">
                    <span className="text-5xl block filter drop-shadow">{card.imageSymbol}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white font-serif-kr">{card.nameKr}</p>
                    <p className="text-[9px] text-amber-300/80 font-cinzel">{card.name}</p>
                  </div>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {card.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 text-[11px] border border-purple-500/20 font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Main Meaning */}
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {content.meaning}
                  </p>
                </div>

                {/* Detailed 3 Aspects */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <span><strong>애정:</strong> {content.love}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>재물:</strong> {content.wealth}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>직업:</strong> {content.career}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
