import {
  $state,
  $untrack,
  cleanup,
  FC,
  Fragment,
  h,
  isElem,
  isValidElement,
  JSXNode,
  JSXProps,
  jsxRender,
  options,
  propsToProxy,
} from 'tivex';
// } from './../src/index.js';

const isFunc = (v: any) => typeof v === 'function';
const isArray = Array.isArray;
const NULL = null;

const renderAsync = async (childs: any[] = []) => {
  const out = [] as any[];
  for (let i = 0; i < childs.length; i++) {
    const elem = childs[i];
    if (isValidElement(elem)) {
      let { props, type } = elem;
      if (isFunc(type)) {
        out.push(await type(propsToProxy(props)));
      } else {
        const child = props.children;
        if (isArray(child)) elem.props.children = await renderAsync(child);
        out.push(elem);
      }
    } else out.push(elem);
  }
  return out;
};

/**
 * Suspense component to handle asynchronous rendering of its children.
 * It accepts a `fallback` prop which is a JSX element to render while the children are being rendered asynchronously.
 * The children can be any valid JSX elements, including components that return promises.
 * @param props - The props for the Suspense component.
 * @param props.fallback - A fallback JSX element to render while the children are being rendered
 * @returns JSX.Element
 * @example
 * <Suspense fallback={<div>Loading...</div>}>
 *   <AsyncComponent />
 * </Suspense>
 */
export const Suspense: FC<{ fallback?: JSXNode }> = ({
  children,
  fallback,
}) => {
  const state = $state({ v: fallback });
  const err = options._err;
  renderAsync(children as any[])
    .then((res) => (state.v = res))
    .catch(err);
  return (() => {
    const comp = h(Fragment, NULL, state.v);
    return $untrack(() => jsxRender(comp, { err }));
  }) as JSX.Element;
};

const isFlow = (v: any) => isElem(v) && v['$c'];
const arrayDiff = (oldNodes: Node[], newNodes: Node[], end: Node) => {
  if (!isFlow(oldNodes[0]) || !isFlow(newNodes[0])) return;
  let parent = oldNodes[0].parentNode;
  if (!parent) return;
  const insert = (a: Node, b: Node) => parent.insertBefore(a, b);
  oldNodes = oldNodes.filter((el) => {
    const exp = el['$c'].s === 'd';
    if (exp) parent.removeChild(el);
    return !exp;
  });
  if (!oldNodes.length) return;
  newNodes.forEach((el) => {
    const { s, i } = el['$c'];
    if (s === 'i') {
      let next: Node,
        temp = oldNodes[i];
      if (temp) (insert(el, oldNodes[i]), (oldNodes[i + 1] = next = temp));
      else if (next) insert(el, next.nextSibling);
      else insert(el, end);
    }
  });
  return true;
};

options.arrDiff = (newVal, oldVal) => {
  let len: number;
  return (
    isArray(newVal) &&
    isArray(oldVal) &&
    newVal.length &&
    (len = oldVal.length) &&
    arrayDiff(oldVal, newVal, oldVal[len - 1].nextSibling)
  );
};

/**
 * For component to iterate over an array and render its children for each item.
 * It accepts an `each` prop which is an array of items, a `fallback` prop which is a JSX element to render if the `each` array is empty,
 * and a `children` prop which is a function that takes an item from the `each` array, its index, and the entire array as arguments, and returns a JSX element to render for each item.
 * @param props - The props for the For component.
 * @param props.each - An array of items to iterate over.
 * @param props.fallback - A fallback JSX element to render if the `each` array is empty.
 * @param props.children - A function that takes an item from the `each` array, its index, and the entire array as arguments, and returns a JSX element to render for each item.
 * @returns JSX.Element
 * @example
 * <For each={state.items} fallback={<div>No items</div>}>
 *   {(item, index) => (
 *     <div key={item.id}>
 *       <p>{item.name}</p>
 *       <span>Index: {index}</span>
 *     </div>
 *   )}
 * </For>
 */
