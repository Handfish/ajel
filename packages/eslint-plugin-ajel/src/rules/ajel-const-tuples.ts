import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';

type Options = [
  {
    ajelAlias?: string;
  }
];
type MessageIds = 'const';

const rule = createRule<Options, MessageIds>({
  name: 'ajel-const-tuples',
  meta: {
    type: 'problem',
    docs: {
      description: 'This rule enforces the use of a const calling ajel',
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
      const: "Utilize 'const' when calling {{ajelAlias}}",
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
    },
  ],

  create: (context, [options]) => {
    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        if (hasAjelCallExpressionChild(node, options.ajelAlias)) {
          if (node.kind !== 'const') {
            context.report({
              node,
              messageId: 'const',
              data: {
                ajelAlias: options.ajelAlias,
              },
            });
          }
        }
      },
    };
  },
});

export default rule;
