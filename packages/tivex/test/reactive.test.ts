import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createSignal,
  $state,
  $ref,
  $untrack,
  $effect,
  isSignal,
  $unmount,
  $mount,
  createComputed,
  $computed,
} from '../src/reactive';

describe('createSignal', () => {
  it('should create a signal with initial value', () => {
    const signal = createSignal(10);
    expect(signal()).toBe(10);
  });

  it('should update signal value', () => {
    const signal = createSignal(0);
    signal.set(5);
    expect(signal()).toBe(5);
  });

  it('should be identified as signal', () => {
    const signal = createSignal();
    expect(isSignal(signal)).toBe(true);
  });
});

describe('$state', () => {
  it('should create reactive state object', () => {
    const state = $state({ count: 0, text: 'hello' });
    expect(state.count).toBe(0);
    expect(state.text).toBe('hello');
  });

  it('should update state values', () => {
    const state = $state({ count: 0 });
    state.count = 5;
    expect(state.count).toBe(5);
  });

  it('should get signal from state', () => {
    const state = $state({ count: 0 });
    const signal = state.$signal('count');
    expect(isSignal(signal)).toBe(true);
    expect(signal()).toBe(0);
  });

  it('should peek state value', () => {
    const state = $state({ count: 0 });
    expect(state.$peek('count')).toBe(0);
  });

  it('should reset state to initial values', () => {
    const state = $state({ count: 0, text: 'hello' });
    state.count = 5;
    state.text = 'world';
    state.$reset();
    expect(state.count).toBe(0);
    expect(state.text).toBe('hello');
  });

  it('should return JSON representation', () => {
    const state = $state({ count: 0, text: 'hello' });
    const json = state.$json();
    expect(json).toEqual({ count: 0, text: 'hello' });
  });
});

describe('$ref', () => {
  it('should create reference with current value', () => {
    const ref = $ref(10);
    expect(ref.current).toBe(10);
  });

  it('should update reference value', () => {
    const ref = $ref(0);
    ref.current = 5;
    expect(ref.current).toBe(5);
  });
});

describe('$untrack', () => {
  it('should execute callback without tracking', () => {
    const signal = createSignal(0);
    const result = $untrack(() => signal() + 1);
    expect(result).toBe(1);
  });
});

describe('$effect', () => {
  it('should run effect when dependencies change', () => {
    const signal = createSignal(0);
    let effectValue = 0;

    $effect(() => {
      effectValue = signal() * 2;
    });

    expect(effectValue).toBe(0);
    signal.set(5);
    expect(effectValue).toBe(10);
  });
});

describe('createComputed', () => {
  it('should compute derived values', () => {
    const count = createSignal(0);
    const double = createComputed(() => count() * 2);

    expect(double()).toBe(0);
    count.set(5);
    expect(double()).toBe(10);
  });

  it('should handle error with custom error handler', () => {
    const errorHandler = vi.fn();
    const computed = createComputed(
      () => {
        throw new Error('Test error');
      },
      { err: errorHandler }
    );

    computed();
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should watch for changes', () => {
    const count = createSignal(0);
    const double = createComputed(() => count() * 2);
    double.watch((oldValue, newValue) => {
      expect(oldValue).toBe(0);
      expect(newValue).toBe(10);
    });
    count.set(5);
  });
});

describe('$computed', () => {
  it('should create a computed value', () => {
    const state = $state({ count: 0 });
    const double = $computed(() => state.count * 2);

    expect(double()).toBe(0);
    state.count = 5;
    expect(double()).toBe(10);
  });
});

describe('$mount', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute callback on mount', () => {
    const callback = vi.fn();
    $mount(callback);

    vi.runAllTimers();
    expect(callback).toHaveBeenCalled();
  });

  it('should return requestAnimationFrame ID', () => {
    const callback = vi.fn();
    const result = $mount(callback);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });
});

describe('$unmount', () => {
  it('should execute cleanup when unmounted', () => {
    const cleanup = vi.fn();
    const dispose = $unmount(cleanup);

    expect(cleanup).not.toHaveBeenCalled();
    dispose();
    expect(cleanup).toHaveBeenCalled();
  });
});
