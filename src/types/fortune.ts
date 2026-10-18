export interface UserProfile {
  id: string; // 'profile-1', 'profile-2', etc.
  label: string; // '내 정보', '내 정보 2 (지인)', '내 정보 3'
  name: string;
  relationship?: string; // '본인', '가족', '연인', '친구', '동료'
  gender: 'male' | 'female';
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  birthHour: number; // 0~23, default 12
  isUnknownHour: boolean;
  calendarType: 'solar' | 'lunar';
  isBirthInfoCompleted: boolean; // True ONLY after user fills name & birth date
  isGoogleAuth?: boolean;
  googleEmail?: string;
  createdAt: string;
}

export interface FortuneCategoryDetail {
  score: number;
  text: string; // Detailed 3~4 lines of flow (both good and bad aspects)
  easyText?: string; // 한눈에 이해되는 쉬운 말 한줄 표현
  warning: string; // Real risks / pitfalls to watch out for
  advice: string; // Specific actionable remedy / avoidance strategy
}

export interface HourlyNarrative {
  time: string;
  title: string;
  narrative: string; // 3~4 lines of descriptive text
}

export interface TodayFortune {
  date: string;
  totalScore: number; // 0 to 100
  title: string;
  summary: string;
  easySummary: string; // 쉬운 말 일상 언어 표현
  elements: {
    wealth: FortuneCategoryDetail;
    love: FortuneCategoryDetail;
    career: FortuneCategoryDetail;
    health: FortuneCategoryDetail;
  };
  hourlyFlow: {
    morning: HourlyNarrative;
    afternoon: HourlyNarrative;
    evening: HourlyNarrative;
    night: HourlyNarrative;
  };
  luckyElements: {
    number: number[];
    color: { name: string; hex: string; desc: string };
    direction: string;
    food: string;
    animal: string;
    item: string;
  };
  aphorism: {
    phrase: string;
    source: string;
    meaning: string;
  };
}

export type FiveElement = '목' | '화' | '토' | '금' | '수';

export interface SajuPillar {
  stem: string; // 천간 (갑, 을, 병, 정...)
  stemHanja: string;
  stemElement: FiveElement;
  branch: string; // 지지 (자, 축, 인, 묘...)
  branchHanja: string;
  branchElement: FiveElement;
  branchAnimal: string;
}

export interface SajuResult {
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'male' | 'female';
    calendarType: 'solar' | 'lunar';
  };
  fourPillars: {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    hour: SajuPillar;
  };
  elementCounts: Record<FiveElement, number>;
  dominantElement: FiveElement;
  lackingElement: FiveElement;
  dayMaster: {
    stem: string;
    element: FiveElement;
    title: string;
    description: string;
  };
  natureAnalysis: string;
  fortuneAdvice: string;
  remedyColor: string;
  remedyFood: string;
}

export interface ZodiacSign {
  id: string;
  name: string;
  hanja: string;
  symbol: string;
  years: number[];
  generalToday: string;
  specificYears: { year: number; age: number; fortune: string; rating: number }[];
  luckyScore: number;
}

export interface ConstellationSign {
  id: string;
  name: string;
  english: string;
  symbol: string;
  period: string;
  score: number;
  love: string;
  money: string;
  work: string;
  luckyTip: string;
}

export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  upright: {
    meaning: string;
    love: string;
    wealth: string;
    career: string;
  };
  reversed: {
    meaning: string;
    love: string;
    wealth: string;
    career: string;
  };
  imageSymbol: string;
}

export interface FortuneCookieItem {
  id: string;
  message: string;
  koreanQuote: string;
  authorOrSource: string;
  luckyNumbers: number[];
}

export interface TalismanTemplate {
  id: string;
  title: string;
  hanja: string;
  category: 'wealth' | 'love' | 'success' | 'peace' | 'warding';
  description: string;
  effect: string;
  glyph: string;
  mantra: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  score: number;
  mood: string;
  memo: string;
  tarotCardName?: string;
}
