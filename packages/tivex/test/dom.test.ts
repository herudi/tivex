import { describe, it, expect } from 'vitest';
import { renderToElement, isFrag, propsToProxy } from '../src/dom.js';
import { h } from '../src/jsx.js';

describe('renderToElement', () => {
  it('renders a string to a text node', () => {
    const result = renderToElement('Hello, World!');
    expect(result.nodeType).toBe(Node.TEXT_NODE);
    expect(result.textContent).toBe('Hello, World!');
  });

  it('renders a number to a text node', () => {
    const result = renderToElement(123);
    expect(result.nodeType).toBe(Node.TEXT_NODE);
    expect(result.textContent).toBe('123');
  });

  it('renders an array of elements to a document fragment', () => {
    const result = renderToElement([
      h('div', null, 'Child 1'),
      h('div', null, 'Child 2'),
    ]);
    expect(result.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    expect(result.childNodes.length).toBe(2);
    expect(result.childNodes[0].textContent).toBe('Child 1');
    expect(result.childNodes[1].textContent).toBe('Child 2');
  });

  it('renders a JSX element to an HTML element', () => {
    const result = renderToElement(
      h('div', { className: 'test-class' }, 'Hello, JSX!')
    );
    expect(result.nodeType).toBe(Node.ELEMENT_NODE);
    expect(result.nodeName).toBe('DIV');
    expect(result.textContent).toBe('Hello, JSX!');
    expect(result.getAttribute('class')).toBe('test-class');
  });

  it('renders a functional component', () => {
    const MyComponent = (props) => h('span', null, props.text);
    const result = renderToElement(
      h(MyComponent, { text: 'Hello, Component!' })
    );
    expect(result.nodeType).toBe(Node.ELEMENT_NODE);
    expect(result.nodeName).toBe('SPAN');
    expect(result.textContent).toBe('Hello, Component!');
  });

  it('renders null or undefined to an empty text node', () => {
    const resultNull = renderToElement(null);
    const resultUndefined = renderToElement(undefined);
    expect(resultNull.nodeType).toBe(Node.TEXT_NODE);
    expect(resultNull.textContent).toBe('');
    expect(resultUndefined.nodeType).toBe(Node.TEXT_NODE);
    expect(resultUndefined.textContent).toBe('');
  });

  it('renders a fragment with multiple children', () => {
    const fragment = h(
      h.Fragment,
      null,
      h('div', null, 'Child 1'),
      h('div', null, 'Child 2')
    );
    const result = renderToElement(fragment);
    expect(result.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    expect(result.childNodes.length).toBe(2);
    expect(result.childNodes[0].textContent).toBe('Child 1');
    expect(result.childNodes[1].textContent).toBe('Child 2');
  });
});

describe('isFrag', () => {
  it('returns true for a DocumentFragment', () => {
    const fragment = document.createDocumentFragment();
    expect(isFrag(fragment)).toBe(true);
  });

  it('returns false for a regular HTML element', () => {
    const element = document.createElement('div');
    expect(isFrag(element)).toBe(false);
  });

  it('returns false for null or undefined', () => {
    expect(isFrag(null)).toBe(false);
    expect(isFrag(undefined)).toBe(false);
  });
});

describe('propsToProxy', () => {
  it('proxies property access', () => {
    const props = { text: 'Hello' };
    const proxy = propsToProxy(props);
    expect(proxy.text).toBe('Hello');
  });

  it('allows setting new properties', () => {
    const props = {};
    const proxy = propsToProxy(props);
    proxy['newProp'] = 'New Value';
    expect(proxy['newProp']).toBe('New Value');
  });

  it('supports $set for computed properties', () => {
    const props = { count: 1 };
    const proxy = propsToProxy(props);
    proxy.$set({ count: (prev) => prev + 1 });
    expect(proxy.count).toBe(2);
  });

  it('returns the original props object with $props', () => {
    const props = { key: 'value' };
    const proxy = propsToProxy(props);
    expect(proxy.$props).toBe(props);
  });
});
