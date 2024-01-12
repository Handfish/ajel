import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  splitting: false,
  minify: true,
  // clean: true,
  // sourcemap: true,
});
