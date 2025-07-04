import { isValidElement, options, OptRender } from './jsx.js';
import {
  $unmount,
  ComputedCore,
  createComputed,
  isSignal,
  Signal,
} from './reactive.js';
import type { JSXNode, JSXProps, TAny } from './types.js';
import {
  $brand,
  $fragment,
  arrFrom,
  cleanup,
  dangerHTML,
  html_ns,
  isArray,
  isElem,
  isFunc,
  isNotNull,
  isNumber,
  isObject,
  isString,
  mutateAttr,
  NULL,
  objToStr,
  reg_capture,
  reg_non_update_attr,
  reg_props,
  reg_void_elem,
  tag_ns,
} from './util.js';

const createTextNode = (v: TAny) => document.createTextNode(v);
const createComment = (v: TAny) => document.createComment(v);

const isEvent = (v: TAny) => v[0] == 'o' && v[1] == 'n';
const applyAttr = (dom: Element, k: string, val: TAny, onErr: TAny) => {
  if (!reg_props.test(k) && k !== dangerHTML) {
    const key = mutateAttr[k] || k.toLowerCase();
    if (key.startsWith('bind:')) {
      let _key = key.slice(5);
      if (isSignal(val)) {
        addEvent(
          dom,
          _key === 'value' ? 'onInput' : 'onChange',
          ({ target }: TAny) => {
            let data =
              target.multiple && target.selectedOptions
                ? arrFrom<TAny>(target.selectedOptions).map((el) => el.value)
                : target.value;
            if (target.type === 'number' && isNotNull(data) && data !== '') {
              data = parseInt(data);
            }
            val.set(data);
          }
        );
      }
      applyAttr(dom, _key, val, onErr);
    } else if (isFunc(val) && !val.$d) {
      if (val[$brand]) {
        val.watch((newVal: TAny) => applyAttr(dom, key, newVal, onErr));
        applyAttr(dom, key, val(), onErr);
      } else if (isEvent(key)) {
        addEvent(dom, k, val);
      } else {
        !val.length && applyAttr(dom, key, createComputed(val, onErr), onErr);
      }
    } else if (isObject(val)) {
      applyAttr(dom, key, objToStr(val, key), onErr);
    } else {
      const name = dom.nodeName;
      const hasKey = key in dom;
      if (key === 'value') {
        const value = val == NULL || val === false ? NULL : val;
        if (name === 'SELECT') {
          selectOptions(arrFrom(dom.children), value);
        } else if (name === 'TEXTAREA') {
          dom[key] = value;
          dom.textContent = value;
        } else if (hasKey) {
          dom[key] = value;
        }
      } else if (!reg_non_update_attr.test(key) && hasKey) {
        dom[key] = val;
      }
      if (isNotNull(val) && val !== false) {
        const _val = val === true ? '' : val;
        if (key === 'style') {
          (dom as HTMLElement).style.cssText = _val;
        } else {
          dom.setAttribute(key, _val);
        }
      }
    }
  }
};

const selectOptions = (arr: TAny[] = [], val: TAny) => {
  if (val == NULL) return;
  if (isFunc(val)) val = val();
  arr.forEach((opt) => {
    let type: string, props: TAny;
    if (isValidElement(opt)) ((type = opt.type), (props = opt.props || {}));
    else ((type = opt.nodeName.toLowerCase()), (props = opt));
    if (type !== 'option') selectOptions(arrFrom(props.children || []), val);
    else {
      props.selected = isArray(val)
        ? val.indexOf(props.value) !== -1
        : val === props.value;
    }
  });
};

const handleRange = (newNode: Node, { start, end }) => {
  const range = document.createRange();
  range.setStartAfter(start);
  range.setEndBefore(end);
  cleanup(range.extractContents());
  range.deleteContents();
  range.insertNode(newNode);
};

const createNode = (node: Element) => {
  if (isFrag(node)) {
    const start = createComment('');
    start['$f'] = 1;
    const end = createComment('');
    const first = node.firstChild;
    if (!first || (first && !first['$f'])) {
      node.prepend(start);
      node.append(end);
    }
    return { start: node.firstChild, end: node.lastChild, [$fragment]: 1 };
  }
  return node;
};
export const isFrag = (v: TAny) => v instanceof DocumentFragment;
const reaction = (sig: Signal<TAny> | ComputedCore<TAny>, opts: OptRender) => {
  const node = renderToElement(sig(), opts);
  sig.watch((newVal, oldVal) => {
    if (options.arrDiff(newVal, oldVal)) return;
    const newNode = renderToElement(newVal, opts);
    const oldNode = sig['_n'];
    if (oldNode[$fragment]) {
      handleRange(newNode, oldNode);
    } else {
      sig['_n'] = createNode(newNode);
      cleanup(oldNode);
      oldNode.replaceWith(newNode);
    }
  });
  sig['_n'] = createNode(node);
  return node;
};
const toVal = (v: TAny, ...a: TAny[]) => (isFunc(v) ? v(...a) : v);

