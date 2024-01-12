type AnyFunction = (...args: any[]) => any;

export const sjel = <Result>(fn: AnyFunction) => (...args: any[]) => {
  try {
    const result = fn(...args);
    return [result, undefined] as [result: Result, error?: undefined];
  } catch (error) {
    return [undefined, error] as [result: undefined, error: unknown];
  }
};
