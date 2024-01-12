# ajel/ajel-require-error-handling

> This rule enforces the usage of the error returned from `ajel`.

- ⭐️ This rule is included in `plugin:ajel/recommended` preset.

## Summary

The `ajel-require-error-handling` rule ensures that when calling `ajel`, the error variable (typically named `err`) is properly handled. This helps prevent potential bugs and ensures that developers explicitly address errors returned from `ajel` calls.

## Rule Details

This rule checks for the usage of the error variable (`err`) in the context of a `VariableDeclaration` associated with an `ajel` call. If the error variable is declared but not used, a violation is reported.

## Why is this Rule Useful?

> Your leading underscores won't save you now.

Handling errors properly is crucial for robust and maintainable code. This rule encourages developers to explicitly handle errors returned from `ajel` calls, reducing the risk of silent failures and improving the overall reliability of the codebase.

This rule is not entirely redundant to `noUnusedLocals` - it is made in mind to be utilized simultaneously. This rule is meant to still throw errors when a developer uses a leading underscore to mark the variable as local only.

## Options

- `ajelAlias` (default: 'ajel'): Specify the alias for the ajel method. This allows you to customize the method name if it differs from the default 'ajel'.
- `sjelAlias` (default: 'sjel'): Specify the alias for the sjel method. This allows you to customize the method name if it differs from the default 'sjel'.

## Implementation

- [Rule source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/src/rules/ajel-require-error-handling.ts)
- [Test source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/tests/rules/ajel-require-error-handling.ts)

## Examples

```javascript
// ajel
// Bad: Declaring error variable but not using it
const [data, err] = await ajel(Promise.resolve(1));
// 'err' should be handled, e.g., by logging or other usage

// Good: Properly handling the error variable
const [data, err] = await ajel(Promise.resolve(1));

if (err) {
  console.error(err);
}

// -----

// sjel
// Bad: Declaring error variable but not using it
const [data, err] = sjel(fs.readFileSync)(path, { encoding: 'utf8' });
// 'err' should be handled, e.g., by logging or other usage

// Good: Properly handling the error variable
const [data, err] = sjel(fs.readFileSync)(path, { encoding: 'utf8' });

if (err) {
  console.error(err);
}
```
