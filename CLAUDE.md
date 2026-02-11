# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site deployed as a static site to GitHub Pages at `https://surumebeer.github.io/surumebeer/`. Built with Next.js 15 (App Router), TypeScript, React 19, and Tailwind CSS v4. The site consists of a single TOP page that displays a Profile rendered from `README.md`.

## Development Commands

```bash
npm run dev              # Dev server with Turbopack (localhost:3000)
npm run build            # Static export to /out directory
npm run lint             # ESLint
npm run start            # Serve production build
```

No testing framework is configured.

## Architecture

### Static Export with basePath

`next.config.ts` sets `output: 'export'`, `basePath: '/surumebeer'`, `assetPrefix: '/surumebeer'`, and `trailingSlash: true`. All routes are statically generated — there is no server runtime. Images are unoptimized (`images.unoptimized: true`).

### Routes

| Route | Description |
|-------|-------------|
| `/` | Home — renders README.md as profile |

### Components

- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### TOP Page (`app/page.tsx`)

Reads `README.md` from the project root, converts it to HTML via `remark` + `remark-html`, and renders it as a Profile page with `.prose` styling.

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. Also runs on pull requests to `main` (build only). Uses Node 20 and `actions/deploy-pages@v4`.

### Key Conventions

- React Server Components by default; `"use client"` only when needed
- Path alias: `@/*` → project root
- Tailwind v4 with CSS variables for theming (oklch color space in `globals.css`)
- Custom `.prose` styles defined in `globals.css` `@layer components`
- shadcn/ui configured (`components.json`) with new-york style, lucide icons
- Fonts: Geist Sans and Geist Mono via `next/font/google`
