export const ajel = <Result>(promise: Promise<Result>) =>
  promise.then(Array.of).catch((error) => [undefined, error]) as Promise<
    [result?: Result, error?: unknown]
  >;
