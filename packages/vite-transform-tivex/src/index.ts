import { transform } from 'tivex-transform';
// import { transform } from "./../../tivex-transform/dist/index.js";
import type { Plugin } from 'vite';

const regExt = /\.(tsx|jsx)$/;

export function tivexTransform(): Plugin {
  return {
    name: 'vite-transform-tivex',
    enforce: 'pre',
    transform: (code, path) => {
      if (regExt.test(path)) return transform(code);
      return code;
    },
  };
}
