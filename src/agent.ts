import OpenAI from 'openai';
import {
    AgentConfig,
    ToolInput,
    AgentStartData,
    LLMStartData,
    LLMEndData,
    ToolStartData,
    ToolEndData,
    ObservationData,
    AgentEndData,
    AgentErrorData,
    WritingSuggestion
} from './types';
import { triggerCallback, findTool } from './utils';

// Global configuration store
let agentConfig: AgentConfig = {
    defaultModel: 'gpt-4o', // Default model
    defaultParameters: { temperature: 0.7 },
    tools: [],
    callbacks: {},
};

let openaiClient: OpenAI | null = null;

/**
 * Configures the agent globally.
 * @param config - The configuration options for the agent.
 */
export function configureAgent(config: AgentConfig): void {
    agentConfig = { ...agentConfig, ...config };

    // Initialize OpenAI client if API key is provided
    if (agentConfig.apiKey) {
        openaiClient = new OpenAI({ apiKey: agentConfig.apiKey });
    } else {
        openaiClient = null;
        console.warn("OpenAI API key not configured. Agent operations requiring LLM will fail.");
    }
    // TODO: Add support for modelEndpoint configuration (e.g., for local models/proxies)
}

/**
 * Main agent class for interacting with language models and tools.
 * @internal This class is exported only for documentation purposes.
 */
