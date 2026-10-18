import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Link } from '../router';

export const Footer: React.FC = () => {
  const { clearAllDataAndCache } = useUser();

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b14] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-serif-kr">
              運
            </div>
            <div>
              <span className="font-bold text-slate-200 font-serif-kr text-sm">운수 (UNSU) - 대한민국 명리 & 데일리 포춘</span>
              <p className="text-[11px] text-slate-500">2026 丙午年(병오년) 전통 명리학 및 심층 통계 기반 운세 서비스</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3 h-3" />
              매일 자정 00:00 기운 자동 갱신
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <Flame className="w-3 h-3" />
              대길(大吉) 기원
            </span>
          </div>
        </div>

        <nav aria-label="사이트 정보" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-400">
          <Link to="/about" className="hover:text-amber-400">서비스 소개</Link>
          <Link to="/guide" className="hover:text-amber-400">운세·사주 가이드</Link>
          <Link to="/privacy" className="hover:text-amber-400">개인정보처리방침</Link>
          <Link to="/terms" className="hover:text-amber-400">이용약관</Link>
          <Link to="/contact" className="hover:text-amber-400">문의하기</Link>
        </nav>

        <div className="border-t border-slate-800/60 pt-6 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            ※ '운수(Unsu)'에서 제공하는 모든 사주팔자, 띠별·별자리 운세, 타로 카드 및 행운의 번호는 전통 명리학 이론과 데이터 분석을 바탕으로 제작되었습니다.
            운세는 긍정적인 하루를 시작하고 지혜로운 선택을 돕는 참고 지침으로 활용하시기 바랍니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 pt-2">
            <p>© 2026 UNSU Fortune Platform. All rights reserved.</p>
            <button
              type="button"
              onClick={clearAllDataAndCache}
              className="text-[10px] text-slate-500 hover:text-amber-400 underline transition-colors"
              title="브라우저에 저장된 모든 캐시와 개인정보를 삭제하고 초기화합니다"
            >
              브라우저 캐시 및 저장된 개인정보 완전 삭제
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
