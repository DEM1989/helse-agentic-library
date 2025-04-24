import OpenAI from 'openai';

/**
 * Defines the structure for input arguments passed to a tool.
 */
export interface ToolInput {
  [key: string]: any;
}

/**
 * Represents an external tool that the agent can use.
 */
export interface Tool {
  /** Unique name for the tool */
  name: string;
  /** Clear description for the AI to understand when to use the tool */
  description: string;
  /** Optional JSON schema defining the expected input arguments (OpenAI compatible) */
  inputSchema?: OpenAI.Chat.Completions.ChatCompletionTool['function']['parameters'];
  /** The asynchronous function that executes the tool's logic */
  execute: (input: ToolInput) => Promise<string>;
}

// --- Callback Data Payloads ---

export interface AgentStartData { input: string; }
export interface LLMStartData { prompt: any; model: string; params: Record<string, any>; }
export interface LLMEndData { response: any; }
export interface ToolStartData { name: string; input: ToolInput; }
export interface ToolEndData { name: string; output: string; }
export interface ObservationData { content: string; }
export interface AgentEndData { finalAnswer: string; }
export interface AgentErrorData { error: Error; stage: string; }

/**
 * Defines the optional callback functions for observing the agent's lifecycle.
 */
export interface AgentCallbacks {
  onAgentStart?: (data: AgentStartData) => Promise<void> | void;
  onLLMStart?: (data: LLMStartData) => Promise<void> | void;
  onLLMEnd?: (data: LLMEndData) => Promise<void> | void;
  onToolStart?: (data: ToolStartData) => Promise<void> | void;
  onToolEnd?: (data: ToolEndData) => Promise<void> | void;
  onObservation?: (data: ObservationData) => Promise<void> | void;
  onAgentEnd?: (data: AgentEndData) => Promise<void> | void;
  onAgentError?: (data: AgentErrorData) => Promise<void> | void;
}

/**
 * Configuration options for the agent.
 */
export interface AgentConfig {
  /** OpenAI API Key or key for another supported LLM provider */
  apiKey?: string;
  /** Custom endpoint for LLM API (e.g., for local models) */
  modelEndpoint?: string;
  /** Default LLM model to use */
  defaultModel?: string;
  /** Default parameters for the LLM (e.g., temperature) */
  defaultParameters?: Record<string, any>;
  /** List of available tools for the agent */
  tools?: Tool[];
  /** Callback functions for observability */
  callbacks?: AgentCallbacks;
  /** Optional system prompt to guide the agent's behavior */
  systemPrompt?: string;
}

/**
 * Represents the parsed action the LLM wants to take.
 */
export type ParsedLLMAction =
  | { type: 'tool_call'; toolName: string; arguments: ToolInput; toolCallId?: string; /* Optional: useful for some models */ }
  | { type: 'final_answer'; content: string; }
  | { type: 'error'; message: string; };

/**
 * Represents a writing suggestion provided by the agent.
 */
export interface WritingSuggestion {
  /** The type of suggestion (e.g., grammar, style, clarity) */
  type: 'grammar' | 'style' | 'clarity' | 'conciseness' | 'tone' | 'other';
  /** The original text that the suggestion applies to */
  originalText: string;
  /** The suggested replacement text */
  suggestedText: string;
  /** Optional explanation for why this suggestion is being made */
  explanation?: string;
  /** Optional confidence score (0-1) for the suggestion */
  confidence?: number;
  /** Optional position information */
  position?: {
    startIndex: number;
    endIndex: number;
  };
}