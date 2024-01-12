import { ResultAsync } from 'neverthrow';
import fs from 'fs';

//---
// ajel implementation
export const ajel = <Result>(promise: Promise<Result>) =>
  promise.then(Array.of).catch((error) => [, error]) as Promise<
    [result?: Result, error?: unknown]
  >;



//---
// Fib test implementation
// Fibonacci calculation (CPU-bound task)
async function calculateFibonacciAsync(n: number): Promise<number> {
  return new Promise<number>((resolve) => {
    resolve(fibonacci(n));
  });
}

// Fibonacci calculation (CPU-bound task)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}


// Fibonacci calculation (CPU-bound task)
async function createAndDeleteFilesAsync(n: number, nameToken: string): Promise<number> {
  return new Promise<number>((resolve) => {
    resolve(createAndDeleteFiles(n, nameToken));
  });
}

export async function tryAsyncGoFib(n: number) {
  const [res, err] = await ajel(
    calculateFibonacciAsync(n)
  );
  if (err instanceof Error && !res) {
    return err
  }

  return res;
};

export async function tryTryCatchFib(n: number) {
  let res: number;

  try {
    res = await calculateFibonacciAsync(n)
  }
  catch (e) {
    return e
  }

  return res;
};

export async function tryNeverthrowFib(n: number) {
  const res = await ResultAsync.fromPromise(calculateFibonacciAsync(n), () => new Error('Error'))

  if (res.isErr()) {
    return res.error;
  } else {
    return res.value;
  }
}



//---
// File test implementation
function createAndDeleteFiles(i: number, nameToken: string) {
  for (let count = 0; count < i; count++) {
    // Generate random content for the file
    const content = Buffer.alloc(500 * 1024, 'a'); // 500KB of 'a'

    // Write the file
    const fileName = `file_${nameToken}.txt`;
    fs.writeFileSync(fileName, content);

    // Delete the file
    fs.unlinkSync(fileName);
  }

  return 1;
}

export async function tryAsyncGoFile(n: number) {
  const [res, err] = await ajel(
    createAndDeleteFilesAsync(n, "A")
  );
  if (err instanceof Error && !res) {
    return err
  }

  return res;
};

export async function tryTryCatchFile(n: number) {
  let res: number;

  try {
    res = await createAndDeleteFilesAsync(n, "B")
  }
  catch (e) {
    return e
  }

  return res;
};

export async function tryNeverthrowFile(n: number) {
  const res = await ResultAsync.fromPromise(createAndDeleteFilesAsync(n, "C"), () => new Error('Error'))

  if (res.isErr()) {
    return res.error;
  } else {
    return res.value;
  }
}
