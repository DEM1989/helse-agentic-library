import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--dark', styles.heroBanner, styles.customHeroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroText}>
          <Heading as="h1" className="hero__title">
            Build Agentic AI Apps with {siteConfig.title}
          </Heading>
          <p className="hero__subtitle" style={{ marginBottom: '30px' }}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/">
              Get Started
            </Link>
            <Link
              className={clsx("button button--outline button--secondary button--lg", styles.githubButton)} 
              style={{ marginLeft: '10px' }}
              href={siteConfig.customFields?.repoUrl as string || '#'}
              target="_blank"
              rel="noopener noreferrer">
              GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <img src="/img/undraw_programming_re_kg9v.svg" alt="Agent Illustration" className={styles.heroImage} />
        </div>
      </div>
    </header>
  );
}

function Feature({ title, description, Svg }: { title: string; description: string; Svg?: React.ComponentType<React.ComponentProps<'svg'>> }) {
  return (
    <div className={clsx('col col--4', styles.featureItem)}>
      <div className={styles.featureCard}>
        {Svg && (
          <div className={styles.featureIcon}>
            <Svg className={styles.featureSvg} role="img" />
          </div>
        )}
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function DocLinkCard({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <div className={clsx('col col--6', styles.docLinkCardContainer)}>
      <Link to={to} className={styles.docLinkCard}>
        <Heading as="h3">{title} &rarr;</Heading>
        <p>{description}</p>
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

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main className={styles.mainContainer}>
        <section className={styles.sectionPadding}>
          <div className="container text--center">
            <Heading as="h2" className={styles.sectionTitle}>Why Forward?</Heading>
            <p className={styles.sectionTagline}>
              Focus on building intelligent agents, not the boilerplate. Forward provides the essential building blocks for creating sophisticated, tool-using AI applications with ease.
            </p>
          </div>
        </section>

        <section className={clsx(styles.features, styles.sectionPadding, styles.sectionAlt)}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>Core Features</Heading>
            <div className="row">
              <Feature
                title="Agentic Framework"
                description="Build AI assistants that can reason, use tools, and interact naturally."
              />
              <Feature
                title="Extensible Tools"
                description="Easily define custom tools for your agent to perform specific actions."
              />
              <Feature
                title="Observability"
                description="Monitor and debug agent behavior with comprehensive lifecycle callbacks."
              />
            </div>
          </div>
        </section>

        <section className={styles.sectionPadding}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>Explore the Docs</Heading>
            <div className="row">
              <DocLinkCard
                to="/docs/quick-start"
                title="Quick Start"
                description="Get up and running in 5 minutes."
              />
              <DocLinkCard
                to="/docs/concepts/agent"
                title="Core Concepts"
                description="Understand the fundamental building blocks."
              />
              <DocLinkCard
                to="/docs/setup-guide" 
                title="Setup Guide"
                description="Detailed setup instructions."
              />
              <DocLinkCard
                to="/api-docs/index.html"
                title="API Reference"
                description="Explore the full API (generate with `npm run docs`)."
              />
            </div>
          </div>
        </section>

        <section className={clsx(styles.codeSection, styles.sectionPadding, styles.sectionAlt)}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              See it in Action
            </Heading>
            <CodeBlock language="typescript">
              {quickStartCode}
            </CodeBlock>
          </div>
        </section>

        <section className={clsx(styles.sectionPadding)}>
            <div className="container text--center">
              <Heading as="h2" className={styles.sectionTitle}>Get Involved</Heading>
              <p className={styles.sectionTagline}>Forward is open source. Contributions are welcome!</p>
              <div className={styles.buttons} style={{ justifyContent: 'center' }}>
                <Link
                  className="button button--primary button--lg"
                  to="/docs/contributing">
                  Contribute
                </Link>
                <Link
                  className="button button--outline button--primary button--lg"
                  style={{ marginLeft: '10px' }}
                  href={`${siteConfig.customFields?.repoUrl}/issues` || '#'}
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
