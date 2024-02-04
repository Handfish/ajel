# ajel/ajel-require-error-handling

> This rule enforces narrowing the error type with `instanceof`.

## Summary

The `ajel-require-error-handling` rule ensures that when calling `ajel` or `sjel`, the error variable is properly narrowed using the `instanceof` operator. This helps developers perform more specific error handling and enhances the type safety of the code.

## Rule Details

This rule checks for variable declarations associated with an `ajel` or `sjel` call and ensures that the error variable is subsequently narrowed using the `instanceof` operator in a `BinaryExpression`.

## Why is this Rule Useful?

Properly narrowing the error type with `instanceof` promotes more precise error handling.

## Options

- `ajelAlias` (default: 'ajel'): Specify the alias for the ajel method. This allows you to customize the method name if it differs from the default 'ajel'.
- `sjelAlias` (default: 'sjel'): Specify the alias for the sjel method. This allows you to customize the method name if it differs from the default 'sjel'.

## Implementation

- [Rule source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/src/rules/ajel-require-error-handling.ts)
- [Test source](https://github.com/Handfish/ajel/blob/main/packages/eslint-plugin-ajel/tests/rules/ajel-require-error-handling.ts)

## Examples

```typescript
import { ajel, sjel } from 'ajel';

class CustomError extends Error { }
class CustomError2 extends Error { }
class CustomError3 extends Error { }

const foobarFn = async () => {
  const result = await ajel(Promise.resolve('result'));
  const result2 = sjel(JSON.parse, '{}');
  const result3 = await ajel(Promise.resolve('result'));
  const result5 = sjel((stringvar: string) => stringvar, '{}');

  //------ Test2 SJEL
  if (result2 instanceof CustomError) {
    //We can access the error here in BinaryExpression with var instanceof
    console.log(result2);
    return;
  }

  // Cant Access the result2 variable here
  // console.log(result2);

  if (result2 instanceof Error) {
    console.log(result2);
    // This return narrows the type of result2 to its Result
    return;
  }
  // Type is narrowed - no longer a union of Result | Error -> just Result
  console.log(result2);

  //------ Test AJEL
  // Cant Access the result variable here
  // console.log(result);

  switch (true) {
    case result instanceof CustomError3:
      //We can access the error here in BinaryExpression with var instanceof
      console.log(test);
      break;
    //We support fall through
    case result instanceof CustomError2:
    case result instanceof CustomError:
      console.log(result);
      break;
    case result instanceof Error:
      break;
  }
  console.log(result);

  //---- No handling of AJEL and SJEL returns reports Errors
  // console.log(result3);
  // console.log(result5);
};
```
