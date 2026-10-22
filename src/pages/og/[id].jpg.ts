import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { getProblems } from '../../data/problems';
import { renderProblemOgSvg } from '../../lib/og/problemOg';
import type { Problem } from '../../types/mathProblem';

export const prerender = true;

export const getStaticPaths = (async () => {
  const problems = await getProblems();
  return problems.map((problem) => ({
    params: { id: problem.id },
    props: { problem },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { problem } = props as { problem: Problem };
  const svg = renderProblemOgSvg(problem);

  const jpeg = await sharp(Buffer.from(svg, 'utf8'))
    .jpeg({
      quality: 88,
      chromaSubsampling: '4:4:4',
      progressive: true,
    })
    .toBuffer();

  return new Response(jpeg, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
