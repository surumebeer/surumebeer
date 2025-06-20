# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.4 application using the App Router, TypeScript, and Tailwind CSS v4. The project appears to be undergoing transformation with content management capabilities being added.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI**: React 19.0.0

### Project Structure
```
/app/                    # Next.js App Router pages and layouts
  /articles/            # Article content (pending)
  /products/            # Product content (pending)
  layout.tsx           # Root layout with font configuration
  page.tsx             # Home page
  globals.css          # Global styles and Tailwind directives
/src/content/           # Content directory (pending)
/config/                # Configuration files (pending)
/public/                # Static assets
```

### Key Conventions

1. **Routing**: All routes use the App Router pattern in `/app` directory
2. **Components**: React Server Components by default, use `"use client"` directive for client components
3. **Styling**: Tailwind CSS utility classes preferred, CSS variables for theming
4. **Fonts**: Geist Sans and Geist Mono loaded via `next/font/local`
5. **Path Alias**: Use `@/*` to import from root directory

### TypeScript Configuration
- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX preserve mode
- Path alias: `@/*` → `./`

### Tailwind CSS
- Version 4 with PostCSS
- CSS variables configured for dark/light theme
- Custom font families: font-geist-sans, font-geist-mono

## Important Notes

- No testing framework is currently configured
- The project is in transition with MDX/content management features being added
- Contentlayer configuration file exists in git status but not yet created
- Development server runs on http://localhost:3000 with hot reloading