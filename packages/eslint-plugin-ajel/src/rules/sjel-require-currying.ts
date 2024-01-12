import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';

type Options = [
  {
    sjelAlias?: string;
  },
];
type MessageIds = 'currying';

const rule = createRule<Options, MessageIds>({
  name: 'sjel-require-currying',
  meta: {
    type: 'problem',
    docs: {
      description: 'This rule enforces the use currying when calling sjel',
      recommended: 'error',
    },
    schema: [
      {
        type: 'object',
        properties: {
          sjelAlias: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      currying: 'Use currying when calling {{sjelAlias}}',
    },
  },
  defaultOptions: [
    {
      sjelAlias: 'sjel',
    },
  ],

  create: (context, [options]) => {
    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        for (const declarator of node.declarations) {
          if (
            declarator.init &&
            declarator.init.type === 'CallExpression' &&
            declarator.init.callee.type === 'Identifier' &&
            declarator.init.callee.name ===
              (options.sjelAlias ? options.sjelAlias : 'sjel')
          ) {
            context.report({
              node,
              messageId: 'currying',
              data: {
                sjelAlias: options.sjelAlias,
              },
            });
          }
        }
      },
    };
  },
});

export default rule;
