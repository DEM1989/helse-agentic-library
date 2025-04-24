/**
 * Helse Agentic Writing Library - Examples
 *
 * This file provides a simple CLI to run the different examples.
 *
 * Usage:
 *   npm run examples
 *   npm run examples -- calculator
 *   npm run examples -- writing
 *   npm run examples -- web-search
 *   npm run examples -- text-analysis
 *   npm run examples -- translation
 *   npm run examples -- multi-tool
 */

import { runCalculatorExample } from './calculator-tool';
import { runWebSearchExample } from './web-search-tool';
import { runTextAnalysisExample } from './text-analysis-tool';
import { runTranslationExample } from './translation-tool';
import { runMultiToolExample } from './multi-tool-example';
import { runWritingSuggestionsExample } from './writing-suggestions';

// Map of example names to their run functions
const examples: Record<string, () => Promise<void>> = {
  'calculator': runCalculatorExample,
  'writing': runWritingSuggestionsExample,
  'web-search': runWebSearchExample,
  'text-analysis': runTextAnalysisExample,
  'translation': runTranslationExample,
  'multi-tool': runMultiToolExample
};

// Get the example name from command line arguments
const exampleName = process.argv[2]?.toLowerCase();

async function main() {
  console.log('Helse Agentic Writing Library - Examples\n');

  // If no example name is provided, show the list of available examples
  if (!exampleName) {
    console.log('Available examples:');
    Object.keys(examples).forEach(name => {
      console.log(`  - ${name}`);
    });
    console.log('\nRun an example with: npm run examples -- <example-name>');
    return;
  }

  // Run the specified example
  const runExample = examples[exampleName];
  if (runExample) {
    console.log(`Running the "${exampleName}" example...\n`);
    try {
      await runExample();
    } catch (error) {
      console.error('Error running example:', error);
    }
  } else {
    console.error(`Unknown example: ${exampleName}`);
    console.log('Available examples:', Object.keys(examples).join(', '));
  }
}

// Run the main function
main().catch(console.error);
