import type { Problem } from '../../types/mathProblem';

/**
 * 문항별 OG 이미지(정사각형 1200×1200)를 SVG 문자열로 렌더링합니다.
 *
 * 네이버 검색 미리보기는 정사각형 썸네일을 사용하므로,
 * 문항 정보·난이도·힌트 수·해설 수를 한 장에 담은 정사각형 이미지를 만듭니다.
 * 실제 이미지 변환(PNG/JPEG)은 `src/pages/og/[id].jpg.ts`에서 sharp로 처리합니다.
 */

const WIDTH = 1200;
const HEIGHT = 1200;
const FONT = 'Noto Sans KR, Malgun Gothic, sans-serif';

interface Accent {
  main: string;
  light: string;
  glow: string;
  badgeBg: string;
}

const ACCENTS: Record<Problem['subject'], Accent> = {
  대수: {
    main: '#818cf8',
    light: '#c7d2fe',
    glow: '#6366f1',
    badgeBg: '#312e81',
  },
  '미적분 I': {
    main: '#fb7185',
    light: '#fecdd3',
    glow: '#f43f5e',
    badgeBg: '#4c0519',
  },
  '확률과 통계': {
    main: '#fbbf24',
    light: '#fde68a',
    glow: '#f59e0b',
    badgeBg: '#451a03',
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 한글 기준 대략적인 글자 폭(em)을 계산합니다. */
function charWidth(char: string): number {
  if (/[가-힣]/.test(char)) return 1;
  if (/[A-Z]/.test(char)) return 0.64;
  if (/[a-z]/.test(char)) return 0.54;
  if (/\d/.test(char)) return 0.58;
  if (char === ' ') return 0.32;
  if (/[.,:;·'"()[\]{}!?/+-]/.test(char)) return 0.34;
  return 0.6;
}

/** 주어진 폭을 넘으면 말줄임표를 붙입니다. */
function fitText(text: string, maxWidth: number, fontSize: number): string {
  const maxUnits = maxWidth / fontSize;
  let units = 0;
  let result = '';

  for (const char of text) {
    const width = charWidth(char);
    if (units + width > maxUnits) {
      return `${result.trimEnd()}…`;
    }
    result += char;
    units += width;
  }

  return text;
}

function textWidth(text: string, fontSize: number): number {
  return [...text].reduce((sum, char) => sum + charWidth(char), 0) * fontSize;
}

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  return Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

function examLabel(problem: Problem): string {
  return problem.examType === '수능'
    ? `${problem.year}학년도 수능`
    : `${problem.year}학년도 ${problem.month}월 모평`;
}

function curvePath(subject: Problem['subject']): string {
  switch (subject) {
    case '미적분 I':
      return 'M 836 430 C 878 430 888 330 928 330 C 968 330 978 410 1018 410 C 1048 410 1058 286 1080 286';
    case '확률과 통계':
      return 'M 836 488 C 902 488 910 276 960 276 C 1010 276 1018 488 1080 488';
    default:
      return 'M 836 480 C 890 476 908 430 944 366 C 972 316 1012 276 1068 258';
  }
}

function curvePoint(subject: Problem['subject']): { x: number; y: number } {
  switch (subject) {
    case '미적분 I':
      return { x: 1018, y: 410 };
    case '확률과 통계':
      return { x: 960, y: 276 };
    default:
      return { x: 1000, y: 306 };
  }
}

export function renderProblemOgSvg(problem: Problem): string {
  const accent = ACCENTS[problem.subject] ?? ACCENTS['대수'];
  const exam = escapeXml(examLabel(problem));
  const title = escapeXml(`수학 ${problem.problemNumber}번`);
  const subject = escapeXml(problem.subject);
  const unit = escapeXml(fitText(problem.unitName, 602, 30));
  const concept = escapeXml(fitText(`· ${problem.concept}`, 602, 26));
  const answerType = problem.answerType === 'mcq' ? '객관식' : '단답형';
  const points = `${problem.points}점`;
  const hintCount = problem.hints.length;
  const solutionCount = problem.solutions.length;
  const difficulty = Math.max(1, Math.min(5, problem.difficulty));
  const dot = curvePoint(problem.subject);

  const subjectWidth = Math.max(84, Math.round(textWidth(problem.subject, 17) + 40));
  const pointsWidth = 78;
  const answerWidth = problem.answerType === 'mcq' ? 84 : 76;
  const pillGap = 10;
  const pointsX = 72 + subjectWidth + pillGap;
  const answerX = pointsX + pointsWidth + pillGap;

  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = index < difficulty;
    return `<polygon points="${starPoints(108 + index * 58, 772, 22, 9.5)}" fill="#fbbf24" fill-opacity="${filled ? '1' : '0.14'}"/>`;
  }).join('');

  const difficultyBarWidth = (392 * difficulty) / 5;
  const pointHalo = 19;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="1200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e1b4b"/>
      <stop offset="0.55" stop-color="#312e81"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(1050 120) rotate(135) scale(470)" gradientUnits="userSpaceOnUse">
      <stop stop-color="${accent.glow}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="${accent.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBottom" cx="0" cy="0" r="1" gradientTransform="translate(260 1030) rotate(-45) scale(360)" gradientUnits="userSpaceOnUse">
      <stop stop-color="${accent.glow}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tile" x1="72" y1="64" x2="136" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="#818cf8"/>
      <stop offset="1" stop-color="#4338ca"/>
    </linearGradient>
    <linearGradient id="card" x1="780" y1="190" x2="1128" y2="538" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.11"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.035"/>
    </linearGradient>
    <linearGradient id="statCard" x1="72" y1="648" x2="1128" y2="858" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.035"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <rect width="1200" height="1200" fill="url(#glowBottom)"/>
  <circle cx="1140" cy="80" r="250" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
  <circle cx="1140" cy="80" r="184" fill="none" stroke="#ffffff" stroke-opacity="0.06"/>

  <!-- 브랜드 -->
  <rect x="72" y="64" width="64" height="64" rx="16" fill="url(#tile)"/>
  <rect x="82" y="80" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="100" y="80" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="90" y="93" width="10" height="7" rx="2" fill="#ffffff"/>
  <rect x="114" y="80" width="7" height="32" rx="2" fill="${accent.light}"/>
  <rect x="114" y="105" width="13" height="7" rx="2" fill="${accent.light}"/>
  <text x="152" y="110" font-family="${FONT}" font-size="34" font-weight="800" letter-spacing="-1">
    <tspan fill="#a5b4fc">How</tspan><tspan fill="#ffffff">Learn</tspan>
  </text>

  <g font-family="${FONT}" font-size="17" font-weight="700">
    <rect x="928" y="76" width="200" height="40" rx="20" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="1028" y="102" text-anchor="middle" fill="#c7d2fe">KICE 기출</text>
  </g>

  <!-- 문항 정보 -->
  <text x="72" y="212" font-family="${FONT}" font-size="18" font-weight="700" letter-spacing="3" fill="${accent.light}">문항 정보</text>
  <text x="72" y="264" font-family="${FONT}" font-size="36" font-weight="700" letter-spacing="-0.5" fill="#c7d2fe">${exam}</text>
  <text x="72" y="396" font-family="${FONT}" font-size="112" font-weight="800" letter-spacing="-4" fill="#ffffff">${title}</text>

  <g font-family="${FONT}" font-size="17" font-weight="700">
    <rect x="72" y="424" width="${subjectWidth}" height="44" rx="22" fill="${accent.main}" fill-opacity="0.18" stroke="${accent.main}" stroke-opacity="0.55"/>
    <text x="${72 + subjectWidth / 2}" y="452" text-anchor="middle" fill="${accent.light}">${subject}</text>
    <rect x="${pointsX}" y="424" width="${pointsWidth}" height="44" rx="22" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="${pointsX + pointsWidth / 2}" y="452" text-anchor="middle" fill="#e2e8f0">${points}</text>
    <rect x="${answerX}" y="424" width="${answerWidth}" height="44" rx="22" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="${answerX + answerWidth / 2}" y="452" text-anchor="middle" fill="#cbd5e1">${answerType}</text>
  </g>

  <rect x="72" y="504" width="4" height="76" rx="2" fill="${accent.main}"/>
  <text x="90" y="530" font-family="${FONT}" font-size="30" font-weight="600" letter-spacing="-0.5" fill="#e2e8f0">${unit}</text>
  <text x="90" y="572" font-family="${FONT}" font-size="26" font-weight="500" letter-spacing="-0.3" fill="#94a3b8">${concept}</text>

  <!-- 문항 그래프 카드 -->
  <rect x="780" y="190" width="348" height="348" rx="28" fill="url(#card)" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="816" y="232" font-family="${FONT}" font-size="18" font-weight="700" fill="#94a3b8">Q.${problem.problemNumber}</text>
  <text x="1092" y="232" font-family="${FONT}" font-size="18" font-weight="700" text-anchor="end" fill="${accent.light}">f(x)</text>

  <g stroke="#ffffff" stroke-opacity="0.08">
    <path d="M820 312H1080M820 372H1080M820 432H1080M820 492H1080"/>
    <path d="M884 252V494M948 252V494M1012 252V494M1076 252V494"/>
  </g>

  <path d="M820 494H1080M820 494V252" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round"/>
  <path d="M1068 486L1080 494L1068 502" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M812 264L820 252L828 264" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <path d="${curvePath(problem.subject)}" fill="none" stroke="${accent.main}" stroke-width="5" stroke-linecap="round"/>
  <path d="M${dot.x} ${dot.y}V494M${dot.x} ${dot.y}H820" fill="none" stroke="${accent.main}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="6 8"/>
  <circle cx="${dot.x}" cy="${dot.y}" r="${pointHalo}" fill="${accent.main}" fill-opacity="0.18"/>
  <circle cx="${dot.x}" cy="${dot.y}" r="8" fill="${accent.main}"/>

  <!-- 난이도·힌트·해설 -->
  <rect x="72" y="648" width="456" height="210" rx="26" fill="url(#statCard)" stroke="#ffffff" stroke-opacity="0.12"/>
  <rect x="552" y="648" width="264" height="210" rx="26" fill="url(#statCard)" stroke="#ffffff" stroke-opacity="0.12"/>
  <rect x="840" y="648" width="288" height="210" rx="26" fill="url(#statCard)" stroke="#ffffff" stroke-opacity="0.12"/>

  <text x="104" y="700" font-family="${FONT}" font-size="22" font-weight="700" fill="#cbd5e1">난이도</text>
  <text x="496" y="700" font-family="${FONT}" font-size="22" font-weight="800" text-anchor="end" fill="#fbbf24">${difficulty} / 5</text>
  ${stars}
  <rect x="104" y="816" width="392" height="8" rx="4" fill="#ffffff" fill-opacity="0.1"/>
  <rect x="104" y="816" width="${difficultyBarWidth}" height="8" rx="4" fill="#fbbf24"/>

  <text x="584" y="700" font-family="${FONT}" font-size="21" font-weight="700" fill="#cbd5e1">힌트</text>
  <text x="784" y="700" font-family="${FONT}" font-size="16" font-weight="600" text-anchor="end" fill="#94a3b8">단계별</text>
  <text x="584" y="810" font-family="${FONT}" font-size="84" font-weight="800" letter-spacing="-3" fill="#ffffff">${hintCount}<tspan font-size="28" font-weight="700" dx="8" fill="#cbd5e1">개</tspan></text>
  <text x="584" y="840" font-family="${FONT}" font-size="17" font-weight="500" fill="#94a3b8">순서대로 확인</text>

  <text x="872" y="700" font-family="${FONT}" font-size="21" font-weight="700" fill="#cbd5e1">해설</text>
  <text x="1096" y="700" font-family="${FONT}" font-size="16" font-weight="600" text-anchor="end" fill="#94a3b8">다각도</text>
  <text x="872" y="810" font-family="${FONT}" font-size="84" font-weight="800" letter-spacing="-3" fill="#ffffff">${solutionCount}<tspan font-size="28" font-weight="700" dx="8" fill="#cbd5e1">개</tspan></text>
  <text x="872" y="840" font-family="${FONT}" font-size="17" font-weight="500" fill="#94a3b8">관점별 비교</text>

  <!-- 하단 -->
  <path d="M72 930H1128" stroke="#ffffff" stroke-opacity="0.1"/>
  <circle cx="78" cy="978" r="5" fill="${accent.main}"/>
  <text x="96" y="988" font-family="${FONT}" font-size="27" font-weight="600" letter-spacing="-0.5" fill="#e2e8f0">정석부터 실전까지, 한 문항을 여러 관점으로.</text>
  <text x="72" y="1102" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="0.5" fill="#94a3b8">howlearn.kr</text>
  <text x="1128" y="1102" font-family="${FONT}" font-size="17" font-weight="600" text-anchor="end" fill="#64748b">단계별 힌트 · 상세 해설</text>
</svg>`;
}
