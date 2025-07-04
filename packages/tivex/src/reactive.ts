import { curClean, h, isValidElement, jsxRender } from './jsx.js';
import type { CB, FC, JSXProps, TAny } from './types.js';
import {
  $brand,
  assign,
  clear,
  deepEqual,
  invoke,
  IS_CLIENT,
  isArray,
  isFunc,
  NULL,
} from './util.js';

interface Effect extends Set<TAny> {
  _c: CB<void>;
  _v: number;
  cb: CB<TAny>;
  clean(): void;
  bye(): void;
  isCycle(): boolean;
}

let batchs!: Set<CB<void>>, curFx!: Effect;

export const isSignal = (v: TAny): v is Signal<TAny> => isFunc(v) && v[$brand];

export interface Signal<T> {
  (): T;
  peek: () => T;
  set(newVal: T): void;
  watch(cb: (newVal: T, oldVal: T) => void): void;
}

export const createSignal = <T>(val?: T): Signal<T> => {
  let notify!: boolean,
    set = new Set();
  const peek = () => val;
  const read = () => {
    !notify && curFx && curFx.add(set.add(curFx.cb));
    return peek();
  };
  read.peek = peek;
  read.clear = () => set.clear();
  read.set = (newVal: T) => {
    if (newVal === val) return;
    const prev = val;
    val = newVal;
    notify = !batchs;
    set.forEach((cb: TAny) => {
      cb._w ? cb(newVal, prev) : batchs ? batchs.add(cb) : cb();
    });
    notify = NULL;
  };
  read.watch = (cb: TAny) => {
    cb['_w'] = 1;
    set.add(cb);
  };
  read[$brand] = true;
  return read;
};

export type State<T> = T & {
  $json(): T;
  $reset(): void;
  $signal<P extends keyof T>(key: P): Signal<T[P]>;
  $peek<P extends keyof T>(key: P): T[P];
};

/**
 * Creates a state object that holds reactive signals for each property in the initial state.
 * This function is used to create a reactive state that can be updated and observed.
 * It is similar to a signal but is specifically designed to hold multiple properties.
 * @param initState - An object representing the initial state, where each property is a signal.
 * @returns A reactive state object with properties that are signals.
 * @example
 * const state = $state({ count: 0, name: 'John' });
 * state.count = 5; // Updates the count signal to 5
 * console.log(state.count); // Outputs: 5
 * console.log(state.$json()); // Outputs: { count: 5, name: 'John' }
 * state.$reset(); // Resets the state to the initial values
 * console.log(state.$json()); // Outputs: { count: 0, name: 'John' }
 */
export const $state = <T extends Record<string, TAny>>(
  initState: T
): State<T> => {
  const state = {} as TAny;
  for (let k in initState) state[k] = createSignal<TAny>(initState[k]);
  const withCheck = (target: TAny, key: TAny) =>
    target[key] ||
    (() => {
      throw new Error(`Cannot find ${key} in $state.`);
    })();
  const proxy = new Proxy(state, {
    get(target, prop) {
      if (prop === '$peek') {
        return (key: string) => withCheck(target, key).peek();
      }
      if (prop === '$signal') return (key: string) => withCheck(target, key);
      if (prop === '$json') return () => assign({}, proxy);
      if (prop === '$reset') {
        return () =>
          $batch(() => {
            for (let k in state) state[k].set(initState[k]);
          });
      }
      const signal = withCheck(target, prop);
      return signal();
    },
    set(target, prop, newVal) {
      withCheck(target, prop).set(newVal);
      return true;
    },
  });
  return proxy;
};

/**
 * Creates a reference state that holds a current value.
 * This function is used to create a reactive reference that can be updated and observed.
 * It is similar to a signal but is specifically designed to hold a single value that can be updated.
 * @param current - An optional initial value for the reference state.
 * @returns A reactive reference state object with a `current` property that holds the current value.
 * @example
 * const ref = $ref(0);
 * ref.current = 5; // Updates the current value to 5
 * console.log(ref.current); // Outputs: 5
 */
export const $ref = <T>(current?: T): State<{ current: T }> =>
  $state({ current });

const createFX = (cb: CB<TAny>) => {
  const fx = new Set() as Effect;
  fx.cb = cb;
  fx._v = Math.random();
  fx.clean = () => {
    if (isFunc(fx._c)) {
      fx._c();
      curClean && curClean.delete(fx.bye);
    }
  };
  fx.bye = () => {
    fx.clean();
    clear(fx, (dep: Set<CB<void>>) => dep.delete(fx.cb));
  };
  fx.isCycle = () => curFx && fx._v === curFx._v;
  return fx;
};

const recompute = <T>(target: Effect, cb: CB<T>, prev?: Effect) => {
  ((prev = curFx), (curFx = target));
  try {
    return cb();
  } finally {
    curFx = prev;
  }
};

/**
 * Executes a callback function without tracking dependencies.
 * This function is used to run a callback without creating a reactive effect,
 * allowing for one-time execution of the callback.
 * @param cb - A callback function that will be executed without tracking dependencies.
 * @returns The result of the callback function.
 * @example
 * const result = $untrack(() => {
 *   console.log('This will not create a reactive effect');
 *   return state.count * 2;  // Assuming state.count is a state
 * });
 */
export const $untrack = <T>(cb: CB<T>) => recompute(NULL, cb);

