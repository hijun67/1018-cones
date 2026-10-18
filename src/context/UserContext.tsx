import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/fortune';

export interface SavedGoogleAccount {
  email: string;
  name: string;
  photoUrl?: string;
  lastUsed: string;
}

interface UserContextType {
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  activeProfileId: string | null;
  setActiveProfileId: (id: string) => void;
  saveProfile: (profile: {
    id?: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour?: number;
    isUnknownHour?: boolean;
    gender?: 'male' | 'female';
    calendarType?: 'solar' | 'lunar';
    relationship?: string;
  }) => UserProfile;
  createNextAcquaintance: () => UserProfile;
  deleteProfile: (id: string) => void;
  savedGoogleAccounts: SavedGoogleAccount[];
  isGoogleModalOpen: boolean;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  isMyInfoModalOpen: boolean;
  openMyInfoModal: () => void;
  closeMyInfoModal: () => void;
  isReportModalOpen: boolean;
  openReportModal: () => void;
  closeReportModal: () => void;
  signInWithSavedGoogleAccount: (account: SavedGoogleAccount) => void;
  signInWithGoogleManual: (email: string, password: string, name?: string, saveToBrowser?: boolean) => void;
  signInWithGoogleOneClick: (email?: string, name?: string) => void;
  removeSavedGoogleAccount: (email: string) => void;
  signOut: () => void;
  clearAllDataAndCache: () => void;
  isRegistered: boolean;
  currentGoogleEmail: string | null;
  restoredNotice: string | null;
  clearRestoredNotice: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_PROFILES_KEY = 'unsu_user_profiles_v3';
const STORAGE_ACTIVE_ID_KEY = 'unsu_active_profile_id_v3';
const STORAGE_SAVED_GOOGLE_KEY = 'unsu_saved_google_accounts_v3';
const STORAGE_REGISTRY_KEY = 'unsu_account_profiles_registry_v3';
const STORAGE_CURRENT_GOOGLE_USER_KEY = 'unsu_current_google_email_v3';

// Helper to read registry
function getRegistry(): Record<string, UserProfile[]> {
  try {
    const raw = localStorage.getItem(STORAGE_REGISTRY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

// Helper to write to registry
function saveToRegistry(key: string, profilesToSave: UserProfile[]) {
  try {
    if (!key) return;
    const reg = getRegistry();
    reg[key.toLowerCase()] = profilesToSave;
    localStorage.setItem(STORAGE_REGISTRY_KEY, JSON.stringify(reg));
  } catch {
    // ignore
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGoogleEmail, setCurrentGoogleEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_CURRENT_GOOGLE_USER_KEY) || null;
    } catch {
      return null;
    }
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILES_KEY);
      if (saved) {
        const parsed: UserProfile[] = JSON.parse(saved);
        return parsed.map((p, idx) => ({
          ...p,
          label: idx === 0 ? '내 정보 (본인)' : (p.name ? `${p.name} (${p.relationship || '지인'})` : '지인 정보'),
        }));
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_ID_KEY) || null;
    } catch {
      return null;
    }
  });

  // Saved accounts in browser (default empty)
  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState<SavedGoogleAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_GOOGLE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isMyInfoModalOpen, setIsMyInfoModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState<string | null>(null);

  const openMyInfoModal = () => setIsMyInfoModalOpen(true);
  const closeMyInfoModal = () => setIsMyInfoModalOpen(false);
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  // Sync active profiles to localStorage and registry whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      
      const targetEmail = currentGoogleEmail || profiles.find((p) => p.isGoogleAuth && p.googleEmail)?.googleEmail;
      if (targetEmail) {
        saveToRegistry(targetEmail, profiles);
      } else if (profiles.length > 0) {
        saveToRegistry('local_guest_user', profiles);
      }
    } catch {
      // ignore
    }
  }, [profiles, currentGoogleEmail]);

  useEffect(() => {
    try {
      if (activeProfileId) {
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, activeProfileId);
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_ID_KEY);
      }
    } catch {
      // ignore
    }
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_GOOGLE_KEY, JSON.stringify(savedGoogleAccounts));
    } catch {
      // ignore
    }
  }, [savedGoogleAccounts]);

  useEffect(() => {
    try {
      if (currentGoogleEmail) {
        localStorage.setItem(STORAGE_CURRENT_GOOGLE_USER_KEY, currentGoogleEmail);
      } else {
        localStorage.removeItem(STORAGE_CURRENT_GOOGLE_USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentGoogleEmail]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || (profiles.length > 0 ? profiles[0] : null);
  const isRegistered = Boolean(currentGoogleEmail || profiles.length > 0);

  // Save or update profile
  const saveProfile = (data: {
    id?: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour?: number;
    isUnknownHour?: boolean;
    gender?: 'male' | 'female';
    calendarType?: 'solar' | 'lunar';
    relationship?: string;
  }) => {
    let targetProfile: UserProfile;
    const targetEmail = currentGoogleEmail || profiles.find((p) => p.isGoogleAuth && p.googleEmail)?.googleEmail;

    if (data.id && profiles.some((p) => p.id === data.id)) {
      const existing = profiles.find((p) => p.id === data.id)!;
      targetProfile = {
        ...existing,
        name: data.name,
        birthYear: data.birthYear,
        birthMonth: data.birthMonth,
        birthDay: data.birthDay,
        birthHour: data.isUnknownHour ? 12 : (data.birthHour ?? 12),
        isUnknownHour: data.isUnknownHour ?? false,
        gender: data.gender || existing.gender,
        calendarType: data.calendarType || existing.calendarType,
        relationship: data.relationship || existing.relationship,
        isBirthInfoCompleted: true,
        isGoogleAuth: Boolean(targetEmail || existing.isGoogleAuth),
        googleEmail: targetEmail || existing.googleEmail,
      };
      const updated = profiles.map((p) => (p.id === data.id ? targetProfile : p));
      setProfiles(updated);
      if (targetEmail) {
        saveToRegistry(targetEmail, updated);
      }
    } else {
      const newIndex = profiles.length + 1;
      const label = newIndex === 1 ? '내 정보 (본인)' : (data.name ? `${data.name} (${data.relationship || '지인'})` : '지인 정보');
      targetProfile = {
        id: `profile-${Date.now()}`,
        label,
        name: data.name,
        relationship: newIndex === 1 ? '본인' : (data.relationship || '지인'),
        gender: data.gender || 'male',
        birthYear: data.birthYear,
        birthMonth: data.birthMonth,
        birthDay: data.birthDay,
        birthHour: data.isUnknownHour ? 12 : (data.birthHour ?? 12),
        isUnknownHour: data.isUnknownHour ?? false,
        calendarType: data.calendarType || 'solar',
        isBirthInfoCompleted: true,
        isGoogleAuth: Boolean(targetEmail),
        googleEmail: targetEmail || undefined,
        createdAt: new Date().toISOString(),
      };
      const updated = [...profiles, targetProfile];
      setProfiles(updated);
      if (targetEmail) {
        saveToRegistry(targetEmail, updated);
      }
    }

    setActiveProfileId(targetProfile.id);
    return targetProfile;
  };

  const createNextAcquaintance = () => {
    const targetEmail = currentGoogleEmail || profiles.find((p) => p.isGoogleAuth && p.googleEmail)?.googleEmail;
    const newAcquaintance: UserProfile = {
      id: `profile-${Date.now()}`,
      label: '새 지인 정보',
      name: '',
      relationship: '가족',
      gender: 'female',
      birthYear: null,
      birthMonth: null,
      birthDay: null,
      birthHour: 12,
      isUnknownHour: true,
      calendarType: 'solar',
      isBirthInfoCompleted: false,
      isGoogleAuth: Boolean(targetEmail),
      googleEmail: targetEmail || undefined,
      createdAt: new Date().toISOString(),
    };
    const updated = [...profiles, newAcquaintance];
    setProfiles(updated);
    setActiveProfileId(newAcquaintance.id);
    if (targetEmail) {
      saveToRegistry(targetEmail, updated);
    }
    return newAcquaintance;
  };

  const deleteProfile = (id: string) => {
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (activeProfileId === id) {
      setActiveProfileId(remaining.length > 0 ? remaining[0].id : null);
    }
    const targetEmail = currentGoogleEmail || profiles.find((p) => p.isGoogleAuth && p.googleEmail)?.googleEmail;
    if (targetEmail) {
      saveToRegistry(targetEmail, remaining);
    }
  };

  const openGoogleModal = () => setIsGoogleModalOpen(true);
  const closeGoogleModal = () => setIsGoogleModalOpen(false);
  const clearRestoredNotice = () => setRestoredNotice(null);

  // 1. Google sign-up / login via saved browser account
  // CRITICAL REQUIREMENT: Restore previous birth info if this account logged in before!
  const signInWithSavedGoogleAccount = (account: SavedGoogleAccount) => {
    const normEmail = account.email.trim().toLowerCase();
    setCurrentGoogleEmail(normEmail);

    const updated = savedGoogleAccounts.map((a) =>
      a.email.toLowerCase() === normEmail ? { ...a, lastUsed: new Date().toISOString() } : a
    );
    setSavedGoogleAccounts(updated);

    const reg = getRegistry();
    const existingSavedProfiles = reg[normEmail];

    if (existingSavedProfiles && existingSavedProfiles.length > 0) {
      // Re-login restoration! Use previously saved name, birth info & acquaintances!
      setProfiles(existingSavedProfiles);
      setActiveProfileId(existingSavedProfiles[0].id);

      const mainP = existingSavedProfiles[0];
      if (mainP.isBirthInfoCompleted && mainP.birthYear) {
        setRestoredNotice(
          `저장된 프로필(${account.email})의 내정보(${mainP.name}, ${mainP.birthYear}년 ${mainP.birthMonth}월 ${mainP.birthDay}일)를 성공적으로 복원했습니다!`
        );
      } else {
        setRestoredNotice(`이메일(${account.email}) 프로필을 불러왔습니다.`);
      }
    } else {
      // Check if current screen already has birth info entered before clicking Google login
      const currentCompletedProfile = profiles.find((p) => p.isBirthInfoCompleted && p.birthYear);
      if (currentCompletedProfile) {
        // Link and migrate existing entered birth info to this Google account
        const updatedProfiles = profiles.map((p) => ({
          ...p,
          isGoogleAuth: true,
          googleEmail: account.email,
        }));
        setProfiles(updatedProfiles);
        saveToRegistry(normEmail, updatedProfiles);
        setRestoredNotice(`입력하신 내정보가 이메일(${account.email}) 프로필로 이 브라우저에 저장되었습니다.`);
      } else {
        // First time Google signup without birth info: create base profile, prompt for birth info
        const userName = account.name || account.email.split('@')[0];
        const newProfile: UserProfile = {
          id: `profile-${Date.now()}`,
          label: '내 정보 (본인)',
          name: userName,
          relationship: '본인',
          gender: 'male',
          birthYear: null,
          birthMonth: null,
          birthDay: null,
          birthHour: 12,
          isUnknownHour: true,
          calendarType: 'solar',
          isBirthInfoCompleted: false, // Must enter birth info to view fortune
          isGoogleAuth: true,
          googleEmail: account.email,
          createdAt: new Date().toISOString(),
        };
        setProfiles([newProfile]);
        setActiveProfileId(newProfile.id);
        saveToRegistry(normEmail, [newProfile]);
        setRestoredNotice(`이메일(${account.email}) 프로필이 만들어졌습니다. 정확한 운세 산출을 위해 이름과 생년월일시를 입력해주세요.`);
      }
    }

    setIsGoogleModalOpen(false);
  };

  // 2. Google sign-up / login via manual email & password
  // CRITICAL REQUIREMENT: Restore previous birth info if this account logged in before!
  const signInWithGoogleManual = (email: string, _password: string, name?: string, saveToBrowser: boolean = true) => {
    const normEmail = email.trim().toLowerCase();
    setCurrentGoogleEmail(normEmail);

    const userName = name?.trim() || email.split('@')[0];

    if (saveToBrowser) {
      const exists = savedGoogleAccounts.some((a) => a.email.toLowerCase() === normEmail);
      if (!exists) {
        setSavedGoogleAccounts((prev) => [
          ...prev,
          {
            email: email.trim(),
            name: userName,
            lastUsed: new Date().toISOString(),
          },
        ]);
      }
    }

    const reg = getRegistry();
    const existingSavedProfiles = reg[normEmail];

    if (existingSavedProfiles && existingSavedProfiles.length > 0) {
      // Re-login restoration!
      setProfiles(existingSavedProfiles);
      setActiveProfileId(existingSavedProfiles[0].id);

      const mainP = existingSavedProfiles[0];
      if (mainP.isBirthInfoCompleted && mainP.birthYear) {
        setRestoredNotice(
          `저장된 프로필(${email})의 내정보(${mainP.name}, ${mainP.birthYear}년 ${mainP.birthMonth}월 ${mainP.birthDay}일)를 성공적으로 복원했습니다!`
        );
      } else {
        setRestoredNotice(`이메일(${email}) 프로필을 불러왔습니다.`);
      }
    } else {
      const currentCompletedProfile = profiles.find((p) => p.isBirthInfoCompleted && p.birthYear);
      if (currentCompletedProfile) {
        const updatedProfiles = profiles.map((p) => ({
          ...p,
          isGoogleAuth: true,
          googleEmail: email.trim(),
        }));
        setProfiles(updatedProfiles);
        saveToRegistry(normEmail, updatedProfiles);
        setRestoredNotice(`입력하신 내정보가 이메일(${email}) 프로필로 이 브라우저에 저장되었습니다.`);
      } else {
        const newProfile: UserProfile = {
          id: `profile-${Date.now()}`,
          label: '내 정보 (본인)',
          name: userName,
          relationship: '본인',
          gender: 'male',
          birthYear: null,
          birthMonth: null,
          birthDay: null,
          birthHour: 12,
          isUnknownHour: true,
          calendarType: 'solar',
          isBirthInfoCompleted: false,
          isGoogleAuth: true,
          googleEmail: email.trim(),
          createdAt: new Date().toISOString(),
        };
        setProfiles([newProfile]);
        setActiveProfileId(newProfile.id);
        saveToRegistry(normEmail, [newProfile]);
        setRestoredNotice(`이메일(${email}) 프로필이 만들어졌습니다. 정확한 운세 산출을 위해 이름과 생년월일시를 입력해주세요.`);
      }
    }

    setIsGoogleModalOpen(false);
  };

  // 1-Click Google Sign-In (seamless, instant connection like modern portals)
  const signInWithGoogleOneClick = (emailParam?: string, nameParam?: string) => {
    const existingName = profiles.length > 0 && profiles[0].name ? profiles[0].name : '';
    const fallbackEmail = existingName ? `${existingName.replace(/\s+/g, '').toLowerCase()}@gmail.com` : 'user@gmail.com';
    const email = (emailParam || fallbackEmail).trim().toLowerCase();
    const displayName = nameParam?.trim() || existingName || (email.split('@')[0] || '회원');

    setCurrentGoogleEmail(email);

    setSavedGoogleAccounts((prev) => {
      if (prev.some((a) => a.email.toLowerCase() === email)) {
        return prev.map((a) =>
          a.email.toLowerCase() === email ? { ...a, lastUsed: new Date().toISOString() } : a
        );
      }
      return [...prev, { email, name: displayName, lastUsed: new Date().toISOString() }];
    });

    const reg = getRegistry();
    const existing = reg[email];

    if (existing && existing.length > 0) {
      setProfiles(existing);
      setActiveProfileId(existing[0].id);
      const mainP = existing[0];
      if (mainP.isBirthInfoCompleted && mainP.birthYear) {
        setRestoredNotice(`프로필 불러오기 완료! 저장된 내정보(${mainP.name}, ${mainP.birthYear}년생)가 복원되었습니다.`);
      } else {
        setRestoredNotice(`이메일(${email}) 프로필로 시작했습니다.`);
      }
    } else if (profiles.length > 0 && profiles.some((p) => p.isBirthInfoCompleted && p.birthYear)) {
      const merged = profiles.map((p) => ({
        ...p,
        isGoogleAuth: true,
        googleEmail: email,
      }));
      setProfiles(merged);
      saveToRegistry(email, merged);
      setRestoredNotice(`입력하신 내정보가 이메일(${email}) 프로필로 이 브라우저에 저장되었습니다.`);
    } else {
      const newProfile: UserProfile = {
        id: `profile-${Date.now()}`,
        label: '내 정보 (본인)',
        name: displayName,
        relationship: '본인',
        gender: 'male',
        birthYear: null,
        birthMonth: null,
        birthDay: null,
        birthHour: 12,
        isUnknownHour: true,
        calendarType: 'solar',
        isBirthInfoCompleted: false,
        isGoogleAuth: true,
        googleEmail: email,
        createdAt: new Date().toISOString(),
      };
      setProfiles([newProfile]);
      setActiveProfileId(newProfile.id);
      saveToRegistry(email, [newProfile]);
      setRestoredNotice(`이메일(${email}) 프로필이 만들어졌습니다. 정확한 사주 운세 산출을 위해 이름과 생년월일시를 입력해주세요.`);
    }

    setIsGoogleModalOpen(false);
  };

  const removeSavedGoogleAccount = (email: string) => {
    setSavedGoogleAccounts((prev) => prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase()));
  };

  // Sign out: Clears active session cache so personal info is immediately hidden and not visible
  const signOut = () => {
    const targetEmail = currentGoogleEmail || profiles.find((p) => p.isGoogleAuth && p.googleEmail)?.googleEmail;
    if (profiles.length > 0 && targetEmail) {
      saveToRegistry(targetEmail, profiles);
    }

    setProfiles([]);
    setActiveProfileId(null);
    setCurrentGoogleEmail(null);
    try {
      localStorage.removeItem(STORAGE_PROFILES_KEY);
      localStorage.removeItem(STORAGE_ACTIVE_ID_KEY);
      localStorage.removeItem(STORAGE_CURRENT_GOOGLE_USER_KEY);
    } catch {
      // ignore
    }
    setRestoredNotice('로그아웃되었습니다. 화면에서 내정보가 완전히 감춰졌으며 세션 캐시가 안전하게 삭제되었습니다.');
  };

  // Complete data & cache wipe (개인정보 및 브라우저 캐시 영구 삭제)
  const clearAllDataAndCache = () => {
    setProfiles([]);
    setActiveProfileId(null);
    setCurrentGoogleEmail(null);
    setSavedGoogleAccounts([]);
    try {
      localStorage.removeItem(STORAGE_PROFILES_KEY);
      localStorage.removeItem(STORAGE_ACTIVE_ID_KEY);
      localStorage.removeItem(STORAGE_SAVED_GOOGLE_KEY);
      localStorage.removeItem(STORAGE_REGISTRY_KEY);
      localStorage.removeItem(STORAGE_CURRENT_GOOGLE_USER_KEY);
      // Clean all unsu_ keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('unsu_')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    } catch {
      // ignore
    }
    setRestoredNotice('모든 개인정보와 브라우저 캐시가 완전히 삭제되었습니다.');
  };

  return (
    <UserContext.Provider
      value={{
        profiles,
        activeProfile,
        activeProfileId,
        setActiveProfileId,
        saveProfile,
        createNextAcquaintance,
        deleteProfile,
        savedGoogleAccounts,
        isGoogleModalOpen,
        openGoogleModal,
        closeGoogleModal,
        isMyInfoModalOpen,
        openMyInfoModal,
        closeMyInfoModal,
        isReportModalOpen,
        openReportModal,
        closeReportModal,
        signInWithSavedGoogleAccount,
        signInWithGoogleManual,
        signInWithGoogleOneClick,
        removeSavedGoogleAccount,
        signOut,
        clearAllDataAndCache,
        isRegistered,
        currentGoogleEmail,
        restoredNotice,
        clearRestoredNotice,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
