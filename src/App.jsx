import React, { useState, useEffect } from 'react';

// --- Local Persistence System ---
const STORAGE_KEY = 'solstretch_bookings_v1';
const ADMIN_PIN_KEY = 'solstretch_admin_pin_v1';

const getInitialBookings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return [];
  }
};

const getInitialAdminPin = () => {
  try {
    const savedPin = localStorage.getItem(ADMIN_PIN_KEY);
    return savedPin || '6369';
  } catch (e) {
    return '6369';
  }
};

const IconSparkles = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconCalendar = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheck = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconChevronRight = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconStar = ({ className = "w-4 h-4 fill-amber-400 stroke-amber-400" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IconMapPin = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconPhone = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const IconActivity = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconAcademic = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const IconShieldCheck = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconX = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconMenu = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconChevronDown = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconExternalLink = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconLock = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconTrash = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconKey = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const SolStretchLogo = ({ className = "h-10" }) => (
  <div className={`flex items-center gap-3.5 ${className}`}>
    <svg className="h-10 w-auto shrink-0 filter drop-shadow-sm" viewBox="0 0 130 110" fill="none">
      <path d="M 62 20 C 85 20, 105 38, 105 62 C 105 85, 85 102, 60 102 C 38 102, 22 86, 24 66" stroke="#3C5A76" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="46" cy="18" r="9" fill="#3C5A76" />
      <path d="M 2 38 C 18 37, 34 33, 50 28" stroke="#3C5A76" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M 52 26 C 50 45, 38 72, 12 106 L 20 108 C 45 75, 58 48, 58 26 Z" fill="#3C5A76" />
      <path d="M 50 30 L 76 4 L 82 26 Z" fill="#3C5A76" />
    </svg>
    <div className="flex flex-col justify-center text-left">
      <span className="font-sans font-semibold text-xl leading-none text-[#3C5A76] tracking-tight">스트레칭 온</span>
      <div className="w-full h-[1px] bg-[#3C5A76]/25 my-1"></div>
      <span className="font-sans font-semibold text-[13px] leading-none text-[#3C5A76] tracking-normal">Stretching ON</span>
    </div>
  </div>
);

const PROGRAMS = [
  {
    id: 'p1',
    title: 'Sol-Recovery',
    subtitle: '1:1 컨디셔닝 패시브 스트레칭',
    duration: 50,
    price: 70000,
    originalPrice: 150000,
    badge: 'SIGNATURE',
    description: '관절 가동 범위를 섬세하게 확보하고, 만성적 근육 긴장 완화를 위한 원장의 독자 수기 기본 솔루션입니다.',
    targets: ['만성 목·어깨·다리 통증', '굽은 등 & 자세 불균형', '일상의 본연 가벼움을 원하시는 분']
  },
  {
    id: 'p2',
    title: 'Sol-Balance',
    subtitle: '무브먼트 리밸런스 딥 케어',
    duration: 90,
    price: 100000,
    originalPrice: 250000,
    badge: 'PREMIUM',
    description: '골반 및 척추 구조 불균형의 근본 원인을 수기 측정평가하여 긴장된 근막을 딥 이완하는 정밀 케어입니다.',
    targets: ['골반 비대칭 및 골반 요통', '하체 순환 장애 & 고관절 답답함', '자세 정교화 및 신체 구조 재정립']
  },
  {
    id: 'p3',
    title: '솔루션 멤버십 10회',
    subtitle: '체계적 1:1 맞춤 체형 교정 & 집중 정기 케어 패키지',
    duration: 50,
    price: 600000,
    originalPrice: 1200000,
    badge: 'MEMBERSHIP',
    description: '지속적인 신체 불균형 개선과 올바른 자세 유지를 위한 10회 맞춤 이용권. 가족 및 지인과 자유롭게 차감 공유 가능합니다.',
    targets: ['근본적인 체형 교정이 필요하신 분', '만성 통증 재발 방지', '가족 및 지인 공유 케어']
  }
];

const BRAND_PRINCIPLES = [
  {
    num: '01',
    title: '정밀 스캔 및 원인 측정',
    desc: '단순 압박이 아닙니다. 관절 가동 범위(ROM)와 근막 비대칭을 정밀 측정하여 통증의 일차 원인을 찾아냅니다.'
  },
  {
    num: '02',
    title: '40년 노하우 독자 수기',
    desc: '수만 명의 임상 데이터를 바탕으로 완성된 파트너드 패시브 기법으로, 안전하면서도 확실한 이완을 이끌어냅니다.'
  },
  {
    num: '03',
    title: '삶의 가치 & 재발 방지',
    desc: '케어 후 개인별 자가 관리 리포트와 호흡 가이드를 제공하여 가벼워진 신체 밸런스를 스스로 유지하도록 돕습니다.'
  }
];

const BODY_ZONES = [
  {
    id: 'neck & Shoulder',
    title: '목 & 어깨 (Neck & Shoulder)',
    subtitle: '거북목, 승모근 긴장 완화',
    symptoms: ['스마트폰/모니터 집중 후 목 뻐근함', '승모근 뭉침 및 두통 유발', '어깨 가동범위 제한', '병원에서 스트레칭을 권유받은 분'],
    solution: '경추 및 흉근·승모근 근막 이완, 관절 가동성 확보 수기 솔루션',
    recProgramId: 'p1'
  },
  {
    id: 'waist',
    title: '허리 & 골반 (Pelvis & Back)',
    subtitle: '골반 비대칭, 뻐근한 요통 근본 해소',
    symptoms: ['오래 앉아있으면 요통이 발생함', '양쪽 골반 높이가 다름', '다리를 꼬거나 걸음걸이 불균형', '오래된 통증으로 불편하신 분'],
    solution: '장요근·장골근 딥 이완 및 고관절 회전성 회복 교정 스트레칭',
    recProgramId: 'p2'
  },
  {
    id: 'legs',
    title: '하체 & 순환 (Legs & Circulation)',
    subtitle: '다리 부종, 햄스트링/종아리 단축 해소',
    symptoms: ['저녁만 되면 다리가 쉽게 부음', '유연성 부족으로 허리를 숙이기 힘듦', '발바닥 및 아킬레스건 피로', '종아리에 쥐가 자주 나시는 분'],
    solution: '하체 림프 순환 촉진 및 햄스트링·내덕근 확장 딥 솔루션',
    recProgramId: 'p1'
  },
  {
    id: 'full',
    title: '전신 피로 & 신체 불균형 (Full Body)',
    subtitle: '만성 피로 해소 및 신체 구조 평온함 회복',
    symptoms: ['자고 일어나도 온몸이 찌뿌둥함', '몸 전체의 자세가 틀어진 느낌', '삶의 질을 높이는 가벼움 절실', '수술 후 빠른회복을 원하시는 분'],
    solution: '전신 솔루션 스트레칭으로 신체 밸런스 완전 복원',
    recProgramId: 'p3'
  }
];

const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const GUIDELINES = [
  {
    category: '예약 및 취소/변경 규정',
    badge: 'RESERVATION',
    items: [
      {
        title: '온라인 당일 예약 제한 (100% 사전예약제)',
        desc: '원장의 1:1 집중 정밀 케어를 위해 당일 예약은 없습니다. 당일 관리를 희망하시는 경우 대표 번호(010-6566-6369)로 문의 부탁드립니다.'
      },
      {
        title: '타임 슬롯 당 1명 한정 (중복 예약 자동 차감)',
        desc: '어떤 프로그램을 선택하셔도 동일한 시간대에는 오직 1분의 고객님만 모십니다. 이미 예약된 타임은 마감 처리됩니다.'
      },
      {
        title: '자유로운 일시 변경 및 취소',
        desc: '예약 취소 및 날짜/시간 변경은 방문 3시간 전까지 웹사이트 내 [내 예약] 또는 대표 전화를 통해 수수료 없이 신청하실 수 있습니다.'
      }
    ]
  },
  {
    category: '복장 및 시설 안내',
    badge: 'DRESS CODE',
    items: [
      {
        title: '유니폼 및 탈의실 미운영',
        desc: '스트레칭 온은 별도의 유니폼을 제공하지 않으며 탈의실/파우더룸을 운영하지 않습니다.'
      },
      {
        title: '편안한 복장 착용 후 방문',
        desc: '관절 및 근막의 자율적이고 원활한 이완 움직임을 위해 방문 시 상·하체 움직임이 편안한 복장(운동복 등)을 미리 착용 후 방문해 주세요.'
      }
    ]
  },
  {
    category: '솔루션 멤버십(10회권) 규정',
    badge: 'MEMBERSHIP',
    items: [
      {
        title: '유효기간 2개월',
        desc: '솔루션 멤버십 10회 이용권의 유효기간은 등록일로부터 2개월입니다.'
      },
      {
        title: '당일 예약취소',
        desc: '당일 예약 취소는 예약시간 3시간 전까지 가능하고, 그 이후 또는 불참시는 1회 차감됩니다.'
      },
      {
        title: '가족 및 지인 자유 공유',
        desc: '10회 멤버십 이용권은 본인 외에도 직계 가족 및 지인과 자유롭게 차감 공유하여 함께 이용하실 수 있습니다.'
      }
    ]
  },
  {
    category: '주차 및 위치 / 안전 안내',
    badge: 'PARKING & SAFETY',
    items: [
      {
        title: '건물 내 2시간 무료 주차',
        desc: '벨라미센텀시티 2차 건물 지하 주차장에 2시간 무료 주차가 가능하며, 케어 완료 후 차량 번호를 등록해 드립니다.'
      },
      {
        title: '신체 상태 사전 공유',
        desc: '수술 이력, 디스크 중증 질환, 임신 중이신 경우 케어 진행 전 원장에게 미리 말씀해 주시면 안전을 최우선으로 진행합니다.'
      }
    ]
  }
];

const REVIEWS = [
  {
    name: '김*아 님',
    job: 'IT 개발팀 리더',
    program: 'Sol-Recovery 시그니처 (50분)',
    comment: '단순 피로 해소 마사지인 줄 알았는데, 제 체형의 불균형 원인을 정확히 짚어주셨습니다. 50분 만에 몸의 가벼움이 완전히 달라졌고 일상 속 집중력이 눈에 띄게 높아졌습니다.',
    rating: 5,
    date: '2026.07.28'
  },
  {
    name: '박*진 님',
    job: '운수업',
    program: 'SOL-Balance 프리미엄 (90분)',
    comment: '오래된 골반,허리통증으로 많이 고생했습니다. 원장님의 해부학적 수기 이완 덕분에 걸음걸이가 편해지고 밤마다 느끼던 뻐근함이 크게 줄어 삶의 질이 향상되었습니다.',
    rating: 5,
    date: '2026.07.24'
  },
  {
    name: '최*진 님',
    job: '사무직 임원',
    program: '솔루션 멤버십 10회',
    comment: '정기적으로 체형을 바르게 잡아가면서 어깨 가동범위가 정상으로 돌아왔습니다. 내 몸의 가치를 되찾아주는 최고 수준의 1:1 케어 스튜디오입니다.',
    rating: 5,
    date: '2026.07.19'
  }
];

const FAQS = [
  {
    q: '일반 마사지나 도수치료와 무엇이 다른가요?',
    a: '스트레칭 온은 단순 압박이나 일시적 마사지가 아닙니다. 40여년 임상 경험을 가진 원장이 직접 관절 가동성(Mobility)과 근막 비대칭을 측정 평가하여 1:1 맞춤 수기 이완 및 교정 스트레칭을 진행합니다.'
  },
  {
    q: '동일 시간대에 다른 사람과 예약이 겹치지 않나요?',
    a: '네, 원장님 1:1 단독 집중 케어로 진행되므로 프로그램 종류에 관계없이 동일 날짜·시간대에는 오직 1명의 예약만 가능합니다. 먼저 예약된 타임 슬롯은 실시간으로 자동 마감 처리됩니다.'
  },
  {
    q: '당일 방문 예약도 가능한가요?',
    a: '온라인 시스템에서는 정밀한 케어 준비를 위해 최소 방문 1일 전부터만 선택이 가능합니다. 당일 케어를 꼭 원하시는 경우 대표 번호(010-6566-6369)로 연락해 주시면 예약 잔여 시간을 안내해 드립니다.'
  },
  {
    q: '편안한 복장이 준비되어 있나요?',
    a: '아니요, 스트레칭 온은 탈의실 및 별도 유니폼을 제공하지 않습니다. 자율적이고 원활한 가동 이완을 위해 방문 시 움직임이 편안한 복장(운동복 등)을 미리 착용하고 방문해 주시기 바랍니다.'
  }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(BODY_ZONES[0]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Date helper (Tomorrow is min date for online reservation)
  const getTomorrowDateStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Reservation States
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0]);
  const [selectedDate, setSelectedDate] = useState(getTomorrowDateStr);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[2]);
  
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userNote, setUserNote] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Realtime Bookings Array
  const [allBookings, setAllBookings] = useState(getInitialBookings);

  // Admin PIN State
  const [adminPin, setAdminPin] = useState(getInitialAdminPin);
  const [newAdminPinInput, setNewAdminPinInput] = useState('');
  const [showPinChangeForm, setShowPinChangeForm] = useState(false);
  
  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [allBookings]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_PIN_KEY, adminPin);
    } catch (e) {
      console.error('LocalStorage PIN write error:', e);
    }
  }, [adminPin]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setAllBookings(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      } else if (e.key === ADMIN_PIN_KEY && e.newValue) {
        setAdminPin(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Modals
  const [activeModal, setActiveModal] = useState(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // Admin Panel States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminDateFilter, setAdminDateFilter] = useState('');
  
  // Admin Manual Booking Form
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualProgram, setManualProgram] = useState(PROGRAMS[0]);
  const [manualDate, setManualDate] = useState(getTomorrowDateStr);
  const [manualTime, setManualTime] = useState(TIME_SLOTS[0]);
  const [manualNote, setManualNote] = useState('전화 예약 (원장 수기)');

  // Academy Form
  const [academyName, setAcademyName] = useState('');
  const [academyPhone, setAcademyPhone] = useState('');
  const [academyNote, setAcademyNote] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extract booked times for selected date across ALL programs
  const getBookedTimesForDate = (dateStr) => {
    return allBookings
      .filter(b => b.date === dateStr && b.status !== '취소')
      .map(b => b.time);
  };

  const currentBookedTimes = getBookedTimesForDate(selectedDate);

  const handleSelectProgramAndBook = (programId) => {
    const prog = PROGRAMS.find(p => p.id === programId) || PROGRAMS[0];
    setSelectedProgram(prog);
    setBookingStep(2);
    scrollToSection('reservation');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!privacyAgreed) {
      showToast('개인정보 수집 및 이용 동의에 동의해 주세요.');
      return;
    }
    if (!userName.trim() || !userPhone.trim()) {
      showToast('성함과 연락처를 빠짐없이 입력해 주세요.');
      return;
    }

    // Double Booking Prevention Check
    const isAlreadyBooked = currentBookedTimes.includes(selectedTime);
    if (isAlreadyBooked) {
      showToast(`이미 ${selectedDate} ${selectedTime} 시간대는 예약이 마감되었습니다. 다른 시간대를 선택해 주세요.`);
      return;
    }

    const bookingId = 'SOL-' + Math.floor(100000 + Math.random() * 900000);
    const newBookingData = {
      id: bookingId,
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      duration: selectedProgram.duration,
      price: selectedProgram.price,
      date: selectedDate,
      time: selectedTime,
      name: userName.trim(),
      phone: userPhone.trim(),
      note: userNote.trim(),
      status: '예약 확정',
      createdAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setAllBookings(prev => [newBookingData, ...prev]);
    setLastConfirmedBooking(newBookingData);
    setActiveModal('booking-success');

    // 실시간 알림톡/문자 발송 API 호출
    try {
      fetch('/api/send-alimtalk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingData)
      }).catch(err => console.error('Solapi notification trigger error:', err));
    } catch (err) {
      console.error(err);
    }
    
    // Clear form
    setUserName('');
    setUserPhone('');
    setUserNote('');
    setPrivacyAgreed(false);
  };

  // Admin Manual Phone Reservation Handler
  const handleAdminManualBooking = (e) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      showToast('고객 성함과 연락처를 입력해 주세요.');
      return;
    }

    const bookedTimes = getBookedTimesForDate(manualDate);
    if (bookedTimes.includes(manualTime)) {
      showToast(`[알림] ${manualDate} ${manualTime}은 이미 다른 예약이 존재합니다.`);
      return;
    }

    const newManualBooking = {
      id: 'DIR-' + Math.floor(100000 + Math.random() * 900000),
      programId: manualProgram.id,
      programTitle: manualProgram.title,
      duration: manualProgram.duration,
      price: manualProgram.price,
      date: manualDate,
      time: manualTime,
      name: manualName.trim(),
      phone: manualPhone.trim(),
      note: manualNote.trim(),
      status: '예약 확정 (원장 직접)',
      createdAt: new Date().toLocaleDateString('ko-KR')
    };

    setAllBookings(prev => [newManualBooking, ...prev]);
    showToast(`${manualName}님 전화예약시간(${manualDate} ${manualTime})이 성공적으로 잠금 마감되었습니다.`);
    setManualName('');
    setManualPhone('');
  };

  // Cancel / Delete Booking Handler
  const handleDeleteBooking = (bookingToDelete) => {
    setAllBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
    showToast(`예약번호 [${bookingToDelete.id}] 예약이 취소 처리되었습니다.`);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === adminPin) {
      setIsAdminAuthenticated(true);
      setActiveModal('admin-dashboard');
      setAdminPinInput('');
      showToast('원장님 관리자 모드로 로그인되었습니다.');
    } else {
      showToast('비밀번호가 올바르지 않습니다.');
    }
  };

  // Dynamic Password Change Handler
  const handleChangeAdminPin = (e) => {
    e.preventDefault();
    if (!newAdminPinInput.trim() || newAdminPinInput.trim().length < 4) {
      showToast('새 비밀번호는 최소 4자리 이상 입력해 주세요.');
      return;
    }
    setAdminPin(newAdminPinInput.trim());
    showToast(`관리자 비밀번호가 성공적으로 변경되었습니다.`);
    setNewAdminPinInput('');
    setShowPinChangeForm(false);
  };

  const handleAcademySubmit = (e) => {
    e.preventDefault();
    if (!academyName.trim() || !academyPhone.trim()) {
      showToast('성함과 연락처를 입력해 주세요.');
      return;
    }
    showToast(`${academyName}님, 지도자 교육과정 수강 상담 신청이 완료되었습니다. 원장이 빠르게 연락드리겠습니다.`);
    setAcademyName('');
    setAcademyPhone('');
    setAcademyNote('');
    setActiveModal(null);
  };

  const openMapSearch = (type) => {
    const query = "스트레칭 온";
    if (type === 'naver') {
      window.open(`https://map.naver.com/p/search/${encodeURIComponent(query)}`, '_blank');
    } else if (type === 'kakao') {
      window.open(`https://map.kakao.com/link/search/${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0C3559] font-sans selection:bg-[#0092B8]/20 selection:text-[#0C3559] antialiased">
      
      {/* Pretendard Font Setup */}
      <link rel="stylesheet" as="style" crossOrigin="true" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      <style>{`
        body { 
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; 
          letter-spacing: -0.01em;
          line-height: 1.6;
          font-weight: 400;
          word-break: keep-all;
        }
      `}</style>

      {/* --- Toast Notification --- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C3559] text-white px-6 py-4 rounded-2xl shadow-2xl border border-sky-400/30 flex items-center gap-3 animate-bounce">
          <IconSparkles className="w-5 h-5 text-sky-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* --- Header Navigation --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-stone-200/80 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer group hover:opacity-95 transition-all"
          >
            <SolStretchLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[15px] font-semibold text-[#0C3559]/80">
            <button onClick={() => scrollToSection('brand-story')} className="hover:text-[#0092B8] transition-colors py-1">브랜드 철학</button>
            <button onClick={() => scrollToSection('body-zones')} className="hover:text-[#0092B8] transition-colors py-1">부위별 솔루션</button>
            <button onClick={() => scrollToSection('programs')} className="hover:text-[#0092B8] transition-colors py-1">프로그램</button>
            <button onClick={() => scrollToSection('academy')} className="hover:text-[#0092B8] transition-colors py-1">아카데미</button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-[#0092B8] transition-colors py-1">고객 경험</button>
            <button onClick={() => scrollToSection('location')} className="hover:text-[#0092B8] transition-colors py-1">이용 안내</button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => setActiveModal(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-all flex items-center gap-1.5"
              title="원장 전용 예약 대시보드"
            >
              <IconLock className="w-3.5 h-3.5 text-amber-700" />
              {isAdminAuthenticated ? '원장님 관리자' : '관리자'}
            </button>

            {allBookings.length > 0 && (
              <button 
                onClick={() => setActiveModal('my-bookings')}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-[#0C3559] transition-all flex items-center gap-1.5 border border-stone-200"
              >
                <IconCalendar className="w-3.5 h-3.5 text-[#0092B8]" />
                내 예약 ({allBookings.length})
              </button>
            )}

            <button
              onClick={() => scrollToSection('reservation')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0C3559] text-white hover:bg-[#082239] transition-all flex items-center gap-1.5 shadow-sm"
            >
              온라인 1:1 예약
              <IconChevronRight className="w-3.5 h-3.5 text-sky-300" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setActiveModal(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="p-2 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 border border-amber-200"
            >
              <IconLock className="w-4 h-4" />
            </button>

            {allBookings.length > 0 && (
              <button 
                onClick={() => setActiveModal('my-bookings')}
                className="p-2 rounded-full bg-stone-100 text-[#0C3559] text-xs font-semibold px-3 border border-stone-200"
              >
                예약 {allBookings.length}
              </button>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#0C3559] hover:opacity-80 rounded-xl bg-stone-100"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-stone-200 px-6 py-6 flex flex-col gap-3 text-base font-semibold text-[#0C3559] shadow-2xl">
            <button onClick={() => scrollToSection('brand-story')} className="text-left py-2.5 border-b border-stone-100">브랜드 철학</button>
            <button onClick={() => scrollToSection('body-zones')} className="text-left py-2.5 border-b border-stone-100">부위별 솔루션</button>
            <button onClick={() => scrollToSection('programs')} className="text-left py-2.5 border-b border-stone-100">프로그램</button>
            <button onClick={() => scrollToSection('academy')} className="text-left py-2.5 border-b border-stone-100">아카데미</button>
            <button onClick={() => scrollToSection('reviews')} className="text-left py-2.5 border-b border-stone-100">고객 경험</button>
            <button onClick={() => scrollToSection('location')} className="text-left py-2.5 border-b border-stone-100">이용 안내</button>
            <button 
              onClick={() => scrollToSection('reservation')}
              className="mt-3 w-full py-4 rounded-2xl bg-[#0C3559] text-white font-semibold text-center shadow-lg text-sm"
            >
              1:1 맞춤 예약하기
            </button>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-stone-200/80 shadow-sm text-xs font-semibold text-[#0C3559] mb-6 backdrop-blur-md">
            <IconSparkles className="w-3.5 h-3.5 text-[#0092B8]" />
            <span>40년 임상 수기 기술 · 근골격계 불균형 솔루션</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0C3559] tracking-tight leading-snug mb-6">
            통증을 원인부터 해소하고, <br className="hidden sm:inline" />
            몸 본연의 자유로움과 평온을 되찾다
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#0C3559]/80 font-normal leading-relaxed mb-8">
            단순 피로 회복을 위한 1회성 케어가 아닙니다.<br className="hidden sm:inline" />
            40여년의 수기 임상 노하우로 체형 불균형의 정밀한 원인을 측정하고, 삶의 질을 바꾸는 1:1 솔루션 스트레칭을 선보입니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <button
              onClick={() => scrollToSection('reservation')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0C3559] text-white font-semibold text-xs sm:text-sm hover:bg-[#082239] transition-all shadow-md flex items-center justify-center gap-2"
            >
              온라인 1:1 예약하기
              <IconChevronRight className="w-4 h-4 text-sky-300" />
            </button>
            <button
              onClick={() => scrollToSection('brand-story')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white border border-stone-300 text-[#0C3559] font-medium text-xs sm:text-sm hover:bg-stone-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              브랜드 철학 알아보기
            </button>
          </div>

          {/* Stats Bar */}
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xl text-left grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-sky-50 text-[#0092B8] shrink-0">
                <IconActivity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-[#0C3559]">40여년</p>
                <p className="text-xs sm:text-sm text-[#0C3559]/75 font-semibold mt-0.5">축적된 원장 체형수기 임상 경험</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-sky-50 text-[#0092B8] shrink-0">
                <IconAcademic className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-[#0C3559]">100%</p>
                <p className="text-xs sm:text-sm text-[#0C3559]/75 font-semibold mt-0.5">1:1 단독 맞춤 수기 솔루션</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-sky-50 text-[#0092B8] shrink-0">
                <IconSparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-[#0C3559]">99.4%</p>
                <p className="text-xs sm:text-sm text-[#0C3559]/75 font-semibold mt-0.5">고객 신체 가동성 개선 만족도</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Brand Story Section --- */}
      <section id="brand-story" className="py-24 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                  alt="스트레칭 온 공간" 
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C3559]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg">
                  <p className="text-[#0C3559] text-sm sm:text-base font-semibold leading-relaxed">
                    "단순한 주무름이 아닌, 인체 본연의 관절 가동성과 균형을 회복시키는 깊이 있는 1:1 테크닉"
                  </p>
                  <p className="text-xs text-[#0092B8] font-semibold mt-1.5">SOLSTRETCH 솔루션스트레칭</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase bg-sky-50 px-3.5 py-1.5 rounded-full">
                THE SOLSTRETCH BRAND STORY
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0C3559] leading-snug">
                몸의 불균형을 근본부터 해결하여 <br />
                삶 전체의 깊은 평온을 되찾아 주는 공간
              </h2>

              <p className="text-[#0C3559]/80 text-xs sm:text-sm leading-relaxed font-normal">
                현대인의 굳어진 근육과 비틀어진 골반은 단순한 피로가 아닌 신체 구조적 신호입니다. 
                스트레칭 온의 프리미엄 브랜드 <strong className="text-[#0C3559] font-semibold">SOLSTRETCH(솔루션스트레칭)</strong>는 일시적인 통증 차단을 지양하고, 40여년 집약된 해부학적 수기 분석을 통해 근골격계와 관절의 가동 범위를 안전하고 정교하게 확장시킵니다.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-[#0C3559] text-white shrink-0 mt-0.5">
                    <IconCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0C3559] text-sm">정밀 모빌리티 측정 평가</h3>
                    <p className="text-xs text-[#0C3559]/70 mt-0.5">방문 즉시 관절 제한 범위와 관절막·근막 불균형 지점을 과학적으로 측정평가</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-[#0C3559] text-white shrink-0 mt-0.5">
                    <IconCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0C3559] text-sm">40년 수기 테크닉 기반 패시브 솔루션</h3>
                    <p className="text-xs text-[#0C3559]/70 mt-0.5">호흡과 신체 이완 반사를 활용한 고도의 수기 가동성 회복 케어</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-[#0C3559] text-white shrink-0 mt-0.5">
                    <IconCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0C3559] text-sm">맞춤형 자가 관리 및 자세 로드맵</h3>
                    <p className="text-xs text-[#0C3559]/70 mt-0.5">케어 후 스스로 평온한 신체 상태를 유지할 수 있도록 1:1 운동 가이드 제공</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meaning of SolStretch */}
          <div className="bg-gradient-to-br from-[#0C3559] via-[#082239] to-[#051829] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-semibold text-sky-300 tracking-widest uppercase bg-white/10 px-3.5 py-1 rounded-full">
                THE ETYMOLOGY OF SOLSTRETCH
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-4 mb-3 leading-tight">
                브랜드가 약속하는 3가지 핵심 밸류, <span className="text-sky-300 font-bold">SOL</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                상호명 <strong className="text-white font-semibold">스트레칭 온(Stretching ON)</strong>이 추구하는 근본적 브랜드 가치 <strong className="text-sky-300 font-semibold">SOLSTRETCH</strong>는 인체의 문제 해결을 넘어, 따스한 온기와 완전한 회복을 상징합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center font-bold text-lg font-mono">
                  01
                </div>
                <div>
                  <span className="text-xs text-sky-300 font-semibold tracking-wider block uppercase">SOLUTION</span>
                  <h4 className="text-base font-semibold text-white mt-0.5 mb-2">근본적 문제 해결</h4>
                </div>
                <p className="text-xs text-stone-300 font-normal leading-relaxed">
                  단순 일시적 자극이나 마사지가 아닙니다. 관절 가동성과 근막 비대칭의 일차 원인을 정밀 스캔하여 명확한 맞춤 수기 이완 솔루션을 제시합니다.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg font-mono">
                  02
                </div>
                <div>
                  <span className="text-xs text-amber-300 font-semibold tracking-wider block uppercase">SOL [LATIN: SUN]</span>
                  <h4 className="text-base font-semibold text-white mt-0.5 mb-2">태양의 따스한 생명력</h4>
                </div>
                <p className="text-xs text-stone-300 font-normal leading-relaxed">
                  라틴어로 ‘태양’을 의미하는 Sol처럼, 만성적으로 차갑게 굳어버린 관절과 근육에 따스한 온기와 자유로운 생명력을 불어넣어 드립니다.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-lg font-mono">
                  03
                </div>
                <div>
                  <span className="text-xs text-emerald-300 font-semibold tracking-wider block uppercase">SHALOM [TRANQUILITY]</span>
                  <h4 className="text-base font-semibold text-white mt-0.5 mb-2">온전한 안식과 평온</h4>
                </div>
                <p className="text-xs text-stone-300 font-normal leading-relaxed">
                  히브리어 '샬롬(Shalom)'의 깊은 평안처럼, 신체 오케스트라의 밸런스를 완전하게 회복시켜 일상 전체에 비로소 차오르는 평온을 선사합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {BRAND_PRINCIPLES.map((item, idx) => (
              <div key={idx} className="bg-stone-50 rounded-2xl p-7 border border-stone-200/80 hover:bg-white hover:shadow-xl transition-all duration-300">
                <span className="text-2xl font-semibold text-[#0092B8] block mb-3 font-mono">{item.num}</span>
                <h3 className="text-base font-semibold text-[#0C3559] mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#0C3559]/75 font-normal leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Body Zones Section --- */}
      <section id="body-zones" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase">ANALYSIS & SOLUTIONS</span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0C3559] mt-2 mb-3">
            불편하신 신체 부위를 선택해 주세요
          </h2>
          <p className="text-[#0C3559]/70 text-xs sm:text-sm font-normal">
            원인이 되는 부위를 선택하시면 스트레칭 온만의 정밀 케어 솔루션을 확인하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          {BODY_ZONES.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-[#0C3559] text-white border-[#0C3559] shadow-xl' 
                    : 'bg-white text-[#0C3559] border-stone-200 hover:bg-stone-50'
                }`}
              >
                <p className={`text-xs font-semibold ${isSelected ? 'text-sky-300' : 'text-[#0C3559]/60'}`}>
                  Focus Zone
                </p>
                <p className="text-base font-semibold mt-1">{zone.title.split(' ')[0]}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0092B8] text-xs font-semibold">
              타겟 지점: {selectedZone.title}
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-[#0C3559]">
              {selectedZone.subtitle}
            </h3>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#0C3559]/60 uppercase tracking-wider">주요 측정 불편 증상</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedZone.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0C3559] bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <span className="w-2 h-2 rounded-full bg-[#0092B8] shrink-0" />
                    {symptom}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4.5 rounded-2xl bg-sky-50/60 border border-sky-100">
              <p className="text-xs font-semibold text-[#0092B8] uppercase mb-1">맞춤 솔루션 메커니즘</p>
              <p className="text-sm sm:text-base font-semibold text-[#0C3559] leading-relaxed">
                {selectedZone.solution}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleSelectProgramAndBook(selectedZone.recProgramId)}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#0C3559] text-white font-semibold text-xs sm:text-sm hover:bg-[#082239] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                해당 증상 맞춤 코스로 예약하기
                <IconChevronRight className="w-4 h-4 text-sky-300" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-stone-100 to-sky-50/80 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center border border-stone-200 min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#0092B8] shadow-md mb-4">
              <IconActivity className="w-8 h-8" />
            </div>
            <p className="text-xs font-semibold text-[#0C3559]/60 uppercase tracking-widest">Matching Program</p>
            <h4 className="text-xl font-semibold text-[#0C3559] mt-1 mb-2">
              {PROGRAMS.find(p => p.id === selectedZone.recProgramId)?.title}
            </h4>
            <p className="text-xs sm:text-sm text-[#0C3559]/75 mb-6 max-w-xs font-medium">
              {PROGRAMS.find(p => p.id === selectedZone.recProgramId)?.subtitle}
            </p>
            <span className="text-lg font-semibold text-[#0C3559]">
              {PROGRAMS.find(p => p.id === selectedZone.recProgramId)?.price.toLocaleString()}원 / {PROGRAMS.find(p => p.id === selectedZone.recProgramId)?.duration}분
            </span>
          </div>
        </div>
      </section>

      {/* --- Programs Section --- */}
      <section id="programs" className="py-24 bg-stone-100/70 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase">CURATED CARE PROGRAMS</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0C3559] mt-3 mb-4">
              프리미엄 1:1 맞춤 솔루션 프로그램
            </h2>
            <p className="text-[#0C3559]/75 text-sm sm:text-base font-medium">
              정밀 체형 분석 스캔과 전문 수기 케어가 종합적으로 제공되는 코스입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS.map((prog) => (
              <div 
                key={prog.id}
                className="bg-white rounded-3xl p-8 border border-stone-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative"
              >
                {prog.badge && (
                  <span className="absolute top-6 right-6 px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-sky-100 text-[#0092B8] uppercase">
                    {prog.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0092B8] mb-2">
                    <IconClock className="w-4 h-4" />
                    <span>{prog.duration}분 1:1 맞춤 케어</span>
                  </div>

                  <h3 className="text-2xl font-semibold text-[#0C3559] mb-2">
                    {prog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#0C3559]/75 mb-6 leading-relaxed font-medium">
                    {prog.subtitle}
                  </p>

                  <div className="mb-6 pb-6 border-b border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-semibold text-[#0C3559]">
                        {prog.price.toLocaleString()}
                      </span>
                      <span className="text-base font-semibold text-[#0C3559]">원</span>
                      {prog.originalPrice && (
                        <span className="text-xs text-stone-400 line-through ml-2 font-medium">
                          {prog.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#0C3559]/80 leading-relaxed mb-6 font-normal">
                    {prog.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    <p className="text-[11px] font-semibold text-[#0C3559]/60 uppercase tracking-wider">권장 케어 대상</p>
                    {prog.targets.map((target, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#0C3559] font-semibold">
                        <IconCheck className="w-4 h-4 text-[#0092B8] shrink-0" />
                        <span>{target}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectProgramAndBook(prog.id)}
                  className="w-full py-4 rounded-2xl bg-[#0C3559] text-white font-semibold text-xs sm:text-sm hover:bg-[#082239] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  프로그램 선택 및 1:1 예약
                  <IconChevronRight className="w-4 h-4 text-sky-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Academy Section --- */}
      <section id="academy" className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0C3559] via-[#0A2D4C] to-[#082239] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="px-3.5 py-1.5 rounded-full bg-sky-400/20 text-sky-300 text-xs font-semibold tracking-widest uppercase">
                  SOLSTRETCH ACADEMY
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
                  솔루션스트레칭 지도자 교육과정
                </h2>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
                  40여년 경력의 원장이 직접 지도하는 최고위 스트레칭 전문가 양성 과정입니다.<br />
                  체형 분석 이론부터 실전 수기 테크닉까지 완성형 노하우를 직접 전수합니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                    <p className="text-xs text-sky-300 font-semibold mb-1">교육 일정 (주중반)</p>
                    <p className="text-base font-semibold text-white">월·수·금요일 (10:00 - 13:00)</p>
                    <p className="text-xs text-stone-300 mt-1 font-normal">1일 3시간 × 4주 (총 36시간 과정)</p>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                    <p className="text-xs text-sky-300 font-semibold mb-1">수강료 및 자격증</p>
                    <p className="text-2xl font-semibold text-white">120만원</p>
                    <p className="text-xs text-stone-300 mt-1 font-normal">* 공식 자격증 발급비 포함</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setActiveModal('academy-apply')}
                    className="px-8 py-4.5 rounded-full bg-sky-400 text-[#0C3559] font-semibold text-xs sm:text-sm hover:bg-sky-300 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    지도자 수강 상담 신청
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                  <a
                    href="tel:010-6566-6369"
                    className="px-6 py-4.5 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <IconPhone className="w-4 h-4 text-sky-300" />
                    직통 문의: 010-6566-6369
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <IconAcademic className="w-5 h-5 text-sky-300" />
                  핵심 커리큘럼 요약
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-stone-200">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-semibold text-sky-300">1주차: 해부학 & 정밀 체형 스캔</p>
                    <p className="mt-0.5 text-stone-300 font-normal">관절 가동 범위 측정 및 불균형 원인 분석</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-semibold text-sky-300">2주차: 상체 및 경추 딥 수기 실습</p>
                    <p className="mt-0.5 text-stone-300 font-normal">거북목, 승모근, 흉곽 이완 수기 노하우</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-semibold text-sky-300">3주차: 골반 & 하체 리밸런스</p>
                    <p className="mt-0.5 text-stone-300 font-normal">고관절 회전성 확보 및 장요근 이완 테크닉</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-semibold text-sky-300">4주차: 실전 코칭 심사 & 자격 수여</p>
                    <p className="mt-0.5 text-stone-300 font-normal">원장 직접 심사 및 지도자 자격증 발급</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Realtime Reservation Section --- */}
      <section id="reservation" className="py-24 bg-[#0C3559] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-widest text-sky-300 uppercase">REAL-TIME RESERVATION</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-3 mb-3">
              실시간 1:1 맞춤 예약
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-normal leading-relaxed">
              * 원장의 100% 1:1 단독 집중 케어로 진행됩니다. <br className="hidden sm:inline" />
              * 당일 예약은 불가하며, 선택하신 날짜/시간대는 1인 한정 실시간 확정됩니다.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-between max-w-xl mx-auto mb-10 border-b border-white/10 pb-6 text-xs sm:text-sm font-semibold">
            <button 
              onClick={() => setBookingStep(1)}
              className={`flex items-center gap-2 ${bookingStep >= 1 ? 'text-sky-300' : 'text-stone-400'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep >= 1 ? 'bg-sky-400 text-[#0C3559]' : 'bg-white/10 text-stone-400'}`}>1</span>
              코스 선택
            </button>
            <IconChevronRight className="w-4 h-4 text-stone-500" />
            <button 
              onClick={() => setBookingStep(2)}
              className={`flex items-center gap-2 ${bookingStep >= 2 ? 'text-sky-300' : 'text-stone-400'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep >= 2 ? 'bg-sky-400 text-[#0C3559]' : 'bg-white/10 text-stone-400'}`}>2</span>
              날짜 & 시간
            </button>
            <IconChevronRight className="w-4 h-4 text-stone-500" />
            <button 
              onClick={() => setBookingStep(3)}
              className={`flex items-center gap-2 ${bookingStep >= 3 ? 'text-sky-300' : 'text-stone-400'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep >= 3 ? 'bg-sky-400 text-[#0C3559]' : 'bg-white/10 text-stone-400'}`}>3</span>
              예약자 정보
            </button>
          </div>

          {/* Reservation Card Container */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl">
            
            {/* STEP 1: Program Selection */}
            {bookingStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">케어 프로그램 선택</h3>
                <div className="grid grid-cols-1 gap-4">
                  {PROGRAMS.map((prog) => {
                    const isSelected = selectedProgram.id === prog.id;
                    return (
                      <div
                        key={prog.id}
                        onClick={() => setSelectedProgram(prog)}
                        className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isSelected 
                            ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-white">{prog.title}</h4>
                            <span className="text-xs px-2.5 py-0.5 rounded bg-white/20 text-stone-200 font-semibold">{prog.duration}분</span>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-300 mt-1 font-normal">{prog.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-xl font-semibold text-sky-300">
                            {prog.price.toLocaleString()}원
                          </span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-sky-400 border-sky-400 text-[#0C3559]' : 'border-stone-500'}`}>
                            {isSelected && <IconCheck className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-6 flex justify-end">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="px-8 py-3.5 rounded-full bg-sky-400 text-[#0C3559] font-semibold text-xs sm:text-sm hover:bg-sky-300 transition-all flex items-center gap-2"
                  >
                    다음: 날짜 및 시간 선택
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Date & Time Picker */}
            {bookingStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">희망 방문 날짜 및 시간 선택</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Date Input */}
                  <div className="md:col-span-5 space-y-3">
                    <label className="block text-xs font-semibold text-stone-200">
                      방문 날짜 선택 (내일부터 예약 가능)
                    </label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      min={getTomorrowDateStr()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val < getTomorrowDateStr()) {
                          showToast('온라인 당일 예약은 불가합니다. 당일 케어는 대표 번호(010-6566-6369) 문의 바랍니다.');
                          setSelectedDate(getTomorrowDateStr());
                        } else {
                          setSelectedDate(val);
                        }
                      }}
                      className="w-full bg-[#082239] border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm font-semibold focus:outline-none focus:border-sky-400"
                    />

                    <div className="p-4 rounded-xl bg-[#082239]/80 border border-white/10 text-xs text-stone-300 space-y-1.5">
                      <p className="font-semibold text-sky-300">💡 예약 정책 안내</p>
                      <p>• 당일 예약은 불가합니다 (최소 1일 전 예약)</p>
                      <p>• 선택하신 날짜의 예약 완료 시간대는 '마감'으로 자동 차단됩니다.</p>
                      <p>• 원장 1:1 전담으로 동일 시간에 추가 중복 예약이 불가능합니다.</p>
                    </div>
                  </div>

                  {/* Time Slots Picker */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-stone-200">
                        방문 시간대 ({selectedDate} 기준)
                      </label>
                      <span className="text-xs text-sky-300 font-semibold">
                        예약 가능 {TIME_SLOTS.length - currentBookedTimes.length} / 전체 {TIME_SLOTS.length}타임
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = currentBookedTimes.includes(slot);
                        const isSelected = selectedTime === slot;

                        if (isBooked) {
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled
                              className="py-3.5 rounded-xl text-xs font-medium border border-stone-700 bg-stone-800/80 text-stone-500 cursor-not-allowed flex flex-col items-center justify-center opacity-60"
                            >
                              <span className="line-through">{slot}</span>
                              <span className="text-[10px] text-red-400 font-semibold mt-0.5">마감</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3.5 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center ${
                              isSelected 
                                ? 'bg-sky-400 text-[#0C3559] border-sky-400 ring-2 ring-sky-300 shadow-lg scale-105' 
                                : 'bg-[#082239] text-stone-200 border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                          >
                            <span>{slot}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-[#0C3559]' : 'text-emerald-400'}`}>예약가능</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="px-6 py-3 rounded-full bg-white/10 text-stone-300 text-xs font-semibold hover:bg-white/20"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={() => {
                      if (currentBookedTimes.includes(selectedTime)) {
                        showToast('선택하신 시간은 이미 마감되었습니다. 다른 시간대를 선택해 주세요.');
                        return;
                      }
                      setBookingStep(3);
                    }}
                    className="px-8 py-3.5 rounded-full bg-sky-400 text-[#0C3559] font-semibold text-xs sm:text-sm hover:bg-sky-300 transition-all flex items-center gap-2"
                  >
                    다음: 예약자 정보 입력
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Client Form */}
            {bookingStep === 3 && (
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">예약자 정보 입력</h3>

                <div className="p-4.5 rounded-2xl bg-[#082239] border border-white/10 text-xs sm:text-sm space-y-2 text-stone-300 font-medium">
                  <div className="flex justify-between">
                    <span className="text-stone-400">선택 코스:</span>
                    <span className="text-white font-semibold">{selectedProgram.title} ({selectedProgram.duration}분)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">예약 일시:</span>
                    <span className="text-sky-300 font-semibold">{selectedDate} / {selectedTime} (1인 독점 케어)</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2.5 text-sm sm:text-base">
                    <span className="text-stone-300">결제 예정 금액:</span>
                    <span className="text-sky-300 font-semibold">{selectedProgram.price.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1">성함 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="홍길동"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#082239] border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm font-normal focus:outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1">연락처 *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="010-0000-0000"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-[#082239] border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm font-normal focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">주요 통증 부위 및 요청사항 (선택)</label>
                  <textarea 
                    rows={3}
                    placeholder="예: 오른쪽 어깨 통증 심함, 골반 비대칭 교정 희망 등"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    className="w-full bg-[#082239] border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm font-normal focus:outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                {/* Privacy Consent */}
                <div className="p-4 rounded-xl bg-[#082239] border border-white/10 space-y-2.5">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-200 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-[#0C3559] text-sky-400 focus:ring-sky-400 cursor-pointer"
                    />
                    <span>[필수] 개인정보 수집 및 이용 동의</span>
                  </label>
                  <div className="p-3 rounded-lg bg-[#0C3559]/60 border border-white/10 text-[11px] text-stone-300 leading-relaxed space-y-1 font-normal">
                    <p>• <strong className="text-stone-200 font-semibold">수집 항목:</strong> 성함, 연락처, 주요 통증 부위 및 요청사항</p>
                    <p>• <strong className="text-stone-200 font-semibold">이용 목적:</strong> 1:1 맞춤 스트레칭 실시간 예약 확정 및 안내</p>
                    <p>• <strong className="text-stone-200 font-semibold">보유 기간:</strong> 이용 완료 후 관련 법령에 따라 최대 3개월 보관 후 파기</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-6 py-3 rounded-full bg-white/10 text-stone-300 text-xs font-semibold hover:bg-white/20"
                  >
                    이전 단계
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 rounded-full bg-sky-400 text-[#0C3559] font-semibold text-sm hover:bg-sky-300 transition-all shadow-xl flex items-center gap-2"
                  >
                    예약 신청 및 즉시 확정하기
                    <IconCheck className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* --- Reviews Section --- */}
      <section id="reviews" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase">CUSTOMER REVIEWS</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0C3559] mt-3 mb-4">
            솔루션스트레칭 고객 수기 후기
          </h2>
          <p className="text-[#0C3559]/75 text-sm sm:text-base font-normal">
            신체 불균형을 개선하고 가벼운 일상을 회복하신 고객분들의 경험담입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <IconStar key={i} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#0C3559]/85 leading-relaxed italic mb-6 font-normal">
                  "{rev.comment}"
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-[#0C3559]">{rev.name}</p>
                  <p className="text-xs text-[#0C3559]/60 font-semibold">{rev.job}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-[#0092B8] font-semibold">
                  {rev.program}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Location & Guidelines Section --- */}
      <section id="location" className="py-24 bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Location Card */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase bg-sky-50 px-3.5 py-1.5 rounded-full">
                  LOCATION & SEARCH
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#0C3559] mt-4 mb-6">
                  오시는 길 안내
                </h3>

                <div className="space-y-4 mb-8 text-sm sm:text-base text-[#0C3559]">
                  <div className="flex items-start gap-3.5">
                    <IconMapPin className="w-6 h-6 text-[#0092B8] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0C3559] text-base sm:text-lg">스트레칭온</p>
                      <p className="text-xs sm:text-sm text-[#0C3559]/85 mt-1 font-semibold">인천 서구 가정로 451 (가정동, 벨라미센텀시티2차) 8층 803호</p>
                      <p className="text-xs text-[#0092B8] font-semibold mt-1.5">
                        * 인천지하철 2호선 가정역 6번 출구 112m / 건물 내 무료주차 2시간
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <IconPhone className="w-5 h-5 text-[#0092B8] shrink-0" />
                    <span className="text-sm sm:text-base font-semibold text-[#0C3559]">010-6566-6369</span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <IconClock className="w-5 h-5 text-[#0092B8] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[#0C3559]/85 font-semibold">
                      <p>월 - 금요일: 10:00 - 22:00</p>
                      <p>토요일: 10:00 - 18:00 (일요일 휴무)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Map Links */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <p className="text-xs font-semibold text-[#0C3559]/70 uppercase tracking-wider">지도 앱으로 빠르게 위치 찾기</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => openMapSearch('naver')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#03CF5D] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>네이버 지도 검색</span>
                    <IconExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openMapSearch('kakao')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FEE500] text-[#191919] font-semibold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>카카오맵 검색</span>
                    <IconExternalLink className="w-4 h-4 text-[#191919]" />
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase">FAQ</span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#0C3559] mt-2 mb-6">
                자주 묻는 질문
              </h3>

              <div className="space-y-3.5">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#0C3559] text-sm sm:text-base hover:bg-stone-50"
                      >
                        <span>{faq.q}</span>
                        <IconChevronDown className={`w-5 h-5 text-[#0092B8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[#0C3559]/85 leading-relaxed border-t border-stone-100 pt-3.5 font-normal">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Integrated Guidelines */}
          <div className="pt-8 border-t border-stone-200/80">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-widest text-[#0092B8] uppercase bg-sky-50 px-3.5 py-1 rounded-full">
                STUDIO POLICIES
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#0C3559] mt-3 mb-3">
                스튜디오 이용 & 수강권 상세 규정
              </h3>
              <p className="text-[#0C3559]/75 text-xs sm:text-sm font-normal">
                투명하고 안전한 스튜디오 이용을 위한 예약, 복장, 수강권 환불 및 공유 기준입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GUIDELINES.map((group, gIdx) => (
                <div 
                  key={gIdx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-semibold text-[#0C3559] flex items-center gap-2">
                        <IconShieldCheck className="w-5 h-5 text-[#0092B8]" />
                        {group.category}
                      </h4>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-sky-100 text-[#0092B8]">
                        {group.badge}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {group.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/80">
                          <p className="font-semibold text-xs sm:text-sm text-[#0C3559] mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0092B8]" />
                            {item.title}
                          </p>
                          <p className="text-xs text-[#0C3559]/75 font-normal leading-relaxed pl-3.5">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-sky-50/80 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#0C3559]">
                <IconClock className="w-5 h-5 text-[#0092B8] shrink-0" />
                <span>문의사항이나 일정 변경 요청은 대표 번호 <strong>010-6566-6369</strong>로 연락주시면 안내해 드립니다.</span>
              </div>
              <button
                onClick={() => scrollToSection('reservation')}
                className="px-5 py-2.5 rounded-full bg-[#0C3559] text-white text-xs font-semibold shrink-0 hover:bg-[#082239] transition-all"
              >
                1:1 예약 바로가기
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0C3559] text-stone-300 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
            <div>
              <SolStretchLogo className="h-10" />
              <p className="text-xs text-stone-300 mt-3 font-normal">
                1:1 맞춤형 체형 불균형 케어 & 지도자 양성 아카데미
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-stone-300 font-semibold">
              <button onClick={() => scrollToSection('brand-story')} className="hover:text-white transition-colors">브랜드 철학</button>
              <button onClick={() => scrollToSection('programs')} className="hover:text-white transition-colors">프로그램</button>
              <button onClick={() => scrollToSection('academy')} className="hover:text-white transition-colors">아카데미</button>
              <button onClick={() => scrollToSection('reservation')} className="hover:text-white transition-colors">예약하기</button>
              <button 
                onClick={() => setActiveModal(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
                className="hover:text-sky-300 transition-colors flex items-center gap-1"
              >
                <IconLock className="w-3.5 h-3.5" />
                관리자 모드
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-normal">
            <p>© 2026 스트레칭온. All rights reserved.</p>
            <p>상호명: 스트레칭온 | 대표: 김동수 | 연락처: 010-6566-6369 | 인천 서구 가정로 451 8층 803호</p>
          </div>
        </div>
      </footer>

      {/* Modal: Booking Success */}
      {activeModal === 'booking-success' && lastConfirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white text-center relative overflow-hidden">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <IconX />
            </button>

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCheck className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              실시간 예약 완료 및 즉시 확정
            </span>

            <h3 className="text-2xl font-semibold text-[#0C3559] mt-2 mb-1">
              {lastConfirmedBooking.name}님, 예약이 확정되었습니다
            </h3>
            <p className="text-xs text-[#0C3559]/75 mb-6 font-medium">선택하신 시간대는 다른 고객의 예약이 차단되었습니다.</p>

            <div className="bg-stone-50 rounded-2xl p-6 text-left border border-stone-200 space-y-3 mb-6 text-xs sm:text-sm font-medium">
              <div className="flex justify-between text-stone-500">
                <span>예약 번호</span>
                <span className="font-mono font-semibold text-[#0C3559]">{lastConfirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">예약자 성함/연락처</span>
                <span className="font-semibold text-[#0C3559]">{lastConfirmedBooking.name} ({lastConfirmedBooking.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">선택 코스</span>
                <span className="font-semibold text-[#0C3559]">{lastConfirmedBooking.programTitle}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3">
                <span className="text-stone-500">확정 일시</span>
                <span className="font-semibold text-[#0092B8] text-sm sm:text-base">{lastConfirmedBooking.date} / {lastConfirmedBooking.time}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-4 rounded-2xl bg-[#0C3559] text-white font-semibold text-xs sm:text-sm hover:bg-[#082239] transition-all shadow-md"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}

      {/* Modal: Admin Login */}
      {activeModal === 'admin-login' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white text-center relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <IconX />
            </button>

            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconLock className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-semibold text-[#0C3559] mb-1">원장님 전용 관리자 로그인</h3>
            <p className="text-xs text-stone-500 mb-6 font-medium">예약 현황 확인 및 수기 전화 예약 관리가 가능합니다.</p>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#0C3559] mb-1">비밀번호 입력</label>
                <input 
                  type="password" 
                  required
                  placeholder="비밀번호 입력"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0092B8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-all shadow-md"
              >
                관리자 대시보드 접속
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Dashboard */}
      {activeModal === 'admin-dashboard' && isAdminAuthenticated && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-white relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <IconX />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    원장 전용 모드
                  </span>
                  <h3 className="text-2xl font-semibold text-[#0C3559]">스트레칭온 실시간 예약 현황 대시보드</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  총 누적 확정 예약: {allBookings.length}건 | 실시간 중복 차단 활성화 중
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPinChangeForm(!showPinChangeForm)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all flex items-center gap-1.5"
                >
                  <IconKey className="w-3.5 h-3.5" />
                  비밀번호 변경
                </button>

                <button
                  onClick={() => {
                    setIsAdminAuthenticated(false);
                    setActiveModal(null);
                    showToast('관리자 모드에서 로그아웃되었습니다.');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-600"
                >
                  로그아웃
                </button>
              </div>
            </div>

            {/* Admin Password Change Form Section */}
            {showPinChangeForm && (
              <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3">
                <h4 className="text-sm font-semibold text-amber-950 flex items-center gap-2">
                  <IconKey className="w-4 h-4 text-amber-800" />
                  관리자 비밀번호 변경
                </h4>
                <p className="text-xs text-amber-800/80">현재 비밀번호: <strong className="font-mono">{adminPin}</strong></p>

                <form onSubmit={handleChangeAdminPin} className="flex flex-col sm:flex-row gap-2.5 items-center">
                  <input 
                    type="password"
                    required
                    placeholder="새 비밀번호 입력 (4자리 이상)"
                    value={newAdminPinInput}
                    onChange={(e) => setNewAdminPinInput(e.target.value)}
                    className="w-full sm:w-64 bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-amber-600"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-all shadow-sm"
                    >
                      새 비밀번호 저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPinChangeForm(false)}
                      className="px-3 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-300 transition-all"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Admin Action: Manual Phone Reservation */}
            <div className="mb-8 p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
              <h4 className="text-base font-semibold text-amber-950 flex items-center gap-2">
                <IconPlus className="w-5 h-5 text-amber-800" />
                전화 문의 및 현장 수기 예약 등록 (해당 시간 자동 마감)
              </h4>

              <form onSubmit={handleAdminManualBooking} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="고객 성함 *"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  required
                />
                <input 
                  type="tel" 
                  placeholder="고객 연락처 *"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  required
                />
                <select
                  value={manualProgram.id}
                  onChange={(e) => setManualProgram(PROGRAMS.find(p => p.id === e.target.value))}
                  className="bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  {PROGRAMS.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.duration}분)</option>
                  ))}
                </select>
                <input 
                  type="date" 
                  value={manualDate}
                  min={getTomorrowDateStr()}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  required
                />
                <select
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <IconPlus className="w-4 h-4" />
                  수기 예약 등록/마감
                </button>
              </form>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <input 
                type="text"
                placeholder="고객 이름 또는 전화번호 검색..."
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="w-full sm:w-64 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0092B8]"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-stone-500 shrink-0 font-medium">날짜 필터:</span>
                <input 
                  type="date"
                  value={adminDateFilter}
                  onChange={(e) => setAdminDateFilter(e.target.value)}
                  className="border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#0092B8]"
                />
                {adminDateFilter && (
                  <button 
                    onClick={() => setAdminDateFilter('')}
                    className="text-xs text-stone-500 hover:underline shrink-0"
                  >
                    전체보기
                  </button>
                )}
              </div>
            </div>

            {/* Bookings List Table/Card View */}
            {allBookings.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-12 border rounded-2xl bg-stone-50">
                등록된 예약 내역이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {allBookings
                  .filter(b => {
                    const matchesSearch = (b.name || '').includes(adminSearchQuery) || (b.phone || '').includes(adminSearchQuery);
                    const matchesDate = adminDateFilter ? b.date === adminDateFilter : true;
                    return matchesSearch && matchesDate;
                  })
                  .map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {b.status || '확정'}
                          </span>
                          <span className="text-xs font-mono font-semibold text-[#0C3559]">{b.id}</span>
                          <span className="text-xs text-stone-400">({b.createdAt})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <h5 className="text-base font-semibold text-[#0C3559]">{b.name}님</h5>
                          <span className="text-xs font-semibold text-[#0092B8]">{b.phone}</span>
                        </div>

                        <p className="text-xs text-stone-600 font-medium">
                          코스: <strong className="text-[#0C3559]">{b.programTitle}</strong> | 일시: <strong className="text-[#0092B8]">{b.date} {b.time}</strong>
                        </p>

                        {b.note && (
                          <p className="text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200/80">
                            요청: "{b.note}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(b)}
                        className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                        예약 취소 (시간 해제)
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Academy Application */}
      {activeModal === 'academy-apply' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <IconX />
            </button>

            <h3 className="text-2xl font-semibold text-[#0C3559] mb-2">지도자 교육 수강 상담 신청</h3>
            <p className="text-xs text-[#0C3559]/75 mb-6 font-medium">월·수·금 주중반 (36시간 / 120만원) 교육 과정 관련 궁금하신 점을 남겨주시면 원장이 직접 상담해 드립니다.</p>

            <form onSubmit={handleAcademySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0C3559] mb-1">성함 *</label>
                <input 
                  type="text" 
                  required
                  placeholder="홍길동"
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-3.5 text-sm font-normal focus:outline-none focus:border-[#0092B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0C3559] mb-1">연락처 *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="010-0000-0000"
                  value={academyPhone}
                  onChange={(e) => setAcademyPhone(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-3.5 text-sm font-normal focus:outline-none focus:border-[#0092B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0C3559] mb-1">문의 및 경력사항 (선택)</label>
                <textarea 
                  rows={3}
                  placeholder="강사 경력 유무 또는 기타 질의사항"
                  value={academyNote}
                  onChange={(e) => setAcademyNote(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-3.5 text-sm font-normal focus:outline-none focus:border-[#0092B8] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#0C3559] text-white font-semibold text-sm hover:bg-[#082239] transition-all shadow-md mt-2"
              >
                상담 신청하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: My Bookings View */}
      {activeModal === 'my-bookings' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-white relative max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <IconX />
            </button>

            <h3 className="text-2xl font-semibold text-[#0C3559] mb-6 flex items-center gap-2">
              <IconCalendar className="w-6 h-6 text-[#0092B8]" />
              내 예약 내역 ({allBookings.length}건)
            </h3>

            {allBookings.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-12 font-medium">예약 내역이 존재하지 않습니다.</p>
            ) : (
              <div className="space-y-4">
                {allBookings.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {b.status || '확정'}
                        </span>
                        <span className="text-xs font-mono text-stone-400 font-semibold">{b.id}</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#0C3559]">{b.programTitle}</h4>
                      <p className="text-xs text-stone-500 mt-1 font-semibold">
                        {b.date} ({b.time}) | {b.name}님
                      </p>
                    </div>
                    <span className="text-base font-semibold text-[#0C3559]">
                      {b.price ? b.price.toLocaleString() + '원' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
