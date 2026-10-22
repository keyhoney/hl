import type {
  AnswerType,
  ExamType,
  Problem,
  ProblemMetadata,
  Solution,
  SolutionType,
  SubjectType,
} from '../../types/mathProblem';
import { findMcqChoiceBlockRange, parseMcqChoiceBodies } from './normalize';
import { stripMarkdown } from './render';

/**
 * `scripts/build-all-problems.mjs`의 MDX 해석 규칙을 그대로 옮긴 모듈입니다.
 *
 * - `## 문제`   : 문제 지문 (①~⑤ 선지는 별도 배열로 분리)
 * - `## 힌트`   : 여러 개 가능
 * - `## 풀이` / `## 풀이: 제목` / `## 실전` / `## 그래프 풀이` / `## 함정 포인트`
 *   → 각각 독립된 해법으로 분리하고, 제목이 없으면 유형별 순번을 자동 부여
 * - `## 풀이 [실전 스킬]`, `## 풀이 2` 같은 레거시 표기도 인식
 */

// ── 풀이 섹션 소제목 규칙 (원본 주석 그대로) ────────────────────────────────
//  ## 풀이 / ## 풀이: 제목        → 정석 풀이 (standard)
//  ## 실전 / ## 실전: 제목        → 실전 스킬 (shortcut)  ※ "## 실전 스킬" 도 동일
//  ## 그래프 풀이 → geometric, ## 함정 포인트 → pitfall
//  ## 풀이 [실전] → shortcut
const SOLUTION_TYPE_RULES: { type: SolutionType; re: RegExp }[] = [
  { type: 'shortcut', re: /실전|스킬|skill/i },
  { type: 'geometric', re: /그래프|시각|svg|graph/i },
  { type: 'pitfall', re: /함정|오답|주의|pitfall/i },
];

const SOLUTION_PREFIXES: { type: SolutionType; re: RegExp; label: string }[] = [
  { type: 'shortcut', re: /^실전(?:\s*스킬)?$/, label: '실전 스킬' },
  { type: 'geometric', re: /^그래프\s*풀이$/, label: '그래프 풀이' },
  { type: 'pitfall', re: /^함정\s*포인트$/, label: '함정 포인트' },
  { type: 'standard', re: /^풀이$/, label: '정석 풀이' },
];

export const SOLUTION_TYPE_LABEL: Record<SolutionType, string> = Object.fromEntries(
  SOLUTION_PREFIXES.map((prefix) => [prefix.type, prefix.label])
) as Record<SolutionType, string>;

/** 대괄호 태그/키워드 → SolutionType */
export function resolveSolutionType(tag: string | undefined): SolutionType {
  if (!tag) return 'standard';
  for (const rule of SOLUTION_TYPE_RULES) if (rule.re.test(tag)) return rule.type;
  return 'standard';
}

/** "## 풀이 …" / "## 실전 스킬 …" 소제목 → { type, title } (제목은 비어 있을 수 있음) */
export function parseSolutionHeading(raw: string): {
  isSolution: boolean;
  type?: SolutionType;
  title?: string;
} {
  const text = (raw || '').trim();

  // 보조 문법: "## 풀이 [실전 스킬]" / "## 풀이 [그래프]" (대괄호 태그)
  const bracket = text.match(/^풀이[ \t]*\[([^\]]+)\][ \t]*(?::[ \t]*([\s\S]*))?$/);
  if (bracket) {
    return {
      isSolution: true,
      type: resolveSolutionType(bracket[1]),
      title: (bracket[2] || '').trim(),
    };
  }

  // 레거시 "## 풀이 2" / "## 풀이 2: 제목" 도 인식하되, 번호는 무시
  const stripped = text.replace(
    /^(풀이|실전(?:[ \t]*스킬)?|그래프[ \t]*풀이|함정[ \t]*포인트)[ \t]*\d+[ \t]*(?=$|:)/,
    '$1'
  );
  const match = stripped.match(/^([^:]+?)[ \t]*(?::[ \t]*([\s\S]*))?$/);
  const head = ((match ? match[1] : stripped) || '').trim();
  const title = ((match && match[2]) || '').trim();
  const prefix = SOLUTION_PREFIXES.find((item) => item.re.test(head));
  if (!prefix) return { isSolution: false };
  return { isSolution: true, type: prefix.type, title };
}

const CIRCLED = ['①', '②', '③', '④', '⑤'] as const;
const SECTION_RE = /^##[ \t]+(.+?)[ \t]*$/gm;
const POINT_RE = /\\?\[\s*(\d+)점\s*\\?\]/;

interface RawSection {
  heading: string;
  content: string;
}

function splitSections(source: string): RawSection[] {
  const headings = [...source.matchAll(SECTION_RE)].map((match) => ({
    heading: match[1].trim(),
    index: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  }));

  return headings.map((heading, index) => {
    const next = headings[index + 1];
    return {
      heading: heading.heading,
      content: source.slice(heading.end, next ? next.index : source.length).trim(),
    };
  });
}

/** 메타데이터의 `미적분Ⅰ` 등 표기를 UI 타입으로 통일합니다. */
export function normalizeSubject(subject: string): SubjectType {
  const value = String(subject || '').replace(/\s+/g, '');
  if (value.includes('확률')) return '확률과 통계';
  if (value.includes('미적분')) return '미적분 I';
  return '대수';
}