/**
 * Creates a proxy for the given props object.
 * The proxy allows for dynamic property access and provides methods to set default values and computed properties.
 * - `$props`: Returns the original props object.
 * - `$set`: Allows setting computed properties by providing a function that takes the previous value.
 * - `$default`: Sets default values for properties that are not already defined in the props object.
 * @param props - The props object to create a proxy for.
 * @returns A proxy object that provides dynamic property access and methods for computed properties and defaults.
 * @example
 * const props = propsToProxy({ text: 'Hello' });
 * console.log(props.text); // 'Hello'
 * props.$set({ text: (prev) => prev + ' World' });
 * console.log(props.text); // 'Hello World'
 * props.$default({ count: 0 });
 * console.log(props.count); // 0
 */
export const propsToProxy = <T extends Record<string, TAny> = {}>(
  props: T = {} as T
): JSXProps<T> => {
  return new Proxy(props, {
    get(target: TAny, prop) {
      if (prop === '$props') return props;
      if (prop === '$set') {
        return (def: TAny) => {
          const wrap = (key: string, val: TAny) => {
            const prev = target[key];
            target[key] = () => toVal(val, toVal(prev));
          };
          for (let k in def) wrap(k, def[k]);
        };
      }
      if (prop === '$default') {
        return (def: TAny) => {
          for (let k in def) {
            if (!(k in props)) (props as TAny)[k] = def[k];
          }
        };
      }
      return toVal(target[prop as string]);
    },
    set(target, prop, newVal) {
      target[prop] = () => newVal;
      return true;
    },
  });
};

/**
 * Renders a JSX element to an HTML element.
 * If the element is a function, it will be executed to get the JSX element.
 * If the element is a string or number, it will be converted to a text node.
 * If the element is an array, it will render each element in the array.
 * If the element is a valid JSX element, it will create an HTML element with the specified type and props.
 * If the element is an existing DOM element, it will return that element.
 * If the element is null or undefined, it will return an empty text node.
 * @param elem - The JSX element to render.
 * @param opts - Optional rendering options.
 * @returns An HTML element representing the rendered JSX element.
 * @example
 * const elem = <div className="my-class">Hello, World!</div>;
 * const renderedElement = renderToElement(elem);
 * document.body.appendChild(renderedElement);
 */
export function renderToElement(elem: TAny): HTMLElement;
export function renderToElement(elem: TAny, opts: OptRender): HTMLElement;
export function renderToElement(elem: JSXNode<TAny>): HTMLElement;
export function renderToElement(
  elem: JSXNode<TAny>,
  opts: OptRender
): HTMLElement;
export function renderToElement(elem: TAny, opts: OptRender = {}) {
  if (elem == NULL || typeof elem === 'boolean') return createTextNode('');
  if (isFunc(elem)) {
    if (elem[$brand]) return reaction(elem, opts);
    return reaction(createComputed(elem, opts.err), opts);
  }
  if (isString(elem) || isNumber(elem)) return createTextNode(elem.toString());
  if (isArray(elem)) {
    const frag = document.createDocumentFragment();
    elem.forEach((el) => frag.append(renderToElement(el, opts)));
    return frag;
  }
  if (isValidElement(elem)) {
    let { type, props } = elem;
    if (isFunc(type)) {
      props = propsToProxy(props);
      return renderToElement(type(props), opts);
    }
    const dom = document.createElementNS(
      (opts.ns ||= tag_ns[type]) || html_ns,
      type,
      props.is && props
    );
    if (type === 'select') {
      selectOptions(props.children, props['bind:value'] || props.value);
    }
    for (let k in props) applyAttr(dom, k, props[k], opts.err);
    if (isObject(props.ref)) props.ref.current = dom;
    if (reg_void_elem.test(type)) return dom;
    if (isNotNull(props[dangerHTML])) dom.innerHTML = props[dangerHTML].__html;
    else if (isNotNull(props.children)) {
      dom.append(renderToElement(props.children, opts));
    }
    return dom;
  }
  if (isElem(elem)) return elem;
  return createTextNode(String(elem));
}

const addEvent = (
  dom: Node,
  name: string,
  cb: EventListenerOrEventListenerObject
) => {
  let cap = name !== (name = name.replace(reg_capture, '$1'));
  name = name.toLowerCase().slice(2);
  dom.addEventListener(name, cb, cap);
  // remove event when component exits. it's recomended to solve GC issue.
  $unmount(() => dom.removeEventListener(name, cb, cap));
};

/**
 * Renders a JSX element into the specified root element.
 * If no root is provided, it appends the rendered element to the document body.
 * @param elem - The JSX element to render.
 * @param root - The root HTML element to append the rendered element to. Defaults to document.body.
 * @example
 * render(<MyComponent />, document.getElementById('app'));
 * @returns void
 */
export function render(elem: JSX.Element, root?: HTMLElement | null) {
  if (root) {
    root.appendChild(renderToElement(elem));
  }
}
