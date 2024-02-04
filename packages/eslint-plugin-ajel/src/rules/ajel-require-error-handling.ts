import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';
import { binaryExpressionHasNodeAndInstanceofError } from '../utils/binaryExpressionHasNodeAndInstanceofError';
import { Position } from 'estree';
import { earliestUsedPosition } from '../utils/earliestUsedPosition';
import { isPositionEarlier } from '../utils/isPositionEarlier';

//import { ajel } from '../utils/ajel';
//import { sjel } from '../utils/sjel';

//class CustomError extends Error { }
//class CustomError2 extends Error { }
//class CustomError3 extends Error { }

//const testfn = async () => {
//  const test = await ajel(Promise.resolve('test'));
//  const test2 = sjel(JSON.parse, '{}');
//  const test3 = await ajel(Promise.resolve('test'));
//  const test5 = sjel((stringvar: string) => stringvar, '{}');

//  //------ Test2 SJEL
//  if (test2 instanceof CustomError) {
//    //We can access the error here in BinaryExpression with var instanceof
//    console.log(test2);
//    return;
//  }

//  // Cant Access the test2 variable here
//  console.log(test2);
//  console.log(test2);

//  if (test2 instanceof Error) {
//    console.log(test2);
//    // This return narrows the type of test2 to its Result
//    return;
//  }
//  // Type is narrowed - no longer a union of Result | Error -> just Result
//  console.log(test2);

//  //------ Test AJEL
//  // Cant Access the test variable here
//  console.log(test);
//  console.log(test);

//  switch (true) {
//    case test instanceof CustomError3:
//      //We can access the error here in BinaryExpression with var instanceof
//      console.log(test);
//      break;
//    //We support fall through
//    case test instanceof CustomError2:
//    case test instanceof CustomError:
//      console.log(test);
//      break;
//    case test instanceof Error:
//      break;
//  }
//  console.log(test);

//  //---- No handling of AJEL and SJEL returns
//  console.log(test3);
//  console.log(test5);
//};
//console.log(testfn);

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
