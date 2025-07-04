import { Node, parse } from 'acorn';
import { simple } from 'acorn-walk';
import { generate } from 'escodegen';

const regPragma = /^(h|jsxDEV|jsxDev|jsxs|jsx)$/;

interface TNode extends Node {
  [k: string]: any;
}

const toArrow = (node: TNode) => {
  if (node.done) return;
  const prev = { ...node };
  node.type = 'ArrowFunctionExpression';
  node.id = null;
  node.expression = true;
  node.generator = false;
  node.async = false;
  node.params = [];
  node.body = prev;
  node.done = true;
  delete node.name;
};
const toClone = (node: TNode) => {
  if (node.done) return;
  const prev = { ...node };
  node.type = 'LogicalExpression';
  node.left = {
    type: 'MemberExpression',
    object: prev,
    property: {
      type: 'Identifier',
      name: '$props',
    },
    computed: false,
    optional: false,
  };
  node.operator = '??';
  node.right = prev;
  delete node.name;
};
const bindSignal = (node: TNode) => {
  if (node.done) return;
  const prev = { ...node };
  const arg = prev.property?.name;
  if (!arg) return;
  node.type = 'CallExpression';
  node.callee = {
    type: 'MemberExpression',
    object: prev.object,
    property: {
      type: 'Identifier',
      name: '$signal',
    },
    computed: false,
    optional: false,
  };
  node.arguments = [
    {
      type: 'Literal',
      value: arg,
      raw: `"${arg}"`,
    },
  ];
  node.optional = false;
  delete node.name;
};
const isPragma = (node: TNode) => {
  return (
    node?.type === 'CallExpression' && regPragma.test(node?.callee?.name || '')
  );
};
const isProps = (node: TNode, isComp: boolean) => {
  return (
    isComp ||
    (!isPragma(node) &&
      node.type !== 'Literal' &&
      node.type !== 'ArrowFunctionExpression' &&
      node.type !== 'FunctionExpression' &&
      node.type !== 'FunctionDeclaration' &&
      node.type !== 'Function')
  );
};
const isObjExpr = (n: TNode) => n.type === 'ObjectExpression';

export function transform(code: string) {
  const ast = parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowHashBang: true,
  });
  simple(ast, {
    CallExpression(node) {
      const name = (node.callee as any)?.name || '';
      if (name === 'h') {
        const args = node.arguments;
        const isComp = () => (args[0] as any)?._comp != null;
        args.forEach((node: TNode, i) => {
          if (i === 0) {
            if (node.type === 'Identifier') {
              const name = node.name;
              if (name && name[0] === name[0].toUpperCase()) {
                node._comp = true;
              }
            }
          } else if (i === 1) {
            isObjExpr(node) &&
              node.properties.forEach((node: TNode) => {
                node.shorthand = false;
                if (node.type === 'Property') {
                  const key = node.key ?? {};
                  const value = node.value;
                  const name = key.name || key.value || '';
                  const isElem =
                    !isComp() && (name.startsWith('on') || name === 'ref');
                  if (isElem || !isProps(value, isComp())) return;
                  if (!isComp() && name.startsWith('bind:')) {
                    if (value.type === 'MemberExpression') {
                      bindSignal(value);
                    }
                  } else {
                    toArrow(value);
                  }
                } else if (node.type === 'SpreadElement') {
                  toClone(node.argument);
                }
              });
          } else {
            if (isProps(node, false)) toArrow(node);
          }
        });
      } else if (['jsxDEV', 'jsxs', 'jsx'].includes(name)) {
        const args = node.arguments;
        const isComp = () => (args[0] as any)?._comp != null;
        args.forEach((node: TNode, i) => {
          if (i === 0) {
            if (node.type === 'Identifier') {
              const name = node.name;
              if (name && name[0] === name[0].toUpperCase()) {
                node._comp = true;
              }
            }
          } else if (i === 1) {
            if (isObjExpr(node)) {
              const props = node.properties;
              props.forEach((node: TNode) => {
                node.shorthand = false;
                if (node.type === 'Property') {
                  const key = node.key ?? {};
                  const value = node.value ?? {};
                  if (key?.name === 'children') {
                    if (value?.type === 'ArrayExpression') {
                      const elems = value.elements || [];
                      elems.forEach((node: TNode) => {
                        isProps(node, false) && toArrow(node);
                      });
                    } else if (isProps(value, false)) {
                      toArrow(value);
                    }
                  } else {
                    const name = key.name || key.value || '';
                    const isElem =
                      !isComp() && (name.startsWith('on') || name === 'ref');
                    if (isElem || !isProps(value, isComp())) return;
                    if (!isComp() && name.startsWith('bind:')) {
                      if (value.type === 'MemberExpression') {
                        bindSignal(value);
                      }
                    } else {
                      toArrow(value);
                    }
                  }
                } else if (node.type === 'SpreadElement') {
                  toClone(node.argument);
                }
              });
            }
          }
        });
      }
    },
  });
  return generate(ast);
}
