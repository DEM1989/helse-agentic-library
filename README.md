<div align="center">
  <img src="./assets/logo.svg" alt="HELSE Forward Logo" width="200" height="200">
  <h1>HELSE Forward</h1>
  <p><strong>An advanced TypeScript framework for building agentic AI applications with tool usage and observability</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@dem1989/forward"><img src="https://img.shields.io/npm/v/@dem1989/forward.svg?style=flat-square" alt="npm version"></a>
    <a href="https://github.com/DEM1989/helse-agentic-library/actions"><img src="https://img.shields.io/github/workflow/status/DEM1989/helse-agentic-library/CI?style=flat-square" alt="Build Status"></a>
    <a href="https://github.com/DEM1989/helse-agentic-library/blob/main/LICENSE"><img src="https://img.shields.io/github/license/DEM1989/helse-agentic-library?style=flat-square" alt="License"></a>
    <a href="https://github.com/DEM1989/helse-agentic-library/stargazers"><img src="https://img.shields.io/github/stars/DEM1989/helse-agentic-library?style=flat-square" alt="GitHub Stars"></a>
  </p>
</div>

## Overview

HELSE Forward is a powerful TypeScript framework for building AI-powered applications with agentic capabilities. It provides a robust foundation for creating AI assistants that can use tools, make decisions, and interact with users in a natural way.

## Key Features

- 🧠 **AI-Powered Assistance** - Leverage large language models for writing, summarization, and more
- 🛠️ **Extensible Tool System** - Create custom tools that your AI agent can use to accomplish tasks
- 📊 **Comprehensive Observability** - Monitor and debug your agent's behavior with detailed callbacks
- 🔄 **Flexible Conversation Flow** - Control the interaction between the agent, tools, and user
- 📝 **Writing Enhancement** - Get intelligent suggestions to improve your writing
- 🔍 **Type Safety** - Full TypeScript support with detailed type definitions

## Installation

HELSE Forward is available as an npm package. You can install it using npm, yarn, or pnpm:

```bash
npm install @dem1989/forward
# or
yarn add @dem1989/forward
# or
pnpm add @dem1989/forward
```

> **Note:** You'll need an OpenAI API key to use HELSE Forward. You can get one from the [OpenAI website](https://platform.openai.com/api-keys).

### TypeScript Configuration

HELSE Forward is written in TypeScript and includes type definitions. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "moduleResolution": "node",
    // ... other options
  }
}
```

## Quick Start

```typescript
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Configure the agent with your OpenAI API key
configureAgent({
  apiKey: process.env.OPENAI_API_KEY,
  callbacks: {
    onAgentStart: ({ input }) => console.log(`🚀 Agent starting: ${input}`),
    onToolStart: ({ name }) => console.log(`🔧 Using tool: ${name}`),
    onAgentEnd: ({ finalAnswer }) => console.log(`✅ Agent finished`)
  }
});

async function run() {
  // Use the agent to answer a question
  const result = await ForwardAgent.run(
    "Summarize the main points of the concept of 'agentic AI'."
  );
  console.log("Result:", result);

  // Get writing suggestions for a text
  const suggestions = await ForwardAgent.getWritingSuggestions(
    "The company have been experiencing rapid growth in recent years."
  );

  // Display the suggestions
  suggestions.forEach(suggestion => {
    console.log(`\n${suggestion.type} suggestion:`);
    console.log(`Original: "${suggestion.originalText}"`);
    console.log(`Improved: "${suggestion.suggestedText}"`);
  });
}

run().catch(console.error);
```

## Core Concepts

### The Agent

The central component of HELSE Forward is the `ForwardAgent`, which orchestrates interactions between the user, the language model, and tools. It handles:

- Processing user inputs
- Deciding when to use tools
- Managing the conversation flow
- Providing final responses

### Tools

Tools extend the agent's capabilities by allowing it to perform specific actions. Each tool has:

- A unique name and description
- An input schema defining expected parameters
- An execution function that performs the actual work

### Observability

HELSE Forward provides comprehensive observability through callbacks at every stage of the agent's lifecycle, making it easy to monitor, debug, and log the agent's behavior.

## Configuration

Use the `configureAgent` function to set up the framework with your preferred configuration:

```typescript
import { configureAgent } from '@dem1989/forward';

