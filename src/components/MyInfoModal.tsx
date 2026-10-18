import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { getZodiacIdByBirthYear, getConstellationIdByBirthDate } from '../utils/sajuCalculator';
import { ZODIAC_SIGNS, CONSTELLATIONS } from '../data/fortuneData';
import { 
  X, User, Users, Plus, Trash2, Edit2, CheckCircle2, Shield, 
  LogOut, Check, AlertCircle, FileText
} from 'lucide-react';

export const MyInfoModal: React.FC = () => {
  const {
    isMyInfoModalOpen,
    closeMyInfoModal,
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    saveProfile,
    deleteProfile,
    currentGoogleEmail,
    openGoogleModal,
    openReportModal,
    signOut,
    clearAllDataAndCache,
  } = useUser();

  const primaryProfile = profiles.length > 0 ? profiles[0] : null;
  const acquaintanceProfiles = profiles.slice(1);

  // Edit mode states
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRelationship, setEditRelationship] = useState('본인');
  const [editGender, setEditGender] = useState<'male' | 'female'>('male');
  const [editYear, setEditYear] = useState<number>(1995);
  const [editMonth, setEditMonth] = useState<number>(7);
  const [editDay, setEditDay] = useState<number>(7);
  const [editHour, setEditHour] = useState<number>(12);
  const [editIsUnknownHour, setEditIsUnknownHour] = useState(true);
  const [editCalendarType, setEditCalendarType] = useState<'solar' | 'lunar'>('solar');

  // Add new acquaintance inline state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('가족');
  const [newGender, setNewGender] = useState<'male' | 'female'>('female');
  const [newYear, setNewYear] = useState<number>(1998);
  const [newMonth, setNewMonth] = useState<number>(5);
  const [newDay, setNewDay] = useState<number>(15);
  const [newHour, setNewHour] = useState<number>(12);
  const [newIsUnknownHour, setNewIsUnknownHour] = useState(true);
  const [newCalendarType, setNewCalendarType] = useState<'solar' | 'lunar'>('solar');

  if (!isMyInfoModalOpen) return null;

  // Start editing a profile
  const handleStartEdit = (p: typeof profiles[0]) => {
    setEditingProfileId(p.id);
    setEditName(p.name || '');
    setEditRelationship(p.relationship || (p.id === primaryProfile?.id ? '본인' : '지인'));
    setEditGender(p.gender || 'male');
    setEditYear(p.birthYear || 1995);
    setEditMonth(p.birthMonth || 7);
    setEditDay(p.birthDay || 7);
    setEditHour(p.birthHour ?? 12);
    setEditIsUnknownHour(p.isUnknownHour ?? true);
    setEditCalendarType(p.calendarType || 'solar');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileId) return;
    saveProfile({
      id: editingProfileId,
      name: editName.trim() || (editingProfileId === primaryProfile?.id ? '본인' : '지인'),
      relationship: editRelationship,
      gender: editGender,
      birthYear: editYear,
      birthMonth: editMonth,
      birthDay: editDay,
      birthHour: editHour,
      isUnknownHour: editIsUnknownHour,
      calendarType: editCalendarType,
    });
    setEditingProfileId(null);
  };

  // Add new acquaintance submit
  const handleAddNewAcquaintance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const added = saveProfile({
      name: newName.trim(),
      relationship: newRelationship,
      gender: newGender,
      birthYear: newYear,
      birthMonth: newMonth,
      birthDay: newDay,
      birthHour: newHour,
      isUnknownHour: newIsUnknownHour,
      calendarType: newCalendarType,
    });
    setActiveProfileId(added.id);
    setIsAddingNew(false);
    setNewName('');
  };

  // Helper for zodiac & constellation badges
  const getProfileZodiacAndStar = (year: number | null, month: number | null, day: number | null) => {
    if (!year || !month || !day) return null;
    const zId = getZodiacIdByBirthYear(year);
    const cId = getConstellationIdByBirthDate(month, day);
    const zObj = ZODIAC_SIGNS.find((z) => z.id === zId);
    const cObj = CONSTELLATIONS.find((c) => c.id === cId);
    return {
      zodiac: zObj ? `${zObj.symbol} ${zObj.name}` : null,
      constellation: cObj ? `${cObj.symbol} ${cObj.name}` : null,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif-kr flex items-center gap-2">
                <span>내 정보 & 지인 관리 창</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                  총 {profiles.length}명 등록
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                본인 및 추가한 지인 정보를 한눈에 확인하고 운세 대상을 간편하게 선택합니다.
              </p>
            </div>
          </div>

          <button
            onClick={closeMyInfoModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 no-scrollbar flex-1">
          {/* Top Status & Active Subject Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-800/80 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[11px] font-bold text-amber-400 block mb-0.5">현재 선택된 운세 대상</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {activeProfile?.relationship === '본인'
                    ? `👤 내 정보 (본인: ${activeProfile?.name || '본인'})`
                    : `👥 지인 (${activeProfile?.name || '지인'} - ${activeProfile?.relationship || '지인'})`}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentGoogleEmail ? (
                <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentGoogleEmail}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMyInfoModal();
                    openGoogleModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>내 정보 저장</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 1: 본인 정보 (내 정보) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-amber-300 font-serif-kr flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                <span>1. 본인 정보 (내 정보)</span>
              </span>
              {primaryProfile && editingProfileId !== primaryProfile.id && (
                <button
                  type="button"
                  onClick={() => handleStartEdit(primaryProfile)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>정보 수정</span>
                </button>
              )}
            </div>

            {primaryProfile ? (
              editingProfileId === primaryProfile.id ? (
                /* Inline Edit Form for Primary Profile */
                <form onSubmit={handleSaveEdit} className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-amber-500/50 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <span className="text-xs font-bold text-amber-400">내 정보 수정</span>
                    <button
                      type="button"
                      onClick={() => setEditingProfileId(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      취소
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">이름</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="이름 (예: 홍길동)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">성별</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditGender('male')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            editGender === 'male' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          남성
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGender('female')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            editGender === 'female' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          여성
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">출생연도</label>
                      <input
                        type="number"
                        min="1920"
                        max="2030"
                        value={editYear}
                        onChange={(e) => setEditYear(parseInt(e.target.value) || 1995)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">월</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={editMonth}
                        onChange={(e) => setEditMonth(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">일</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={editDay}
                        onChange={(e) => setEditDay(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">양력 / 음력</label>
                      <select
                        value={editCalendarType}
                        onChange={(e) => setEditCalendarType(e.target.value as 'solar' | 'lunar')}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="solar">양력 (Solar)</option>
                        <option value="lunar">음력 (Lunar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">태어난 시간</label>
                      <div className="flex items-center gap-2">
                        <select
                          disabled={editIsUnknownHour}
                          value={editHour}
                          onChange={(e) => setEditHour(parseInt(e.target.value) || 12)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white disabled:opacity-50"
                        >
                          {Array.from({ length: 24 }).map((_, i) => (
                            <option key={i} value={i}>{i}시 ({i < 12 ? `오전 ${i}시` : `오후 ${i === 12 ? 12 : i - 12}시`})</option>
                          ))}
                        </select>
                        <label className="flex items-center gap-1 text-[11px] text-slate-300 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editIsUnknownHour}
                            onChange={(e) => setEditIsUnknownHour(e.target.checked)}
                            className="accent-amber-500 rounded"
                          />
                          <span>모름</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProfileId(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                    >
                      저장 완료
                    </button>
                  </div>
                </form>
              ) : (
                /* Primary Profile Display Card */
                <div className={`p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  activeProfileId === primaryProfile.id
                    ? 'bg-gradient-to-r from-amber-950/30 to-slate-800/80 border-2 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/50 border border-slate-700/80 hover:bg-slate-800/80'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      {primaryProfile.name ? primaryProfile.name.charAt(0) : '본'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-white font-serif-kr">
                          {primaryProfile.name || '본인'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          내 정보 (본인)
                        </span>
                        {primaryProfile.gender && (
                          <span className="text-xs text-slate-400">
                            · {primaryProfile.gender === 'male' ? '남성' : '여성'}
                          </span>
                        )}
                        {activeProfileId === primaryProfile.id && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            현재 대상
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mt-1">
                        {primaryProfile.isBirthInfoCompleted && primaryProfile.birthYear ? (
                          <>
                            {primaryProfile.birthYear}년 {primaryProfile.birthMonth}월 {primaryProfile.birthDay}일 ({primaryProfile.calendarType === 'lunar' ? '음력' : '양력'})
                            · {primaryProfile.isUnknownHour ? '시간모름' : `${primaryProfile.birthHour}시`} 출생
                          </>
                        ) : (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            생년월일 미입력 - [정보 수정] 버튼을 눌러 입력해주세요.
                          </span>
                        )}
                      </p>

                      {/* Zodiac & Star Badges */}
                      {(() => {
                        const badges = getProfileZodiacAndStar(primaryProfile.birthYear, primaryProfile.birthMonth, primaryProfile.birthDay);
                        if (!badges) return null;
                        return (
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {badges.zodiac && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                                {badges.zodiac}
                              </span>
                            )}
                            {badges.constellation && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
                                {badges.constellation}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {activeProfileId !== primaryProfile.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProfileId(primaryProfile.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
                      >
                        이 대상 운세 보기
                      </button>
                    ) : (
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        운세 열람 중
                      </span>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700/80 text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">등록된 내 정보가 없습니다.</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    이메일로 내 정보를 저장하거나, 내 정보를 등록하시면 사주와 오늘의 운세가 즉시 분석됩니다.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      saveProfile({
                        name: '본인',
                        relationship: '본인',
                        gender: 'male',
                        birthYear: 1995,
                        birthMonth: 7,
                        birthDay: 7,
                        birthHour: 12,
                        isUnknownHour: true,
                        calendarType: 'solar',
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                  >
                    + 내 정보 등록하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMyInfoModal();
                      openGoogleModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    <span>내 정보 저장하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: 내가 추가한 지인 정보 */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-bold text-white font-serif-kr flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>2. 내가 추가한 지인 정보</span>
                  <span className="text-xs text-slate-400 font-normal">({acquaintanceProfiles.length}명)</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNew ? '추가 폼 닫기' : '새 지인 추가'}</span>
              </button>
            </div>

            {/* Inline Add New Acquaintance Form */}
            {isAddingNew && (
              <form onSubmit={handleAddNewAcquaintance} className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border-2 border-amber-500/40 space-y-4 shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    새 지인 정보 등록
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    닫기
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">이름 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="지인 이름 (예: 김철수)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">관계</label>
                    <select
                      value={newRelationship}
                      onChange={(e) => setNewRelationship(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      <option value="가족">가족</option>
                      <option value="부모님">부모님</option>
                      <option value="자녀">자녀</option>
                      <option value="배우자">배우자</option>
                      <option value="연인">연인</option>
                      <option value="친구">친구</option>
                      <option value="직장동료">직장동료</option>
                      <option value="기타">기타 지인</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">성별</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewGender('female')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          newGender === 'female' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        여성
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewGender('male')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          newGender === 'male' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        남성
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">출생연도</label>
                    <input
                      type="number"
                      min="1920"
                      max="2030"
                      value={newYear}
                      onChange={(e) => setNewYear(parseInt(e.target.value) || 1995)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">월</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={newMonth}
                      onChange={(e) => setNewMonth(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">일</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={newDay}
                      onChange={(e) => setNewDay(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">양력 / 음력</label>
                    <select
                      value={newCalendarType}
                      onChange={(e) => setNewCalendarType(e.target.value as 'solar' | 'lunar')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      <option value="solar">양력 (Solar)</option>
                      <option value="lunar">음력 (Lunar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">태어난 시간</label>
                    <div className="flex items-center gap-2">
                      <select
                        disabled={newIsUnknownHour}
                        value={newHour}
                        onChange={(e) => setNewHour(parseInt(e.target.value) || 12)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white disabled:opacity-50"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>{i}시 ({i < 12 ? `오전 ${i}시` : `오후 ${i === 12 ? 12 : i - 12}시`})</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1 text-[11px] text-slate-300 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newIsUnknownHour}
                          onChange={(e) => setNewIsUnknownHour(e.target.checked)}
                          className="accent-amber-500 rounded"
                        />
                        <span>모름</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                  >
                    지인 정보 등록 완료
                  </button>
                </div>
              </form>
            )}

            {/* List of Acquaintances */}
            {acquaintanceProfiles.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">아직 추가된 지인이 없습니다</p>
                <p className="text-[11px] text-slate-500">
                  가족, 친구, 연인의 생년월일을 등록해두시면 운세 대상에서 손쉽게 전환하여 확인할 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>첫 지인 추가하기</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {acquaintanceProfiles.map((p, idx) => {
                  const isSelected = activeProfileId === p.id;
                  const isEditing = editingProfileId === p.id;

                  if (isEditing) {
                    return (
                      <form key={p.id} onSubmit={handleSaveEdit} className="p-4 rounded-2xl bg-slate-800 border border-amber-500/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                          <span className="text-xs font-bold text-amber-400">지인 정보 수정</span>
                          <button type="button" onClick={() => setEditingProfileId(null)} className="text-xs text-slate-400">취소</button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">이름</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">관계</label>
                            <select
                              value={editRelationship}
                              onChange={(e) => setEditRelationship(e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            >
                              <option value="가족">가족</option>
                              <option value="친구">친구</option>
                              <option value="연인">연인</option>
                              <option value="직장동료">직장동료</option>
                              <option value="기타">기타</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">생년</label>
                            <input
                              type="number"
                              value={editYear}
                              onChange={(e) => setEditYear(parseInt(e.target.value) || 1995)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">월/일</label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                value={editMonth}
                                onChange={(e) => setEditMonth(parseInt(e.target.value) || 1)}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="number"
                                value={editDay}
                                onChange={(e) => setEditDay(parseInt(e.target.value) || 1)}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button type="button" onClick={() => setEditingProfileId(null)} className="px-3 py-1 rounded bg-slate-700 text-xs">취소</button>
                          <button type="submit" className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs">저장</button>
                        </div>
                      </form>
                    );
                  }

                  const badges = getProfileZodiacAndStar(p.birthYear, p.birthMonth, p.birthDay);

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-950/20 via-slate-800 to-slate-900 border-2 border-amber-400 shadow-md'
                          : 'bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                          {p.name ? p.name.charAt(0) : idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white font-serif-kr">
                              {p.name || `지인 ${idx + 1}`}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                              {p.relationship || '지인'}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                현재 대상
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {p.isBirthInfoCompleted && p.birthYear ? (
                              `${p.birthYear}년 ${p.birthMonth}월 ${p.birthDay}일 (${p.calendarType === 'lunar' ? '음력' : '양력'})`
                            ) : (
                              '생년월일 미입력'
                            )}
                          </p>
                          {badges && (
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {badges.zodiac && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9px]">
                                  {badges.zodiac}
                                </span>
                              )}
                              {badges.constellation && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px]">
                                  {badges.constellation}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isSelected ? (
                          <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            운세 열람 중
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProfileId(p.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                          >
                            이 지인 운세 보기
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors"
                          title="지인 정보 수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProfile(p.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
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
        </div>

        {/* Footer Actions & Cache Clear Area */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                closeMyInfoModal();
                openReportModal();
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 hover:from-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="사주팔자 & 오늘의 운세 전체 리포트 PDF 다운로드"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>전체 리포트 PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeMyInfoModal();
                signOut();
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="화면에서 내 정보가 감춰집니다"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>로그아웃 (내정보 감춤)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeMyInfoModal();
                clearAllDataAndCache();
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="브라우저에 저장된 모든 캐시와 개인정보를 완전 삭제합니다"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>캐시 완전 삭제 (초기화)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closeMyInfoModal}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
