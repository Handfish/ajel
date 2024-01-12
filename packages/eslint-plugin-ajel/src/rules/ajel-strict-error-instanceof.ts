import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';
import { isFoundInBinaryExpressionWithInstanceOf } from '../utils/isFoundInBinaryExpressionWithInstanceOf';

type Options = [
  {
    ajelAlias?: string;
    sjelAlias?: string;
  },
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
          sjelAlias: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      instanceofError: 'Utilize err instanceof when using {{ajelOrSjel}}',
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
      sjelAlias: 'sjel',
    },
  ],

  create: (context, [{ ajelAlias, sjelAlias }]) => {
    let errorVariable: TSESTree.Identifier | null = null;
    let ajelOrSjelReport: 'ajel' | 'sjel' | undefined = undefined;

    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        const [hasAjelCallExpression, ajelOrSjel] = hasAjelCallExpressionChild(
          node,
          ajelAlias,
          sjelAlias
        );

        if (hasAjelCallExpression && ajelOrSjel) {
          const declarator = node.declarations[0];
          if (
            declarator.id.type === 'ArrayPattern' &&
            declarator.id.elements[1]?.type === 'Identifier'
          ) {
            errorVariable = declarator.id.elements[1];
            ajelOrSjelReport = ajelOrSjel;
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
            data: {
              ajelOrSjel: ajelOrSjelReport === 'ajel' ? ajelAlias : sjelAlias,
            },
          });
        }
      },
    };
  },
});

export default rule;
