import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';

const project = fileURLToPath(new URL('./', import.meta.url));
const output = fileURLToPath(new URL('./.github-pages-dist', import.meta.url));
const base = `${(process.env.PAGES_BASE_PATH ?? '/Reclaim').replace(/\/+$/, '')}/`;
export default defineConfig({
  root: `${project}github-pages`, base, publicDir: false,
  define: { __RECLAIM_GITHUB_PAGES__: 'true' },
  resolve: { alias: {
    'next/link': `${project}github-pages/link.tsx`,
    'next/navigation': `${project}github-pages/router.ts`,
    '@': project,
  } },
  css: { postcss: project },
  plugins: [react(), {
    name: 'reclaim-pages-public-assets',
    closeBundle() {
      mkdirSync(output, { recursive: true });
      copyFileSync(`${project}public/favicon.svg`, `${output}/favicon.svg`);
      writeFileSync(`${output}/.nojekyll`, '');
      writeFileSync(`${output}/manifest.webmanifest`, JSON.stringify({
        name: 'RECLAIM — Your next safe step', short_name: 'RECLAIM',
        description: 'Recovery guides and private browser checklists.',
        start_url: './', scope: './', display: 'standalone',
        background_color: '#0a101a', theme_color: '#0a101a',
        icons: [{ src: './favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      }));
    },
  }],
  build: { outDir: output, emptyOutDir: true },
  server: { host: '127.0.0.1', port: 5174 },
  preview: { host: '127.0.0.1', port: 5174 },
});
