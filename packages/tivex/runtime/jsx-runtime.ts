import { Fragment, h, JSXInternal, JSXProps } from 'tivex';

const createElement = (
  type: any,
  props: JSXInternal.HTMLAttributes & JSXProps
) => {
  props ||= {};
  if (props.children == null) return h(type, props);
  const childs = props.children;
  delete props.children;
  if (Array.isArray(childs)) return h(type, props, ...childs);
  return h(type, props, childs);
};

export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
export { createElement as jsxDEV };
