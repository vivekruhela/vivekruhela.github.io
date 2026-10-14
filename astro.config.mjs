import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://vivekruhela.github.io',
  // $inline$ and $$display$$ math in Markdown posts
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
});
