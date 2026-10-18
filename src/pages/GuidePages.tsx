import React from 'react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import guidesJson from '../data/guides.json';
import { Link, siteTitle, usePageMeta } from '../router';

export interface GuideSection {
  heading: string;
  body: string[];
}
export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  sections: GuideSection[];
}

export const GUIDES = guidesJson as Guide[];

export const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => (
  <Link
    to={`/guide/${guide.slug}`}
    className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-amber-500/50 hover:bg-slate-900 transition-colors"
  >
    <span className="text-[11px] font-semibold text-amber-400">{guide.category}</span>
    <h3 className="mt-1 text-base font-bold text-slate-100 font-serif-kr leading-snug">{guide.title}</h3>
    <p className="mt-2 text-xs text-slate-400 leading-relaxed">{guide.description}</p>
  </Link>
);

export const GuideIndexPage: React.FC = () => {
  usePageMeta(
    siteTitle('운세·사주 이용 가이드'),
    '사주팔자, 오행, 띠와 별자리, 타로, 포춘쿠키, 부적 문화까지 운세의 기초 지식을 쉽게 풀어 쓴 가이드 모음입니다.',
    '/guide'
  );
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="flex items-center gap-2 text-2xl font-bold font-serif-kr text-slate-50">
        <BookOpen className="w-6 h-6 text-amber-400" />
        운세·사주 이용 가이드
      </h1>
      <p className="mt-3 text-sm text-slate-400 leading-relaxed">
        운수에서 제공하는 사주, 띠별·별자리, 타로, 포춘쿠키, 행운 부적을 더 깊이 즐길 수 있도록 기초 개념과 문화적 배경을 정리했습니다.
        각 글은 전통 명리학과 점술 문화에 대한 일반적인 설명이며, 오락과 자기 성찰을 위한 참고 자료입니다.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>
    </section>
  );
};

export const GuideArticlePage: React.FC<{ slug: string }> = ({ slug }) => {
  const guide = GUIDES.find((g) => g.slug === slug);
  usePageMeta(
    guide ? siteTitle(guide.title) : siteTitle('페이지를 찾을 수 없습니다'),
    guide ? guide.description : '요청하신 가이드 글을 찾을 수 없습니다.',
    `/guide/${slug}`
  );

  if (!guide) {
    return (
      <section className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-xl font-bold text-slate-100">글을 찾을 수 없습니다</h1>
        <Link to="/guide" className="mt-4 inline-block text-amber-400 underline text-sm">
          가이드 목록으로 돌아가기
        </Link>
      </section>
    );
  }

  const others = GUIDES.filter((g) => g.slug !== slug).slice(0, 4);

  return (
    <article className="max-w-3xl mx-auto">
      <Link to="/guide" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400">
        <ChevronLeft className="w-3.5 h-3.5" />
        가이드 목록
      </Link>
      <span className="mt-4 block text-xs font-semibold text-amber-400">{guide.category}</span>
      <h1 className="mt-1 text-2xl sm:text-3xl font-bold font-serif-kr text-slate-50 leading-snug">{guide.title}</h1>
      <p className="mt-3 text-sm text-slate-400 leading-relaxed">{guide.description}</p>

      {guide.sections.map((sec) => (
        <section key={sec.heading} className="mt-8">
          <h2 className="text-lg font-bold font-serif-kr text-amber-300">{sec.heading}</h2>
          {sec.body.map((p, i) => (
            <p key={i} className="mt-3 text-[15px] text-slate-300 leading-[1.9]">
              {p}
            </p>
          ))}
        </section>
      ))}

      <p className="mt-10 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500 leading-relaxed">
        ※ 이 글은 전통 명리학과 점술 문화에 대한 일반적인 설명이며, 운세는 과학적으로 입증된 예측이 아닌 오락 및 참고 목적의 콘텐츠입니다.
      </p>

      <div className="mt-10">
        <h2 className="text-sm font-bold text-slate-200">함께 읽으면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {others.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </div>
    </article>
  );
};
