# Repository Guidelines

## Project Structure & Module Organization
The app is a Create React App TypeScript workspace. Feature code lives under `src/`, split by domain: `features/ai` handles Gemini integrations, `features/editor` manages canvas tools, and `core/` wraps shared utilities. UI primitives live in `components/`, and cross-cutting types are in `types/`. Static assets and Tailwind styles live in `src/assets` and `index.css`. Public entry assets are under `public/`, while build artifacts land in `build/`. Architectural notes and UX docs live in `docs/` and `screenshots/`.

## Build, Test, and Development Commands
Use `npm start` to launch the React dev server at `http://localhost:3000`. Run `npm run build` before releasing to produce the optimized bundle in `build/`. Execute `npm test` for interactive Jest runs; add `-- --watchAll=false` in CI to avoid hanging. Remove stale assets with `rm -rf build` when regenerating production output.

## Coding Style & Naming Conventions
TypeScript strict mode is enabled; prefer `*.tsx` for components and keep hooks, repositories, and use-cases in their domain folders. Follow the existing naming pattern (`AddText.usecase.ts`, `Gemini.datasource.ts`) and use PascalCase for React components, camelCase for helpers, and SCREAMING_SNAKE_CASE for const identifiers. Indent with two spaces, favor Tailwind utility classes in JSX, and let ESLint/Prettier defaults from `react-scripts` format imports. Typed interfaces should live in `types/` or beside their feature when scoped.

## Testing Guidelines
Jest powers the suite; tests mirror the feature layout and use `.test.ts` suffixes. Keep mocks in `src/__mocks__` and prefer dependency injection over global state to ease testing. Target meaningful coverage on core use-cases (editor actions, AI pipelines). For one-off CI checks, run `npm test -- --watchAll=false --coverage` and ensure new use-cases include happy-path and failure-path assertions.

## Commit & Pull Request Guidelines
Commit history follows Conventional Commits (`feat`, `fix`, `refactor(scope): summary`). Keep scopes aligned with domain folders (`ai`, `editor`). Each PR should describe the user-facing outcome, list validation steps (`npm test`, manual canvas smoke tests), link to related issues, and attach screenshots or screen recordings for UI changes. Highlight any API key or environment impacts prominently in the PR body.

## Environment & API Keys
The Gemini integration is client-side only; no keys are stored server-side. Encourage contributors to use personal API keys in localStorage via the in-app settings. Never commit `.env` files or real keys. Document alternative behavior when AI features are disabled so the editor continues to function offline.