export const For = <T extends Array<any>>(props: {
  each: T;
  fallback?: JSX.Element;
  children: (
    data: T[number],
    index: number & { peek(): number },
    thisArr: T
  ) => JSX.Element;
}): JSX.Element => {
  const c = props.children;
  const cb = c && c[0];
  if (!isFunc(cb)) {
    throw new Error('Cannot find callback');
  }
  const err = options._err,
    temp = new Map();
  return () => {
    const { each, fallback } = props;
    if (fallback && !each.length) return fallback;
    let hKey!: Record<string, number>;
    const result = each.map((el, i, arr) => {
      const state = $state({ i });
      const idx = () => state.i;
      idx['peek'] = () => i;
      idx.valueOf = idx;
      let ret = cb(el, idx as any, arr);
      let rKey = (ret.props || {}).key;
      if (isFunc(rKey)) {
        rKey = rKey();
        if (rKey === idx) rKey = NULL;
      }
      const key = rKey || el;
      if (rKey) (hKey ||= {})[key] = 1;
      if (temp.has(key)) {
        const res = temp.get(key);
        res['$c'].w.i = i;
        res['$c'].s = NULL;
        return res;
      }
      const res = $untrack(() => {
        if (isFunc(ret.type) && isArray(ret.props.children)) {
          ret = h('t-item', NULL, ret);
        }
        return jsxRender(ret, { err });
      });
      res['$c'] = { s: 'i', w: state, i };
      temp.set(key, res);
      return res;
    });
    if (temp.size > each.length) {
      for (const [key, res] of temp) {
        if (hKey ? !hKey[key] : each.indexOf(key) === -1) {
          res['$c'].s = 'd';
          temp.delete(key);
          cleanup(res);
        }
      }
    }
    return result;
  };
};

/**
 * Show component to conditionally render its children based on a condition.
 * If the `when` prop is true, it renders the children; otherwise, it renders
 * the `fallback` prop.
 * @param props - The props for the Show component.
 * @param props.when - A condition that determines whether to render the children or the fallback.
 * @param props.fallback - A fallback JSX element to render if the condition is false.
 * @returns JSX.Element
 * @example
 * <Show when={condition} fallback={<div>No Match</div>}>
 *   <div>Content to show when condition is true</div>
 * </Show>
 */
export const Show: FC<{ when: any; fallback?: JSX.Element }> = (props) => {
  return (() => {
    const { when, children, fallback } = props;
    return h(Fragment, NULL, when ? children : fallback);
  }) as any;
};

/**
 * Switch component to render one of its children based on a condition.
 * It will render the first child whose `when` prop returns true.
 * If no child matches the condition, it will render the `fallback` prop.
 * @param props - The props for the Switch component.
 * @param props.fallback - The fallback JSX element to render if no child matches the condition.
 * @param props.children - The child components, each with a `when` prop that is a function returning a boolean value.
 * @returns JSX.Element
 * @example
 * <Switch fallback={<div>No match</div>}>
 *   <Match when={condition1}>child1</Match>
 *   <Match when={condition2}>child2</Match>
 *   <Match when={condition3}>child3</Match>
 * </Switch>
 */
export const Switch = (
  props: JSXProps<{ fallback?: JSX.Element }>
): JSX.Element => {
  return () => {
    const { children, fallback } = props;
    return h(
      Fragment,
      NULL,
      (children as any[]).find((el) => el.props.when()) || fallback
    );
  };
};

/**
 * Match component to conditionally render its children based on a condition.
 * It is used within a Switch component to determine which child to render.
 * @param props - The props for the Match component.
 * @param props.when - A condition that determines whether to render the children.
 */
export const Match: FC<{ when: boolean }> = Fragment;

/**
 * ErrorBoundary component to catch errors in the child components.
 * It renders a fallback UI when an error occurs.
 * @param children - The child components to render.
 * @param fallback - A function that takes an error and returns a JSX element to render
 * @returns JSX.Element
 * @example
 * <ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
 *   <ChildComponent />
 * </ErrorBoundary>
 */
export const ErrorBoundary: FC<{ fallback: (err: Error) => JSX.Element }> = ({
  children,
  fallback,
}) => {
  const state = $state({ v: NULL as HTMLElement });
  const err = (e: Error) => {
    cleanup(state.v);
    state.v = render(fallback(e));
  };
  const render = (elem: any) => $untrack(() => jsxRender(elem, { err }));
  try {
    state.v = render(h(Fragment, NULL, ...(children as any)));
  } catch (e) {
    err(e);
  }
  return (() => state.v) as JSX.Element;
};

/**
 * Throw component to throw an error.
 * It is used to throw an error in the component tree.
 * @param error - The error to throw, can be an instance of Error or a string.
 * @throws {Error} Throws the provided error.
 * @example
 * <Throw error='Something went wrong' />
 */
export const Throw: FC<{ error: Error | string }> = ({ error }) => {
  if (error instanceof Error) throw error;
  throw new Error(error);
};
