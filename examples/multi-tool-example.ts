import { configureAgent, ForwardAgent } from '../src';
import { calculatorTool } from './calculator-tool';
import { webSearchTool } from './web-search-tool';
import { textAnalysisTool } from './text-analysis-tool';
import { translationTool } from './translation-tool';

/**
 * This example demonstrates how to use multiple tools together with the agent.
 * It configures the agent with all the example tools and shows how the agent
 * can choose the appropriate tool based on the user's request.
 */
async function runMultiToolExample() {
  // Configure the agent with all the example tools
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    tools: [
      calculatorTool,
      webSearchTool,
      textAnalysisTool,
      translationTool
    ],
    // Add a system prompt to guide the agent's behavior
    systemPrompt: `You are a helpful assistant with access to several tools:
    - A calculator for mathematical operations
    - A web search tool to find information
    - A text analysis tool for readability metrics
    - A translation tool for language translation
    
    Use these tools appropriately based on the user's request. Be concise but thorough in your responses.`,
    callbacks: {
      onAgentStart: ({ input }) => console.log(`\n🚀 Agent starting with input: ${input}`),
      onLLMStart: ({ model }) => console.log(`🧠 Using model: ${model}`),
      onToolStart: ({ name, input }) => console.log(`🔧 Using tool: ${name}`),
      onToolEnd: ({ name, output }) => console.log(`✅ Tool ${name} completed`),
      onAgentEnd: ({ finalAnswer }) => console.log(`🏁 Agent finished\n`)
    }
  });

  // Array of example prompts that should trigger different tools
  const examplePrompts = [
    "What is 345 * 27?",
    "Can you find information about quantum computing?",
    "Analyze this text for readability: 'The quick brown fox jumps over the lazy dog. This sentence is often used as a typing test because it contains all the letters of the English alphabet.'",
    "Translate 'Hello, how are you today?' to French.",
    "I need to calculate the area of a circle with radius 5 cm, and then translate the result to Spanish."
  ];

  try {
    // Run the agent with each example prompt
    for (let i = 0; i < examplePrompts.length; i++) {
      const prompt = examplePrompts[i];
      console.log(`\n📝 EXAMPLE ${i + 1}: "${prompt}"\n`);
      
      const result = await ForwardAgent.run(prompt);
      
      console.log(`\nResult: ${result}\n`);
      console.log("------------------------------------------------");
    }
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runMultiToolExample().catch(console.error);
}

// Export the example function
export { runMultiToolExample };
