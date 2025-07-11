import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [terser(), typescript()],
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'esm',
    },
    plugins: [typescript(), dts()],
  },
]);
