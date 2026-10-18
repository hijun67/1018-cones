import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { Navbar, TabType } from './components/Navbar';
import { TodayFortuneTab } from './components/TodayFortuneTab';
import { SajuAnalysisTab } from './components/SajuAnalysisTab';
import { ZodiacFortuneTab } from './components/ZodiacFortuneTab';
import { TarotTab } from './components/TarotTab';
import { FortuneCookieTab } from './components/FortuneCookieTab';
import { TalismanTab } from './components/TalismanTab';
import { FortuneDiaryTab } from './components/FortuneDiaryTab';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { MyInfoModal } from './components/MyInfoModal';
import { ReportPdfModal } from './components/ReportPdfModal';
import { Footer } from './components/Footer';
import { HomeIntro } from './components/HomeIntro';
import { GuideArticlePage, GuideIndexPage } from './pages/GuidePages';
import { AboutPage, ContactPage, PrivacyPage, TermsPage } from './pages/InfoPages';
import { navigate, usePageMeta, usePath } from './router';

const HOME_TITLE = '운수 (Unsu) - 오늘의 운세 & 사주 대통';
const HOME_DESC =
  '오늘의 운수, 정통 사주 오행 분석, 띠별·별자리 운세, 타로 카드, 포춘쿠키 및 행운의 부적을 제공하는 한국 정통 & 모던 운세 플랫폼 \'운수(Unsu)\'입니다.';

const HomePage: React.FC<{ activeTab: TabType }> = ({ activeTab }) => {
  usePageMeta(HOME_TITLE, HOME_DESC, '/');
  return (
    <>
      {activeTab === 'today' && <TodayFortuneTab />}
      {activeTab === 'saju' && <SajuAnalysisTab />}
      {activeTab === 'zodiac' && <ZodiacFortuneTab />}
      {activeTab === 'tarot' && <TarotTab />}
      {activeTab === 'cookie' && <FortuneCookieTab />}
      {activeTab === 'talisman' && <TalismanTab />}
      {activeTab === 'diary' && <FortuneDiaryTab />}
      {/* 입력 전에도 항상 보이는 정적 소개·가이드 콘텐츠 */}
      <HomeIntro />
    </>
  );
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const path = usePath();

  // 하위 페이지에서 탭을 누르면 홈으로 돌아가며 해당 탭을 연다
  const handleSetTab = (tab: TabType) => {
    setActiveTab(tab);
    if (path !== '/') navigate('/');
  };

  const renderPage = () => {
    if (path === '/guide') return <GuideIndexPage />;
    if (path.startsWith('/guide/')) return <GuideArticlePage slug={decodeURIComponent(path.slice('/guide/'.length))} />;
    if (path === '/about') return <AboutPage />;
    if (path === '/privacy') return <PrivacyPage />;
    if (path === '/terms') return <TermsPage />;
    if (path === '/contact') return <ContactPage />;
    return <HomePage activeTab={activeTab} />;
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
        {/* Navigation Header */}
        <Navbar activeTab={activeTab} setActiveTab={handleSetTab} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {renderPage()}
        </main>

        {/* Google Authentication Modal */}
        <GoogleAuthModal />

        {/* My Info & Acquaintances Window Modal */}
        <MyInfoModal />

        {/* Full Saju & Fortune PDF Report Modal */}
        <ReportPdfModal />

        {/* Footer */}
        <Footer />
      </div>
    </UserProvider>
  );
};

export default App;
