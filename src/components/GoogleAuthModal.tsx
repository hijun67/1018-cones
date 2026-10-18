import React, { useState } from 'react';
import { useUser, SavedGoogleAccount } from '../context/UserContext';
import { X, Mail, Trash2, ShieldCheck, Sparkles, AlertCircle, User, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserRound } from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const {
    isGoogleModalOpen,
    closeGoogleModal,
    savedGoogleAccounts,
    signInWithSavedGoogleAccount,
    signInWithGoogleOneClick,
    removeSavedGoogleAccount,
    clearAllDataAndCache,
    profiles,
  } = useUser();

  const [authMode, setAuthMode] = useState<'oneclick' | 'direct'>('oneclick');
  const [directEmail, setDirectEmail] = useState('');
  const [directName, setDirectName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isGoogleModalOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fde68a', '#fb923c'],
    });
  };

  // 기본 프로필로 바로 시작
  const handleInstantGoogleLogin = (emailParam?: string, nameParam?: string) => {
    triggerConfetti();
    signInWithGoogleOneClick(emailParam, nameParam);
  };

  const handleSelectSaved = (acc: SavedGoogleAccount) => {
    triggerConfetti();
    signInWithSavedGoogleAccount(acc);
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!directEmail.trim() || !directEmail.includes('@')) {
      setErrorMessage('올바른 이메일 주소(예: name@example.com)를 입력해주세요.');
      return;
    }

    triggerConfetti();
    signInWithGoogleOneClick(directEmail.trim(), directName.trim());
  };

  const primaryP = profiles.length > 0 ? profiles[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Profile icon */}
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-md shrink-0">
              <UserRound className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-kr flex items-center gap-1.5">
                <span>내 정보 저장</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                  브라우저 저장
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">이메일을 입력하면 이 기기의 브라우저에 내 정보가 저장됩니다</p>
            </div>
          </div>

          <button
            onClick={closeGoogleModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Active Profile Sync Notice (if user already filled info) */}
          {primaryP && (primaryP.name || primaryP.birthYear) && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">{primaryP.name || '본인'}</span> 님의 내정보 및 추가된 지인({profiles.length}명)이 이 기기의 브라우저에 저장됩니다.
              </div>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="flex rounded-2xl bg-slate-800/80 p-1 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setAuthMode('oneclick')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'oneclick'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ 빠른 시작
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('direct')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'direct'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✉️ 이메일 입력
            </button>
          </div>

          {authMode === 'oneclick' ? (
            <div className="space-y-4">
              {/* Primary 1-Click Button */}
              <button
                type="button"
                onClick={() => handleInstantGoogleLogin()}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl shadow-white/10 flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98 group cursor-pointer border border-slate-200"
              >
                <UserRound className="w-5 h-5 shrink-0 text-slate-900" />
                <span>기본 프로필로 시작하기</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                회원가입 없이 바로 시작할 수 있으며, 입력한 정보는 서버로 전송되지 않습니다.
              </p>

              {/* Saved accounts in browser */}
              {savedGoogleAccounts.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block">
                    이 브라우저에 저장된 프로필 선택:
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                    {savedGoogleAccounts.map((acc) => (
                      <div
                        key={acc.email}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between gap-3 group transition-all"
                      >
                        <div
                          onClick={() => handleSelectSaved(acc)}
                          className="flex items-center gap-2.5 flex-1 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                            {acc.name ? acc.name.charAt(0) : '운'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                              {acc.name || '회원'}
                            </p>
                            <p className="text-[10px] text-slate-400">{acc.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSelectSaved(acc)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] transition-all"
                          >
                            불러오기
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSavedGoogleAccount(acc.email)}
                            className="p-1 hover:text-red-400 text-slate-500 transition-colors"
                            title="목록에서 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Direct Email Input Form */
            <form onSubmit={handleDirectSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 animate-fadeIn">
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  이메일 <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">이름 / 닉네임 (선택)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={primaryP?.name || '홍길동'}
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
              >
                <span>이 이메일로 저장 시작</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Privacy & Cache Clean Notice */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-center text-slate-400 text-[11px]">
            <div className="flex items-center justify-center gap-1 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>안전한 브라우저 세션 관리 · 언제든 1초 만에 캐시 삭제 가능</span>
            </div>
            <p className="text-[10px] text-slate-500">
              ※ 로그아웃 시 화면에서 내 정보가 감춰지며, 캐시 완전 삭제 시 모든 개인정보가 영구 소멸됩니다.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  closeGoogleModal();
                  clearAllDataAndCache();
                }}
                className="text-[11px] text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors cursor-pointer"
              >
                🗑️ 브라우저 캐시 및 저장된 개인정보 완전 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
