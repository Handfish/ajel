import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';

export function isTryStatement(
  node: TSESTree.Node
): node is TSESTree.TryStatement {
  return node.type === 'TryStatement';
}

type Options = [
  {
    ajelAlias?: string;
  }
];
type MessageIds = 'tryStatement';

const rule = createRule<Options, MessageIds>({
  name: 'ajel-disable-try-catch',
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule reports and error when a developer uses a TryStatement',
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
      tryStatement: 'Consider using {{ajelAlias}} instead of try catch',
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
    },
  ],

  create: (context, [{ ajelAlias }]) => {
    return {
      TryStatement: (node: TSESTree.TryStatement) => {
        // Check if it's a TryStatement
        if (isTryStatement(node)) {
          // Report an error for the TryStatement
          context.report({
            node,
            messageId: 'tryStatement',
            data: {
              ajelAlias,
            },
          });
        }
      },
    };
  },
});

export default rule;
