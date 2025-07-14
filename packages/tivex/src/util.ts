import type { TAny } from './types.js';

export const NULL = null;
export const IS_CLIENT = typeof document !== 'undefined';
export const dangerHTML = 'dangerouslySetInnerHTML';
export const isFunc = (v: TAny): v is Function => typeof v === 'function';
export const isArray = Array.isArray;
export const isNumber = (v: TAny) => typeof v === 'number';
export const isString = (v: TAny) => typeof v === 'string';
export const Okeys = Object.keys;
export const assign = Object.assign;
export const arrFrom = Array.from;
export const isNotNull = (v: TAny) => v != NULL;
export const isObject = (v: TAny) =>
  isNotNull(v) && typeof v === 'object' && !isArray(v);
export const isElem = (v: TAny) =>
  isObject(v) && isString(v.nodeName) && isNumber(v.nodeType);
export const reg_props = /^(ref|key|children)$/;
export const reg_void_elem =
  /^(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
export const reg_non_update_attr =
  /^(style|width|height|href|list|form|tabindex|download|rowspan|colspan|role|popover)$/;
export const reg_capture = /(PointerCapture)$|Capture$/i;
const reg_non_dimentional =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
const Sym = Symbol;
export const $fragment = Sym('$frag');
export const $clean = Sym('$clean');
export const $cleanFrag = Sym('$cleanFrag');
export const $brand = Sym('$brand');
const sameLen = (a: TAny[], b: TAny[]) => a.length === b.length;
export const deepEqual = (x: TAny, y: TAny): boolean => {
  if (x === y) return true;
  if (isElem(x)) return isElem(y) && x.isEqualNode(y);
  if (isArray(x) && isArray(y) && sameLen(x, y)) {
    return x.every((v, i) => deepEqual(v, y[i]));
  }
  if (isObject(x) && isObject(y)) {
    const arr = Okeys(x);
    return sameLen(arr, Okeys(y)) && arr.every((k) => deepEqual(x[k], y[k]));
  }
  return false;
};

export const invoke = (cb: TAny) => cb();

export const clear = (set?: Set<TAny>, cb?: TAny) => {
  if (!set) return;
  set.forEach(cb || invoke);
  set.clear();
};

export const cleanup = (elem: TAny) => {
  if (isElem(elem)) {
    clear(elem[$clean]);
    clear(elem[$cleanFrag]);
    if (elem.children) arrFrom(elem.children).forEach(cleanup);
  }
};

export const kebab = (v: string) => v.replace(/[A-Z]/g, '-$&').toLowerCase();
export const objToStr = (obj: Record<string, TAny>, attr: string) => {
  let out = '';
  for (let k in obj) {
    let val = obj[k];
    if (isNotNull(val) && val !== '') {
      let key = kebab(k);
      let end = ';';
      if (
        attr === 'style' &&
        isNumber(val) &&
        !key.startsWith('--') &&
        !reg_non_dimentional.test(key)
      ) {
        end = 'px;';
      }
      out = out + key + ':' + val + end;
    }
  }
  return out;
};

export const mutateAttr: Record<string, string> = {
  acceptCharset: 'accept-charset',
  httpEquiv: 'http-equiv',
  htmlFor: 'for',
  className: 'class',
};
const base_url = 'http://www.w3.org';
export const html_ns = base_url + '/1999/xhtml';
export const tag_ns = {
  svg: base_url + '/2000/svg',
  math: base_url + '/1998/Math/MathML',
};
