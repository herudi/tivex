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
    plugins: [terser({ keep_classnames: /TArray/ }), typescript()],
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'esm',
    },
    plugins: [typescript(), dts()],
  },
  {
    input: './runtime/jsx-runtime.ts',
    output: {
      file: './dist/jsx-runtime.js',
      format: 'esm',
    },
    plugins: [typescript()],
  },
  {
    input: './runtime/jsx-runtime.ts',
    output: {
      file: './dist/jsx-runtime.d.ts',
      format: 'esm',
    },
    plugins: [typescript(), dts()],
  },
  {
    input: './flow/flow.ts',
    output: {
      file: './dist/flow.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [terser({ keep_classnames: /TArray/ }), typescript()],
  },
  {
    input: './flow/flow.ts',
    output: {
      file: './dist/flow.d.ts',
      format: 'esm',
    },
    plugins: [typescript(), dts()],
  },
]);
