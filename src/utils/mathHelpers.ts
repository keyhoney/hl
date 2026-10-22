import type { SolutionType, SubjectType } from '../types/mathProblem';

/** 과목 배지 색상 */
export function getSubjectBadgeStyle(subject: SubjectType | string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (subject) {
    case '대수':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case '미적분 I':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case '확률과 통계':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

/** 난이도 별 표시 */
export function difficultyStars(level: number): string {
  return '★'.repeat(Math.max(0, Math.min(5, level))) + '☆'.repeat(Math.max(0, 5 - level));
}

/** 해법 유형 배지 색상 */
export function getSolutionBadgeStyle(type: SolutionType): {
  bg: string;
  text: string;
  border: string;
} {
  switch (type) {
    case 'standard':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'shortcut':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'geometric':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'pitfall':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}. ${String(month).padStart(2, '0')}.`;
}

export function examShortLabel(examType: string, month: number): string {
  if (examType === '수능') return '수능';
  return `${month}월 모평`;
}
