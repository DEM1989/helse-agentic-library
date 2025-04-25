import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {useColorMode} from '@docusaurus/theme-common';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const {colorMode} = useColorMode();
  const isDarkTheme = colorMode === 'dark';

  return (
    <header className={clsx('hero', styles.heroBanner, styles.customHeroBanner)}>
      <div className={styles.heroBackground}>
        <div className={styles.heroBackgroundCircle1}></div>
        <div className={styles.heroBackgroundCircle2}></div>
        <div className={styles.heroBackgroundGrid}></div>
      </div>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroText}>
          <div className={styles.heroTitleWrapper}>
            <Heading as="h1" className={styles.heroTitle}>
              Build Intelligent <span className={styles.highlight}>AI Agents</span> with {siteConfig.title}
            </Heading>
          </div>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx("button button--primary button--lg", styles.primaryButton)}
              to="/docs/">
              Get Started
            </Link>
            <Link
              className={clsx("button button--outline button--secondary button--lg", styles.githubButton)}
              style={{ marginLeft: '16px' }}
              href="https://github.com/dem1989/helse-agentic-library"
              target="_blank"
              rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.githubIcon}>
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.278 9.521 21.017C9.521 20.782 9.512 20.082 9.508 19.272C6.726 19.859 6.139 17.967 6.139 17.967C5.685 16.812 5.029 16.51 5.029 16.51C4.121 15.889 5.098 15.901 5.098 15.901C6.101 15.971 6.629 16.926 6.629 16.926C7.521 18.455 8.97 18.013 9.539 17.762C9.631 17.129 9.889 16.689 10.175 16.419C7.954 16.146 5.62 15.319 5.62 11.534C5.62 10.415 6.01 9.503 6.649 8.794C6.546 8.546 6.203 7.622 6.747 6.221C6.747 6.221 7.587 5.958 9.497 7.276C10.3 7.058 11.15 6.95 12 6.946C12.85 6.95 13.7 7.058 14.503 7.276C16.413 5.958 17.253 6.221 17.253 6.221C17.797 7.622 17.454 8.546 17.351 8.794C17.99 9.503 18.38 10.415 18.38 11.534C18.38 15.329 16.043 16.143 13.815 16.411C14.173 16.741 14.498 17.396 14.498 18.394C14.498 19.826 14.486 20.691 14.486 21.017C14.486 21.28 14.666 21.586 15.173 21.487C19.145 20.162 22 16.417 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
              </svg>
              GitHub
            </Link>
          </div>
          <div className={styles.npmCommand}>
            <CodeBlock language="bash">
              npm install @dem1989/forward
            </CodeBlock>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.logoContainer}>
            <img src="/img/logo.svg" alt="Forward Logo" className={styles.heroLogo} />
            <div className={styles.logoGlow}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Feature({
  title,
  description,
  icon,
  color = 'blue'
}: {
  title: string;
  description: string;
  icon: string;
  color?: 'blue' | 'purple' | 'green' | 'orange';
}) {
  return (
    <div className={clsx('col col--4', styles.featureItem)}>
      <div className={clsx(styles.featureCard, styles[`featureCard${color.charAt(0).toUpperCase() + color.slice(1)}`])}>
        <div className={styles.featureIconContainer}>
          <div className={styles.featureIcon}>
            <span className={styles.featureIconInner} dangerouslySetInnerHTML={{ __html: icon }} />
          </div>
        </div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function DocLinkCard({
  to,
  title,
  description,
  icon
}: {
  to: string;
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className={clsx('col col--6', styles.docLinkCardContainer)}>
      <Link to={to} className={styles.docLinkCard}>
        <div className={styles.docLinkCardContent}>
          {icon && (
            <div className={styles.docLinkCardIcon} dangerouslySetInnerHTML={{ __html: icon }} />
          )}
          <div>
            <Heading as="h3" className={styles.docLinkCardTitle}>{title}</Heading>
            <p className={styles.docLinkCardDescription}>{description}</p>
          </div>
        </div>
        <div className={styles.docLinkCardArrow}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.16667 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 4.16667L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </div>
  );
}

const quickStartCode = `
import { configureAgent, ForwardAgent } from '@dem1989/forward';

// Configure with API key (from process.env.OPENAI_API_KEY)
configureAgent({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const answer = await ForwardAgent.run(
    "What is the capital of France?"
  );
  console.log(answer);
  // Output: The capital of France is Paris.
}

main();
`.trim();

// SVG icons for features
const featureIcons = {
  agent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 9H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 9H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  tools: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  observe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  typescript: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 9.4l-1-1L18.9 5H7.1l3.4 3.4l-1 1L5 5v14l4.5-4.4l1 1L7.1 19h11.8l-3.4-3.4l1-1L21 19V5l-4.5 4.4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

// Doc icons
const docIcons = {
  quickStart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  concepts: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  setup: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  api: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L22 12L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 6L2 12L8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {colorMode} = useColorMode();
  const isDarkTheme = colorMode === 'dark';

  return (
    <Layout
      title={`Home`}
      description={siteConfig.tagline}>
      <HomepageHeader />

      <main className={styles.mainContainer}>
        {/* Why Forward Section */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>Why Forward?</Heading>
              <p className={styles.sectionTagline}>
                Focus on building intelligent agents, not the boilerplate. Forward provides the essential building blocks for creating sophisticated, tool-using AI applications with ease.
              </p>
            </div>

            <div className={styles.whyForwardGrid}>
              <div className={styles.whyForwardItem}>
                <div className={styles.whyForwardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Simplified Development</h3>
                <p>Build AI applications in minutes instead of weeks with our intuitive API.</p>
              </div>

              <div className={styles.whyForwardItem}>
                <div className={styles.whyForwardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 8L2 12L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.5 4L9.5 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>TypeScript First</h3>
                <p>Fully typed API with excellent IDE support for a smooth development experience.</p>
              </div>

              <div className={styles.whyForwardItem}>
                <div className={styles.whyForwardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Comprehensive Documentation</h3>
                <p>Detailed guides, examples, and API references to help you get started quickly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className={clsx(styles.features, styles.sectionPadding, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>Core Features</Heading>
              <p className={styles.sectionTagline}>
                Everything you need to build powerful AI agents that can reason, use tools, and solve complex problems.
              </p>
            </div>

            <div className="row">
              <Feature
                title="Agentic Framework"
                description="Build AI assistants that can reason, use tools, and interact naturally with users and systems."
                icon={featureIcons.agent}
                color="blue"
              />
              <Feature
                title="Extensible Tools"
                description="Create and integrate custom tools that allow your agents to perform specific actions and access external systems."
                icon={featureIcons.tools}
                color="purple"
              />
              <Feature
                title="Observability"
                description="Monitor and debug agent behavior with comprehensive lifecycle callbacks and detailed logging."
                icon={featureIcons.observe}
                color="green"
              />
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className={clsx(styles.codeSection, styles.sectionPadding)}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>See it in Action</Heading>
              <p className={styles.sectionTagline}>
                Get started with just a few lines of code. Forward makes it simple to create powerful AI agents.
              </p>
            </div>

            <div className={styles.codeExample}>
              <CodeBlock language="typescript" className={styles.codeBlock}>
                {quickStartCode}
              </CodeBlock>

              <div className={styles.codeExampleFeatures}>
                <div className={styles.codeExampleFeature}>
                  <div className={styles.codeExampleFeatureIcon}>1</div>
                  <div>
                    <h4>Simple Configuration</h4>
                    <p>Configure your agent with your OpenAI API key</p>
                  </div>
                </div>

                <div className={styles.codeExampleFeature}>
                  <div className={styles.codeExampleFeatureIcon}>2</div>
                  <div>
                    <h4>Run Your Agent</h4>
                    <p>Call the agent with a natural language prompt</p>
                  </div>
                </div>

                <div className={styles.codeExampleFeature}>
                  <div className={styles.codeExampleFeatureIcon}>3</div>
                  <div>
                    <h4>Get Results</h4>
                    <p>Receive intelligent responses from your agent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore the Docs Section */}
        <section className={clsx(styles.docsSection, styles.sectionPadding, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>Explore the Docs</Heading>
              <p className={styles.sectionTagline}>
                Comprehensive documentation to help you get started and make the most of Forward.
              </p>
            </div>

            <div className="row">
              <DocLinkCard
                to="/docs/quick-start"
                title="Quick Start"
                description="Get up and running in 5 minutes with our step-by-step guide."
                icon={docIcons.quickStart}
              />
              <DocLinkCard
                to="/docs/concepts/agent"
                title="Core Concepts"
                description="Understand the fundamental building blocks of the Forward framework."
                icon={docIcons.concepts}
              />
              <DocLinkCard
                to="/docs/setup-guide"
                title="Setup Guide"
                description="Detailed instructions for setting up Forward in your project."
                icon={docIcons.setup}
              />
              <DocLinkCard
                to="/api-docs/index.html"
                title="API Reference"
                description="Explore the complete API documentation for Forward."
                icon={docIcons.api}
              />
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className={clsx(styles.getInvolvedSection, styles.sectionPadding)}>
          <div className="container text--center">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>Get Involved</Heading>
              <p className={styles.sectionTagline}>
                Forward is open source and community-driven. Contributions of all kinds are welcome!
              </p>
            </div>

            <div className={styles.buttons} style={{ justifyContent: 'center' }}>
              <Link
                className={clsx("button button--primary button--lg", styles.primaryButton)}
                to="/docs/contributing">
                Contribute
              </Link>
              <Link
                className="button button--outline button--secondary button--lg"
                style={{ marginLeft: '16px' }}
                href="https://github.com/dem1989/helse-agentic-library/issues"
                target="_blank"
                rel="noopener noreferrer">
                Report an Issue
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
