import { AgentConfig, Tool } from './types';

/**
 * Safely triggers an optional callback function, handling both sync and async callbacks.
 * Logs an error to the console if the callback throws an exception.
 *
 * @param callback The callback function to trigger (if provided).
 * @param data The data payload to pass to the callback.
 */
export async function triggerCallback<T>(
    callback: ((data: T) => Promise<void> | void) | undefined,
    data: T
): Promise<void> {
    if (callback) {
        try {
            // Use Promise.resolve() to handle both synchronous functions and Promises gracefully
            await Promise.resolve(callback(data));
        } catch (error) {
            console.error("Error executing agent callback:", error instanceof Error ? error.message : error);
            // Depending on desired behavior, you might want to:
            // - Re-throw the error
            // - Trigger the onAgentError callback if available
            // - Silently ignore it (as implemented here, just logging)
        }
    }
}

/**
 * Finds a tool by name from a list of tools.
 *
 * @param name The name of the tool to find.
 * @param tools The list of available tools.
 * @returns The tool object if found, otherwise undefined.
 */
export function findTool(name: string, tools?: AgentConfig['tools']): Tool | undefined {
    return tools?.find((tool: Tool) => tool.name === name);
}