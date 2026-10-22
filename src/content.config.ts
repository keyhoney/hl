import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 각 문항은 src/content/problems/<id>.md 파일 하나로 관리됩니다.
 * - 파일명(확장자 제외)이 문항 id가 됩니다. (예: 2025-csat-math-22.md -> "2025-csat-math-22")
 * - 구조화된 메타데이터/해법은 frontmatter에, 문제 원문(LaTeX 포함)은 마크다운 본문에 작성합니다.
 */

/** 수능 수학 과목 (2022 개정 교육과정 기준, 공통/선택 구분 없음) */
const subjectSchema = z.enum(['대수', '미적분 I', '확률과 통계']);

const solutionStepSchema = z.object({
  stepTitle: z.string(),
  explanation: z.string(),
  mathLatex: z.string().optional(),
  tip: z.string().optional(),
});

/**
 * 해법 하나. 같은 `type`을 여러 번 쓸 수 있습니다.
 * 예) standard 2개 + shortcut 3개 (정석 풀이 ①·② / 스킬 풀이 ①·②·③ 자동 번호 부여)
 * 표시용 라벨은 frontmatter에 쓰지 않으며 UI가 `type`과 등장 순서로 생성합니다.
 */
const solutionSchema = z.object({
  type: z.enum(['standard', 'shortcut', 'geometric']),
  title: z.string(),
  summary: z.string(),
  calculationLoad: z.enum(['소 (매우 적음)', '중 (보통)', '대 (계산량 많음)']),
  difficultyRating: z.number().min(1).max(5),
  recommendationScore: z.number().min(1).max(5),
  estimatedMinutes: z.number().int().positive(),
  diagramId: z.string().optional(),
  steps: z.array(solutionStepSchema),
  verdict: z.string(),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/problems' }),
  schema: z.object({
    examName: z.string(),
    year: z.number().int(),
    examMonth: z.number().int().optional(),
    subject: subjectSchema,
    unitName: z.string(),
    subTopic: z.string(),
    problemNumber: z.number().int().positive(),
    points: z.number().int().positive(),
    correctRateEstimate: z.number().optional(),
    answer: z.union([z.string(), z.number()]),
    sourceOrg: z.string(),
    officialLink: z.string().url(),
    diagramType: z
      .enum(['cubic-derivative', 'quartic-tangent', 'transcendental-integral'])
      .optional(),
    keyInsight: z.string(),
    solutions: z.array(solutionSchema).min(1),
    /**
     * 아래 두 항목은 "작성한 문항에서만" 노출되는 선택 항목입니다.
     * 아직 모든 문항에 채우지 않아도 되도록 optional로 두었습니다.
     */
    prerequisites: z
      .array(
        z.object({
          name: z.string(),
          subject: z.string(),
          description: z.string(),
          importance: z.enum(['필수', '권장', '심화']),
        })
      )
      .optional(),
    relatedProblems: z
      .array(
        z.object({
          id: z.string(),
          examTitle: z.string(),
          year: z.number().int(),
          problemNumber: z.number().int(),
          subject: subjectSchema,
          similarityReason: z.string(),
        })
      )
      .optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    reviewedBy: z.string(),
  }),
});

export const collections = { problems };
