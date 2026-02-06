# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site deployed as a static site to GitHub Pages at `https://surumebeer.github.io/surumebeer/`. Built with Next.js 15 (App Router), TypeScript, React 19, and Tailwind CSS v4. Uses a flat-file content management system with Markdown/MDX and YAML frontmatter.

## Development Commands

```bash
npm run dev              # Dev server with Turbopack (localhost:3000)
npm run build            # Static export to /out directory
npm run lint             # ESLint
npm run start            # Serve production build

# Content scaffolding (creates template article.md with today's date)
npm run create:articles
npm run create:products
npm run create:learning-css
```

No testing framework is configured.

## Architecture

### Static Export with basePath

`next.config.ts` sets `output: 'export'`, `basePath: '/surumebeer'`, and `trailingSlash: true`. All routes are statically generated — there is no server runtime. Dynamic routes use `generateStaticParams` with `dynamicParams: false`.

### Content System

All content lives in `/content` as Markdown files with `gray-matter` frontmatter:

```
content/
  articles/YYYY/MM/DD/article.md      # Frontmatter: title, date, isPublished, tags
  learning-css/YYYY/MM/DD/article.md   # Frontmatter: title, date, isPublished (rendered as MDX)
  products/<product-name>/article.md   # Frontmatter: title, images, description, date, isPublished
```

- Only content with `isPublished: true` is displayed
- Articles and learning-css pages are listed newest-first, capped at 20 items
- **Articles**: Rendered via `remark` + `remark-gfm` + `remark-html` to HTML
- **Learning CSS**: Rendered via `next-mdx-remote/rsc` with custom components (`CodeDemo`, `ColorBox`, `CSSProperty`)
- **Products**: Rendered via remark pipeline, supports image display

Content loading happens inline in each page file (no shared content utility module) — each route's `page.tsx` contains its own `getArticles()`/`getCssTips()`/`getProducts()` function that reads the filesystem directly.

### Routes

| Route | Dynamic Params |
|-------|---------------|
| `/` | Home — renders README.md as profile |
| `/articles` | Article listing |
| `/articles/[year]/[month]/[day]` | Single article |
| `/products` | Product listing |
| `/products/[product-name]` | Single product |
| `/learning-css` | CSS tips listing |
| `/learning-css/[year]/[month]/[day]` | Single CSS tip (MDX) |

### Components

- `app/components/header.tsx` — Client component, fixed navigation bar with pathname-based active styling
- `app/components/tag-badge.tsx` — `TagBadge` and `TagList` components for article tags
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. Uses Node 20 and `actions/deploy-pages@v4`.

### Key Conventions

- React Server Components by default; `"use client"` only when needed
- Path alias: `@/*` → project root
- Tailwind v4 with CSS variables for theming (oklch color space in `globals.css`)
- shadcn/ui configured (`components.json`) with new-york style
- Fonts: Geist Sans and Geist Mono via `next/font/google`
