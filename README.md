# Visual Dashboard

Production-ready dashboard built with React, TypeScript, Vite, React Query, and mock-first API contracts.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
npm ci
```

## Local development

```bash
npm run dev
```

## Quality and security gates

```bash
npm run check:repo-hygiene
npm run typecheck
npm run test
npm run build
npm run check:security
npm run check:all
```

`check:all` is the standard pre-merge validation chain.

## Privacy controls

```bash
npm run privacy:status
npm run privacy:enforce
```

- `privacy:status`: reports current GitHub repository visibility.
- `privacy:enforce`: fails if repository is not private.

To set repository visibility to private using API credentials:

```bash
bash scripts/github-set-private.sh
```

`github-set-private.sh` requires `GH_TOKEN` or `GITHUB_TOKEN` with repository admin permissions.

## Repository hygiene policy

The following local/generated content is ignored and must not be committed:

- `node_modules/`
- `dist/`
- `coverage/`
- `playwright-report/`
- `test-results/`
- `.lighthouseci/`
- `.env*` (except `.env.example`)
- local IDE settings (`.vscode/settings.json`, `.vscode/launch.json`)

Source and project configuration files are the repository source of truth.

## Personal project workflow

1. Keep `main` protected and work on feature branches.
2. Run `npm run check:all` before every merge.
3. Keep secrets only in local `.env` files and never commit them.
4. Use `npm run privacy:enforce` before publishing or sharing the repository.
