import { isFrag, renderToElement } from './dom.js';
import type {
  CB,
  EObject,
  FC,
  JSXElement,
  JSXInternal,
  JSXNode,
  TAny,
} from './types.js';
import {
  $clean,
  $cleanFrag,
  $jsx,
  assign,
  IS_CLIENT,
  isNotNull,
  isObject,
  NULL,
} from './util.js';

/**
 * Creates a JSX element.
 * This function is used to create JSX elements in a functional component.
 * It can accept a string for HTML elements or a functional component (FC).
 * The props can be an object containing HTML attributes or component props.
 * The children can be any valid JSX nodes.
 * @param type - The type of the element, can be a string for HTML elements or a functional component (FC).
 * @param props - The properties of the element, can be an object containing HTML attributes or component props.
 * @param children - The children of the element, can be any valid JSX nodes.
 * @returns A JSX element object with the specified type, props, and children.
 * @example
 * const elem = h('div', { className: 'my-class' }, 'Hello, World!');
 * const elem2 = h(MyComponent, { prop1: 'value' }, h('span', null, 'Child Element'));
 * // elem is a JSX element representing a <div> with class "my-class" and
 * // text content "Hello, World!".
 * // elem2 is a JSX element representing a MyComponent with prop1 set to 'value'
 * // and a child element which is a <span> with text content "Child Element".
 */
export function h(
  type: string,
  props?: JSXInternal.HTMLAttributes | null,
  ...children: JSXNode[]
): JSXElement;
export function h<T = EObject>(
  type: FC<TAny>,
  props?: T | null,
  ...children: JSXNode[]
): JSXElement | null;
export function h(
  type: string | FC,
  props?: EObject | null,
  ...children: JSXNode[]
): JSXNode {
  props ||= {};
  return {
    type,
    props:
      children.length > 0 ? assign(assign({}, props), { children }) : props,
    [$jsx]: 1,
  } as TAny;
}

/**
 * Fragment component to group multiple JSX elements without adding extra nodes to the DOM.
 * It is used to wrap multiple children without introducing an additional HTML element.
 * This is useful when you want to return multiple elements from a component without wrapping them in a single parent element.
 * @param props - The props for the Fragment component.
 * @returns A JSX element representing a fragment.
 * @example
 * const elem = (
 *   <Fragment>
 *     <div>Child 1</div>
 *     <div>Child 2</div>
 *   </Fragment>
 * );
 * // elem is a JSX element representing a fragment containing two child div elements.
 */
export const Fragment: FC = (props) => props.children as JSXElement;
h.Fragment = Fragment;

/**
 * Checks if the given value is a valid JSX element.
 * A valid JSX element is an object with a `$jsx` property.
 * @param v - The value to check.
 * @returns boolean - Returns true if the value is a valid JSX element, otherwise false.
 * @example
 * isValidElement(<div>Hello</div>); // true
 * isValidElement('Hello'); // false
 * isValidElement(null); // false
 */
export const isValidElement = (v: TAny) => isObject(v) && isNotNull(v[$jsx]);

/**
 * Options for rendering JSX elements.
 * - `clean`: If true, it will clean up the rendered element after rendering.
 * - `err`: An error handler function to handle errors during rendering.
 * - `ns`: The namespace for the element, used for SVG or MathML elements.
 */
export type OptRender = {
  clean?: boolean;
  err?: (err: Error) => JSX.Element;
  ns?: string;
};

/**
 * Options for rendering JSX elements.
 * - `renderToString`: A function to render the element to a string.
 * - `_err`: An error handler function to handle errors during rendering.
 * - `arrDiff`: A function to compare two values and determine if they are different.
 *   It is used to optimize rendering by avoiding unnecessary updates.
 */
export const options: {
  renderToString?: (elem: TAny) => string;
  _err?: TAny;
  arrDiff: <T, O>(newVal: T, oldVal: O) => boolean;
} = { arrDiff: () => false };
export let curClean!: Set<CB<void>>;
const renderWithCleanup = (
  elem: JSXNode,
  opts: OptRender,
  res?: TAny,
  prev?: Set<CB<void>>
) => {
  ((prev = curClean),
    (curClean = new Set()),
    (res = renderToElement(elem, opts)),
    (res[$clean] = curClean),
    (curClean = prev));
  if (isFrag(res) && res[$clean].size) {
    const first = res.firstChild;
    if (first) {
      first[$cleanFrag] = res[$clean];
      res[$clean] = NULL;
    }
  }
  return res;
};

/**
 * Renders a JSX element to a string or an HTML element.
 * If the environment is a client, it will render the element to an HTML element.
 * If the environment is a server, it will render the element to a string.
 * The `opts` parameter can be used to specify rendering options such as error handling and cleanup.
 * @param elem - The JSX element to render.
 * @param opts - Optional rendering options.
 * @returns The rendered element as a string or an HTML element.
 * @example
 * const elem = <div className="my-class">Hello, World!</div>;
 * const renderedElement = jsxRender(elem);
 * document.body.appendChild(renderedElement);
 */
export const jsxRender = (elem: TAny, opts: OptRender = {}) => {
  const prev = options._err;
  if (opts.clean == NULL) opts.clean = true;
  options._err = opts.err;
  try {
    if (IS_CLIENT) {
      return opts.clean
        ? renderWithCleanup(elem, opts)
        : renderToElement(elem, opts);
    }
    const toStr = options.renderToString;
    return toStr ? toStr(elem) : elem;
  } finally {
    options._err = prev;
  }
};
