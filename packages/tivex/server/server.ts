import { isValidElement, type JSXProps, options } from 'tivex';
// } from '../src/index.js';

type TAny = any;
const NULL = null;
const dangerHTML = 'dangerouslySetInnerHTML';
const isFunc = (v: TAny): v is Function => typeof v === 'function';
const isArray = Array.isArray;
const isNumber = (v: TAny) => typeof v === 'number';
const isString = (v: TAny) => typeof v === 'string';
const isNotNull = (v: TAny) => v != NULL;
const isObject = (v: TAny) =>
  isNotNull(v) && typeof v === 'object' && !isArray(v);

const reg_void_elem =
  /^(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;

const mutateAttr: Record<string, string> = {
  acceptCharset: 'accept-charset',
  httpEquiv: 'http-equiv',
  htmlFor: 'for',
  className: 'class',
};

const reg_non_dimentional =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

const kebab = (v: string) => v.replace(/[A-Z]/g, '-$&').toLowerCase();
const objToStr = (obj: Record<string, TAny>, attr: string) => {
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

const REG_HTML = /["'&<>]/;
function escapeHtml(str: string): string {
  // optimize
  return !REG_HTML.test(str)
    ? str
    : (() => {
        let esc = '',
          i = 0,
          l = 0,
          html = '';
        for (; i < str.length; i++) {
          switch (str.charCodeAt(i)) {
            case 34: // "
              esc = '&quot;';
              break;
            case 38: // &
              esc = '&amp;';
              break;
            case 39: // '
              esc = '&#39;';
              break;
            case 60: // <
              esc = '&lt;';
              break;
            case 62: // >
              esc = '&gt;';
              break;
            default:
              continue;
          }
          if (i !== l) html += str.substring(l, i);
          html += esc;
          l = i + 1;
        }
        if (i !== l) html += str.substring(l, i);
        return html;
      })();
}
const toAttr = (props: TAny = {}): string => {
  let attr = '';
  for (const k in props) {
    let val = props[k];
    if (
      val == NULL ||
      val === false ||
      k === dangerHTML ||
      k === 'key' ||
      k === 'ref' ||
      k === 'children' ||
      isFunc(val)
    ) {
      continue;
    }
    const key = mutateAttr[k] ?? k.toLowerCase();
    if (val === true) {
      attr += ` ${key}`;
    } else {
      if (isObject(val)) val = objToStr(val, key);
      attr += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  return attr;
};

const propsToProxy = <T extends Record<string, TAny> = {}>(
  props: T = {} as T
): JSXProps<T> => {
  return new Proxy(props, {
    get(target: TAny, prop) {
      if (prop === '$props') return props;
      if (prop === '$set') {
        return (def: TAny) => {
          const wrap = (key: string, val: TAny) => {
            const prev = target[key];
            target[key] = isFunc(val) ? val(prev) : val;
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
      return target[prop as string];
    },
    set(target, prop, newVal) {
      target[prop] = newVal;
      return true;
    },
  });
};

/**
 * Render elem to string
 * @param elem JSX.Element
 * @returns string
 */
export function renderToString(elem: JSX.Element) {
  if (elem == NULL || typeof elem === 'boolean') return '';
  if (isFunc(elem)) return renderToString(elem());
  if (isNumber(elem) || isString(elem)) return elem.toString();
  if (isArray(elem)) {
    return elem.map((el) => renderToString(el)).join('');
  }
  if (isValidElement(elem)) {
    let { type, props } = elem;
    if (isFunc(type)) {
      return renderToString(type(propsToProxy(props)));
    }
    const attr = toAttr(props);
    if (reg_void_elem.test(type)) return `<${type}${attr}>`;
    if (isNotNull(props[dangerHTML])) {
      return `<${type}${attr}>${props[dangerHTML].__html}</${type}>`;
    }
    const child = renderToString(props.children);
    return `<${type}${attr}>${child}</${type}>`;
  }
  return String(elem);
}

options.renderToString = renderToString;

export type OptionRenderHTML = {
  docType?: string;
  charset?: string | false;
  viewport?: string | false;
  attribute?: {
    html?: Record<string, TAny>;
    body?: Record<string, TAny>;
  };
  head?: JSX.Element;
  footer?: JSX.Element;
};

/**
 * Render elem to html
 * @param elem JSX.Element
 * @returns string
 */
export const renderToHtml = (
  elem: JSX.Element,
  opts: OptionRenderHTML = {}
): string => {
  opts.docType ??= '<!DOCTYPE html>';
  opts.charset ??= 'UTF-8';
  opts.viewport ??= 'width=device-width, initial-scale=1.0';
  const attr = opts.attribute ?? {};
  return (
    opts.docType +
    `<html${toAttr(attr.html)}>` +
    '<head>' +
    (opts.charset ? `<meta charset="${opts.charset}">` : '') +
    (opts.viewport ? `<meta name="viewport" content="${opts.viewport}">` : '') +
    (opts.head ? renderToString(opts.head) : '') +
    `</head><body${toAttr(attr.body)}>${renderToString(elem)}` +
    (opts.footer ? renderToString(opts.footer) : '') +
    '</body></html>'
  );
};
