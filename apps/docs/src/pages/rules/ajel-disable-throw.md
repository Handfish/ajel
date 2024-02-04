# ajel/ajel-disable-throw

> This rule reports a warning when a developer uses a `ThrowStatement`.

- ⭐️ This rule is included in `plugin:ajel/recommended` preset.

## Summary

The `ajel-disable-throw` rule identifies and reports instances where a `Throw` is used in the code. Throwing errors might be considered an anti-pattern in some scenarios, and this rule encourages developers to consider alternative approaches, such as returning an error or using a constant string, to handle exceptional cases.

## Rule Details

This rule checks for the presence of `ThrowStatement` instances in the code. If a `throw` is found, a warning is reported with a message advising developers to consider returning an error or a constant string instead of throwing an error.

## Why is this Rule Useful?

The use of `throw` is not represented in return types, and is denoted in an 'unknown' when handling manually in the editor. While returning an `Error` helps maintain type information, it also produces a stack trace. In performance-critical environments, developers may want to consider alternatives such as returning a string to avoid creating a stack trace, or utilizing a non-garbage-collected language for more performance-critical pieces.

## Options

This rule does not have any configurable options.

## Implementation

- [Rule source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/src/rules/ajel-disable-throw.ts)
- [Test source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/tests/rules/ajel-disable-throw.ts)

## Examples

```javascript
// Bad: Using ThrowStatement to handle an error
function exampleFunction() {
  throw new Error('This is an error');
}

// Good: Returning an error or using a constant string
function exampleFunction() {
  return new Error('This is an error'); // or return 'ERR100-GenericError';
}
```
