import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { normalizeMathMarkdownSource } from './normalize';
import { remarkDfrac } from './remark-dfrac';
import { rehypeKatexSafeOptions } from './katex-options';

/**
 * 렌더링 규칙은 원본 프로젝트의 `KaTeXRenderer.tsx`와 동일합니다.
 *
 * remark-parse → remark-math → remark-gfm → remark-dfrac
 * → remark-rehype → rehype-katex(safe) → rehype-stringify
 *
 * - `$...$`, `$$...$$` 수식을 KaTeX로 변환
 * - GFM 표·체크리스트·취소선 지원
 * - `\frac`를 `\dfrac`로 통일
 * - 잘못된 수식이 있어도 빌드를 중단하지 않음
 */

function rehypeMdxEnhancements() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName === 'img') {
        node.properties = {
          ...node.properties,
          loading: 'lazy',
          decoding: 'async',
          className: ['mdx-image'],
        };
      }

      if (node.tagName === 'table' && parent && typeof index === 'number') {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['mdx-table-wrap'] },
          children: [node],
        };
        return SKIP;
      }

      if (node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && /^https?:\/\//.test(href)) {
          node.properties = {
            ...node.properties,
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          };
        }
      }
      return undefined;
    });
  };
}

let processor: any;

function getProcessor() {
  if (!processor) {
    processor = unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkDfrac)
      .use(remarkRehype)
      .use(rehypeKatex, rehypeKatexSafeOptions)
      .use(rehypeMdxEnhancements)
      .use(rehypeStringify);
  }
  return processor;
}

const htmlCache = new Map<string, Promise<string>>();

async function render(source: string): Promise<string> {
  const normalized = normalizeMathMarkdownSource(source).trim();
  if (!normalized) return '';

  const cached = htmlCache.get(normalized);
  if (cached) return cached;

  const request = (async () => {
    try {
      const file = await getProcessor().process(normalized);
      return String(file);
    } catch (error) {
      console.error('[mdx] 렌더링 실패:', error);
      return `<pre class="mdx-error">${escapeHtml(normalized)}</pre>`;
    }
  })();

  htmlCache.set(normalized, request);
  request.catch(() => htmlCache.delete(normalized));
  return request;
}

/** 마크다운 전체를 HTML로 변환합니다. (문단·표·이미지·수식 포함) */
export function renderMarkdown(source: string): Promise<string> {
  return render(source);
}

/** 한 문단짜리 짧은 문장을 `<p>` 없이 인라인 HTML로 변환합니다. */
export async function renderInlineMarkdown(source: string): Promise<string> {
  const html = (await render(source)).trim();
  const match = html.match(/^<p>([\s\S]*)<\/p>$/);
  return match ? match[1] : html;
}

/** 검색·미리보기용 평문. 수식 기호와 마크다운 장식만 제거합니다. */
export function stripMarkdown(source: string): string {
  return source
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~`]/g, '')
    .replace(/\$+/g, '')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
