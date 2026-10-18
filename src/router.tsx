import React, { useEffect, useState } from 'react';
import { SITE_NAME, SITE_URL } from './config';

// 외부 라이브러리 없이 쓰는 경량 경로 라우터 (History API)
export const navigate = (to: string) => {
  if (window.location.pathname === to) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
};

export const usePath = (): string => {
  const [path, setPath] = useState(window.location.pathname.replace(/\/+$/, '') || '/');
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname.replace(/\/+$/, '') || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

// 실제 <a href> 를 렌더링해 크롤러가 링크를 따라갈 수 있게 하고, 클릭은 SPA 이동으로 처리
export const Link: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => (
  <a
    href={to}
    onClick={(e) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    }}
    {...rest}
  >
    {children}
  </a>
);

// 페이지별 title / description / canonical 갱신
export const usePageMeta = (title: string, description: string, path: string) => {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, attr: string, value: string, create: () => HTMLElement) => {
      let el = document.head.querySelector<HTMLElement>(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', description, () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    });
    setMeta('link[rel="canonical"]', 'href', `${SITE_URL}${path === '/' ? '/' : path}`, () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    setMeta('meta[property="og:title"]', 'content', title, () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    });
    setMeta('meta[property="og:description"]', 'content', description, () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      return m;
    });
  }, [title, description, path]);
};

export const siteTitle = (page: string) => `${page} | ${SITE_NAME}`;
