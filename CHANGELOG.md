# Changelog

All notable changes to the `@dem1989/forward` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- (Nothing yet)

### Changed
- (Nothing yet)

### Deprecated
- (Nothing yet)

### Removed
- (Nothing yet)

### Fixed
- (Nothing yet)

### Security
- (Nothing yet)

## [0.1.0] - 2024-04-24

### Added
- Initial release of the Forward framework (`@dem1989/forward`).
- Core `ForwardAgent` class in `src/agent.ts` providing main interaction logic.
- Agent methods: `run`, `summarize`, `getWritingSuggestions`.
- Support for defining and integrating custom tools via the `Tool` interface (`src/types.ts`).
- Configuration system using `configureAgent` (`src/agent.ts`) for API keys, model settings, tools, and callbacks.
- Observability hooks (callbacks) for agent lifecycle events (e.g., `onAgentStart`, `onLLMStart`, `onToolStart`, `onAgentEnd`, `onAgentError`).
- Basic utility functions (`src/utils.ts`).
- TypeScript setup with strict type checking (`tsconfig.json`).
- Jest testing framework configuration (`jest.config.js`) and initial unit tests (`src/__tests__`).
- ESLint configuration for code linting (`.eslintrc.js`).
- MIT License (`LICENSE`).
- Initial documentation structure using Docusaurus (`website/` directory).
- Basic `README`, `SETUP`, `CONTRIBUTING`, `PUBLISHING` guides.

### Changed
- (Nothing yet)

### Deprecated
- (Nothing yet)

### Removed
- (Nothing yet)

### Fixed
- (Nothing yet)

### Security
- (Nothing yet)

[Unreleased]: https://github.com/DEM1989/helse-agentic-library/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/DEM1989/helse-agentic-library/releases/tag/v0.1.0 