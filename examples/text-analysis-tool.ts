import { configureAgent, OpenAIAgent, Tool } from '../src';

// Define a text analysis tool that provides readability metrics
const textAnalysisTool: Tool = {
  name: 'analyze_text',
  description: 'Analyze text for readability metrics, word count, and other statistics',
  inputSchema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'The text to analyze'
      },
      includeReadability: {
        type: 'boolean',
        description: 'Whether to include readability scores (default: true)'
      },
      includeWordFrequency: {
        type: 'boolean',
        description: 'Whether to include word frequency analysis (default: false)'
      }
    },
    required: ['text']
  },
  execute: async (input) => {
    const { text, includeReadability = true, includeWordFrequency = false } = input;
    
    // Basic text statistics
    const wordCount = countWords(text);
    const sentenceCount = countSentences(text);
    const characterCount = text.length;
    const paragraphCount = countParagraphs(text);
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
    
    let result = `Text Analysis Results:\n\n`;
    result += `Word count: ${wordCount}\n`;
    result += `Sentence count: ${sentenceCount}\n`;
    result += `Character count: ${characterCount}\n`;
    result += `Paragraph count: ${paragraphCount}\n`;
    result += `Average words per sentence: ${avgWordsPerSentence.toFixed(1)}\n`;
    
    // Readability metrics
    if (includeReadability) {
      const fleschReadingEase = calculateFleschReadingEase(text, wordCount, sentenceCount);
      const fleschKincaidGrade = calculateFleschKincaidGrade(text, wordCount, sentenceCount);
      
      result += `\nReadability Metrics:\n`;
      result += `Flesch Reading Ease: ${fleschReadingEase.toFixed(1)} - ${interpretFleschScore(fleschReadingEase)}\n`;
      result += `Flesch-Kincaid Grade Level: ${fleschKincaidGrade.toFixed(1)}\n`;
    }
    
    // Word frequency analysis
    if (includeWordFrequency) {
      const wordFrequency = calculateWordFrequency(text);
      const topWords = getTopWords(wordFrequency, 10);
      
      result += `\nMost Frequent Words:\n`;
      topWords.forEach((word, index) => {
        result += `${index + 1}. "${word.word}" - ${word.count} occurrences\n`;
      });
    }
    
    return result;
  }
};

// Helper functions for text analysis

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countSentences(text: string): number {
  // Simple sentence counting based on punctuation
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
}

function countParagraphs(text: string): number {
  return text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length || 1;
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  // Special cases
  if (word.length <= 3) return 1;
  
  // Count vowel groups as syllables
  const vowels = 'aeiouy';
  let count = 0;
  let prevIsVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }
  
  // Adjust for silent 'e' at the end
  if (word.length > 2 && word.endsWith('e') && !vowels.includes(word[word.length - 2])) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(count, 1);
}

function calculateFleschReadingEase(text: string, wordCount: number, sentenceCount: number): number {
  // Flesch Reading Ease = 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)
  
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  let totalSyllables = 0;
  
  words.forEach(word => {
    totalSyllables += countSyllables(word);
  });
  
  const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
  const avgSyllablesPerWord = totalSyllables / Math.max(wordCount, 1);
  
  return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
}

function calculateFleschKincaidGrade(text: string, wordCount: number, sentenceCount: number): number {
  // Flesch-Kincaid Grade Level = 0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59
  
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  let totalSyllables = 0;
  
  words.forEach(word => {
    totalSyllables += countSyllables(word);
  });
  
  const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
  const avgSyllablesPerWord = totalSyllables / Math.max(wordCount, 1);
  
  return 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
}

function interpretFleschScore(score: number): string {
  if (score >= 90) return "Very Easy to Read";
  if (score >= 80) return "Easy to Read";
  if (score >= 70) return "Fairly Easy to Read";
  if (score >= 60) return "Standard/Plain English";
  if (score >= 50) return "Fairly Difficult to Read";
  if (score >= 30) return "Difficult to Read";
  return "Very Difficult to Read";
}

function calculateWordFrequency(text: string): Map<string, number> {
  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const frequency = new Map<string, number>();
  
  // Common English stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 
    'has', 'had', 'do', 'does', 'did', 'but', 'or', 'if', 'then', 'else', 
    'when', 'up', 'down', 'this', 'that', 'these', 'those', 'it', 'its'
  ]);
  
  words.forEach(word => {
    if (!stopWords.has(word) && word.length > 1) {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    }
  });
  
  return frequency;
}

function getTopWords(wordFrequency: Map<string, number>, count: number): Array<{word: string, count: number}> {
  return Array.from(wordFrequency.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
}

// Example usage
async function runTextAnalysisExample() {
  // Configure the agent with your API key and the text analysis tool
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    tools: [textAnalysisTool],
    callbacks: {
      onAgentStart: ({ input }) => console.log(`Agent starting with input: ${input}`),
      onToolStart: ({ name, input }) => console.log(`Using tool: ${name} with input text length: ${input.text.length} chars`),
      onToolEnd: ({ name, output }) => console.log(`Tool ${name} returned results`),
      onAgentEnd: ({ finalAnswer }) => console.log(`Agent finished with answer: ${finalAnswer.substring(0, 100)}...`)
    }
  });

  // Sample text to analyze
  const sampleText = `
    Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. 
    AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
    
    The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.
    
    AI applications include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, automated decision-making, and competing at the highest level in strategic game systems. As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect.
  `;

  try {
    // Run the agent with a prompt that should trigger the text analysis tool
    const result = await OpenAIAgent.run(
      `Can you analyze this text for readability and provide word frequency analysis?
      
      ${sampleText}`
    );
    
    console.log("\nFinal result:", result);
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runTextAnalysisExample().catch(console.error);
}

export { textAnalysisTool };
