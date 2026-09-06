/**
 * 반병현 유튜브 영상 아카이브 큐레이션 데이터
 * - 저자/개발자 반병현의 대표 영상, 업무 자동화, AI 특강, 인터뷰 등 엄선
 */

const INITIAL_VIDEOS = [
  {
    id: "R9Z_s2p89tE",
    title: "카이스트 출신 대학원생이 공익이 되면 일어나는 일?! (feat. 코딩)",
    channel: "스브스뉴스 SUBUSUNEWS",
    category: "automation",
    publishedAt: "2019-06-28",
    duration: "04:38",
    views: "4,250,000회",
    summary: "고용노동부 안동지청 공익근무요원 시절, 6개월 걸릴 단순 반복 우편 작업을 파이썬 매크로 코딩으로 단 하루 만에 끝내버린 전설적인 실화 인터뷰 영상입니다.",
    tags: ["업무자동화", "파이썬", "카이스트공익", "스브스뉴스", "레전드"],
    featured: true
  },
  {
    id: "kYJm9Uv1nJk",
    title: "2026년 생성형 AI 트렌드, 어떻게 진화할까? [반병현 대표 특강]",
    channel: "반병현 half_bottle",
    category: "ai",
    publishedAt: "2024-01-15",
    duration: "24:18",
    views: "185,000회",
    summary: "단순한 텍스트 챗봇을 넘어 멀티모달, 자율 에이전트(AI Agent), 피지컬 AI로 급변하는 AI 트렌드의 본질과 개인이 준비해야 할 전략을 명쾌하게 해설합니다.",
    tags: ["생성형AI", "AI트렌드", "AI에이전트", "미래전망", "반병현"],
    featured: true
  },
  {
    id: "aG-V1659yK8",
    title: "지금이 AI를 시작하는 마지막 탑승 시기라고 봅니다 / AI 개발자가 알려주는 활용법",
    channel: "호오컨설팅",
    category: "ai",
    publishedAt: "2023-08-20",
    duration: "18:42",
    views: "340,000회",
    summary: "AI를 두려워하는 사람들과 잘 활용하는 사람들의 격차가 벌어지고 있는 지금, 비전공자도 일상과 업무에서 AI 탑승권을 쥐는 구체적인 방법론을 제시합니다.",
    tags: ["ChatGPT", "인공지능", "생산성", "직업의미래", "강연"],
    featured: true
  },
  {
    id: "48n1l1bNlX8",
    title: "AI로 고퀄리티 문서작업하기 / 실무자를 위한 프롬프트 엔지니어링 활용 실습",
    channel: "반병현 half_bottle",
    category: "automation",
    publishedAt: "2023-11-04",
    duration: "21:15",
    views: "152,000회",
    summary: "보고서, 기획서, 데이터 분석 등 직장인들의 고질적인 야근 유발 업무를 AI 프롬프트와 자동화 툴을 결합해 10배 빠르게 끝내는 실전 워크플로우를 전수합니다.",
    tags: ["문서작업", "프롬프트", "업무효율", "직장인꿀팁", "실습"],
    featured: false
  },
  {
    id: "eYkZ4g8K5OQ",
    title: "[안될메보] Chat GPT가 가끔 뻔뻔하게 소설을 쓰는 이유 (feat. 반병현 CTO)",
    channel: "안될과학 Unrealscience",
    category: "interview",
    publishedAt: "2023-04-12",
    duration: "28:50",
    views: "520,000회",
    summary: "대규모 언어 모델(LLM)이 왜 그토록 당당하게 거짓말(할루시네이션, 환각 현상)을 생성하는지 인공신경망의 확률적 원리를 유쾌하고 명쾌하게 풀어냅니다.",
    tags: ["안될과학", "할루시네이션", "LLM원리", "인공지능", "기술해설"],
    featured: false
  },
  {
    id: "F38l1JmXo8M",
    title: "두 달 만에 사용자 1억 명 모은 챗GPT 서비스, 넌 정체가 뭐니? (반병현 작가 1부)",
    channel: "삼프로TV 경제의신과함께",
    category: "interview",
    publishedAt: "2023-02-18",
    duration: "32:10",
    views: "680,000회",
    summary: "전 세계를 뒤흔든 ChatGPT의 등장 배경과 기존 인공지능 기술들과의 결정적인 차이점을 경제/산업적 관점에서 분석합니다.",
    tags: ["삼프로TV", "챗GPT", "특이점", "산업분석", "경제"],
    featured: false
  },
  {
    id: "G7f3iY-sR8M",
    title: "챗GPT 활용, 벌써 이만큼까지 왔다고? 실무자가 체감하는 충격적 변화 (반병현 작가 2부)",
    channel: "삼프로TV 경제의신과함께",
    category: "interview",
    publishedAt: "2023-02-22",
    duration: "35:45",
    views: "490,000회",
    summary: "단순 대화형 챗봇을 넘어 코딩, 엑셀 처리, 번역, 논문 요약 등 실제 실무 현장에서 생성형 AI가 인간의 생산성을 극대화하는 사례들을 집중 조명합니다.",
    tags: ["삼프로TV", "실무활용", "업무혁신", "생산성", "챗GPT"],
    featured: false
  },
  {
    id: "i9Yy68S1z_Y",
    title: "챗GPT 인공지능 시대, AI에게 대체되지 않고 앞서가기 위한 핵심 역량 (반병현 작가 3부)",
    channel: "삼프로TV 경제의신과함께",
    category: "interview",
    publishedAt: "2023-02-25",
    duration: "30:12",
    views: "580,000회",
    summary: "AI 도구를 잘 다루는 사람이 그렇지 못한 사람의 자리를 대체할 것입니다. 미래 사회에서 인간만이 가질 수 있는 대체 불가능한 역량과 문제 정의 능력에 대해 나눕니다.",
    tags: ["삼프로TV", "미래역량", "인재상", "커리어", "AI시대"],
    featured: false
  },
  {
    id: "O1k9wL5z2s4",
    title: "중국인들이 제 논문을 통째로 훔쳐갔습니다 | 카이스트 연구원의 논문 표절 피해 실화",
    channel: "반병현 half_bottle",
    category: "story",
    publishedAt: "2022-09-14",
    duration: "14:26",
    views: "230,000회",
    summary: "카이스트 석사 시절 심혈을 기울여 작성한 연구 논문이 해외에서 무단으로 표절 및 복제되었던 충격적인 사건의 전말과 연구 윤리에 대한 고찰을 전합니다.",
    tags: ["카이스트", "논문표절", "연구실비하인드", "썰", "연구자"],
    featured: false
  },
  {
    id: "L2GjH1P6Jv4",
    title: "GPT 노마드의 탄생 - AI와 함께 일하는 새로운 인류의 업무 방식",
    channel: "생능북스",
    category: "ai",
    publishedAt: "2023-07-09",
    duration: "15:40",
    views: "98,000회",
    summary: "공간과 시간의 제약 없이 생성형 AI를 페어 프로그래머이자 비서로 활용하는 신인류 'GPT 노마드'의 라이프스타일과 업무 전략을 소개합니다.",
    tags: ["GPT노마드", "스마트워크", "생능북스", "저자직강", "도서"],
    featured: false
  },
  {
    id: "NflN-dLFC4U",
    title: "생성형 AI 트렌드와 산업의 패러다임 시프트 - 기업들이 주목하는 기술 동향",
    channel: "반병현 half_bottle",
    category: "ai",
    publishedAt: "2024-03-01",
    duration: "26:55",
    views: "115,000회",
    summary: "기업들이 자체 LLM 구축과 사내 데이터 연동(RAG)을 도입하며 겪는 시행착오와 2026년 이후 AI 비즈니스 모델의 나아갈 방향을 진단합니다.",
    tags: ["RAG", "기업용AI", "비즈니스모델", "디지털트랜스포메이션", "나나랩"],
    featured: false
  },
  {
    id: "p4d2V73u3_A",
    title: "AI 활용과 직업의 미래 - 사라지는 일자리와 새롭게 생겨나는 기회들",
    channel: "세미나 & 포럼 특강",
    category: "story",
    publishedAt: "2023-12-10",
    duration: "22:04",
    views: "167,000회",
    summary: "역사 속 산업혁명과 인공지능 혁명의 유사점을 비교하며, 두려움보다는 새로운 기술을 능숙하게 활용하는 것이 왜 가장 안전한 선택인지 설명합니다.",
    tags: ["직업전망", "산업혁명", "커리어전략", "미래교육", "통찰"],
    featured: false
  },
  {
    id: "3-M9f5-Z46I",
    title: "실무자를 위한 엑셀 & 파이썬 자동화와 프롬프트 엔지니어링 꿀팁 모음",
    channel: "반병현 half_bottle",
    category: "automation",
    publishedAt: "2023-10-18",
    duration: "19:33",
    views: "210,000회",
    summary: "엑셀 함수로 고생하던 대용량 데이터 전처리를 파이썬 판다스(Pandas)와 ChatGPT 코드 인터프리터를 통해 클릭 몇 번으로 자동화하는 기법을 실습합니다.",
    tags: ["엑셀자동화", "파이썬판다스", "코드인터프리터", "데이터분석", "실무자동화"],
    featured: false
  }
];

// 카테고리 정의
const CATEGORIES = [
  { id: "all", name: "전체 영상", icon: "✨" },
  { id: "automation", name: "업무 자동화 & 코딩", icon: "⚡" },
  { id: "ai", name: "ChatGPT & 인공지능", icon: "🤖" },
  { id: "interview", name: "인터뷰 & 방송", icon: "🎙️" },
  { id: "story", name: "개발 비하인드 & 썰", icon: "💡" }
];
