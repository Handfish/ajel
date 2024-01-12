import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';
import { isUsedVariable } from '../utils/isUsed';

type Options = [
  {
    ajelAlias?: string;
  }
];
type MessageIds = 'requireErrorHandling';

const rule = createRule<Options, MessageIds>({
  name: 'ajel-require-error-handling',
  meta: {
    type: 'problem',
    docs: {
      description: 'This rule having to use the err returned from ajel',
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
      requireErrorHandling: 'err from {{ajelAlias}} must be used',
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
      'Program:exit'(): void {
        if (errorVariable) {
          // Get the scope of the identifier
          const scope = context.getScope();

          // Get the variable associated with the identifier
          const variable = scope.variables.find((v) =>
            v.identifiers.includes(errorVariable as TSESTree.Identifier)
          );

          if (variable && !isUsedVariable(variable)) {
            context.report({
              node: errorVariable,
              messageId: 'requireErrorHandling',
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
