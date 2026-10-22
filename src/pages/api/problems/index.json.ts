import type { APIRoute } from 'astro';
import { getProblems } from '../../../data/problems';
import { problemSearchBlob } from '../../../utils/problemSearch';

export const prerender = true;

const PAGE = 12;

/**
 * 목록 페이지의 검색·필터용 경량 인덱스.
 *
 * 카드 HTML(KaTeX 포함)은 `/api/problems/{page}.json`에서 페이지 단위로
 * 필요할 때만 가져오고, 이 파일에는 검색에 필요한 최소 필드만 담습니다.
 * `p`는 원본 목록에서의 페이지 번호입니다.
 */
export const GET: APIRoute = async () => {
  const all = await getProblems();

  const items = all.map((problem, index) => ({
    id: problem.id,
    p: Math.floor(index / PAGE) + 1,
    y: problem.year,
    s: problem.subject,
    q: problemSearchBlob(problem),
  }));

  return new Response(
    JSON.stringify({
      total: all.length,
      pageSize: PAGE,
      totalPages: Math.max(1, Math.ceil(all.length / PAGE)),
      items,
    }),
    {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
};