export function normalizeExamType(examType: string): ExamType {
  return String(examType).includes('수능') ? '수능' : '모평';
}

function cleanUnitName(chapter: string): string {
  return String(chapter || '')
    .replace(/^\s*\d+\.\s*/, '')
    .trim();
}

function cleanSubChapter(subChapter: string): string {
  return String(subChapter || '')
    .replace(/^\s*[A-Za-z]\.\s*/, '')
    .trim();
}

function examTitle(meta: ProblemMetadata): string {
  if (meta.examType === '수능') return `${meta.year}학년도 대학수학능력시험`;
  return `${meta.year}학년도 ${meta.month}월 모의평가`;
}

function problemNumberFromId(id: string): number {
  const suffix = id.match(/(\d{2})$/);
  return suffix ? Number(suffix[1]) : 0;
}

function extractChoices(problemContent: string): { body: string; choices: string[] } {
  const lines = problemContent.split('\n');
  const range = findMcqChoiceBlockRange(lines);

  if (range) {
    const choiceText = lines
      .slice(range.start, range.end + 1)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ');
    const bodies = parseMcqChoiceBodies(choiceText);
    if (bodies.length === 5 && bodies[0]) {
      const body = [...lines.slice(0, range.start), ...lines.slice(range.end + 1)].join('\n');
      return { body: body.trim(), choices: bodies };
    }
  }

  // 줄바꿈이 어긋난 예외도 5개 마커가 있으면 한 번 더 시도합니다.
  const markers = [...problemContent.matchAll(/[①②③④⑤]/g)];
  if (markers.length === 5) {
    const bodies = parseMcqChoiceBodies(problemContent.replace(/\n+/g, ' '));
    if (bodies.length === 5 && bodies[0]) {
      const firstMarker = markers[0].index ?? 0;
      return { body: problemContent.slice(0, firstMarker).trim(), choices: bodies };
    }
  }

  return { body: problemContent.trim(), choices: [] };
}

function inferPoints(difficulty: number): number {
  if (difficulty >= 4) return 4;
  if (difficulty >= 2) return 3;
  return 2;
}

function summarizeContent(content: string, maxLength = 180): string {
  const text = stripMarkdown(content);
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function parseProblem(id: string, source: string, meta: ProblemMetadata): Problem {
  const normalizedSource = source.replace(/\r\n?/g, '\n');
  const sections = splitSections(normalizedSource);

  const problemSection =
    sections.find((section) => section.heading === '문제') ?? sections[0] ?? { heading: '', content: '' };

  const hints = sections
    .filter((section) => /^힌트/.test(section.heading))
    .map((section) => section.content)
    .filter(Boolean);

  const solutionSections = sections
    .map((section) => ({ ...section, parsed: parseSolutionHeading(section.heading) }))
    .filter((section) => section.parsed.isSolution)
    .filter((section) => section.content.length > 0);

  const typeCounters: Partial<Record<SolutionType, number>> = {};
  const solutions: Solution[] = solutionSections.map((section, index) => {
    const type = section.parsed.type ?? 'standard';
    const count = (typeCounters[type] = (typeCounters[type] ?? 0) + 1);
    const title = section.parsed.title || `${SOLUTION_TYPE_LABEL[type]} ${count}`;
    return {
      id: `${id}-${type}-${count}`,
      type,
      title,
      content: section.content,
      summary: summarizeContent(section.content),
      index,
    };
  });

  const { body, choices } = extractChoices(problemSection.content);
  const pointMatch = problemSection.content.match(POINT_RE);
  const points = pointMatch ? Number(pointMatch[1]) : inferPoints(meta.difficulty);
  const problemBody = body.replace(/\\?\[\s*\d+점\s*\\?\]\s*$/, '').trim();

  const answerType: AnswerType = meta.answerType === 'mcq' ? 'mcq' : 'short';
  const answerValue = Number(meta.answer);
  const answerIndex =
    answerType === 'mcq' && answerValue >= 1 && answerValue <= 5 ? answerValue : undefined;
  const answer =
    answerIndex !== undefined ? CIRCLED[answerIndex - 1] : String(meta.answer ?? '');

  const subject = normalizeSubject(meta.subject);
  const examType = normalizeExamType(meta.examType);
  const unitName = cleanUnitName(meta.chapter);
  const subChapter = cleanSubChapter(meta.subChapter);
  const subTopic = [subChapter, meta.concept].filter(Boolean).join(' · ');
  const problemNumber = problemNumberFromId(id);

  const searchText = [
    meta.source,
    examTitle(meta),
    subject,
    unitName,
    subTopic,
    meta.concept,
    `${problemNumber}번`,
    problemBody,
    ...hints,
    ...solutions.map((solution) => `${solution.title} ${solution.content}`),
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .slice(0, 6000);

  return {
    id,
    sourceFile: `${id}.mdx`,
    year: meta.year,
    month: meta.month,
    examType,
    examName: examTitle(meta),
    subject,
    chapter: meta.chapter,
    unitName,
    subChapter,
    concept: meta.concept,
    subTopic,
    problemNumber,
    points,
    difficulty: meta.difficulty,
    answerType,
    answer,
    answerIndex,
    answerValue: String(meta.answer ?? ''),
    choices,
    problemBody,
    hints,
    keyInsight: hints[0] ?? '',
    solutions,
    searchText,
    related: [],
  } satisfies Problem;
}
