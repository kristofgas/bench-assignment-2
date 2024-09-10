import { CommandErrorCode, SwaggerException } from "./client.generated";

export const isSwaggerException = SwaggerException.isSwaggerException;

interface BackendCommandException {
  type: string;
  title: string;
  status: number;
  commandErrorCodes: Record<CommandErrorCode, string[]>;
}

/**
 * example:
 * ```typescript
 * const exampleFunc = async () => {
 *   const client = await genApiClient();
 *   try {
 *     await client.example_postThatThrows({ data: "example" });
 *   }
 *   catch (error) {
 *     if (isSwaggerException(error)) {
 *       const commandErrors = getCommandErrorCodesFromSwaggerException(error);
 *       // Do what you want the error codes...
 *     }
 *     else {
 *       console.error("unknown error happened on backend", error)
 *     }
 *   }
 * }
 * ```
 * @param error
 * @returns
 */
export const getCommandErrorCodesFromSwaggerException = (
  error: SwaggerException
): Readonly<CommandErrorCode[]> => {
  const parsedError = JSON.parse(error.response) as BackendCommandException;

  const result = Object.keys(parsedError.commandErrorCodes).map(
    (x) => Number(x) as CommandErrorCode
  );

  return result;
};
