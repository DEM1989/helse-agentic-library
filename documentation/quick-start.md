---
sidebar_position: 2
sidebar_label: Quick Start
---

# Quick Start

This guide will get you up and running with Forward in just a few minutes.

## Installation

First, install the package using your preferred package manager:

```bash
npm install @dem1989/forward
# or
yarn add @dem1989/forward
# or
pnpm add @dem1989/forward
```

## Configuration

You'll need an OpenAI API key. You can get one from the [OpenAI website](https://platform.openai.com/api-keys).

Set your API key as an environment variable named `OPENAI_API_KEY`.

## Basic Usage

Create a new TypeScript file (e.g., `example.ts`) and add the following code:

```typescript
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Configure the agent with your OpenAI API key
// It automatically reads from process.env.OPENAI_API_KEY
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
  console.log("\nSuggestions:", suggestions);
}

run().catch(console.error);
```

## Running the Example

Compile and run the file:

```bash
# Make sure OPENAI_API_KEY is set in your environment
npx ts-node example.ts
```

You should see output from the agent, including the summary and writing suggestions! 