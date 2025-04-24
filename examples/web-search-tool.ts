import { configureAgent, ForwardAgent, Tool } from '../src';

// Define a web search tool that simulates searching the web
const webSearchTool: Tool = {
  name: 'web_search',
  description: 'Search the web for information on a specific topic or query',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query'
      },
      numResults: {
        type: 'number',
        description: 'Number of results to return (default: 3)'
      }
    },
    required: ['query']
  },
  execute: async (input) => {
    const { query, numResults = 3 } = input;
    
    // In a real implementation, this would call a search API
    // For this example, we'll simulate search results
    console.log(`Searching for: "${query}" (${numResults} results)`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results based on the query
    const results = generateMockSearchResults(query, numResults);
    
    return formatSearchResults(results);
  }
};

// Helper function to generate mock search results
function generateMockSearchResults(query: string, numResults: number) {
  const baseResults = [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
      snippet: `${query} is a topic of significant interest in various fields. It has been studied extensively by researchers around the world...`
    },
    {
      title: `Understanding ${query} - A Comprehensive Guide`,
      url: `https://example.com/guides/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
      snippet: `This comprehensive guide explains everything you need to know about ${query}, including its history, applications, and future developments.`
    },
    {
      title: `Latest Research on ${query} - Science Daily`,
      url: `https://www.sciencedaily.com/search/?keyword=${encodeURIComponent(query)}`,
      snippet: `Recent studies have revealed new insights into ${query}. Scientists at leading universities have discovered...`
    },
    {
      title: `${query} Explained Simply - For Beginners`,
      url: `https://beginners-guide.com/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
      snippet: `New to ${query}? This beginner-friendly explanation breaks down complex concepts into easy-to-understand language.`
    },
    {
      title: `The Future of ${query} - Trends and Predictions`,
      url: `https://future-trends.org/topics/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
      snippet: `Experts predict that ${query} will continue to evolve in the coming years. Here are the top trends to watch...`
    }
  ];
  
  // Return the requested number of results (or all if fewer are available)
  return baseResults.slice(0, Math.min(numResults, baseResults.length));
}

// Helper function to format search results
function formatSearchResults(results: Array<{ title: string, url: string, snippet: string }>) {
  let formattedResults = `Found ${results.length} results:\n\n`;
  
  results.forEach((result, index) => {
    formattedResults += `${index + 1}. ${result.title}\n`;
    formattedResults += `   URL: ${result.url}\n`;
    formattedResults += `   ${result.snippet}\n\n`;
  });
  
  return formattedResults;
}

// Example usage
async function runWebSearchExample() {
  // Configure the agent with your API key and the web search tool
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    tools: [webSearchTool],
    callbacks: {
      onAgentStart: ({ input }) => console.log(`Agent starting with input: ${input}`),
      onToolStart: ({ name, input }) => console.log(`Using tool: ${name} with input:`, input),
      onToolEnd: ({ name, output }) => console.log(`Tool ${name} returned results (length: ${output.length} chars)`),
      onAgentEnd: ({ finalAnswer }) => console.log(`Agent finished with answer: ${finalAnswer.substring(0, 100)}...`)
    }
  });

  try {
    // Run the agent with a prompt that should trigger the web search tool
    const result = await ForwardAgent.run(
      "I need to learn about quantum computing. Can you search for some information about it?"
    );
    
    console.log("\nFinal result:", result);
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runWebSearchExample().catch(console.error);
}

export { webSearchTool };
