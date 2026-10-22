import { getProblems } from '../data/problems';

export async function GET() {
  const site = import.meta.env.SITE;
  if (!site) {
    throw new Error('Set the site URL in astro.config.mjs to generate the sitemap.');
  }

  const problems = await getProblems();
  const paths = [
    '/',
    '/problems/',
    '/about/',
    '/privacy/',
    '/contact/',
    ...problems.map((problem) => `/problem/${problem.id}/`),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    }
  );
}
