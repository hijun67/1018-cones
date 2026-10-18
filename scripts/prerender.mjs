// 빌드 후 실행: 각 경로별 정적 HTML 을 dist 에 생성합니다.
// JS 를 실행하지 않는 크롤러도 페이지별 제목·설명·본문 텍스트를 읽을 수 있게 하기 위함이며,
// 브라우저에서는 React 가 #root 를 덮어써서 기존과 똑같이 동작합니다.
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://cones.work';
const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8');
const guides = JSON.parse(fs.readFileSync(path.resolve('src/data/guides.json'), 'utf-8'));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nav = `<nav><a href="/">오늘의 운세</a> <a href="/guide">가이드</a> <a href="/about">서비스 소개</a> <a href="/privacy">개인정보처리방침</a> <a href="/terms">이용약관</a> <a href="/contact">문의하기</a></nav>`;

const pages = [];

pages.push({
  route: '/about',
  title: '서비스 소개 | 운수 (Unsu)',
  desc: '운수(Unsu)는 사주 오행, 오늘의 운세, 띠별·별자리, 타로, 포춘쿠키, 행운 부적을 제공하는 한국어 운세 서비스입니다.',
  body: '<h1>운수(Unsu) 서비스 소개</h1><p>운수는 전통 명리학의 사주 오행 개념을 바탕으로 오늘의 운세와 하루의 흐름을 살펴볼 수 있는 한국어 운세 서비스입니다. 운세는 오락과 자기 성찰을 위한 참고 자료로 제공되며, 입력한 정보는 이용자의 브라우저에만 저장됩니다.</p>',
});
pages.push({
  route: '/guide',
  title: '운세·사주 이용 가이드 | 운수 (Unsu)',
  desc: '사주팔자, 오행, 띠와 별자리, 타로, 포춘쿠키, 부적 문화까지 운세의 기초 지식을 쉽게 풀어 쓴 가이드 모음입니다.',
  body: `<h1>운세·사주 이용 가이드</h1><ul>${guides.map((g) => `<li><a href="/guide/${g.slug}">${esc(g.title)}</a> - ${esc(g.description)}</li>`).join('')}</ul>`,
});
for (const g of guides) {
  pages.push({
    route: `/guide/${g.slug}`,
    title: `${g.title} | 운수 (Unsu)`,
    desc: g.description,
    body: `<article><h1>${esc(g.title)}</h1><p>${esc(g.description)}</p>${g.sections
      .map((s) => `<h2>${esc(s.heading)}</h2>${s.body.map((p) => `<p>${esc(p)}</p>`).join('')}`)
      .join('')}</article>`,
  });
}
pages.push({
  route: '/privacy',
  title: '개인정보처리방침 | 운수 (Unsu)',
  desc: '운수(Unsu)가 수집·이용하는 정보, 브라우저 저장소 사용, 광고 쿠키, 이용자의 권리에 대한 개인정보처리방침입니다.',
  body: '<h1>개인정보처리방침</h1><p>운수는 별도의 회원 가입과 서버 데이터베이스를 운영하지 않으며, 이용자가 입력한 정보는 브라우저 저장소에만 저장됩니다. 광고 쿠키 사용과 정보 삭제 방법 등 자세한 내용은 이 페이지에서 확인하실 수 있습니다.</p>',
});
pages.push({
  route: '/terms',
  title: '이용약관 | 운수 (Unsu)',
  desc: '운수(Unsu) 서비스의 이용 조건, 콘텐츠의 성격과 면책, 지적재산권, 금지 행위에 대한 이용약관입니다.',
  body: '<h1>이용약관</h1><p>운수가 제공하는 운세 콘텐츠는 오락 및 참고 목적의 정보이며, 결과의 정확성이나 실현 여부를 보장하지 않습니다.</p>',
});
pages.push({
  route: '/contact',
  title: '문의하기 | 운수 (Unsu)',
  desc: '운수(Unsu) 서비스 이용 문의, 오류 제보, 제휴 및 개인정보 관련 문의 방법을 안내합니다.',
  body: '<h1>문의하기</h1><p>서비스 이용 문의, 오류 제보, 제휴 및 개인정보 관련 문의 방법을 안내합니다.</p>',
});

const render = ({ route, title, desc, body }) => {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${SITE}${route}" />`);
  html = html.replace('<div id="root"></div>', `<div id="root"><main>${nav}${body}</main></div>`);
  return html;
};

for (const p of pages) {
  const dir = path.join(dist, p.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p));
}
console.log(`prerendered ${pages.length} pages`);
