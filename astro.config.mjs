// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://howlearn.kr',
  // 100% static output — no server, no database. Every page is pre-rendered to HTML.
  server: {
    port: 3000,
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // 외부 CSS 요청이 초기 렌더링을 막지 않도록 모든 스타일을 HTML에 인라인합니다.
    inlineStylesheets: 'always',
  },
});
