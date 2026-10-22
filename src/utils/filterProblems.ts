import type { Problem } from '../types/mathProblem';

export function getUniqueYears(problems: Problem[]): number[] {
  const years = Array.from(new Set(problems.map((p) => p.year)));
  return years.sort((a, b) => b - a);
}
