import { configureAgent, OpenAIAgent, Tool } from '../src';

// Define a simple calculator tool
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

// Example usage
async function runCalculatorExample() {
  // Configure the agent with your API key and the calculator tool
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    tools: [calculatorTool],
    callbacks: {
      onAgentStart: ({ input }) => console.log(`Agent starting with input: ${input}`),
      onToolStart: ({ name, input }) => console.log(`Using tool: ${name} with input:`, input),
      onToolEnd: ({ name, output }) => console.log(`Tool ${name} returned: ${output}`),
      onAgentEnd: ({ finalAnswer }) => console.log(`Agent finished with answer: ${finalAnswer}`)
    }
  });

  try {
    // Run the agent with a prompt that should trigger the calculator tool
    const result = await OpenAIAgent.run(
      "I need to calculate 125 * 37. Can you help me with that?"
    );
    
    console.log("Final result:", result);
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runCalculatorExample().catch(console.error);
}

export { calculatorTool };
