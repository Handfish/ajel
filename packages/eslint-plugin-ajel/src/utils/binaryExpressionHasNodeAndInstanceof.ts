/*
 * Likely Unused
 *
 *
 */
import { TSESTree } from '@typescript-eslint/utils';

export function binaryExpressionHasNodeAndInstanceof(
  node: TSESTree.Node | null | undefined,
  errorVariable: TSESTree.Identifier | null | undefined
): boolean {
  if (!node || node.type !== 'BinaryExpression') {
    return false;
  }

  if (node.operator === 'instanceof') {
    if (
      node.left.type === 'Identifier' &&
      node.left.name === errorVariable?.name &&
      node.parent &&
      node.parent.type === 'IfStatement' &&
      node.parent.consequent &&
      node.parent.consequent.type === 'BlockStatement'
    ) {
      return true;
    }
  }

  return false;
}
