import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Define the structure for the main documentation sidebar
  tutorialSidebar: [
    // Link to the index/overview page
    'index', // Corresponds to documentation/index.md
    // Link to the quick start guide
    'quick-start', // Corresponds to documentation/quick-start.md
    // Category for Core Concepts
    {
      type: 'category',
      label: 'Core Concepts',
      link: {
        type: 'generated-index', // Optional: Auto-generate an index page for this category
        // title: 'Core Concepts Overview', // Optional title for the index page
        // description: 'Learn about the main concepts in Forward', // Optional description
      },
      items: [
        'concepts/agent', // Corresponds to documentation/concepts/agent.md
        'concepts/tools',
        'concepts/observability',
        'concepts/configuration',
      ],
    },
    // Link to the setup guide
    'setup-guide',
    {
      type: 'category',
      label: 'Community',
      link: { type: 'generated-index' }, // Optional index page for community links
      items: [
        'contributing',
        'reporting-issues',
        // Add link to Code of Conduct if desired
        // { 
        //   type: 'link',
        //   label: 'Code of Conduct',
        //   href: 'https://github.com/DEM1989/helse-agentic-library/blob/main/CODE_OF_CONDUCT.md',
        // },
      ]
    },
    // TODO: Add link to API reference later
    // Link to Changelog page
    'changelog',
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
