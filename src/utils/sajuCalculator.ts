import { FiveElement, SajuPillar, SajuResult } from '../types/fortune';

export const HEAVENLY_STEMS: { name: string; hanja: string; element: FiveElement }[] = [
  { name: '갑', hanja: '甲', element: '목' },
  { name: '을', hanja: '乙', element: '목' },
  { name: '병', hanja: '丙', element: '화' },
  { name: '정', hanja: '丁', element: '화' },
  { name: '무', hanja: '戊', element: '토' },
  { name: '기', hanja: '己', element: '토' },
  { name: '경', hanja: '庚', element: '금' },
  { name: '신', hanja: '辛', element: '금' },
  { name: '임', hanja: '壬', element: '수' },
  { name: '계', hanja: '癸', element: '수' },
];

export const EARTHLY_BRANCHES: { name: string; hanja: string; element: FiveElement; animal: string }[] = [
  { name: '자', hanja: '子', element: '수', animal: '쥐' },
  { name: '축', hanja: '丑', element: '토', animal: '소' },
  { name: '인', hanja: '寅', element: '목', animal: '호랑이' },
  { name: '묘', hanja: '卯', element: '목', animal: '토끼' },
  { name: '진', hanja: '辰', element: '토', animal: '용' },
  { name: '사', hanja: '巳', element: '화', animal: '뱀' },
  { name: '오', hanja: '午', element: '화', animal: '말' },
  { name: '미', hanja: '未', element: '토', animal: '양' },
  { name: '신', hanja: '申', element: '금', animal: '원숭이' },
  { name: '유', hanja: '酉', element: '금', animal: '닭' },
  { name: '술', hanja: '戌', element: '토', animal: '개' },
  { name: '해', hanja: '亥', element: '수', animal: '돼지' },
];

export const ELEMENT_INFO: Record<FiveElement, { name: string; hanja: string; color: string; hex: string; desc: string; keywords: string[] }> = {
  목: {
    name: '목(木)',
    hanja: '木',
    color: '청색(청록)',
    hex: '#10b981',
    desc: '푸른 나무의 기운으로 봄의 생명력, 곧은 의지, 기획력과 성장을 의미합니다.',
    keywords: ['성장', '창의', '인정', '진취성', '이상'],
  },
  화: {
    name: '화(火)',
    hanja: '火',
    color: '적색(주황/붉은색)',
    hex: '#ef4444',
    desc: '타오르는 불의 기운으로 여름의 활기, 열정, 표현력과 사람을 끄는 매력을 뜻합니다.',
    keywords: ['열정', '표현력', '예술', '리더십', '화려함'],
  },
  토: {
    name: '토(土)',
    hanja: '土',
    color: '황색(노란색/갈색)',
    hex: '#f59e0b',
    desc: '대지의 기운으로 계절의 환절기, 포용력, 흔들리지 않는 신뢰와 묵직한 안정을 의미합니다.',
    keywords: ['신용', '포용', '중재', '안정', '끈기'],
  },
  금: {
    name: '금(金)',
    hanja: '金',
    color: '백색(은색/금색)',
    hex: '#94a3b8',
    desc: '단단한 바위와 쇠의 기운으로 가을의 결실, 명확한 결단력, 냉철한 판단과 원칙을 뜻합니다.',
    keywords: ['결단', '원칙', '의리', '결실', '정밀함'],
  },
  수: {
    name: '수(水)',
    hanja: '水',
    color: '흑색(감청/네이비)',
    hex: '#3b82f6',
    desc: '흐르는 물의 기운으로 겨울의 지혜, 깊은 통찰력, 유연한 적응력과 침착함을 의미합니다.',
    keywords: ['지혜', '유연성', '통찰', '기획', '인내'],
  },
};

