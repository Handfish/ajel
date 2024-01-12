import fs from 'fs';

type AnyFunction = (...args: any[]) => any;

export const sjel = <Result>(fn: AnyFunction) => (...args: any[]) => {
  try {
    const result = fn(...args);
    return [result, undefined] as [result: Result, error?: undefined];
  } catch (error) {
    return [undefined, error] as [result: undefined, error: unknown];
  }
};

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

export async function trySjelFile(n: number) {
  const [res, err] = sjel(
    createAndDeleteFiles
  )(n, "A");
  if (err instanceof Error && !res) {
    return err
  }

  return res;
};

export async function tryTryCatchFile(n: number) {
  let res: number;

  try {
    res = createAndDeleteFiles(n, "B")
  }
  catch (e) {
    return e
  }

  return res;
};

