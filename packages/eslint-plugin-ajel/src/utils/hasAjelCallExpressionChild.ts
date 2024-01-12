import { TSESTree } from '@typescript-eslint/utils';

export function hasAjelCallExpressionChild(
  node: TSESTree.VariableDeclaration | null | undefined,
  ajelAlias?: string,
  sjelAlias?: string
): [boolean, 'ajel' | 'sjel' | undefined] {
  if (!node || node.type !== 'VariableDeclaration') {
    return [false, undefined];
  }

  for (const declarator of node.declarations) {
    // Check for ajel
    if (
      declarator.init &&
      declarator.init.type === 'AwaitExpression' &&
      declarator.init.argument &&
      declarator.init.argument.type === 'CallExpression' &&
      declarator.init.argument.callee.type === 'Identifier' &&
      declarator.init.argument.callee.name === (ajelAlias ? ajelAlias : 'ajel')
    ) {
      return [true, 'ajel'];
    }

    // Check for sjel
    if (
      declarator.init &&
      declarator.init.type === 'CallExpression' &&
      declarator.init.callee.type === 'CallExpression' &&
      declarator.init.callee.callee.type === 'Identifier' &&
      declarator.init.callee.callee.name === (sjelAlias ? sjelAlias : 'sjel')
    ) {
      return [true, 'sjel'];
    }
  }

  return [false, undefined];
}
