import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://faradad.github.io',
  base: '/prompthub',
  adapter: cloudflare(),
});