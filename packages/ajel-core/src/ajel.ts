/* eslint-disable ajel/ajel-disable-try-catch */
export const ajel = async <Result, ErrorType = Error>(
  promise: Promise<Result>
): Promise<Result | ErrorType> => {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    return error as ErrorType;
  }
};
