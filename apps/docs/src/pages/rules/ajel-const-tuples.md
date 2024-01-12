# ajel/ajel-const-tuples

> This rule enforces the use of `const` when calling ajel.

- ⭐️ This rule is included in `plugin:ajel/recommended` preset.

## Summary

The `ajel-const-tuples` rule ensures that when calling ajel, the variables are declared using the `const` keyword. This promotes the use of immutable variables when interacting with the ajel functionality.

## Rule Details

This rule checks for Variable Declarations that include a call to the ajel method. If a variable declaration does not use the `const` keyword in such cases, an error is reported.

## Options

- `ajelAlias` (default: 'ajel'): Specify the alias for the ajel method. This allows you to customize the method name if it differs from the default 'ajel'.

## Implementation

- [Rule source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/src/rules/ajel-const-tuples.ts)
- [Test source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/tests/rules/ajel-const-tuples.ts)

## Examples

```javascript
// Bad: Variable declaration without 'const' for ajel method
let [res, err] = await ajel(Promise.resolve(1));

// Good: Variable declaration with 'const' for ajel method
const [res, err] = await ajel(Promise.resolve(1));
```
