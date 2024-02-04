<p align="center"><a href="https://github.com/Handfish/ajel" target="_blank"><img src="https://raw.githubusercontent.com/Handfish/ajel/main/apps/docs/public/ajel2.svg" width="100"></a></p>

<p align="center">`ajel` and `sjel` are thin wrappers for try-catch, coupled with eslint rules to encourage better error handling.</p>

<p align="center">
<a href="https://www.npmjs.com/ajel" target="_blank"><img src="https://img.shields.io/npm/v/ajel.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/ajel" target="_blank"><img src="https://img.shields.io/npm/l/ajel.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/ajel" target="_blank"><img src="https://img.shields.io/npm/dt/ajel.svg" alt="NPM Downloads" /></a>
<a href="https://handfish.github.io/ajel" target="_blank"><img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white" /></a>
<a href="https://github.com/Handfish/ajel" target="_blank"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</p>



# [ajel](https://handfish.github.io/ajel)

### Installation

`yarn add ajel eslint-plugin-ajel`

`pnpm add ajel eslint-plugin-ajel`


### Basic Example
```typescript
// Handling async functions that throw
import { ajel } from 'ajel';

async function main() {
  const result = await ajel(Promise.resolve('hello world'));

	// Accessing result before narrowing union type throws eslint error
  // console.log(result);

  if (result instanceof Error) {
    // This return narrows the type of result to its Result
    return;
  }

  return result;
}
```

```typescript
// Handling syncronous functions that throw
import { sjel } from 'ajel';

async function main() {
  const result = await sjel(JSON.parse, "{}");

	// Accessing result before narrowing union type throws eslint error
  // console.log(result);

  if (result instanceof Error) {
    // This return narrows the type of result to its Result
    return;
  }

  return result;
}
```

`ajel` and `sjel` are thin wrappers for try-catch, coupled with eslint rules to encourage better error handling.

### Basic eslintrc

```javascript
{
  plugins: ['ajel'],
  extends: [
    'plugin:ajel/recommended',
  ],
}
```

#### More Advanced Example
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
