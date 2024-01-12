import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';

type Options = [
  {
    ajelAlias?: string;
  }
];
type MessageIds = 'limitDeclarations' | 'tupleLen2';

const rule = createRule<Options, MessageIds>({
  name: 'ajel-require-tuple-declaration',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Variable declarations must be a tuple of length 2 when calling ajel',
      recommended: 'error',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ajelAlias: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      limitDeclarations: 'Declare only the tuple when calling {{ajelAlias}}',
      tupleLen2:
        'Variable declarations must be a tuple of length 2 when calling {{ajelAlias}}',
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
    },
  ],

  create: (context, [{ ajelAlias }]) => {
    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        if (hasAjelCallExpressionChild(node, ajelAlias)) {
          // Check if there's more than one declarator
          if (node.declarations.length !== 1) {
            context.report({
              node,
              messageId: 'limitDeclarations',
            });
          }
          const declarator = node.declarations[0];
          // Check if the declarator is not an ArrayPattern or doesn't have exactly two elements
          if (
            declarator.id.type !== 'ArrayPattern' ||
            declarator.id.elements.length !== 2
          ) {
            context.report({
              node,
              messageId: 'tupleLen2',
              data: {
                ajelAlias,
              },
            });
          }
        }
      },
    };
  },
});

export default rule;
