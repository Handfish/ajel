/*
 * Surgically taken from @typescript-eslint/eslint-plugin
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils, TSESLint } from '@typescript-eslint/utils';
import { Position } from 'estree';
import { isPositionEarlier } from './isPositionEarlier';
import { nodeIsPartOfBinaryExpressionWithInstanceof } from './nodeIsPartOfBinaryExpressionWithInstanceof';
import {
  LOGICAL_ASSIGNMENT_OPERATORS,
  isSelfReference,
  isInside,
} from './isUsed';

interface ContextReportPayload {
  position: Position;
  identifier: TSESTree.Identifier | TSESTree.JSXIdentifier;
}
/**
 * Determines if the variable is used.
 * @param variable The variable to check.
 * @returns True if the variable is used
 */
export function earliestUsedPosition(
  variable: TSESLint.Scope.Variable
): [Position | null, ContextReportPayload[]] {
  /**
   * Gets a list of function definitions for a specified variable.
   * @param variable eslint-scope variable object.
   * @returns Function nodes.
   */
  function getFunctionDefinitions(
    variable: TSESLint.Scope.Variable
  ): Set<TSESTree.Node> {
    const functionDefinitions = new Set<TSESTree.Node>();

    variable.defs.forEach((def) => {
      // FunctionDeclarations
      if (def.type === TSESLint.Scope.DefinitionType.FunctionName) {
        functionDefinitions.add(def.node);
      }

      // FunctionExpressions
      if (
        def.type === TSESLint.Scope.DefinitionType.Variable &&
        (def.node.init?.type === AST_NODE_TYPES.FunctionExpression ||
          def.node.init?.type === AST_NODE_TYPES.ArrowFunctionExpression)
      ) {
        functionDefinitions.add(def.node.init);
      }
    });
    return functionDefinitions;
  }

  function getTypeDeclarations(
    variable: TSESLint.Scope.Variable
  ): Set<TSESTree.Node> {
    const nodes = new Set<TSESTree.Node>();

    variable.defs.forEach((def) => {
      if (
        def.node.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
        def.node.type === AST_NODE_TYPES.TSTypeAliasDeclaration
      ) {
        nodes.add(def.node);
      }
    });

    return nodes;
  }

  function getModuleDeclarations(
    variable: TSESLint.Scope.Variable
  ): Set<TSESTree.Node> {
    const nodes = new Set<TSESTree.Node>();

    variable.defs.forEach((def) => {
      if (def.node.type === AST_NODE_TYPES.TSModuleDeclaration) {
        nodes.add(def.node);
      }
    });

    return nodes;
  }

  /**
   * Checks if the ref is contained within one of the given nodes
   */
  function isInsideOneOf(
    ref: TSESLint.Scope.Reference,
    nodes: Set<TSESTree.Node>
  ): boolean {
    for (const node of nodes) {
      if (isInside(ref.identifier, node)) {
        return true;
      }
    }

    return false;
  }

  /**
   * If a given reference is left-hand side of an assignment, this gets
   * the right-hand side node of the assignment.
   *
   * In the following cases, this returns null.
   *
   * - The reference is not the LHS of an assignment expression.
   * - The reference is inside of a loop.
   * - The reference is inside of a function scope which is different from
   *   the declaration.
   * @param ref A reference to check.
   * @param prevRhsNode The previous RHS node.
   * @returns The RHS node or null.
   */
  function getRhsNode(
    ref: TSESLint.Scope.Reference,
    prevRhsNode: TSESTree.Node | null
  ): TSESTree.Node | null {
    /**
     * Checks whether the given node is in a loop or not.
     * @param node The node to check.
     * @returns `true` if the node is in a loop.
     */
    function isInLoop(node: TSESTree.Node): boolean {
      let currentNode: TSESTree.Node | undefined = node;
      while (currentNode) {
        if (ASTUtils.isFunction(currentNode)) {
          break;
        }

        if (ASTUtils.isLoop(currentNode)) {
          return true;
        }

        currentNode = currentNode.parent;
      }

      return false;
    }

    const id = ref.identifier;
    const parent = id.parent;
    const grandparent = parent!.parent!;
    const refScope = ref.from.variableScope;
    const varScope = ref.resolved!.scope.variableScope;
    const canBeUsedLater = refScope !== varScope || isInLoop(id);

    /*
     * Inherits the previous node if this reference is in the node.
     * This is for `a = a + a`-like code.
     */
    if (prevRhsNode && isInside(id, prevRhsNode)) {
      return prevRhsNode;
    }

    if (
      parent?.type === AST_NODE_TYPES.AssignmentExpression &&
      grandparent.type === AST_NODE_TYPES.ExpressionStatement &&
      id === parent.left &&
      !canBeUsedLater
    ) {
      return parent.right;
    }
    return null;
  }

  /**
   * Checks whether a given reference is a read to update itself or not.
   * @param ref A reference to check.
   * @param rhsNode The RHS node of the previous assignment.
   * @returns The reference is a read to update itself.
   */
  function isReadForItself(
    ref: TSESLint.Scope.Reference,
    rhsNode: TSESTree.Node | null
  ): boolean {
    /**
     * Checks whether a given Identifier node exists inside of a function node which can be used later.
     *
     * "can be used later" means:
     * - the function is assigned to a variable.
     * - the function is bound to a property and the object can be used later.
     * - the function is bound as an argument of a function call.
     *
     * If a reference exists in a function which can be used later, the reference is read when the function is called.
     * @param id An Identifier node to check.
     * @param rhsNode The RHS node of the previous assignment.
     * @returns `true` if the `id` node exists inside of a function node which can be used later.
     */
    function isInsideOfStorableFunction(
      id: TSESTree.Node,
      rhsNode: TSESTree.Node
    ): boolean {
      /**
       * Finds a function node from ancestors of a node.
       * @param node A start node to find.
       * @returns A found function node.
       */
      function getUpperFunction(node: TSESTree.Node): TSESTree.Node | null {
        let currentNode: TSESTree.Node | undefined = node;
        while (currentNode) {
          if (ASTUtils.isFunction(currentNode)) {
            return currentNode;
          }
          currentNode = currentNode.parent;
        }

        return null;
      }

      /**
       * Checks whether a given function node is stored to somewhere or not.
       * If the function node is stored, the function can be used later.
       * @param funcNode A function node to check.
       * @param rhsNode The RHS node of the previous assignment.
       * @returns `true` if under the following conditions:
       *      - the funcNode is assigned to a variable.
       *      - the funcNode is bound as an argument of a function call.
       *      - the function is bound to a property and the object satisfies above conditions.
       */
      function isStorableFunction(
        funcNode: TSESTree.Node,
        rhsNode: TSESTree.Node
      ): boolean {
        let node = funcNode;
        let parent = funcNode.parent;

        while (parent && isInside(parent, rhsNode)) {
          switch (parent.type) {
            case AST_NODE_TYPES.SequenceExpression:
              if (parent.expressions[parent.expressions.length - 1] !== node) {
                return false;
              }
              break;

            case AST_NODE_TYPES.CallExpression:
            case AST_NODE_TYPES.NewExpression:
              return parent.callee !== node;

            case AST_NODE_TYPES.AssignmentExpression:
            case AST_NODE_TYPES.TaggedTemplateExpression:
            case AST_NODE_TYPES.YieldExpression:
              return true;

            default:
              if (
                parent.type.endsWith('Statement') ||
                parent.type.endsWith('Declaration')
              ) {
                /*
                 * If it encountered statements, this is a complex pattern.
                 * Since analyzing complex patterns is hard, this returns `true` to avoid false positive.
                 */
                return true;
              }
          }

          node = parent;
          parent = parent.parent;
        }

        return false;
      }

      const funcNode = getUpperFunction(id);

      return (
        !!funcNode &&
        isInside(funcNode, rhsNode) &&
        isStorableFunction(funcNode, rhsNode)
      );
    }

    const id = ref.identifier;
    const parent = id.parent;
    const grandparent = parent!.parent!;

    return (
      ref.isRead() && // in RHS of an assignment for itself. e.g. `a = a + 1`
      // self update. e.g. `a += 1`, `a++`
      ((parent?.type === AST_NODE_TYPES.AssignmentExpression &&
        !LOGICAL_ASSIGNMENT_OPERATORS.has(parent.operator) &&
        grandparent.type === AST_NODE_TYPES.ExpressionStatement &&
        parent.left === id) ||
        (parent?.type === AST_NODE_TYPES.UpdateExpression &&
          grandparent.type === AST_NODE_TYPES.ExpressionStatement) ||
        (!!rhsNode &&
          isInside(id, rhsNode) &&
          !isInsideOfStorableFunction(id, rhsNode)))
    );
  }

  const functionNodes = getFunctionDefinitions(variable);
  const isFunctionDefinition = functionNodes.size > 0;

  const typeDeclNodes = getTypeDeclarations(variable);
  const isTypeDecl = typeDeclNodes.size > 0;

  const moduleDeclNodes = getModuleDeclarations(variable);
  const isModuleDecl = moduleDeclNodes.size > 0;

  let rhsNode: TSESTree.Node | null = null;

  const relevantRefs = variable.references.filter((ref) => {
    const forItself = isReadForItself(ref, rhsNode);

    rhsNode = getRhsNode(ref, rhsNode);

    return (
      ref.isRead() &&
      !forItself &&
      !(isFunctionDefinition && isSelfReference(ref, functionNodes)) &&
      !(isTypeDecl && isInsideOneOf(ref, typeDeclNodes)) &&
      !(isModuleDecl && isSelfReference(ref, moduleDeclNodes)) &&
      !nodeIsPartOfBinaryExpressionWithInstanceof(ref.identifier)
    );
  });

  let earliestReferencePosition: Position | null = null;
  const contextPayload: ContextReportPayload[] = [];

  relevantRefs.forEach((ref) => {
    const referencePosition = ref.identifier.loc.start;
    contextPayload.push({
      position: referencePosition,
      identifier: ref.identifier,
    });

    if (
      !earliestReferencePosition ||
      isPositionEarlier(referencePosition, earliestReferencePosition)
    ) {
      earliestReferencePosition = referencePosition;
    }
  });

  return [earliestReferencePosition, contextPayload];
}
