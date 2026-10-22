import type { Solution, SolutionType } from '../types/mathProblem';

/**
 * 해법 표시/정렬 헬퍼.
 *
 * 원본 MDX는 `## 풀이` 계열 소제목을 여러 개 가질 수 있습니다.
 * 같은 유형이 여러 번 나오면 등장 순서대로 ①, ② 번호를 자동 부여합니다.
 */

/** 화면에 노출되는 유형 순서 (정석 → 스킬 → 그래프 → 함정) */
export const SOLUTION_TYPE_ORDER: readonly SolutionType[] = [
  'standard',
  'shortcut',
  'geometric',
  'pitfall',
];

/** 유형별 정식 명칭 */
export const SOLUTION_TYPE_LABELS: Record<SolutionType, string> = {
  standard: '정석 풀이',
  shortcut: '스킬 풀이',
  geometric: '그래프 풀이',
  pitfall: '함정 포인트',
};

/** 유형별 축약 명칭 */
export const SOLUTION_TYPE_SHORT_LABELS: Record<SolutionType, string> = {
  standard: '정석',
  shortcut: '스킬',
  geometric: '그래프',
  pitfall: '함정',
};

/** 유형별 대표 색상 */
export const SOLUTION_TYPE_DOT_COLORS: Record<SolutionType, string> = {
  standard: 'bg-indigo-500',
  shortcut: 'bg-amber-500',
  geometric: 'bg-emerald-500',
  pitfall: 'bg-rose-500',
};

const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

function toCircled(n: number): string {
  return CIRCLED_NUMBERS[n - 1] ?? `(${n})`;
}

export function countSolutionsByType(solutions: Solution[]): Record<SolutionType, number> {
  const counts: Record<SolutionType, number> = {
    standard: 0,
    shortcut: 0,
    geometric: 0,
    pitfall: 0,
  };
  for (const solution of solutions) counts[solution.type] += 1;
  return counts;
}

export interface OrderedSolution {
  solution: Solution;
  type: SolutionType;
  typeIndex: number;
  typeCount: number;
  displayLabel: string;
  shortLabel: string;
  dotColor: string;
}

export function orderSolutions(solutions: Solution[]): OrderedSolution[] {
  const counts = countSolutionsByType(solutions);
  const seen: Record<SolutionType, number> = {
    standard: 0,
    shortcut: 0,
    geometric: 0,
    pitfall: 0,
  };

  return SOLUTION_TYPE_ORDER.flatMap((type) =>
    solutions
      .filter((solution) => solution.type === type)
      .map((solution) => {
        seen[type] += 1;
        const numbered = counts[type] > 1;
        const suffix = numbered ? ` ${toCircled(seen[type])}` : '';

        return {
          solution,
          type,
          typeIndex: seen[type],
          typeCount: counts[type],
          displayLabel: `${SOLUTION_TYPE_LABELS[type]}${suffix}`,
          shortLabel: `${SOLUTION_TYPE_SHORT_LABELS[type]}${suffix}`,
          dotColor: SOLUTION_TYPE_DOT_COLORS[type],
        };
      })
  );
}

export interface SolutionTypeSummary {
  type: SolutionType;
  label: string;
  shortLabel: string;
  count: number;
  dotColor: string;
}

export function summarizeSolutionTypes(solutions: Solution[]): SolutionTypeSummary[] {
  const counts = countSolutionsByType(solutions);

  return SOLUTION_TYPE_ORDER.filter((type) => counts[type] > 0).map((type) => ({
    type,
    label: SOLUTION_TYPE_LABELS[type],
    shortLabel: SOLUTION_TYPE_SHORT_LABELS[type],
    count: counts[type],
    dotColor: SOLUTION_TYPE_DOT_COLORS[type],
  }));
}

export function getPrimarySolution(solutions: Solution[]): Solution | undefined {
  return solutions.find((solution) => solution.type === 'standard') ?? solutions[0];
}

/** LaTeX 구분자를 제거한 평문 라벨 */
export function toPlainLabel(text: string): string {
  return text.replace(/\${1,2}/g, '').replace(/\s+/g, ' ').trim();
}
