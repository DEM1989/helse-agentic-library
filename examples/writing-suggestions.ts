import { configureAgent, ForwardAgent, WritingSuggestion } from '../src';

// Example usage of the writing suggestions feature
async function runWritingSuggestionsExample() {
  // Configure the agent with your API key
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    callbacks: {
      onAgentStart: ({ input }) => console.log(`Agent starting: ${input}`),
      onAgentEnd: ({ finalAnswer }) => console.log(`Agent finished: ${finalAnswer}`)
    }
  });

  // Sample text with various writing issues
  const sampleText = `
    The company have been experiencing rapid growth in recent years.
    This growth has lead to many challenges, including the need to hire more staff,
    find bigger office space, and also the implementation of new systems and processes.
    Despite these challenges, the company is committed to maintaining it's high standards of quality and customer service.
    We believe that our customers are the most important aspect of our business, and we strive to ensure that they are satisfied with our products and services.
    In conclusion, the company is well-positioned for continued growth and success in the future, despite the challenges that we face.
  `;

  try {
    console.log("Analyzing text for writing suggestions...");
    console.log("Original text:", sampleText);
    console.log("-----------------------------------");

    // Get writing suggestions
    const suggestions = await ForwardAgent.getWritingSuggestions(sampleText, {
      types: ['grammar', 'style', 'conciseness'],
      maxSuggestions: 5
    });

    console.log(`Found ${suggestions.length} suggestions:`);

    // Display each suggestion
    suggestions.forEach((suggestion: WritingSuggestion, index: number) => {
      console.log(`\nSuggestion ${index + 1} (${suggestion.type}):`);
      console.log(`Original: "${suggestion.originalText}"`);
      console.log(`Suggested: "${suggestion.suggestedText}"`);
      if (suggestion.explanation) {
        console.log(`Explanation: ${suggestion.explanation}`);
      }
      if (suggestion.confidence) {
        console.log(`Confidence: ${suggestion.confidence.toFixed(2)}`);
      }
    });

  } catch (error) {
    console.error("Error getting writing suggestions:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runWritingSuggestionsExample().catch(console.error);
}

export { runWritingSuggestionsExample };
