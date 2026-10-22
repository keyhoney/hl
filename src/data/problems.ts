import type {
  Problem,
  ProblemMetadata,
  RelatedProblem,
  SubjectType,
} from '../types/mathProblem';
import { parseProblem } from '../lib/mdx/parse';

/**
 * `src/content/problems/*.mdx` 원문과 `_metadata.json`을 빌드 시점에 읽어
 * `Problem` 객체로 변환합니다.
 *
 * MDX는 컴파일하지 않고 raw 문자열로 가져온 뒤,
 * `src/lib/mdx/parse.ts`의 섹션 규칙으로 해석합니다.
 * (원본 Vite 앱의 `scripts/build-all-problems.mjs`와 동일한 규칙)
 */

const problemSources = import.meta.glob('/src/content/problems/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const metadataSource = import.meta.glob('/src/content/problems/_metadata.json', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function loadMetadata(): Record<string, ProblemMetadata> {
  const raw = Object.values(metadataSource)[0];
  if (!raw) throw new Error('_metadata.json을 찾지 못했습니다.');
  return JSON.parse(raw.replace(/^\uFEFF/, '')) as Record<string, ProblemMetadata>;
}

function buildRelated(problems: Problem[]): Problem[] {
  return problems.map((problem) => {
    const related: RelatedProblem[] = problems
      .filter(
        (candidate) =>
          candidate.id !== problem.id &&
          problem.concept !== '' &&
          candidate.concept === problem.concept
      )
      .sort(
        (a, b) =>
          b.year - a.year ||
          b.month - a.month ||
          a.problemNumber - b.problemNumber
      )
      .map((candidate) => ({
        id: candidate.id,
        examName: candidate.examName,
        year: candidate.year,
        month: candidate.month,
        problemNumber: candidate.problemNumber,
        subject: candidate.subject,
        answerType: candidate.answerType,
        difficulty: candidate.difficulty,
        points: candidate.points,
        hintsCount: candidate.hints.length,
        solutionsCount: candidate.solutions.length,
        unitName: candidate.unitName,
        concept: candidate.concept,
        reason: `같은 개념 · ${candidate.concept}`,
      }));

    return { ...problem, related };
  });
}

let problemsCache: Problem[] | undefined;

function buildProblems(): Problem[] {
  const metadata = loadMetadata();

  const problems = Object.entries(problemSources)
    .map(([path, source]) => {
      const id = path.split('/').pop()?.replace(/\.mdx$/, '') ?? '';
      const meta = metadata[id];
      if (!meta) return null;
      return parseProblem(id, source, meta);
    })
    .filter((problem): problem is Problem => problem !== null)
    .sort(
      (a, b) =>
        b.year - a.year ||
        b.month - a.month ||
        a.problemNumber - b.problemNumber
    );

  return buildRelated(problems);
}

/** 전체 450문항 (정렬: 최근 학년도 → 최근 시행 → 번호 오름차순) */
export async function getProblems(): Promise<Problem[]> {
  if (!problemsCache) problemsCache = buildProblems();
  return problemsCache;
}

export async function getProblemById(id: string): Promise<Problem | undefined> {
  const problems = await getProblems();
  return problems.find((problem) => problem.id === id);
}

export async function getProblemsByYear(year: number): Promise<Problem[]> {
  return (await getProblems()).filter((problem) => problem.year === year);
}

export async function getProblemsBySubject(subject: SubjectType): Promise<Problem[]> {
  return (await getProblems()).filter((problem) => problem.subject === subject);
}

export async function getLatestYear(): Promise<number> {
  return (await getProblems()).reduce((max, problem) => Math.max(max, problem.year), 0);
}

export async function getYears(): Promise<number[]> {
  return [...new Set((await getProblems()).map((problem) => problem.year))].sort((a, b) => b - a);
}

/** 연도·과목·난이도·시행 구분별 집계 */
export interface ArchiveStats {
  total: number;
  years: number[];
  subjects: { subject: SubjectType; count: number }[];
  exams: { year: number; month: number; examType: string; count: number }[];
  difficulty: { level: number; count: number }[];
  hintCount: number;
  solutionCount: number;
  choiceCount: number;
}

export async function getArchiveStats(): Promise<ArchiveStats> {
  const problems = await getProblems();
  const subjectOrder: SubjectType[] = ['대수', '미적분 I', '확률과 통계'];

  return {
    total: problems.length,
    years: [...new Set(problems.map((problem) => problem.year))].sort((a, b) => b - a),
    subjects: subjectOrder.map((subject) => ({
      subject,
      count: problems.filter((problem) => problem.subject === subject).length,
    })),
    exams: [...new Map(
      problems.map((problem) => [
        `${problem.year}-${problem.month}-${problem.examType}`,
        {
          year: problem.year,
          month: problem.month,
          examType: problem.examType,
          count: problems.filter(
            (item) =>
              item.year === problem.year &&
              item.month === problem.month &&
              item.examType === problem.examType
          ).length,
        },
      ])
    ).values()].sort((a, b) => b.year - a.year || b.month - a.month),
    difficulty: [1, 2, 3, 4, 5].map((level) => ({
      level,
      count: problems.filter((problem) => problem.difficulty === level).length,
    })),
    hintCount: problems.reduce((sum, problem) => sum + problem.hints.length, 0),
    solutionCount: problems.reduce((sum, problem) => sum + problem.solutions.length, 0),
    choiceCount: problems.reduce((sum, problem) => sum + problem.choices.length, 0),
  };
}

/** 홈 화면 대표 문항: 최신 학년도·최신 시행에서 난이도가 높은 순 */
export async function getFeaturedProblems(limit = 6): Promise<Problem[]> {
  const problems = await getProblems();
  const latestYear = problems.reduce((max, problem) => Math.max(max, problem.year), 0);
  const latestMonth = problems
    .filter((problem) => problem.year === latestYear)
    .reduce((max, problem) => Math.max(max, problem.month), 0);

  return problems
    .filter((problem) => problem.year === latestYear && problem.month === latestMonth)
    .sort((a, b) => b.difficulty - a.difficulty || b.points - a.points || a.problemNumber - b.problemNumber)
    .slice(0, limit);
}

/** 상세 화면 이전/다음 문항 */
export async function getAdjacentProblems(id: string): Promise<{
  previous?: Problem;
  next?: Problem;
}> {
  const problems = await getProblems();
  const index = problems.findIndex((problem) => problem.id === id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? problems[index - 1] : undefined,
    next: index < problems.length - 1 ? problems[index + 1] : undefined,
  };
}

/** 과목별 단원 집계 (단원 → 개념 목록) */
export interface UnitGroup {
  unitName: string;
  count: number;
  concepts: { name: string; count: number }[];
}

export async function getUnitGroups(subject: SubjectType): Promise<UnitGroup[]> {
  const problems = (await getProblems()).filter((problem) => problem.subject === subject);
  const units = new Map<string, Problem[]>();

  for (const problem of problems) {
    const list = units.get(problem.unitName) ?? [];
    list.push(problem);
    units.set(problem.unitName, list);
  }

  return [...units.entries()]
    .map(([unitName, items]) => {
      const conceptMap = new Map<string, number>();
      for (const item of items) {
        conceptMap.set(item.concept, (conceptMap.get(item.concept) ?? 0) + 1);
      }
      return {
        unitName,
        count: items.length,
        concepts: [...conceptMap.entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      };
    })
    .sort((a, b) => b.count - a.count || a.unitName.localeCompare(b.unitName));
}
