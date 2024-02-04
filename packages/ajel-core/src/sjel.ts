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