export const DAY_MASTER_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  갑: {
    title: '동량지목(棟樑之木) - 큰 나무',
    description: '곧게 뻗은 아름드리 큰 소나무처럼 리더십이 강하고 자존심과 뚝심이 있으며 타인에게 기대기보다 베푸는 기질입니다.',
  },
  을: {
    title: '초목화초(草木花草) - 유연한 꽃과 풀',
    description: '바람에 꺾이지 않는 유연한 들꽃처럼 끈질긴 생명력과 사교성, 현실 적응력과 예술적 감각이 뛰어납니다.',
  },
  병: {
    title: '태양지화(太陽之火) - 하늘의 태양',
    description: '하늘에 빛나는 태양처럼 뒤끝 없이 밝고 매사 당당하며 적극적인 에너지를 주변에 전파하는 솔직 담백한 리더입니다.',
  },
  정: {
    title: '등촉지화(燈燭之火) - 촛불과 달빛',
    description: '어둠을 밝히는 은은한 촛불이나 모닥불처럼 내면이 섬세하고 온화하며 학구열과 헌신적인 면모를 지녔습니다.',
  },
  무: {
    title: '태산지토(泰山之土) - 우뚝 솟은 큰 산',
    description: '중후하고 듬직한 태산처럼 믿음직스럽고 비밀을 잘 지키며 주변 사람들을 품어주는 넓은 포용력을 자랑합니다.',
  },
  기: {
    title: '전원지토(田園之土) - 비옥한 전원',
    description: '곡식을 길러내는 기름진 밭처럼 다정다감하고 사람을 잘 키워내며 실속과 순발력을 겸비한 현실파입니다.',
  },
  경: {
    title: '원석괴강(原石魁罡) - 단단한 무쇠와 바위',
    description: '제련되지 않은 웅장한 쇠나 바위처럼 의리와 결단력이 남다르며 맺고 끊음이 분명하고 추진력이 대단합니다.',
  },
  신: {
    title: '주옥보석(珠玉寶石) - 정교한 보석과 칼',
    description: '정밀하게 다듬어진 다이아몬드처럼 깔끔하고 섬세하며 자존감이 높고 미적 감각과 정확한 판단력이 돋보입니다.',
  },
  임: {
    title: '대해지수(大海之水) - 드넓은 바다와 큰 강',
    description: '모든 물을 받아들이는 큰 바다처럼 스케일이 크고 임기응변에 능하며 지혜와 포용력이 깊은 전략가입니다.',
  },
  계: {
    title: '우로지수(雨露之水) - 촉촉한 이슬비와 샘물',
    description: '만물을 적시는 단비처럼 유순하고 지혜로우며 뛰어난 통찰력과 직관으로 사람의 마음을 꿰뚫어봅니다.',
  },
};

