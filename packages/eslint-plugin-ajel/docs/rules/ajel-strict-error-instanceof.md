# ajel/ajel-strict-error-instanceof

> This rule enforces narrowing the error type with `instanceof`.

- ⭐️ This rule is included in `plugin:ajel/recommended` preset.

## Summary

The `ajel-strict-error-instanceof` rule ensures that when calling `ajel`, the error variable is properly narrowed using the `instanceof` operator. This helps developers perform more specific error handling and enhances the type safety of the code.

## Rule Details

This rule checks for variable declarations associated with an `ajel` call and ensures that the error variable is subsequently narrowed using the `instanceof` operator in a `BinaryExpression`.

## Why is this Rule Useful?

Properly narrowing the error type with `instanceof` promotes more precise error handling.

## Options

- `ajelAlias` (default: 'ajel'): Specify the alias for the ajel method. This allows you to customize the method name if it differs from the default 'ajel'.

## Implementation

- [Rule source](../../src/rules/ajel-strict-error-instanceof.ts)
- [Test source](../../tests/rules/ajel-strict-error-instanceof.ts)

## Examples

```javascript
// Bad: Error variable not narrowed with instanceof
const [data, err] = await ajel(Promise.resolve(1));
// Missing instanceof check for specific error type
if (err) {
  console.error(err);
}

// Good: Error variable narrowed with instanceof
const [data, err] = await ajel(Promise.resolve(1));
// Handle specific error type
if (err instanceof SpecificError) {
  console.error(err.message);
}
```
