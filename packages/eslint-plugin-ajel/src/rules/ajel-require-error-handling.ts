import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';
import { isUsedVariable } from '../utils/isUsed';

type Options = [
  {
    ajelAlias?: string;
    sjelAlias?: string;
  },
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
          sjelAlias: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireErrorHandling: 'err from {{ajelOrSjel}} must be used',
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

    function reportIfErrorVariableUnused() {
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
              ajelOrSjel: ajelOrSjelReport === 'ajel' ? ajelAlias : sjelAlias,
            },
          });
        }
      }
    }

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
      'ArrowFunctionExpression:exit'(): void {
        reportIfErrorVariableUnused();
      },
      'FunctionDeclaration:exit'(): void {
        reportIfErrorVariableUnused();
      },
      'Program:exit'(): void {
        reportIfErrorVariableUnused();
      },
    };
  },
});

export default rule;