/**
 * Creates an effect that runs a callback function when dependencies change.
 * This function is used to create reactive effects that respond to changes in state or signals.
 * It is similar to a reactive signal but is used for side effects that do not return a value.
 * @param cb - A callback function that will be executed when the effect is triggered.
 * @returns A function that, when called, will execute the effect and return a dispose function.
 * @example
 * const state = $state({ count: 0 });
 * $effect(() => {
 *   console.log('Count changed:', state.count);
 * });
 * // This will log the count value whenever it changes.
 *
 * @example
 * const dispose = $effect(() => {
 *   console.log('This effect will run once');
 * });
 * // The dispose function can be called to remove the effect.
 * dispose();
 *
 * @example
 * $effect(() => {
 *   console.log('This effect will run once');
 *   return () => {
 *     console.log('This effect will be cleaned up');
 *   };
 * });
 * // The effect will run once and then be cleaned up.
 */
export const $effect = (cb: CB<void>) => {
  const fx = createFX(() => {
    if (fx.isCycle()) return;
    fx.clean();
    fx['_c'] = recompute<TAny>(fx, cb);
    isFunc(fx['_c']) && curClean && curClean.add(fx.bye);
  });
  return (fx.cb(), fx.bye);
};
export interface ComputedCore<T> {
  (): T;
  watch(cb: (newVal: T, oldVal: T) => void): void;
}

/**
 * Creates a computed value that is derived from a callback function.
 * This function is used to create reactive values that automatically update when their dependencies change.
 * It is similar to a reactive signal but is used for derived values that depend on other signals.
 * @param fn - A callback function that returns the computed value.
 * @param err - An optional error handler function that will be called if an error occurs during computation.
 * @returns A function that returns the computed value when called.
 * @example
 * const count = $state({ value: 0 });
 * const doubleCount = createComputed(() => count.value * 2);
 * // doubleCount will automatically update when count.value changes.
 */
export const createComputed = <T>(
  fn: CB<T>,
  err?: (err: Error) => TAny
): ComputedCore<T> => {
  const sig = createSignal<T>();
  let fx!: Effect, prev: TAny, res: TAny;
  const cb = () => {
    let cur = fn() as TAny;
    if (isArray(cur)) return cur;
    else if (isFunc(cur) && cur.length === 0) cur = cur();
    if (!deepEqual(cur, prev)) {
      res = isValidElement(cur) ? $untrack(() => jsxRender(cur, { err })) : cur;
    }
    prev = cur;
    return res;
  };
  const initFX = () => {
    if (!fx) {
      fx = createFX(() => {
        if (fx.isCycle()) return fx.bye();
        try {
          sig.set(recompute(fx, cb));
        } catch (e) {
          if (err) return err(e);
          else throw e;
        }
      });
      fx.cb();
    }
  };
  const comp = () => (initFX(), sig());
  comp[$brand] = 1;
  comp.watch = sig.watch;
  return comp;
};

/**
 * Creates a computed value that is derived from a callback function.
 * This function is used to create reactive values that automatically update when their dependencies change.
 * It is similar to a reactive signal but is used for derived values that depend on other signals.
 * @param cb - A callback function that returns the computed value.
 * @returns A function that returns the computed value when called.
 * @example
 * const state = $state({ count: 0 });
 * const doubleCount = $computed(() => state.count * 2);
 */
export const $computed = <T>(cb: CB<T>) => cb;

/**
 * Executes a batch of callbacks, ensuring that all effects are run only once
 * after all the callbacks have been executed.
 * This is useful for grouping multiple state updates together to avoid unnecessary re-renders.
 * It collects all the callbacks in a Set and invokes them after the batch is complete.
 * @param cb - A callback function that will be executed within the batch.
 * @example
 * $batch(() => {
 *   state.value1 = newValue1;
 *   state.value2 = newValue2;
 * });
 * @returns void
 */
export const $batch = (cb: CB<void>) => {
  let set = batchs;
  !set && (batchs = new Set());
  try {
    cb();
  } finally {
    !set && ((set = batchs), (batchs = NULL), set.forEach(invoke));
  }
};

/**
 * Mounts a component by executing the provided callback function.
 * This function is typically used to perform setup tasks when a component is mounted to the DOM.
 * It is called when the component is first rendered or when it is re-rendered after a state change.
 * @param cb - A callback function that will be executed when the component is mounted.
 * @returns A number representing the requestAnimationFrame ID, or 0 if not in a client environment.
 * @example
 * const MyComponent = () => {
 *   $mount(() => console.log('Component mounted'));
 * };
 */
export const $mount = (cb: CB<void>) =>
  (IS_CLIENT && requestAnimationFrame(cb)) || 0;

/**
 * Unmounts a component by executing the provided callback function.
 * This function is typically used to clean up resources or remove event listeners when a component is no longer needed.
 * It is called when the component is unmounted from the DOM.
 * @param cb - A callback function that will be executed when the component is unmounted.
 * @returns A function that, when called, will execute the provided callback.
 * @example
 * const MyComponent = () => {
 *   $unmount(() => console.log('Component unmounted'));
 * };
 */
export const $unmount = (cb: CB<void>) => $effect(() => cb);

/**
 * Lazy component loader that returns a function to render the component.
 * Suspense can be used to handle loading states.
 * It accepts an asynchronous function that returns a component or a default export of a component.
 * It is used to load components on demand, improving performance by reducing the initial bundle size.
 * @param asyncFunc - An asynchronous function that returns a component or a default export of a component.
 * @returns A function that takes props and returns a JSX element representing the loaded component.
 * @example
 * const LazyComponent = $lazy(() => import('./MyComponent'));
 *
 * <Suspense fallback={<div>Loading...</div>}>
 *   <LazyComponent prop1="value" />
 * </Suspense>
 */
export const $lazy = <T>(
  asyncFunc: (props: JSXProps<T>) => Promise<FC<T> | { default: FC<T> }>
): FC<T> => {
  let res!: JSX.Element;
  return (props: JSXProps<T>) =>
    res ||
    asyncFunc(props).then((el: any) => (res = h(el.default || el, props)));
};
