import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';

export function isThrowStatement(
  node: TSESTree.Node
): node is TSESTree.ThrowStatement {
  return node.type === 'ThrowStatement';
}

const rule = createRule({
  name: 'ajel-disable-throw',
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule reports and error when a developer uses a ThrowStatement',
      recommended: 'error',
    },
    schema: [],
    messages: {
      throwStatement:
        'Consider returning an error or as const string instead of throwing an error',
    },
  },
  defaultOptions: [],

  create: (context) => {
    return {
      ThrowStatement: (node: TSESTree.ThrowStatement) => {
        // Check if it's a ThrowStatement
        if (isThrowStatement(node)) {
          // Report an error for the ThrowStatement
          context.report({
            node,
            messageId: 'throwStatement',
          });
        }
      },
    };
  },
});

export default rule;
