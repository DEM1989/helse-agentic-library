<div align="center">
  <!-- Add logo if available, e.g., from website/static/img/logo.svg, adjusting path -->
  <!-- <img src="./website/static/img/logo.svg" alt="Forward Logo" width="150"> -->
  <h1>Forward</h1>
  <p><strong>An advanced TypeScript framework for building agentic AI applications</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@dem1989/forward"><img src="https://img.shields.io/npm/v/@dem1989/forward.svg?style=flat-square" alt="npm version"></a>
    <a href="https://github.com/DEM1989/helse-agentic-library/actions?query=workflow%3ACI"><img src="https://img.shields.io/github/actions/workflow/status/DEM1989/helse-agentic-library/ci.yml?branch=main&style=flat-square" alt="Build Status"></a>
    <a href="https://github.com/DEM1989/helse-agentic-library/blob/main/LICENSE"><img src="https://img.shields.io/github/license/DEM1989/helse-agentic-library?style=flat-square" alt="License"></a>
    <!-- Add other badges if desired, e.g., coverage -->
  </p>
</div>

Forward is a powerful TypeScript framework for building AI-powered applications with agentic capabilities. It provides a robust foundation for creating AI assistants that can use tools, make decisions, and interact with users in a natural way.

**✨ [Explore the Full Documentation Website](https://dem1989.github.io/helse-agentic-library/) ✨**

## Key Features

- 🧠 **AI-Powered Assistance** - Leverage large language models for writing, summarization, and more
- 🛠️ **Extensible Tool System** - Create custom tools that your AI agent can use to accomplish tasks
- 📊 **Comprehensive Observability** - Monitor and debug your agent's behavior with detailed callbacks
- 🔄 **Flexible Conversation Flow** - Control the interaction between the agent, tools, and user
- 📝 **Writing Enhancement** - Get intelligent suggestions to improve your writing
- 🔍 **Type Safety** - Full TypeScript support with detailed type definitions

## Installation

```bash
npm install @dem1989/forward
```

## Quick Look

```typescript
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Configure with API key (from process.env.OPENAI_API_KEY)
configureAgent({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const answer = await ForwardAgent.run(
    "What is the capital of France?"
  );
  console.log(answer);
}

main();
```

## Documentation

For detailed guides, tutorials, and API references, please visit the **[Full Documentation Website](https://dem1989.github.io/helse-agentic-library/)**.

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://dem1989.github.io/helse-agentic-library/docs/contributing) on the documentation site.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details. 