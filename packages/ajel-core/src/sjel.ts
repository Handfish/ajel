/* eslint-disable ajel/ajel-disable-try-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */

// type AnyFunction = (...args: any[]) => any;

// export const sjel =
//   <Result>(fn: AnyFunction) =>
//   (...args: any[]) => {
//     try {
//       const result = fn(...args);
//       return [result, undefined] as [result: Result, error?: undefined];
//     } catch (error) {
//       return [undefined, error] as [result: undefined, error: unknown];
//     }
//   };
// export const sjel =
//   <Args extends any[], Result>(fn: (...args: Args) => Result) =>
//     (...args: Args) => {
//       try {
//         const result = fn(...args);
//         return [result, undefined] as [Result, undefined];
//       } catch (error) {
//         return [undefined, error] as [undefined, unknown];
//       }
//     };

// Example usage:
// const [result, error] = sjel(JSON.parse)(5);

// export const sjel =
//   <Args extends any[], Result, ErrorType = Error>(fn: (...args: Args) => Result) =>
//     async (...args: Args): Promise<Result | ErrorType> => {
//       try {
//         const result = await fn(...args);
//         return result;
//       } catch (error) {
//         return error as ErrorType;
//       }
//     };

// Example usage:
// const result = await sjel(JSON.parse)('5');
// const data = await sjel(fs.readFileSync)(path, { encoding: 'utf8' });

/* eslint-disable ajel/ajel-disable-try-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const sjel = <Args extends any[], Result, ErrorType = Error>(
  fn: (...args: Args) => Result,
  ...args: Args
): Result | ErrorType => {
  try {
    const result = fn(...args);
    return result;
  } catch (error) {
    return error as ErrorType;
  }
};

// Example usage:
// const result = await sjel(JSON.parse, '5');
// const data = await sjel(fs.readFileSync, path, { encoding: 'utf8' });