configureAgent({
  // Required: Your OpenAI API key
  apiKey: process.env.OPENAI_API_KEY,

  // Optional: Custom endpoint for the LLM API (e.g., for proxies or local models)
  modelEndpoint: 'https://your-custom-endpoint.com/v1',

  // Optional: Default model to use (defaults to 'gpt-4o')
  defaultModel: 'gpt-4-turbo',

  // Optional: Default parameters for the LLM
  defaultParameters: {
    temperature: 0.7,
    max_tokens: 1000
  },

  // Optional: List of tools the agent can use
  tools: [
    {
      name: 'calculator',
      description: 'Performs basic arithmetic calculations',
      inputSchema: {
        type: 'object',
        properties: {
          operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide'] },
          a: { type: 'number' },
          b: { type: 'number' }
        },
        required: ['operation', 'a', 'b']
      },
      execute: async (input) => {
        // Implementation of the calculator tool
        const { operation, a, b } = input;
        let result;

        switch (operation) {
          case 'add': result = a + b; break;
          case 'subtract': result = a - b; break;
          case 'multiply': result = a * b; break;
          case 'divide': result = a / b; break;
          default: throw new Error(`Unknown operation: ${operation}`);
        }

        return `The result of ${a} ${operation} ${b} is ${result}`;
      }
    }
  ],

  // Optional: Callback functions for observability
  callbacks: {
    onAgentStart: ({ input }) => console.log(`Agent starting with: ${input}`),
    onLLMStart: ({ model }) => console.log(`Using model: ${model}`),
    onToolStart: ({ name, input }) => console.log(`Using tool: ${name}`),
    onToolEnd: ({ name, output }) => console.log(`Tool ${name} returned: ${output}`),
    onAgentEnd: ({ finalAnswer }) => console.log(`Agent finished: ${finalAnswer}`),
    onAgentError: ({ error, stage }) => console.error(`Error in ${stage}: ${error.message}`)
  },

  // Optional: System prompt to guide the agent's behavior
  systemPrompt: 'You are a helpful AI assistant specializing in writing assistance.'
});
```

## API Reference

### ForwardAgent

The main interface for interacting with the agent.

#### `run(input: string, maxTurns?: number): Promise<string>`

Runs the agent with a given input, potentially using tools.

- `input`: The user's request or prompt.
- `maxTurns`: Maximum number of LLM <-> Tool interactions to prevent infinite loops. Default: 5.
- Returns: The final answer from the agent.

```typescript
const answer = await ForwardAgent.run("What is the square root of 144?");
```

#### `summarize(text: string, options?: { length?: 'short' | 'medium' | 'long'; model?: string }): Promise<string>`

Summarizes the given text using the agent.

- `text`: The text to summarize.
- `options.length`: Optional length preference for the summary.
- `options.model`: Optional model to use for this specific request.
- Returns: The generated summary.

```typescript
const summary = await ForwardAgent.summarize(longText, { length: 'short' });
```

#### `getWritingSuggestions(text: string, options?: { types?: Array<'grammar' | 'style' | 'clarity' | 'conciseness' | 'tone'>; model?: string; maxSuggestions?: number }): Promise<WritingSuggestion[]>`

Analyzes text and provides writing improvement suggestions.

- `text`: The text to analyze for writing suggestions.
- `options.types`: Types of suggestions to focus on. Default: all types.
- `options.model`: Optional model to use for this specific request.
- `options.maxSuggestions`: Maximum number of suggestions to return. Default: 5.
- Returns: An array of writing suggestions.

```typescript
const suggestions = await ForwardAgent.getWritingSuggestions(myText, {
  types: ['grammar', 'conciseness'],
  maxSuggestions: 3
});
```

### Tool Interface

Tools allow the agent to perform specific actions or access external functionality.

```typescript
interface Tool {
  // Unique name for the tool
  name: string;

  // Clear description for the AI to understand when to use the tool
  description: string;

  // Optional JSON schema defining the expected input arguments (OpenAI compatible)
  inputSchema?: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };

  // The asynchronous function that executes the tool's logic
  execute: (input: any) => Promise<string>;
}
```

See the [examples directory](./examples) for sample tool implementations.

## Examples

Check out the [examples directory](./examples) for complete working examples:

- [Calculator Tool](./examples/calculator-tool.ts): Demonstrates how to create and use a simple arithmetic tool.
- [Writing Suggestions](./examples/writing-suggestions.ts): Shows how to use the writing suggestions feature.
- [Web Search Tool](./examples/web-search-tool.ts): Simulates searching the web for information.
- [Text Analysis Tool](./examples/text-analysis-tool.ts): Analyzes text for readability metrics and statistics.
- [Translation Tool](./examples/translation-tool.ts): Translates text between different languages.
- [Multi-Tool Example](./examples/multi-tool-example.ts): Shows how to use multiple tools together in a single agent.

## Development

### Prerequisites

- Node.js 16.x or higher
- npm, yarn, or pnpm
- An OpenAI API key

### Setup

```bash
# Clone the repository
git clone https://github.com/DEM1989/helse-agentic-library.git
cd helse-agentic-library

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run examples
npm run examples
```

## Contributing

We welcome contributions to HELSE Forward! Whether it's bug reports, feature requests, or code contributions, we appreciate your help in making this framework better.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct

We are committed to fostering an open and welcoming environment. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating in our project.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the API that powers this framework
- All the contributors who have helped shape this project

---

<div align="center">
  <p>Made with ❤️</p>
  <p>
    <a href="https://github.com/DEM1989/helse-agentic-library/stargazers">⭐ Star us on GitHub</a> •
    <a href="https://www.npmjs.com/package/@dem1989/forward">📦 View on npm</a>
  </p>
</div>