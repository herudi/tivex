import { describe, expect, it } from 'vitest';
import { h, options } from '../src/jsx.js';

describe('Fragment', () => {
  it('renders multiple children without adding extra nodes', () => {
    const fragment = h(
      h.Fragment,
      null,
      h('div', null, 'Child 1'),
      h('div', null, 'Child 2')
    );
    expect(fragment.type).toBe(h.Fragment);
    expect(Array.isArray(fragment.props['children'])).toEqual(true);
  });
});

describe('options.arrDiff', () => {
  it('returns false by default', () => {
    const result = options.arrDiff(1, 2);
    expect(result).toBe(false);
  });
});
