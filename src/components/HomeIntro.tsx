import React from 'react';
import { GUIDES, GuideCard } from '../pages/GuidePages';
import { Link } from '../router';

// 입력 전에도 항상 보이는 정적 소개 콘텐츠 (크롤러와 첫 방문자 모두를 위한 영역)
export const HomeIntro: React.FC = () => (
  <section className="mt-14 border-t border-slate-800/70 pt-10 space-y-10">
    <div>
      <h2 className="text-xl font-bold font-serif-kr text-slate-50">운수(Unsu)는 어떤 서비스인가요?</h2>
      <p className="mt-3 text-sm text-slate-300 leading-[1.9]">
        운수는 태어난 해, 달, 날, 시간으로 세우는 사주(四柱)의 오행 분포를 바탕으로 오늘의 운세를 풀이해 드리는 한국어 운세 서비스입니다.
        재물, 애정, 직업, 건강 네 가지 분야의 흐름과 오전·오후·저녁·밤의 시간대별 조언, 행운의 색과 방향을 함께 확인할 수 있습니다.
        입력하신 정보는 서버로 전송되지 않고 이용자의 브라우저에만 저장되므로 부담 없이 이용하실 수 있습니다.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-bold font-serif-kr text-slate-50">오행으로 보는 하루의 기운</h2>
      <p className="mt-3 text-sm text-slate-300 leading-[1.9]">
        오행은 목(木), 화(火), 토(土), 금(金), 수(水) 다섯 기운을 말합니다. 목은 성장과 시작, 화는 열정과 표현, 토는 안정과 중재, 금은 결단과 정리, 수는 지혜와 유연함을 상징합니다.
        다섯 기운은 목생화·화생토·토생금·금생수·수생목으로 서로 돕고, 목극토·토극수·수극화·화극금·금극목으로 서로 균형을 잡습니다.
        내 사주에서 어느 기운이 넘치고 부족한지 알면 하루의 컨디션과 선택을 조금 더 여유 있게 조절할 수 있습니다.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-bold font-serif-kr text-slate-50">이렇게 이용하세요</h2>
      <ol className="mt-3 list-decimal list-inside space-y-1.5 text-sm text-slate-300 leading-relaxed">
        <li>상단의 정보 입력란에 이름, 생년월일, 태어난 시간(모르면 12시 기준)을 입력합니다.</li>
        <li>'오늘의 운수'에서 총운과 분야별 운세, 시간대별 흐름을 확인합니다.</li>
        <li>'정통 사주', '띠별·별자리', '신비 타로', '포춘쿠키', '행운 부적' 메뉴로 다양한 관점의 운세를 즐겨 보세요.</li>
        <li>마음에 드는 결과는 운세 일기에 기록하거나 PDF 리포트로 저장할 수 있습니다.</li>
      </ol>
    </div>

    <div>
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold font-serif-kr text-slate-50">운세·사주 이용 가이드</h2>
        <Link to="/guide" className="text-xs text-amber-400 underline">
          전체 보기
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.slice(0, 6).map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>
    </div>

    <div>
      <h2 className="text-xl font-bold font-serif-kr text-slate-50">자주 묻는 질문</h2>
      <dl className="mt-3 space-y-4 text-sm leading-relaxed">
        <div>
          <dt className="font-semibold text-amber-300">태어난 시간을 모르면 어떻게 하나요?</dt>
          <dd className="mt-1 text-slate-300">태어난 시간을 모르면 낮 12시를 기준으로 계산합니다. 시주를 제외한 세 기둥으로도 기본적인 오행 분포와 성향을 확인할 수 있습니다.</dd>
        </div>
        <div>
          <dt className="font-semibold text-amber-300">입력한 정보는 어디에 저장되나요?</dt>
          <dd className="mt-1 text-slate-300">이용자의 브라우저에만 저장되며 운영자 서버로 전송되지 않습니다. 언제든 '개인정보 완전 삭제' 기능으로 지울 수 있습니다.</dd>
        </div>
        <div>
          <dt className="font-semibold text-amber-300">운세 결과를 그대로 믿어도 되나요?</dt>
          <dd className="mt-1 text-slate-300">운세는 오락과 자기 성찰을 위한 참고 자료입니다. 중요한 결정은 전문가의 조언과 객관적인 자료를 바탕으로 판단해 주세요.</dd>
        </div>
      </dl>
    </div>

    <p className="text-[11px] text-slate-500 leading-relaxed">
      ※ 본 서비스의 모든 운세 콘텐츠는 오락 및 참고 목적으로 제공됩니다. 자세한 내용은 <Link to="/terms" className="underline">이용약관</Link>과{' '}
      <Link to="/privacy" className="underline">개인정보처리방침</Link>을 확인해 주세요.
    </p>
  </section>
);
