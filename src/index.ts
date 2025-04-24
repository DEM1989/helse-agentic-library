// src/index.ts

// Export the main configuration function
export { configureAgent } from './agent';

// Export the agent instance
export { OpenAIAgent } from './agent';

// Export core types for users (configuration, tools, callbacks)
export type {
    AgentConfig,
    Tool,
    ToolInput,
    AgentCallbacks,
    AgentStartData,
    LLMStartData,
    LLMEndData,
    ToolStartData,
    ToolEndData,
    ObservationData,
    AgentEndData,
    AgentErrorData
} from './types'; 