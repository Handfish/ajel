import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';
import { binaryExpressionHasNodeAndInstanceofError } from '../utils/binaryExpressionHasNodeAndInstanceofError';
import { Position } from 'estree';
import { earliestUsedPosition } from '../utils/earliestUsedPosition';
import { isPositionEarlier } from '../utils/isPositionEarlier';

interface ErrorReportInfo {
  ajelOrSjel: 'ajel' | 'sjel';
  instanceofPosition: Position | undefined;
}

type Options = [
  {
    ajelAlias?: string;
    sjelAlias?: string;
  },
];
type MessageIds = 'requireErrorHandling' | 'usedBeforeErrorHandling';

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
      requireErrorHandling:
        "{{ajelOrSjel}}: {{name}} used before type narrowing catch-all '{{name}} instanceof Error'",
      usedBeforeErrorHandling:
        "{{ajelOrSjel}}: {{name}} used before type narrowing catch-all '{{name}} instanceof Error'",
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
      sjelAlias: 'sjel',
    },
  ],

  create: (context, [{ ajelAlias, sjelAlias }]) => {
    const errorVariablesMap = new Map<TSESTree.Identifier, ErrorReportInfo>();

    function reportIfErrorVariableUnused() {
      for (const [
        errorVariable,
        { ajelOrSjel, instanceofPosition },
      ] of errorVariablesMap) {
        // Get the scope of the identifier
        const scope = context.getScope();

        // Get the variable associated with the identifier
        const variable = scope.variables.find((v) =>
          v.identifiers.includes(errorVariable)
        );

        if (variable) {
          const [pos, contextPayloads] = earliestUsedPosition(variable);
          if (!instanceofPosition) {
            for (const contextPayload of contextPayloads) {
              context.report({
                node: contextPayload.identifier,
                messageId: 'requireErrorHandling',
                data: {
                  ajelOrSjel: ajelOrSjel === 'ajel' ? ajelAlias : sjelAlias,
                  name: contextPayload.identifier.name,
                },
              });
            }
          } else if (instanceofPosition) {
            if (pos && isPositionEarlier(pos, instanceofPosition))
              for (const contextPayload of contextPayloads) {
                if (
                  isPositionEarlier(contextPayload.position, instanceofPosition)
                ) {
                  context.report({
                    node: contextPayload.identifier,
                    messageId: 'usedBeforeErrorHandling',
                    data: {
                      ajelOrSjel: ajelOrSjel === 'ajel' ? ajelAlias : sjelAlias,
                      name: contextPayload.identifier.name,
                    },
                  });
                }
              }
          }
        }
        // if (variable && !isUsedVariable(variable)) {
      }
    }

    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        const [hasAjelCallExpression, ajelOrSjel = ''] =
          hasAjelCallExpressionChild(node, ajelAlias, sjelAlias);

        //Refactor
        if (hasAjelCallExpression && ajelOrSjel) {
          const declarator = node.declarations[0];
          if (declarator.id.type === 'Identifier') {
            // Handling single variable assignment
            const errorVariable = declarator.id;
            const ajelOrSjelReport = ajelOrSjel;

            // Store the error variable and its corresponding report information in the WeakMap
            errorVariablesMap.set(errorVariable, {
              ajelOrSjel: ajelOrSjelReport,
              instanceofPosition: undefined,
            });
          }
        }
      },

      // If the error variable is used in a binary expression with instanceof
      BinaryExpression(node: TSESTree.BinaryExpression): void {
        for (const [errorVariable, errorReportInfo] of errorVariablesMap) {
          if (
            !errorReportInfo.instanceofPosition &&
            binaryExpressionHasNodeAndInstanceofError(node, errorVariable)
          ) {
            errorVariablesMap.set(errorVariable, {
              ...errorReportInfo,
              instanceofPosition: node.loc.start,
            });
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
