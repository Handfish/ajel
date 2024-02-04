import { TSESTree } from '@typescript-eslint/utils';

export function nodeIsPartOfBinaryExpressionWithInstanceof(
  inputNode: TSESTree.Identifier | TSESTree.JSXIdentifier | null | undefined
): boolean {
  if (!inputNode) {
    return false;
  }

  let result = false;

  function isMatchingBinaryExpression(node: TSESTree.Node): boolean {
    return (
      node.type === 'BinaryExpression' &&
      node.operator === 'instanceof' &&
      node.left.type === 'Identifier' &&
      node.left.name === inputNode?.name
    );
  }

  function hasMatchingBinaryExpressionInAllSwitchCases(
    node: TSESTree.SwitchStatement
  ): boolean {
    for (const clause of node.cases) {
      if (clause.test && !isMatchingBinaryExpression(clause.test)) {
        return false;
      }
    }
    return true;
  }

  function backtrack(node: TSESTree.Node | null | undefined): void {
    if (node && isMatchingBinaryExpression(node)) {
      result = true;
      return;
    }

    if (node && node.parent) {
      if (
        node.parent.type === 'IfStatement' &&
        node.parent.test === node // Check if the BinaryExpression is the test condition
      ) {
        result = true;
        return;
      }

      // ------
      // Case of if (test instanceof CustomError){}
      //
      // Check if belongs to a BlockStatement that is the consequent of an IfStatement with a BinaryExpression test
      //
      if (
        node.type === 'BlockStatement' &&
        node.parent &&
        node.parent.type === 'IfStatement' &&
        node.parent.test &&
        node.parent.test.type === 'BinaryExpression' &&
        node.parent.test.operator === 'instanceof' &&
        node.parent.test.left.type === 'Identifier' &&
        node.parent.test.left.name === inputNode?.name
      ) {
        result = true;
        return;
      }

      // ------
      // Case of
      //
      // switch (true) {
      //  case test instanceof CustomError:
      //  case test instanceof Error:
      //      console.log(test);
      //      break;
      //  }
      if (
        node.parent.type === 'SwitchStatement' &&
        node.parent.cases.length > 0 &&
        hasMatchingBinaryExpressionInAllSwitchCases(node.parent)
      ) {
        result = true;
        return;
      }

      backtrack(node.parent);
    }
  }

  backtrack(inputNode);

  return result;
}
