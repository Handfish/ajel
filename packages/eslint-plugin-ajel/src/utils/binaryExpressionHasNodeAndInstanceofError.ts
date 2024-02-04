import { TSESTree } from '@typescript-eslint/utils';

export function binaryExpressionHasNodeAndInstanceofError(
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
      node.right.type === 'Identifier' &&
      node.right.name === 'Error'
    ) {
      return true;
    }
  }

  return false;
}
