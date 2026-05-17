import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  external: ['@napi-rs/canvas'],
  outDir: 'dist',
  target: 'node18',
  tsconfig: 'tsconfig.json',
});
