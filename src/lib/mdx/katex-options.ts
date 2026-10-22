/**
 * 원본 `katex-shared.ts`와 동일한 rehype-katex 옵션.
 * 잘못된 수식이 있어도 빌드가 중단되지 않습니다.
 */
export const rehypeKatexSafeOptions = {
  throwOnError: false,
  strict: false,
  errorColor: '#cc0000',
} as const;
