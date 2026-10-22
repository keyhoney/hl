import type { Problem } from '../types/mathProblem';

/**
 * 문항 카드 검색·필터용 평문 문자열.
 *
 * 목록 페이지의 초기 HTML과 `/api/problems/index.json`이 같은 규칙을 쓰도록
 * 한 곳에서만 정의합니다. (소문자, 연속 공백 축약)
 */
export function problemSearchBlob(problem: Problem): string {
  const solutionText = problem.solutions
    .map((solution) => `${solution.title} ${solution.summary}`)
    .join(' ');

  return [
    problem.examName,
    problem.subject,
    problem.unitName,
    problem.subChapter,
    `${problem.problemNumber}`,
    `${problem.problemNumber}번`,
    problem.problemBody,
    problem.keyInsight,
    solutionText,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}