export class AgentImplementation {
    /**
     * Runs the agent with a given input, potentially using tools.
     * @param input - The user's request or prompt.
     * @param maxTurns - Maximum number of LLM <-> Tool interactions to prevent infinite loops.
     * @returns The final answer from the agent.
     */
    async run(input: string, maxTurns: number = 5): Promise<string> {
        if (!openaiClient) {
            throw new Error("Agent is not configured with an API key. Call configureAgent first.");
        }

        const callbacks = agentConfig.callbacks ?? {};
        let finalAnswer = "";
        // Use OpenAI message format
        const conversationHistory: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        try {
            await triggerCallback<AgentStartData>(callbacks.onAgentStart, { input });

            // Add optional system prompt
            if (agentConfig.systemPrompt) {
                conversationHistory.push({ role: 'system', content: agentConfig.systemPrompt });
            }
            // Add initial user input
            conversationHistory.push({ role: 'user', content: input });

            // --- Agent Loop ---
            for (let turn = 0; turn < maxTurns; turn++) {
                const model = agentConfig.defaultModel ?? 'gpt-4o';
                const params = agentConfig.defaultParameters ?? {};
                // Format tools for OpenAI API
                const defaultToolSchema: OpenAI.Chat.Completions.ChatCompletionTool['function']['parameters'] = { type: 'object', properties: {} };
                const tools = agentConfig.tools?.map(tool => ({
                    type: 'function' as const, // Ensure type is literal
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: tool.inputSchema ?? defaultToolSchema, // Use compliant default
                    },
                })) ?? [];

                await triggerCallback<LLMStartData>(callbacks.onLLMStart, { prompt: conversationHistory, model, params });

                const response = await openaiClient.chat.completions.create({
                    model: model,
                    messages: conversationHistory,
                    tools: tools.length > 0 ? tools : undefined,
                    tool_choice: tools.length > 0 ? 'auto' : undefined,
                    ...params,
                });

                await triggerCallback<LLMEndData>(callbacks.onLLMEnd, { response });

                const message = response.choices[0]?.message;
                if (!message) {
                    throw new Error("No message received from LLM.");
                }

                // Add LLM response to history
                conversationHistory.push(message);

                if (message.tool_calls && message.tool_calls.length > 0) {
                    // --- Tool Call Handling ---
                    for (const toolCall of message.tool_calls) {
                         if (toolCall.type !== 'function') continue; // Only handle function calls for now

                        const toolName = toolCall.function.name;
                        let toolArgs: ToolInput = {};
                        try {
                            toolArgs = JSON.parse(toolCall.function.arguments || '{}');
                        } catch (parseError) {
                            const errorMsg = `Failed to parse arguments for tool ${toolName}: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
                            await triggerCallback<AgentErrorData>(callbacks.onAgentError, { error: new Error(errorMsg), stage: 'tool_args_parse' });
                            conversationHistory.push({ role: 'tool', tool_call_id: toolCall.id, content: `Error: ${errorMsg}`});
                            continue; // Skip this tool call
                        }

                        const tool = findTool(toolName, agentConfig.tools);

                        if (!tool) {
                            const errorMsg = `LLM tried to call unknown tool: ${toolName}`;
                            await triggerCallback<AgentErrorData>(callbacks.onAgentError, { error: new Error(errorMsg), stage: 'tool_find' });
                            conversationHistory.push({ role: 'tool', tool_call_id: toolCall.id, content: `Error: ${errorMsg}`});
                            continue; // Try next tool call or let LLM proceed
                        }

                        await triggerCallback<ToolStartData>(callbacks.onToolStart, { name: tool.name, input: toolArgs });
                        try {
                            const toolOutput = await tool.execute(toolArgs);
                            await triggerCallback<ToolEndData>(callbacks.onToolEnd, { name: tool.name, output: toolOutput });

                            // Use output directly as content for the tool message
                            await triggerCallback<ObservationData>(callbacks.onObservation, { content: toolOutput });
                            conversationHistory.push({ role: 'tool', tool_call_id: toolCall.id, content: toolOutput });
                        } catch (error: any) {
                            const errorMsg = `Error executing tool ${tool.name}: ${error.message}`;
                            await triggerCallback<AgentErrorData>(callbacks.onAgentError, { error, stage: 'tool_execute' });
                            conversationHistory.push({ role: 'tool', tool_call_id: toolCall.id, content: `Error: ${errorMsg}`});
                        }
                    }
                    // Continue loop to let LLM process tool results
                } else if (message.content) {
                    // --- Final Answer ---
                    finalAnswer = message.content;
                    break; // Exit loop, we have the answer
                } else if (turn === maxTurns -1 && !finalAnswer) {
                   // If it's the last turn and still no answer or tool call, break
                   break;
                } else {
                    // If no content and no tool calls, and not the last turn,
                    // it might be an unexpected state or the model wants to implicitly end.
                    // Consider adding a placeholder message or specific error handling.
                     console.warn("LLM response had no content or tool calls. Turn:", turn);
                    // Let the loop continue; maybe the next turn yields something.
                     // Alternatively, you could throw an error here:
                    // throw new Error("LLM response was empty or missing expected content/tool calls.");
                }
            }
            // --- End Agent Loop ---

            if (!finalAnswer) {
                finalAnswer = "Agent could not reach a final answer within the turn limit.";
                // Optionally, extract the last assistant message as a potential partial answer
                const lastAssistantMsg = conversationHistory.filter(m => m.role === 'assistant' && typeof m.content === 'string').pop();
                if(lastAssistantMsg?.content && typeof lastAssistantMsg.content === 'string') finalAnswer = lastAssistantMsg.content;
            }

            await triggerCallback<AgentEndData>(callbacks.onAgentEnd, { finalAnswer });
            return finalAnswer;

        } catch (error: any) {
            const stage = error.stage || 'agent_run'; // Try to get stage from error if available
            await triggerCallback<AgentErrorData>(callbacks.onAgentError, { error, stage });
            // Re-throw the error so the caller can handle it
            throw new Error(`Agent run failed on stage '${stage}': ${error.message}`);
        }
    }

    /**
     * Summarizes the given text using the agent.
     * This is a simplified example; could involve more specific prompting.
     */
    async summarize(text: string, options?: { length?: 'short' | 'medium' | 'long'; model?: string }): Promise<string> {
         if (!openaiClient) throw new Error("Agent not configured with API key.");

         const model = options?.model ?? agentConfig.defaultModel ?? 'gpt-4o';
         const prompt = `Summarize the following text ${options?.length ? `to a ${options.length} length` : ''}:

---
${text}
---

Summary:`;

         const callbacks = agentConfig.callbacks ?? {};
         await triggerCallback<AgentStartData>(callbacks.onAgentStart, { input: `Summarize text (length: ${options?.length ?? 'default'})` });

         try {
             const response = await openaiClient.chat.completions.create({
                 model: model,
                 messages: [{ role: 'user', content: prompt }],
                 temperature: agentConfig.defaultParameters?.temperature ?? 0.5,
                 n: 1,
             });
             const summary = response.choices[0]?.message?.content?.trim() ?? "";
             await triggerCallback<AgentEndData>(callbacks.onAgentEnd, { finalAnswer: summary });
             return summary;
         } catch (error: any) {
              await triggerCallback<AgentErrorData>(callbacks.onAgentError, { error, stage: 'summarize' });
              throw new Error(`Summarization failed: ${error.message}`);
         }
    }

    /**
     * Analyzes text and provides writing improvement suggestions.
     * @param text - The text to analyze for writing suggestions.
     * @param options - Optional configuration for the analysis.
     * @returns An array of writing suggestions.
     */
    async getWritingSuggestions(
        text: string,
        options?: {
            types?: Array<'grammar' | 'style' | 'clarity' | 'conciseness' | 'tone'>,
            model?: string,
            maxSuggestions?: number
        }
    ): Promise<WritingSuggestion[]> {
        if (!openaiClient) {
            throw new Error("Agent is not configured with an API key. Call configureAgent first.");
        }

        const model = options?.model ?? agentConfig.defaultModel ?? 'gpt-4o';
        const maxSuggestions = options?.maxSuggestions ?? 5;
        const types = options?.types ?? ['grammar', 'style', 'clarity', 'conciseness', 'tone'];

        const callbacks = agentConfig.callbacks ?? {};
        await triggerCallback<AgentStartData>(callbacks.onAgentStart, {
            input: `Analyze text for writing suggestions (types: ${types.join(', ')})`
        });

        const systemPrompt = `You are a professional writing assistant. Analyze the provided text and suggest improvements.
        Focus on the following aspects: ${types.join(', ')}.
        Provide up to ${maxSuggestions} high-quality suggestions.
        Format your response as a JSON array of objects with the following structure:
        [
          {
            "type": "grammar", // One of: grammar, style, clarity, conciseness, tone, other
            "originalText": "the text to be replaced",
            "suggestedText": "the improved text",
            "explanation": "brief explanation of why this change improves the writing",
            "confidence": 0.9 // A number between 0 and 1 indicating your confidence in this suggestion
          }
        ]
        Only include suggestions that would genuinely improve the text. If you can't find any issues, return an empty array.`;

        try {
            const response = await openaiClient.chat.completions.create({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.3, // Lower temperature for more consistent suggestions
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content?.trim() ?? "[]";
            let suggestions: WritingSuggestion[] = [];

            try {
                const parsed = JSON.parse(content);
                suggestions = Array.isArray(parsed) ? parsed : parsed.suggestions || [];

                // Validate and clean up suggestions
                suggestions = suggestions
                    .filter(s => s && typeof s === 'object' && s.originalText && s.suggestedText)
                    .map(s => ({
                        type: s.type && ['grammar', 'style', 'clarity', 'conciseness', 'tone', 'other'].includes(s.type)
                            ? s.type as WritingSuggestion['type']
                            : 'other',
                        originalText: String(s.originalText),
                        suggestedText: String(s.suggestedText),
                        explanation: s.explanation ? String(s.explanation) : undefined,
                        confidence: typeof s.confidence === 'number' ? Math.min(Math.max(s.confidence, 0), 1) : undefined,
                        position: s.position && typeof s.position === 'object' ? s.position : undefined
                    }));
            } catch (parseError) {
                await triggerCallback<AgentErrorData>(callbacks.onAgentError, {
                    error: new Error(`Failed to parse writing suggestions: ${parseError instanceof Error ? parseError.message : String(parseError)}`),
                    stage: 'parse_suggestions'
                });
                // Return empty array on parse error
                suggestions = [];
            }

            await triggerCallback<AgentEndData>(callbacks.onAgentEnd, {
                finalAnswer: `Generated ${suggestions.length} writing suggestions`
            });

            return suggestions;
        } catch (error: any) {
            await triggerCallback<AgentErrorData>(callbacks.onAgentError, { error, stage: 'writing_suggestions' });
            throw new Error(`Failed to generate writing suggestions: ${error.message}`);
        }
    }
}

// Export a singleton instance of the agent class
export const ForwardAgent = new AgentImplementation();