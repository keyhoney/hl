import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * remark-math가 만든 math/inlineMath 노드에서 `\frac` → `\dfrac`.
 * 원본 `remark-dfrac.ts`와 동일한 규칙입니다.
 */
export function remarkDfrac() {
  return (tree: Root) => {
    visit(tree, ['inlineMath', 'math'], (node) => {
      if ('value' in node && typeof node.value === 'string') {
        node.value = node.value.replace(/\\frac/g, '\\dfrac');
      }
    });
  };
}
