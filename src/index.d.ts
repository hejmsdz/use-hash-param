/**
 * @param key The parameter-name to use from the hash-string query string.
 * @param defaultValue A default value to use if the parameter is not specified and on the server.
 * @returns A two-tuple, the first element is the selected param value (either extracted from the hash param or the default value).
 *  The second element is a setter function to change the param value.
 */
export default function useHashParam(
  key: string,
  defaultValue: string
): [string, (value: string) => void];
