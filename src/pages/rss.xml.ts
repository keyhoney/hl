import { getProblems } from '../data/problems';
import { stripMarkdown } from '../lib/mdx/render';
import type { Problem } from '../types/mathProblem';

const FEED_TITLE = 'HowLearn | 수능 수학 4점 기출 해설';
const FEED_DESCRIPTION =
  '수능 수학 4점 킬러·준킬러 문항의 정석 풀이, 실전 숏컷, 단계별 힌트를 제공하는 HowLearn의 문항 피드입니다.';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength).trim()}…`
    : normalized;
}

/** RSS 설명에는 KaTeX 원문 대신 읽기 쉬운 평문을 사용합니다. */
function toFeedText(source: string): string {
  const withoutMath = source
    .replace(/\$\$[\s\S]*?\$\$/g, ' [수식] ')
    .replace(/\\\[[\s\S]*?\\\]/g, ' [수식] ')
    .replace(/\\\([\s\S]*?\\\)/g, ' [수식] ')
    .replace(/\$[^$\n]*\$/g, ' [수식] ');

  return stripMarkdown(withoutMath);
}

/**
 * `problem.year`는 학년도 기준입니다.
 * 예: 2026학년도 수능은 2025년 11월에 시행되므로 실제 달력 연도는 1년 앞당깁니다.
 */
function getProblemDate(problem: Problem): Date {
  return new Date(Date.UTC(problem.year - 1, problem.month - 1, 1, 9, 0, 0));
}

function buildDescription(problem: Problem): string {
  const body = truncate(toFeedText(problem.problemBody), 320);
  const hint = truncate(toFeedText(problem.keyInsight), 180);

  return [
    `${problem.examName} · ${problem.subject} · ${problem.unitName} · ${problem.concept}`,
    `난이도 ${problem.difficulty}/5 · ${problem.points}점 · ${
      problem.answerType === 'mcq' ? '객관식' : '단답형'
    } · 힌트 ${problem.hints.length}개 · 풀이 ${problem.solutions.length}개`,
    body,
    hint ? `첫 힌트: ${hint}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function GET() {
  const site = import.meta.env.SITE;
  if (!site) {
    throw new Error('Set the site URL in astro.config.mjs to generate the RSS feed.');
  }

  const problems = await getProblems();
  const feedUrl = new URL('/rss.xml', site).href;
  const lastBuildDate = new Date().toUTCString();

  const items = problems
    .map((problem) => {
      const link = new URL(`/problem/${problem.id}/`, site).href;
      const categories = [
        problem.examType,
        problem.subject,
        problem.unitName,
        problem.concept,
      ];

      return [
        '    <item>',
        `      <title>${escapeXml(`${problem.examName} ${problem.subject} ${problem.problemNumber}번`)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${getProblemDate(problem).toUTCString()}</pubDate>`,
        `      <author>math@howlearn.kr (주기헌)</author>`,
        ...categories.map((category) => `      <category>${escapeXml(category)}</category>`),
        `      <description>${escapeXml(buildDescription(problem))}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(new URL('/', site).href)}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>ko</language>
    <copyright>© ${new Date().getFullYear()} HowLearn</copyright>
    <managingEditor>math@howlearn.kr (주기헌)</managingEditor>
    <webMaster>math@howlearn.kr (주기헌)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Astro</generator>
    <ttl>1440</ttl>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
