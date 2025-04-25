# HELSE Forward Setup Guide

This guide will walk you through the process of setting up and using HELSE Forward in your project. Follow these steps to get started with building AI-powered applications with agentic capabilities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Basic Setup](#basic-setup)
- [Creating Your First Agent](#creating-your-first-agent)
- [Adding Custom Tools](#adding-custom-tools)
- [Advanced Configuration](#advanced-configuration)
- [Complete Example Project](#complete-example-project)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have the following:

- Node.js (version 16.x or higher)
- npm, yarn, or pnpm
- An OpenAI API key (get one from [OpenAI's website](https://platform.openai.com/api-keys))

## Installation

You can install HELSE Forward using npm, yarn, or pnpm:

```bash
# Using npm
npm install @dem1989/forward

# Using yarn
yarn add @dem1989/forward

# Using pnpm
pnpm add @dem1989/forward
```

## Basic Setup

After installing the package, you need to configure the agent with your OpenAI API key. Create a new file (e.g., `index.js` or `index.ts`) and add the following code:

```typescript
// Import the necessary components from HELSE Forward
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Configure the agent with your OpenAI API key
configureAgent({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

// Basic function to run the agent
async function runAgent() {
  try {
    const result = await ForwardAgent.run('What is the capital of France?');
    console.log('Agent response:', result);
  } catch (error) {
    console.error('Error running agent:', error);
  }
}

// Run the function
runAgent();
```

To run this code, make sure your OpenAI API key is available as an environment variable. You can set it in a `.env` file (using a package like `dotenv`) or export it directly in your terminal:

```bash
# Using dotenv (.env file)
OPENAI_API_KEY=your-api-key-here

# Or in terminal (Linux/macOS)
export OPENAI_API_KEY=your-api-key-here

# Or in terminal (Windows)
set OPENAI_API_KEY=your-api-key-here
```

## Creating Your First Agent

Let's create a more comprehensive example with observability callbacks to monitor the agent's behavior:

```typescript
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Configure the agent with callbacks for observability
configureAgent({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4o', // You can specify which model to use
  callbacks: {
    onAgentStart: ({ input }) => console.log(`🚀 Agent starting with input: ${input}`),
    onLLMStart: ({ model }) => console.log(`🧠 Using model: ${model}`),
    onLLMEnd: ({ response }) => console.log(`✅ Received response from LLM`),
    onAgentEnd: ({ finalAnswer }) => console.log(`🏁 Agent finished with answer: ${finalAnswer.substring(0, 50)}...`),
    onAgentError: ({ error, stage }) => console.error(`❌ Error in ${stage}: ${error.message}`),
  },
});

// Create a function to summarize text
async function summarizeText() {
  const longText = `
    Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.
    AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
    The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving".
    This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.
  `;

  try {
    console.log('Original text:', longText);
    console.log('\nGenerating summary...\n');

    const summary = await ForwardAgent.summarize(longText, {
      length: 'short', // Options: 'short', 'medium', 'long'
    });

    console.log('Summary:', summary);
  } catch (error) {
    console.error('Error generating summary:', error);
  }
}

// Run the function
summarizeText();
```

## Adding Custom Tools

One of the most powerful features of HELSE Forward is the ability to create custom tools that extend the agent's capabilities. Here's how to create and use a custom tool:

```typescript
import { configureAgent, ForwardAgent, Tool } from '@dem1989/forward';

// Define a custom calculator tool
const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Performs basic arithmetic calculations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'The arithmetic operation to perform'
      },
      a: {
        type: 'number',
        description: 'The first number'
      },
      b: {
        type: 'number',
        description: 'The second number'
      }
    },
    required: ['operation', 'a', 'b']
  },
  execute: async (input) => {
    const { operation, a, b } = input;

    let result: number;
    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) {
          throw new Error('Division by zero is not allowed');
        }
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return `The result of ${a} ${operation} ${b} is ${result}`;
  }
};

// Define a weather tool (mock implementation)
const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Gets the current weather for a location',
  inputSchema: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and/or country'
      }
    },
    required: ['location']
  },
  execute: async (input) => {
    const { location } = input;

    // In a real implementation, you would call a weather API
    // This is just a mock response
    const mockWeatherData = {
      'New York': { temp: 72, condition: 'Sunny' },
      'London': { temp: 62, condition: 'Cloudy' },
      'Tokyo': { temp: 80, condition: 'Clear' },
      'Paris': { temp: 68, condition: 'Partly Cloudy' },
    };

    const defaultWeather = { temp: 70, condition: 'Unknown' };
    const weather = mockWeatherData[location] || defaultWeather;

    return `The current weather in ${location} is ${weather.condition} with a temperature of ${weather.temp}°F.`;
  }
};

// Configure the agent with the custom tools
configureAgent({
  apiKey: process.env.OPENAI_API_KEY,
  tools: [calculatorTool, weatherTool],
  callbacks: {
    onAgentStart: ({ input }) => console.log(`🚀 Agent starting with input: ${input}`),
    onToolStart: ({ name, input }) => console.log(`🔧 Using tool: ${name} with input:`, input),
    onToolEnd: ({ name, output }) => console.log(`✅ Tool ${name} returned: ${output}`),
    onAgentEnd: ({ finalAnswer }) => console.log(`🏁 Agent finished with answer: ${finalAnswer}`),
  }
});

// Run the agent with a prompt that should trigger tool usage
async function runAgentWithTools() {
  try {
    // This prompt should trigger the calculator tool
    const result1 = await ForwardAgent.run(
      "I need to calculate 125 * 37. Can you help me with that?"
    );
    console.log("\nResult 1:", result1);

    // This prompt should trigger the weather tool
    const result2 = await ForwardAgent.run(
      "What's the weather like in Tokyo today?"
    );
    console.log("\nResult 2:", result2);

    // This prompt should trigger both tools
    const result3 = await ForwardAgent.run(
      "If it's 62 degrees in London and 80 degrees in Tokyo, what's the difference between these temperatures?"
    );
    console.log("\nResult 3:", result3);
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

// Run the function
runAgentWithTools();
```

## Advanced Configuration

HELSE Forward offers advanced configuration options for more control over the agent's behavior:

```typescript
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Advanced configuration
configureAgent({
  apiKey: process.env.OPENAI_API_KEY,

  // Custom endpoint (useful for proxies or local models)
  modelEndpoint: 'https://your-custom-endpoint.com/v1',

  // Default model settings
  defaultModel: 'gpt-4-turbo',
  defaultParameters: {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.95,
  },

  // System prompt to guide the agent's behavior
  systemPrompt: `You are an AI assistant specialized in providing concise, accurate information.
  Always cite your sources when providing factual information.
  When using tools, make sure to interpret the results correctly.`,

  // Comprehensive callbacks
  callbacks: {
    onAgentStart: ({ input }) => {
      console.log(`Agent started with input: ${input}`);
      // You could log to a database or monitoring service here
    },
    onLLMStart: ({ model, prompt, params }) => {
      console.log(`Using model: ${model}`);
      // You could track token usage here
    },
    onLLMEnd: ({ response }) => {
      // Process or analyze the LLM's response
    },
    onToolStart: ({ name, input }) => {
      console.log(`Using tool: ${name}`);
      // Track tool usage metrics
    },
    onToolEnd: ({ name, output }) => {
      // Analyze tool output
    },
    onObservation: ({ content }) => {
      // Process intermediate observations
    },
    onAgentEnd: ({ finalAnswer }) => {
      console.log(`Agent finished`);
      // Store the final answer in a database
    },
    onAgentError: ({ error, stage }) => {
      console.error(`Error in ${stage}: ${error.message}`);
      // Report errors to your error tracking service
    }
  }
});
```

## Complete Example Project

Here's a complete example project structure that demonstrates how to use HELSE Forward in a real application:

### Project Structure

```
my-ai-assistant/
├── src/
│   ├── index.ts         # Main entry point
│   ├── config.ts        # Configuration
│   ├── tools/
│   │   ├── index.ts     # Tool exports
│   │   ├── calculator.ts
│   │   ├── weather.ts
│   │   └── translator.ts
│   └── handlers/
│       ├── summarize.ts
│       └── suggestions.ts
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

### config.ts

```typescript
import { configureAgent } from '@dem1989/forward';
import { calculatorTool } from './tools/calculator';
import { weatherTool } from './tools/weather';
import { translatorTool } from './tools/translator';

export function initializeAgent() {
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-4o',
    tools: [calculatorTool, weatherTool, translatorTool],
    callbacks: {
      onAgentStart: ({ input }) => console.log(`🚀 Agent starting: ${input}`),
      onToolStart: ({ name }) => console.log(`🔧 Using tool: ${name}`),
      onAgentEnd: ({ finalAnswer }) => console.log(`✅ Agent finished`),
      onAgentError: ({ error, stage }) => console.error(`❌ Error in ${stage}: ${error.message}`),
    }
  });

  console.log('HELSE Forward agent initialized successfully');
}
```

### tools/calculator.ts

```typescript
import { Tool } from '@dem1989/forward';

export const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Performs basic arithmetic calculations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'The arithmetic operation to perform'
      },
      a: { type: 'number', description: 'The first number' },
      b: { type: 'number', description: 'The second number' }
    },
    required: ['operation', 'a', 'b']
  },
  execute: async (input) => {
    const { operation, a, b } = input;

    let result: number;
    switch (operation) {
      case 'add': result = a + b; break;
      case 'subtract': result = a - b; break;
      case 'multiply': result = a * b; break;
      case 'divide':
        if (b === 0) throw new Error('Division by zero is not allowed');
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return `The result of ${a} ${operation} ${b} is ${result}`;
  }
};
```

### handlers/summarize.ts

```typescript
import { ForwardAgent } from '@dem1989/forward';

export async function summarizeText(text: string, length: 'short' | 'medium' | 'long' = 'medium') {
  try {
    console.log(`Generating ${length} summary...`);

    const summary = await ForwardAgent.summarize(text, { length });

    return {
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

### index.ts

```typescript
import dotenv from 'dotenv';
import { ForwardAgent } from '@dem1989/forward';
import { initializeAgent } from './config';
import { summarizeText } from './handlers/summarize';

// Load environment variables
dotenv.config();

// Initialize the agent
initializeAgent();

async function main() {
  // Example 1: Basic question answering
  console.log('\n--- Example 1: Basic Question Answering ---\n');
  const answer = await ForwardAgent.run('What are the three laws of thermodynamics?');
  console.log('Answer:', answer);

  // Example 2: Using the summarize feature
  console.log('\n--- Example 2: Text Summarization ---\n');
  const longText = `
    Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.
    AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
    The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving".
    This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.
  `;
  const summaryResult = await summarizeText(longText, 'short');
  console.log('Summary result:', summaryResult);

  // Example 3: Using tools
  console.log('\n--- Example 3: Using Tools ---\n');
  const toolResult = await ForwardAgent.run(
    "I need to calculate 125 * 37 and then translate the result to Spanish."
  );
  console.log('Tool result:', toolResult);
}

// Run the main function
main().catch(console.error);
```

## Troubleshooting

### Common Issues and Solutions

1. **API Key Issues**

   **Problem**: Error message about invalid API key or authentication failure.

   **Solution**: Double-check that your OpenAI API key is correct and properly set as an environment variable. Make sure there are no extra spaces or characters.

2. **Rate Limiting**

   **Problem**: You're getting rate limit errors from the OpenAI API.

   **Solution**: Implement retry logic with exponential backoff, or reduce the frequency of your API calls. Consider upgrading your OpenAI plan if you need higher rate limits.

3. **Tool Execution Errors**

   **Problem**: Tools are failing to execute properly.

   **Solution**: Make sure your tool's `execute` function handles errors properly and returns meaningful error messages. Check that the input schema matches what your function expects.

4. **Memory Issues**

   **Problem**: Your application is using too much memory with large conversations.

   **Solution**: Implement conversation summarization or truncation to limit the context size. Only keep the most relevant parts of the conversation history.

### Getting Help

If you encounter issues not covered here, you can:

- Check the [GitHub repository](https://github.com/DEM1989/helse-agentic-library/issues) for existing issues
- Join our [Discord community](https://discord.gg/helse) for real-time help
- Submit a detailed bug report with steps to reproduce the issue

## Next Steps

Now that you've set up HELSE Forward, you might want to explore:

- Creating more complex tools that integrate with external APIs
- Implementing conversation memory to maintain context across multiple interactions
- Building a web interface for your AI assistant
- Fine-tuning the agent's behavior with custom system prompts

For more examples and advanced usage, check out the [examples directory](https://github.com/DEM1989/helse-agentic-library/tree/main/examples) in the GitHub repository.
