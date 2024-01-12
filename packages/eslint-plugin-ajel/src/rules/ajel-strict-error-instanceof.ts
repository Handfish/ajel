import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';
import { isFoundInBinaryExpressionWithInstanceOf } from '../utils/isFoundInBinaryExpressionWithInstanceOf';

type Options = [
  {
    ajelAlias?: string;
  }
];
type MessageIds = 'instanceofError';

const rule = createRule<Options, MessageIds>({
  name: 'ajel-strict-error-instanceof',
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule enforces narrowing the error type with instanceof',
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
      instanceofError: 'Utilize err instanceof',
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
    },
  ],

  create: (context, [{ ajelAlias }]) => {
    let errorVariable: TSESTree.Identifier | null = null;

    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        if (hasAjelCallExpressionChild(node, ajelAlias)) {
          const declarator = node.declarations[0];
          if (
            declarator.id.type === 'ArrayPattern' &&
            declarator.id.elements[1]?.type === 'Identifier'
          ) {
            errorVariable = declarator.id.elements[1];
          }
        }
      },
      BinaryExpression(node: TSESTree.BinaryExpression): void {
        if (isFoundInBinaryExpressionWithInstanceOf(node, errorVariable)) {
          errorVariable = null;
        }
      },
      'Program:exit'(): void {
        if (errorVariable) {
          context.report({
            node: errorVariable,
            messageId: 'instanceofError',
          });
        }
      },
    };
  },
});

export default rule;
