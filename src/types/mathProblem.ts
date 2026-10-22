/** 수능 수학 과목 (2022 개정 교육과정 기준) */
export type SubjectType = '대수' | '미적분 I' | '확률과 통계';

/** 평가원 시행 구분 */
export type ExamType = '수능' | '모평';

/** 객관식(5지선다) / 단답형 */
export type AnswerType = 'mcq' | 'short';

/**
 * 해법 유형.
 * - standard  : `## 풀이`
 * - shortcut  : `## 실전`, `## 실전 스킬`, `## 풀이 [실전]`
 * - geometric : `## 그래프 풀이`
 * - pitfall   : `## 함정 포인트`
 */
export type SolutionType = 'standard' | 'shortcut' | 'geometric' | 'pitfall';

/** `src/content/problems/_metadata.json`의 문항 메타데이터 */
export interface ProblemMetadata {
  source: string;
  year: number;
  month: number;
  examType: string;
  subject: string;
  chapter: string;
  subChapter: string;
  concept: string;
  difficulty: number;
  answerType: string;
  answer: string | number;
}

/** MDX에서 분리한 해법 하나 */
export interface Solution {
  id: string;
  type: SolutionType;
  title: string;
  /** MDX 원문 (수식·표·이미지 포함) */
  content: string;
  /** 검색·카드용 평문 요약 */
  summary: string;
  /** 문서 내 등장 순서 */
  index: number;
}

/** 같은 개념으로 묶인 다른 학년도 문항 */
export interface RelatedProblem {
  id: string;
  examName: string;
  year: number;
  month: number;
  problemNumber: number;
  subject: SubjectType;
  answerType: AnswerType;
  difficulty: number;
  points: number;
  hintsCount: number;
  solutionsCount: number;
  unitName: string;
  concept: string;
  reason: string;
}

/** 앱에서 사용하는 정규화된 문항 */
export interface Problem {
  id: string;
  /** 원본 MDX 파일명 */
  sourceFile: string;

  year: number;
  month: number;
  examType: ExamType;
  examName: string;

  subject: SubjectType;
  chapter: string;
  unitName: string;
  subChapter: string;
  concept: string;
  subTopic: string;

  problemNumber: number;
  points: number;
  difficulty: number;

  answerType: AnswerType;
  /** 화면 표시용 정답: 객관식 `④`, 단답형 `191` */
  answer: string;
  /** 객관식 정답 번호 (1~5) */
  answerIndex?: number;
  /** 원본 정답 값 */
  answerValue: string;
  /** ①~⑤ 선지 본문 (객관식만) */
  choices: string[];

  /** `## 문제` 본문 (선지·배점 표식 제거) */
  problemBody: string;
  /** `## 힌트` 본문들 */
  hints: string[];
  /** 카드 미리보기용 첫 번째 힌트 */
  keyInsight: string;
  /** `## 풀이` 계열 섹션들 */
  solutions: Solution[];

  /** 검색용 소문자 평문 */
  searchText: string;
  /** 같은 개념의 다른 문항 */
  related: RelatedProblem[];
}
