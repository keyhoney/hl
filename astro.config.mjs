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
});
