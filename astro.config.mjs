// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

import { baseUrlPlugin } from './src/plugins/base-url-plugin.mjs';

const base = '/surumebeer';

// https://astro.build/config
export default defineConfig({
  site: 'https://surumebeer.github.io',
  base,
  trailingSlash: 'always',
  markdown: {
    processor: satteri({
      // Markdown 内のルート相対 URL にも base を効かせる
      hastPlugins: [baseUrlPlugin(base)],
    }),
    shikiConfig: {
      // コードブロックはライト／ダークどちらの表示でも常にダークテーマにする
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
});
