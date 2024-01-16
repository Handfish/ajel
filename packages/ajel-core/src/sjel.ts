export const sjel =
  <Args extends any[], Result>(fn: (...args: Args) => Result) =>
    (...args: Args) => {
      try {
        const result = fn(...args);
        return [result, undefined] as [Result, undefined];
      } catch (error) {
        return [undefined, error] as [undefined, unknown];
      }
    };
