# Visual Dashboard

Production-ready dashboard built with React, TypeScript, Vite, React Query, and mock-first API contracts.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
npm ci
```

## Local Development

```bash
npm run dev
```

## Quality Gates

```bash
npm run typecheck
npm run test
npm run build
npm run test:coverage
npm run check:all
```

`check:all` is the standard pre-merge validation (`typecheck + test + build`).

## Repository Hygiene Policy

The following generated artifacts are intentionally ignored and must not be committed:

- `dist/`
- `coverage/`
- `playwright-report/`
- `test-results/`
- `.lighthouseci/`

Source and configuration files are the only repository source of truth.
