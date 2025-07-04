import type { EObject, JSXInternal, JSXNode, TAny } from './types.js';

declare global {
  export namespace JSX {
    // @ts-ignore
    type Element = TAny;
    interface IntrinsicElements extends JSXInternal.IntrinsicElements {
      [k: string]: {
        children?: JSXNode;
        [p: string]: TAny;
      };
    }
    interface ElementChildrenAttribute {
      children: EObject;
    }
  }
}

export { Fragment, h, isValidElement, jsxRender, options } from './jsx.js';
export {
  $batch,
  $computed,
  $effect,
  $lazy,
  $mount,
  $ref,
  $state,
  $unmount,
  $untrack,
  type State,
} from './reactive.js';

export { propsToProxy, render, renderToElement } from './dom.js';
export { cleanup, isElem } from './util.js';

export type {
  AsyncFC,
  FC,
  JSXElement,
  JSXInternal,
  JSXNode,
  JSXProps,
} from './types.js';
