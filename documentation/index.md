---
sidebar_position: 1
sidebar_label: Overview
---

# Overview

Forward is a powerful TypeScript framework for building AI-powered applications with agentic capabilities. It provides a robust foundation for creating AI assistants that can use tools, make decisions, and interact with users in a natural way.

## Key Features

- 🧠 **AI-Powered Assistance** - Leverage large language models for writing, summarization, and more
- 🛠️ **Extensible Tool System** - Create custom tools that your AI agent can use to accomplish tasks
- 📊 **Comprehensive Observability** - Monitor and debug your agent's behavior with detailed callbacks
- 🔄 **Flexible Conversation Flow** - Control the interaction between the agent, tools, and user
- 📝 **Writing Enhancement** - Get intelligent suggestions to improve your writing
- 🔍 **Type Safety** - Full TypeScript support with detailed type definitions

## Installation

Forward is available as an npm package. You can install it using npm, yarn, or pnpm:

```bash
npm install @dem1989/forward
# or
yarn add @dem1989/forward
# or
pnpm add @dem1989/forward
```

> **Note:** You'll need an OpenAI API key to use Forward. You can get one from the [OpenAI website](https://platform.openai.com/api-keys).

### TypeScript Configuration

Forward is written in TypeScript and includes type definitions. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "moduleResolution": "node"
    // ... other options
  }
}
```

## Next Steps

*   Check out the [Quick Start](./quick-start) guide.
*   Learn about the [Core Concepts](./concepts/agent).
*   Explore the [API Reference](/api-docs/index.html) (coming soon).
*   See the [Examples](https://github.com/DEM1989/helse-agentic-library/tree/main/examples) on GitHub.
