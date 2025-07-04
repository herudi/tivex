import { describe, it, expect, vi } from 'vitest';
import * as util from '../src/util.js';

describe('util exports', () => {
  it('NULL should be null', () => {
    expect(util.NULL).toBeNull();
  });

  it('dangerHTML should be "dangerouslySetInnerHTML"', () => {
    expect(util.dangerHTML).toBe('dangerouslySetInnerHTML');
  });

  it('isFunc should detect functions', () => {
    expect(util.isFunc(() => {})).toBe(true);
    expect(util.isFunc(123)).toBe(false);
  });

  it('isArray should detect arrays', () => {
    expect(util.isArray([1, 2, 3])).toBe(true);
    expect(util.isArray('not array')).toBe(false);
  });

  it('isNumber should detect numbers', () => {
    expect(util.isNumber(5)).toBe(true);
    expect(util.isNumber('5')).toBe(false);
  });

  it('isString should detect strings', () => {
    expect(util.isString('abc')).toBe(true);
    expect(util.isString(123)).toBe(false);
  });

  it('Okeys should return object keys', () => {
    expect(util.Okeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  it('assign should assign properties', () => {
    expect(util.assign({}, { a: 1 })).toEqual({ a: 1 });
  });

  it('arrFrom should convert to array', () => {
    expect(util.arrFrom('abc')).toEqual(['a', 'b', 'c']);
  });

  it('isNotNull should check for non-null', () => {
    expect(util.isNotNull(0)).toBe(true);
    expect(util.isNotNull(null)).toBe(false);
  });

  it('isObject should detect objects', () => {
    expect(util.isObject({})).toBe(true);
    expect(util.isObject([])).toBe(false);
    expect(util.isObject(null)).toBe(false);
  });

  it('isElem should detect element-like objects', () => {
    const elem = { nodeName: 'DIV', nodeType: 1 };
    expect(util.isElem(elem)).toBe(true);
    expect(util.isElem({})).toBe(false);
  });

  it('deepEqual should compare deeply', () => {
    expect(util.deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(util.deepEqual([1, 2], [1, 2])).toBe(true);
    expect(util.deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(util.deepEqual([1, 2], [2, 1])).toBe(false);
  });

  it('invoke should call a function', () => {
    const fn = vi.fn();
    util.invoke(fn);
    expect(fn).toHaveBeenCalled();
  });

  it('clear should clear a set and call callback', () => {
    const set = new Set([1, 2]);
    const cb = vi.fn();
    util.clear(set, cb);
    expect(set.size).toBe(0);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('cleanup should call clear on clean symbols', () => {
    const elem: any = {
      nodeName: 'DIV',
      nodeType: 1,
      [util.$clean]: new Set([() => {}]),
      [util.$cleanFrag]: new Set([() => {}]),
      children: [],
    };
    util.cleanup(elem);
    expect(elem[util.$clean].size).toBe(0);
    expect(elem[util.$cleanFrag].size).toBe(0);
  });

  it('kebab should convert camelCase to kebab-case', () => {
    expect(util.kebab('camelCaseTest')).toBe('camel-case-test');
  });

  it('objToStr should convert object to style string', () => {
    expect(util.objToStr({ color: 'red', fontSize: 12 }, 'style')).toBe(
      'color:red;font-size:12px;'
    );
    expect(util.objToStr({ '--custom': 5 }, 'style')).toBe('--custom:5;');
    expect(util.objToStr({ width: 100 }, 'style')).toBe('width:100px;');
  });

  it('mutateAttr should map attribute names', () => {
    expect(util.mutateAttr.className).toBe('class');
    expect(util.mutateAttr.htmlFor).toBe('for');
  });

  it('html_ns and tag_ns should be correct', () => {
    expect(util.html_ns).toBe('http://www.w3.org/1999/xhtml');
    expect(util.tag_ns.svg).toBe('http://www.w3.org/2000/svg');
    expect(util.tag_ns.math).toBe('http://www.w3.org/1998/Math/MathML');
  });
});
