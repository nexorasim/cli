/**
 * Safely parses a JSON string without throwing an error.
 * @param jsonString The JSON string to parse.
 * @returns A tuple [error, data]. If parsing is successful, error is null. If it fails, data is null.
 */
export const safeJsonParse = (jsonString: string): [error: Error | null, data: any] => {
  try {
    // Attempt to handle cases where Gemini returns a markdown-style JSON block
    const processedString = jsonString.startsWith('```json') 
        ? jsonString.replace(/^```json\s*/, '').replace(/```$/, '') 
        : jsonString;
    const data = JSON.parse(processedString);
    return [null, data];
  } catch (error) {
    if (error instanceof Error) {
      return [error, null];
    }
    return [new Error('An unknown parsing error occurred.'), null];
  }
};
