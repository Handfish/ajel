import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'eslint-plugin-ajel',
  splitting: false,
  minify: true,
  // clean: true,
  // sourcemap: true,
});
