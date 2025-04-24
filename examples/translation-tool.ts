import { configureAgent, ForwardAgent, Tool } from '../src';

// Define a translation tool that translates text between languages
const translationTool: Tool = {
  name: 'translate_text',
  description: 'Translate text from one language to another',
  inputSchema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'The text to translate'
      },
      sourceLanguage: {
        type: 'string',
        description: 'The source language (e.g., "English", "Spanish", "auto" for automatic detection)'
      },
      targetLanguage: {
        type: 'string',
        description: 'The target language to translate to (e.g., "French", "Japanese")'
      },
      preserveFormatting: {
        type: 'boolean',
        description: 'Whether to preserve the original formatting (default: true)'
      }
    },
    required: ['text', 'targetLanguage']
  },
  execute: async (input) => {
    const { 
      text, 
      sourceLanguage = 'auto', 
      targetLanguage, 
      preserveFormatting = true 
    } = input;
    
    // In a real implementation, this would call a translation API
    // For this example, we'll simulate translation with a mock implementation
    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Get the translation
      const translatedText = mockTranslate(text, sourceLanguage, targetLanguage);
      
      // Format the response
      let result = `Translation (${sourceLanguage === 'auto' ? 'detected language' : sourceLanguage} → ${targetLanguage}):\n\n`;
      result += translatedText;
      
      if (sourceLanguage === 'auto') {
        // In a real implementation, we would return the detected language
        const detectedLanguage = detectLanguage(text);
        result += `\n\nDetected source language: ${detectedLanguage}`;
      }
      
      return result;
    } catch (error) {
      return `Translation error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
};

// Mock translation function
function mockTranslate(text: string, sourceLanguage: string, targetLanguage: string): string {
  // This is a very simple mock implementation that doesn't actually translate
  // In a real implementation, you would use a translation API or library
  
  // Check if the target language is supported
  const supportedLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Russian', 'Japanese', 'Chinese', 'Korean',
    'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Greek'
  ];
  
  const normalizedTarget = targetLanguage.toLowerCase();
  const isSupported = supportedLanguages.some(lang => lang.toLowerCase() === normalizedTarget);
  
  if (!isSupported) {
    throw new Error(`Unsupported target language: ${targetLanguage}`);
  }
  
  // For demonstration purposes, we'll add some language-specific modifications
  // to simulate translation
  switch (normalizedTarget) {
    case 'spanish':
      return addSpanishFlavor(text);
    case 'french':
      return addFrenchFlavor(text);
    case 'german':
      return addGermanFlavor(text);
    case 'japanese':
      return addJapaneseFlavor(text);
    default:
      // For other languages, just add a note that this is a mock translation
      return `${text}\n\n[Note: This is a mock translation to ${targetLanguage}. In a real implementation, the text would be properly translated.]`;
  }
}

// Helper function to detect the language of a text
function detectLanguage(text: string): string {
  // This is a very simple mock implementation
  // In a real implementation, you would use a language detection API or library
  
  // Check for some common words or patterns to guess the language
  const lowerText = text.toLowerCase();
  
  if (/\b(the|and|is|in|to|of|that|for|it|with)\b/.test(lowerText)) {
    return 'English';
  } else if (/\b(el|la|los|las|es|en|y|que|de|por|con)\b/.test(lowerText)) {
    return 'Spanish';
  } else if (/\b(le|la|les|et|est|en|que|pour|dans|ce|cette)\b/.test(lowerText)) {
    return 'French';
  } else if (/\b(der|die|das|und|ist|in|zu|den|dem|mit|für)\b/.test(lowerText)) {
    return 'German';
  } else {
    // Default fallback
    return 'Unknown';
  }
}

// Helper functions to add language-specific flavor to text
function addSpanishFlavor(text: string): string {
  // Replace some common English words with Spanish equivalents
  return text
    .replace(/\bthe\b/gi, 'el')
    .replace(/\bis\b/gi, 'es')
    .replace(/\band\b/gi, 'y')
    .replace(/\bof\b/gi, 'de')
    .replace(/\bin\b/gi, 'en')
    .replace(/\bto\b/gi, 'a')
    .replace(/\bfor\b/gi, 'para')
    .replace(/\bwith\b/gi, 'con')
    .replace(/\bhello\b/gi, '¡Hola!')
    .replace(/\bgoodbye\b/gi, '¡Adiós!')
    .replace(/\bthank you\b/gi, 'Gracias')
    .replace(/\byes\b/gi, 'Sí')
    .replace(/\bno\b/gi, 'No')
    .replace(/\?/g, '¿?');
}

function addFrenchFlavor(text: string): string {
  // Replace some common English words with French equivalents
  return text
    .replace(/\bthe\b/gi, 'le')
    .replace(/\bis\b/gi, 'est')
    .replace(/\band\b/gi, 'et')
    .replace(/\bof\b/gi, 'de')
    .replace(/\bin\b/gi, 'dans')
    .replace(/\bto\b/gi, 'à')
    .replace(/\bfor\b/gi, 'pour')
    .replace(/\bwith\b/gi, 'avec')
    .replace(/\bhello\b/gi, 'Bonjour')
    .replace(/\bgoodbye\b/gi, 'Au revoir')
    .replace(/\bthank you\b/gi, 'Merci')
    .replace(/\byes\b/gi, 'Oui')
    .replace(/\bno\b/gi, 'Non');
}

function addGermanFlavor(text: string): string {
  // Replace some common English words with German equivalents
  return text
    .replace(/\bthe\b/gi, 'die')
    .replace(/\bis\b/gi, 'ist')
    .replace(/\band\b/gi, 'und')
    .replace(/\bof\b/gi, 'von')
    .replace(/\bin\b/gi, 'in')
    .replace(/\bto\b/gi, 'zu')
    .replace(/\bfor\b/gi, 'für')
    .replace(/\bwith\b/gi, 'mit')
    .replace(/\bhello\b/gi, 'Hallo')
    .replace(/\bgoodbye\b/gi, 'Auf Wiedersehen')
    .replace(/\bthank you\b/gi, 'Danke')
    .replace(/\byes\b/gi, 'Ja')
    .replace(/\bno\b/gi, 'Nein');
}

function addJapaneseFlavor(text: string): string {
  // For Japanese, we'll just add some Japanese particles and words
  // This is not a real translation, just a demonstration
  return `${text}\n\n[日本語翻訳] ${text.replace(/\./g, 'です。').replace(/\?/g, 'ですか？')}`;
}

// Example usage
async function runTranslationExample() {
  // Configure the agent with your API key and the translation tool
  configureAgent({
    apiKey: process.env.OPENAI_API_KEY,
    tools: [translationTool],
    callbacks: {
      onAgentStart: ({ input }) => console.log(`Agent starting with input: ${input}`),
      onToolStart: ({ name, input }) => console.log(`Using tool: ${name} with languages: ${input.sourceLanguage || 'auto'} → ${input.targetLanguage}`),
      onToolEnd: ({ name, output }) => console.log(`Tool ${name} returned translation`),
      onAgentEnd: ({ finalAnswer }) => console.log(`Agent finished with answer: ${finalAnswer.substring(0, 100)}...`)
    }
  });

  try {
    // Run the agent with a prompt that should trigger the translation tool
    const result = await ForwardAgent.run(
      "Can you translate this text to Spanish? 'Hello, my name is John. I am learning about artificial intelligence and language models. It's very interesting!'"
    );
    
    console.log("\nFinal result:", result);
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runTranslationExample().catch(console.error);
}

export { translationTool };
