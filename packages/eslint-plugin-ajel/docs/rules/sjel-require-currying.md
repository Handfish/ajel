# ajel/sjel-require-currying

> This rule provides clearer errors when trying to use sjel without currying. This should help more junior eyes.

- ⭐️ This rule is included in `plugin:ajel/recommended` preset.

## Summary

The `sjel-require-currying` rule provides a clear error that when calling sjel, you should be currying.

## Rule Details

- This rule checks for Variable Declarations that include a call to the sjel method. If a variable declaration does not find a AST nodes that denote currying, an error is reported.

## Options

- `sjelAlias` (default: 'sjel'): Specify the alias for the sjel method. This allows you to customize the method name if it differs from the default 'sjel'.

## Implementation

- [Rule source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/src/rules/sjel-require-currying.ts)
- [Test source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/tests/rules/sjel-require-currying.ts)

## Examples

```javascript
// Bad: calling sjel without currying (will provide 2 errors - a type error and our custom error)
let [res, err] = sjel(() => null);

// Good: calling sjel and currying
const [res, err] = sjel(() => null)();
```
