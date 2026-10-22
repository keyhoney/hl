import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ProblemCard from '../../../components/ProblemCard.astro';
import { getProblems } from '../../../data/problems';
import type { APIRoute, GetStaticPaths } from 'astro';

export const prerender = true;

const PAGE = 12;

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getProblems();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE));
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const page = Math.max(1, parseInt(params.page ?? '1') || 1);
  const all = await getProblems();
  const chunk = all.slice((page - 1) * PAGE, page * PAGE);

  const container = await AstroContainer.create();
  const cards = await Promise.all(
    chunk.map((problem) =>
      container.renderToString(ProblemCard, {
        props: { problem },
      })
    )
  );

  return new Response(
    JSON.stringify({
      page,
      total: all.length,
      totalPages: Math.ceil(all.length / PAGE),
      cards,
    }),
    {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
};
