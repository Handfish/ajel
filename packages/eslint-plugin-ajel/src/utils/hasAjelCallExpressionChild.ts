import { TSESTree } from '@typescript-eslint/utils';

export function hasAjelCallExpressionChild(
  node: TSESTree.VariableDeclaration | null | undefined,
  alias?: string
): boolean {
  if (!node || node.type !== 'VariableDeclaration') {
    return false;
  }

  for (const declarator of node.declarations) {
    if (
      declarator.init &&
      declarator.init.type === 'AwaitExpression' &&
      declarator.init.argument &&
      declarator.init.argument.type === 'CallExpression' &&
      declarator.init.argument.callee.type === 'Identifier' &&
      declarator.init.argument.callee.name === (alias ? alias : 'ajel')
    ) {
      return true;
    }
  }

  return false;
}
