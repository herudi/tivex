import { transform, type TransformOptions } from 'tivex-transform';
// import { transform, type TransformOptions } from "./../../tivex-transform/src/index.js";
import type { Plugin } from 'vite';

const regExt = /\.(tsx|jsx)$/;

export function tivexTransform(opts: TransformOptions = {}): Plugin {
  return {
    name: 'vite-transform-tivex',
    enforce: 'pre',
    transform: (code, path) => {
      if (regExt.test(path)) return transform(code, opts);
      return code;
    },
  };
}
