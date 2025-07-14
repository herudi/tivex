import parser from '@babel/parser';
import traverse_ from '@babel/traverse';
import generate_ from '@babel/generator';

const traverse = traverse_['default'] as typeof traverse_;
const generate = generate_['default'] as typeof generate_;

const isValidType = (type: string, isComp: boolean) => {
  return (
    isComp ||
    (type !== 'Literal' &&
      type !== 'ArrowFunctionExpression' &&
      type !== 'FunctionExpression' &&
      type !== 'FunctionDeclaration' &&
      type !== 'Function')
  );
};
export type TransformOptions = parser.ParserOptions;
export function transform(code: string, opts: TransformOptions = {}) {
  const plugins = new Set(opts.plugins ?? []);
  plugins.add('typescript');
  plugins.add('jsx');
  opts.plugins = Array.from(plugins);
  const ast = parser.parse(code, {
    sourceType: 'module',
    ...opts,
  });
  traverse(ast, {
    JSXSpreadAttribute(path) {
      const prev = { ...path.node.argument };
      const cloneExpr = {
        type: 'JSXSpreadAttribute',
        argument: {
          type: 'LogicalExpression',
          left: {
            type: 'MemberExpression',
            object: prev,
            computed: false,
            property: {
              type: 'Identifier',
              name: '$props',
            },
          },
          operator: '??',
          right: prev,
        },
      };
      path.node.argument = cloneExpr.argument as any;
    },
    JSXExpressionContainer(path) {
      const elem = path.findParent((path) => path.type === 'JSXElement');
      const isComp = () => {
        if (elem && elem.node.type === 'JSXElement') {
          const name = elem.node.openingElement.name;
          return (
            name.type === 'JSXIdentifier' &&
            name.name[0] === name.name[0]?.toUpperCase()
          );
        }
        return false;
      };
      if (!isComp()) {
        if (path.parent.type === 'JSXAttribute') {
          const key = path.parent.name;
          if (key.type === 'JSXIdentifier') {
            const name = key.name;
            if (name.startsWith('on') || name === 'ref') {
              return;
            }
          } else {
            if (key.namespace.name === 'bind') {
              const expr = path.node.expression;
              if (expr.type === 'MemberExpression') {
                if (
                  expr.object.type === 'Identifier' &&
                  expr.property.type === 'Identifier'
                ) {
                  const objName = expr.object.name;
                  const propName = expr.property.name;
                  const bindSignal = {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: objName,
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: '$signal',
                      },
                    },
                    arguments: [
                      {
                        type: 'StringLiteral',
                        extra: { rawValue: propName, raw: `"${propName}"` },
                        value: propName,
                      },
                    ],
                  };
                  path.node.expression = bindSignal as any;
                }
              }
              return;
            }
          }
        }
      }
      const expr = path.node.expression;
      if (isValidType(expr.type, isComp())) {
        const arrowFunction = {
          type: 'ArrowFunctionExpression',
          params: [],
          body: expr,
          expression: true,
        };
        path.node.expression = arrowFunction as any;
      }
    },
  });
  return generate(ast, {}, code).code;
}