/**
 * Calculates accurate 4 pillars (Year, Month, Day, Hour) based on standard sexagenary cycle algorithms
 */
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female',
  calendarType: 'solar' | 'lunar' = 'solar'
): SajuResult {
  // 1. Year Pillar: Standard base 4 AD = 갑자년 (index 0)
  // Adjusted offset: (year - 4) % 60
  const yearOffset = (year - 4) % 60;
  const yearStemIdx = (yearOffset % 10 + 10) % 10;
  const yearBranchIdx = (yearOffset % 12 + 12) % 12;

  // 2. Month Pillar: Month Branch starts with 인(寅)=month 1 (approx Feb in Solar/Lunar calendar)
  // Heavenly stem of month depends on year stem (오호둔월법 / 五虎遁月法)
  // 甲己년 -> 丙寅월 시작, 乙庚년 -> 戊寅월 시작, 丙辛년 -> 庚寅월, 丁壬년 -> 壬寅월, 戊癸년 -> 甲寅월
  const monthBranchStartIdx = 2; // 寅 (index 2 in earthly branches)
  const monthBranchIdx = (monthBranchStartIdx + (month - 1)) % 12;
  const monthStemBase = ((yearStemIdx % 5) * 2 + 2) % 10;
  const monthStemIdx = (monthStemBase + (month - 1)) % 10;

  // 3. Day Pillar: Julian day count reference
  // Base reference date: 2000-01-01 was 戊午 (Mu-Oh, stem 4, branch 6)
  const refDate = new Date(Date.UTC(2000, 0, 1));
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const diffDays = Math.floor((targetDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = (diffDays % 60 + 60) % 60;
  const dayStemIdx = (4 + dayOffset) % 10;
  const dayBranchIdx = (6 + dayOffset) % 12;

  // 4. Hour Pillar: 12 Shijin (2-hour increments)
  // 23:30 ~ 01:30 = 자(0), 01:30 ~ 03:30 = 축(1), ...
  let hourBranchIdx = 0;
  if (hour >= 23 || hour < 1) hourBranchIdx = 0; // 자
  else if (hour >= 1 && hour < 3) hourBranchIdx = 1; // 축
  else if (hour >= 3 && hour < 5) hourBranchIdx = 2; // 인
  else if (hour >= 5 && hour < 7) hourBranchIdx = 3; // 묘
  else if (hour >= 7 && hour < 9) hourBranchIdx = 4; // 진
  else if (hour >= 9 && hour < 11) hourBranchIdx = 5; // 사
  else if (hour >= 11 && hour < 13) hourBranchIdx = 6; // 오
  else if (hour >= 13 && hour < 15) hourBranchIdx = 7; // 미
  else if (hour >= 15 && hour < 17) hourBranchIdx = 8; // 신
  else if (hour >= 17 && hour < 19) hourBranchIdx = 9; // 유
  else if (hour >= 19 && hour < 21) hourBranchIdx = 10; // 술
  else hourBranchIdx = 11; // 해

  // Hour stem depends on day stem (오서둔시법 / 五鼠遁時法)
  // 甲己일 -> 甲子시, 乙庚일 -> 丙子시, 丙辛일 -> 戊子시, 丁壬일 -> 庚子시, 戊癸일 -> 壬子시
  const hourStemBase = ((dayStemIdx % 5) * 2) % 10;
  const hourStemIdx = (hourStemBase + hourBranchIdx) % 10;

  const createPillar = (sIdx: number, bIdx: number): SajuPillar => {
    const s = HEAVENLY_STEMS[sIdx];
    const b = EARTHLY_BRANCHES[bIdx];
    return {
      stem: s.name,
      stemHanja: s.hanja,
      stemElement: s.element,
      branch: b.name,
      branchHanja: b.hanja,
      branchElement: b.element,
      branchAnimal: b.animal,
    };
  };

  const yearPillar = createPillar(yearStemIdx, yearBranchIdx);
  const monthPillar = createPillar(monthStemIdx, monthBranchIdx);
  const dayPillar = createPillar(dayStemIdx, dayBranchIdx);
  const hourPillar = createPillar(hourStemIdx, hourBranchIdx);

  // Count Five Elements across 8 characters (사주팔자 / 8글자)
  const elementCounts: Record<FiveElement, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const allElements = [
    yearPillar.stemElement,
    yearPillar.branchElement,
    monthPillar.stemElement,
    monthPillar.branchElement,
    dayPillar.stemElement,
    dayPillar.branchElement,
    hourPillar.stemElement,
    hourPillar.branchElement,
  ];

  allElements.forEach((el) => {
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  });

  // Find dominant and lacking element
  const sortedElements = (Object.keys(elementCounts) as FiveElement[]).sort(
    (a, b) => elementCounts[b] - elementCounts[a]
  );
  const dominantElement = sortedElements[0];
  const lackingElement = sortedElements[sortedElements.length - 1];

  const dayMasterKey = dayPillar.stem;
  const dayMasterInfo = DAY_MASTER_DESCRIPTIONS[dayMasterKey] || {
    title: `${dayMasterKey}의 기운`,
    description: '균형 잡힌 사주 기운으로 본인의 의지가 확고합니다.',
  };

  // Generate personalized analysis
  const natureAnalysis = `타고난 본성(일간)은 '${dayMasterKey}(${dayPillar.stemHanja})'으로, ${dayMasterInfo.description} 사주에 ${ELEMENT_INFO[dominantElement].name}의 기운이 ${elementCounts[dominantElement]}개로 강하게 작용하여 ${ELEMENT_INFO[dominantElement].keywords.join(', ')} 등의 성향이 두드러지게 발현됩니다.`;

  const remedies: Record<FiveElement, { advice: string; color: string; food: string }> = {
    목: {
      advice: '푸른 숲을 자주 걷거나 식물을 가꾸고, 새로운 기획과 독서로 목(木)의 생기 넘치는 진취성을 채워보세요.',
      color: '초록색, 에메랄드, 청록색',
      food: '신선한 샐러드, 녹차, 사과, 나물류',
    },
    화: {
      advice: '따뜻한 햇볕을 쬐며 유산소 운동을 하고, 대인 관계에서 적극적인 소통과 밝은 에너지를 발산해보세요.',
      color: '붉은색, 와인색, 주황색, 핑크',
      food: '매콤한 요리, 토마토, 석류, 홍삼차',
    },
    토: {
      advice: '등산이나 흙을 밟는 맨발 걷기를 추천하며, 중심을 잡고 약속과 신뢰를 지키는 차분한 마음가짐이 길합니다.',
      color: '노란색, 베이지, 카멜, 황토색',
      food: '고구마, 단호박, 잡곡밥, 꿀, 된장국',
    },
    금: {
      advice: '주변을 단정하게 정돈하고 미니멀리즘을 실천하며, 결단력과 명확한 우선순위를 세워 실천하면 길운이 열립니다.',
      color: '화이트, 실버, 골드, 메탈릭',
      food: '도라지차, 배, 양파, 백미, 견과류',
    },
    수: {
      advice: '충분한 수면과 수분 섭취, 명상이나 목욕으로 심신을 정화하며, 깊은 통찰과 유연한 사고를 키우는 것이 좋습니다.',
      color: '블랙, 네이비, 딥블루, 챠콜',
      food: '검은콩, 해조류(미역, 다시마), 블루베리, 흑임자',
    },
  };

  const currentRemedy = remedies[lackingElement];

  return {
    birthInfo: { year, month, day, hour, gender, calendarType },
    fourPillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    elementCounts,
    dominantElement,
    lackingElement,
    dayMaster: {
      stem: dayMasterKey,
      element: dayPillar.stemElement,
      title: dayMasterInfo.title,
      description: dayMasterInfo.description,
    },
    natureAnalysis,
    fortuneAdvice: `현재 사주에서 보완이 필요한 기운은 '${ELEMENT_INFO[lackingElement].name}'입니다. ${currentRemedy.advice}`,
    remedyColor: currentRemedy.color,
    remedyFood: currentRemedy.food,
  };
}

export const ZODIAC_IDS_BY_BRANCH_INDEX = [
  'rat',     // 0: 자 (쥐)
  'ox',      // 1: 축 (소)
  'tiger',   // 2: 인 (호랑이)
  'rabbit',  // 3: 묘 (토끼)
  'dragon',  // 4: 진 (용)
  'snake',   // 5: 사 (뱀)
  'horse',   // 6: 오 (말)
  'sheep',   // 7: 미 (양)
  'monkey',  // 8: 신 (원숭이)
  'rooster', // 9: 유 (닭)
  'dog',     // 10: 술 (개)
  'pig',     // 11: 해 (돼지)
] as const;

export function getZodiacIdByBirthYear(year: number): string {
  const yearOffset = (year - 4) % 60;
  const yearBranchIdx = (yearOffset % 12 + 12) % 12;
  return ZODIAC_IDS_BY_BRANCH_INDEX[yearBranchIdx] || 'rat';
}

export function getConstellationIdByBirthDate(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries'; // 03.21 ~ 04.19
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus'; // 04.20 ~ 05.20
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'gemini'; // 05.21 ~ 06.21
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'cancer'; // 06.22 ~ 07.22
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo'; // 07.23 ~ 08.22
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo'; // 08.23 ~ 09.22
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra'; // 09.23 ~ 10.22
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio'; // 10.23 ~ 11.21
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius'; // 11.22 ~ 12.21
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn'; // 12.22 ~ 01.19
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius'; // 01.20 ~ 02.18
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces'; // 02.19 ~ 03.20
  return 'aries';
}

