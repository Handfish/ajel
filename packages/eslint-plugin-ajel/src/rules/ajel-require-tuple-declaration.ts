import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { hasAjelCallExpressionChild } from '../utils/hasAjelCallExpressionChild';

type Options = [
  {
    ajelAlias?: string;
    sjelAlias?: string;
  },
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
          sjelAlias: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      limitDeclarations: 'Declare only the tuple when calling {{ajelOrSjel}}',
      tupleLen2:
        'Variable declarations must be a tuple of length 2 when calling {{ajelOrSjel}}',
    },
  },
  defaultOptions: [
    {
      ajelAlias: 'ajel',
      sjelAlias: 'sjel',
    },
  ],

  create: (context, [{ ajelAlias, sjelAlias }]) => {
    return {
      VariableDeclaration(node: TSESTree.VariableDeclaration): void {
        const [hasAjelCallExpression, ajelOrSjel] = hasAjelCallExpressionChild(
          node,
          ajelAlias,
          sjelAlias
        );

        if (hasAjelCallExpression && ajelOrSjel) {
          // Check if there's more than one declarator
          if (node.declarations.length !== 1) {
            context.report({
              node,
              messageId: 'limitDeclarations',
              data: {
                ajelOrSjel: ajelOrSjel === 'ajel' ? ajelAlias : sjelAlias,
              },
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
                ajelOrSjel: ajelOrSjel === 'ajel' ? ajelAlias : sjelAlias,
              },
            });
          }
        }
      },
    };
  },
});

export default rule;
