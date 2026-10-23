import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * 현재 배포된 커밋 SHA를 알려주는 헬스체크 엔드포인트.
 *
 * GitHub Actions(`.github/workflows/indexnow.yml`)가 push 후 이 값을 폴링해서
 * Cloudflare Pages 배포가 끝난 뒤에만 IndexNow로 URL을 제출합니다.
 * Cloudflare Pages 빌드 환경에서는 `CF_PAGES_COMMIT_SHA`가 자동 주입됩니다.
 */
export const GET: APIRoute = () => {
  const sha = process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'unknown';

  return new Response(JSON.stringify({ sha }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};
