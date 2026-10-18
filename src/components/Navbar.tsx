import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Sparkles, Scroll, Moon, Cookie, Shield, CalendarHeart, 
  Flame, User, Plus, LogOut, CheckCircle2, ChevronLeft, ChevronRight, 
  ChevronDown, Trash2, Users, RotateCcw, FileText
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { UserRound } from 'lucide-react';

export type TabType = 'today' | 'saju' | 'zodiac' | 'tarot' | 'cookie' | 'talisman' | 'diary';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    profiles, 
    activeProfile, 
    activeProfileId, 
    setActiveProfileId, 
    createNextAcquaintance, 
    deleteProfile,
    openGoogleModal, 
    openMyInfoModal,
    openReportModal,
    signOut, 
    clearAllDataAndCache,
    isRegistered 
  } = useUser();

  const tabs = [
    { id: 'today' as TabType, label: '오늘의 운수', icon: Sparkles, badge: '인기' },
    { id: 'saju' as TabType, label: '정통 사주', icon: Compass, badge: '오행' },
    { id: 'zodiac' as TabType, label: '띠별·별자리', icon: Moon },
    { id: 'tarot' as TabType, label: '신비 타로', icon: Scroll },
    { id: 'cookie' as TabType, label: '포춘쿠키', icon: Cookie, badge: '행운' },
    { id: 'talisman' as TabType, label: '행운 부적', icon: Shield, badge: '발행' },
    { id: 'diary' as TabType, label: '운세 일기', icon: CalendarHeart },
  ];

  // Nav Horizontal Scrolling & '> / <' indicators
  const navRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Profile Dropdown Popover
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryProfile = profiles.length > 0 ? profiles[0] : null;
  const acquaintanceProfiles = profiles.slice(1);

  // Check if nav rail overflows or can scroll
  const checkNavScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkNavScroll();
    const timer = setTimeout(checkNavScroll, 150);
    window.addEventListener('resize', checkNavScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkNavScroll);
    };
  }, [activeTab]);

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navRef.current) return;
    const amount = direction === 'left' ? -220 : 220;
    navRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkNavScroll, 300);
  };

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#0c1222]/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-600/30 border border-amber-300/40 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl sm:text-2xl font-black text-amber-950 font-serif-kr">運</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif-kr group-hover:text-amber-400 transition-colors">
                  운수 <span className="text-amber-400 font-cinzel font-light text-lg sm:text-xl tracking-widest">(UNSU)</span>
                </span>
                <span className="hidden sm:flex px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 text-amber-300 border border-amber-500/30 items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                  대길(大吉)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">대한민국 정통 명리 & 데일리 럭셔리 포춘</p>
            </div>
          </div>

          {/* User Section & 운세 대상 Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 운세 대상 - [내 정보 ▾] 단일 드롭다운 (내정보2를 빼고 내정보 클릭 시 본인정보 및 지인추가정보 표시) */}
            {isRegistered && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-xs transition-all shadow-md group"
                  title="운세 대상 선택 (본인 및 지인)"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/40">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-amber-400 font-bold">운세 대상</span>
                      <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors block leading-tight">
                      {activeProfile?.relationship === '본인' 
                        ? '내 정보' 
                        : (activeProfile?.name ? `${activeProfile.name} (${activeProfile.relationship || '지인'})` : activeProfile?.label || '지인 정보')}
                    </span>
                  </div>
                </button>

                {/* Popover Dropdown: 본인정보 & 지인추가한 정보 */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl p-3.5 z-50 animate-fadeIn space-y-3">
                    <div className="px-1 pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-serif-kr flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        운세 대상 선택
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">총 {profiles.length}명 등록됨</span>
                    </div>

                    {/* 1. 본인 정보 (내 정보) */}
                    <div>
                      <div className="flex items-center justify-between px-1 mb-1">
                        <span className="text-[11px] font-bold text-slate-400">👤 본인 정보</span>
                        <span className="text-[10px] text-amber-400 font-semibold">내 정보</span>
                      </div>
                      {primaryProfile && (
                        <div
                          onClick={() => {
                            setActiveProfileId(primaryProfile.id);
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                            activeProfileId === primaryProfile.id
                              ? 'bg-amber-500/20 border-2 border-amber-400/90 text-white shadow-sm'
                              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white">{primaryProfile.name || '본인'}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold">
                                  내 정보 (본인)
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400">
                                {primaryProfile.isBirthInfoCompleted && primaryProfile.birthYear
                                  ? `${primaryProfile.birthYear}년 ${primaryProfile.birthMonth}월 ${primaryProfile.birthDay}일 (${primaryProfile.calendarType === 'lunar' ? '음력' : '양력'})`
                                  : '생년월일 미입력 (입력 필요)'}
                              </p>
                            </div>
                          </div>
                          {activeProfileId === primaryProfile.id && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* 2. 지인 추가한 정보 */}
                    <div>
                      <div className="flex items-center justify-between px-1 mb-1">
                        <span className="text-[11px] font-bold text-slate-400">👥 추가된 지인 정보</span>
                        <span className="text-[10px] text-slate-400">{acquaintanceProfiles.length}명</span>
                      </div>

                      {acquaintanceProfiles.length === 0 ? (
                        <div className="p-3 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center text-[11px] text-slate-400">
                          등록된 지인 정보가 없습니다. 아래 버튼으로 추가해보세요.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                          {acquaintanceProfiles.map((p, idx) => {
                            const isSelected = activeProfileId === p.id;
                            return (
                              <div
                                key={p.id}
                                onClick={() => {
                                  setActiveProfileId(p.id);
                                  setIsProfileDropdownOpen(false);
                                }}
                                className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-2 border-amber-400/90 text-white shadow-sm'
                                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                                    {p.name ? p.name.charAt(0) : idx + 2}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-white">{p.name || `지인 ${idx + 2}`}</span>
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

                    {/* 3. 내정보 창 전체 열기, PDF 리포트 & 새 지인 추가 버튼 */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          openReportModal();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 hover:from-emerald-900/60 hover:to-teal-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>📄 전체 리포트 PDF 다운로드</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          openMyInfoModal();
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>내정보 & 지인 관리창 열기</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          createNextAcquaintance();
                          setIsProfileDropdownOpen(false);
                          setActiveTab('today');
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
                          setIsProfileDropdownOpen(false);
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
                          setIsProfileDropdownOpen(false);
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
            )}

            {isRegistered && (
              <button
                type="button"
                onClick={openMyInfoModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-700/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all shadow-sm group"
                title="내 정보 및 내가 추가한 지인 정보 관리 창 열기"
              >
                <User className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">내정보 창</span>
                <span className="sm:hidden">내정보</span>
              </button>
            )}

            <button
              type="button"
              onClick={openReportModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all shadow-sm group cursor-pointer"
              title="사주팔자 & 오늘의 운세 전체 리포트 PDF 다운로드"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">리포트 PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {!isRegistered ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={openGoogleModal}
                  className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md shadow-white/10 border border-slate-200 transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="이메일로 내 정보를 저장하고 불러오기"
                >
                  <UserRound className="w-4 h-4 shrink-0 text-slate-900" />
                  <span className="hidden sm:inline">내 정보 저장 / 불러오기</span>
                  <span className="sm:hidden">내 정보 저장</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllDataAndCache}
                  title="브라우저 캐시 및 임시정보 삭제"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={signOut}
                  title="로그아웃 (화면에서 내정보 숨김 및 세션 캐시 정리)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
                <button
                  onClick={clearAllDataAndCache}
                  title="캐시 및 모든 개인정보 완전 삭제 (초기화)"
                  className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-red-950/50 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation: Compact font/padding on desktop + Chevron '<' / '>' scroll indicators */}
        <div className="relative flex items-center border-t border-slate-800/60 pt-1">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-3 z-20 flex items-center pr-2 bg-gradient-to-r from-[#0c1222] via-[#0c1222]/90 to-transparent">
              <button
                type="button"
                onClick={() => scrollNav('left')}
                className="p-1 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-md transition-all"
                title="이전 메뉴"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Items (Optimized compact font & padding) */}
          <nav
            ref={navRef}
            onScroll={checkNavScroll}
            className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto pb-3 pt-1 no-scrollbar w-full"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 sm:px-2.5 lg:px-3 py-1.5 rounded-xl font-medium text-xs lg:text-[13px] transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-bold font-serif-kr'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 text-[9px] rounded-md font-bold ${
                        isActive
                          ? 'bg-amber-950 text-amber-200'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Scroll Button ('>' 표시로 메뉴가 더 있음을 표시) */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-3 z-20 flex items-center pl-2 bg-gradient-to-l from-[#0c1222] via-[#0c1222]/90 to-transparent">
              <button
                type="button"
                onClick={() => scrollNav('right')}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-lg shadow-amber-500/20 transition-all group animate-pulse"
                title="다음 메뉴 더보기"
              >
                <span className="hidden sm:inline text-[10px] font-bold tracking-tight">메뉴 더보기</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
