# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio / blog deployed as a static site to GitHub Pages, served from the
custom domain `https://surumebeer.me/`. Built with **Astro 7** (no UI framework
integration — plain `.astro` components) and TypeScript.

## Development Commands

```bash
npm run dev      # Dev server (localhost:4321)
npm run build    # Static build to /dist
npm run preview  # Serve the built /dist
npm run check    # astro check (type + template diagnostics)
npm test         # node:test over test/**/*.test.ts
```

Requires Node >= 22.12.0 (Astro 7 engine requirement).

Tests run on the built-in `node:test` runner with `--experimental-strip-types`, so test
files are TypeScript but must use *erasable* syntax only (no enums, no parameter
properties) and import with an explicit `.ts` extension. Only modules that do not import
`astro:content` are testable this way — that is why the pure logic lives in
`src/lib/tag-utils.ts` and `src/lib/article-utils.ts` (tested) separately from
`src/lib/tags.ts` (collection access).

## Architecture

### Static build

`astro.config.mjs` sets `site: 'https://surumebeer.me'`, `base: '/'`, and
`trailingSlash: 'always'`. Output is fully static (`dist/`).

The site used to live at `surumebeer.github.io/surumebeer/`, so the base-path machinery is
still in place but currently inert: with `base: '/'`, `withBase()` (`src/lib/url.ts`) is a
pass-through and the base-url Markdown plugin early-returns. Keep using `withBase()` for
internal links in `.astro` files — that is the one switch that makes moving back to a
project page (or onto any other subpath) a one-line change in `astro.config.mjs`.

### Routes

| Route | Source | Description |
|-------|--------|-------------|
| `/` | `src/pages/index.astro` | TOP — renders root `README.md` as Profile |
| `/articles/` | `src/pages/articles/index.astro` | Article list (newest first) |
| `/articles/{YYYY}/{MM}/{DD}/{slug}/` | `src/pages/articles/[...slug].astro` | Article detail |
| `/tags/` | `src/pages/tags/index.astro` | All tags with article counts |
| `/tags/{tag}/` | `src/pages/tags/[tag].astro` | Articles for one tag |
| `/404` | `src/pages/404.astro` | Not found — passes `noindex` to the layout |

### Content collections (`src/content.config.ts`)

Two collections, both using the content layer `glob()` loader:

- `profile` — `README.md` at the repository root, id `readme`. The TOP page renders it
  via `getEntry('profile', 'readme')` + `render()`. Editing `README.md` updates the TOP page.
- `articles` — `src/content/articles/{YYYY}/{MM}/{DD}/{slug}.md`. The path relative to the
  collection base becomes the entry `id`, and `[...slug].astro` uses it as a rest param, so
  `2026/09/06/hello-astro.md` serves at `/articles/2026/09/06/hello-astro/`.

  `getPublishedArticles()` runs `validateArticlePath()` (in `src/lib/article-utils.ts`)
  over every entry, so a file outside that shape — or one whose directory date disagrees
  with its `pubDate` — **fails the build** with a message naming the file. The date lives
  in two places, and this is what keeps them from drifting apart. Validation runs before
  the draft filter, so a broken `draft: true` article fails the production build too.

Article frontmatter schema (validated with zod, imported from `astro/zod` — **not**
from `astro:content`, whose `z` re-export is deprecated and removed in Astro 8):

```yaml
---
title: string          # required
description: string    # optional, shown in lists and meta tags
pubDate: 2026-09-06    # required, date only — must match the directories
updatedDate: 2026-09-07 # optional, date only
tags: ['Astro', 'TypeScript']  # optional, defaults to []
draft: false           # optional, defaults to false
---
```

`pubDate` must match the `YYYY/MM/DD` directories the file sits in.

Both date fields go through the `dateOnly` schema, which rejects anything carrying a time
or offset (`2026-09-06T10:00:00+09:00`). A date-only value is one unambiguous UTC calendar
day, which is what the directory comparison assumes; allowing times would make "which
timezone's day?" a real question.

`draft: true` articles are visible in `npm run dev` but excluded from production builds
(see `getPublishedArticles()` in `src/lib/tags.ts`).

### Tags

Tags are not a separate collection — they are aggregated from article frontmatter by
`getTagSummaries()` in `src/lib/tags.ts`, which delegates to the pure `groupByTag()` in
`src/lib/tag-utils.ts`.

`tagToSlug()` lowercases, maps `+`/`#` to `plus`/`sharp` (so `C++` and `C#` stay
distinct), turns whitespace/underscores/hyphens into `-`, and strips the rest.
Non-ASCII letters (e.g. Japanese) are preserved.

Tags differing only in case or in space/underscore/hyphen (`GitHub Pages`,
`github_pages`, `github-pages`) are treated as one tag, and the first-seen spelling is
used for display. `normalizeTags()` applies that same folding for display, so
`TagList.astro` never emits duplicate or empty tag links. If two genuinely different tags
still collide on one slug, `groupByTag()` **throws at build time** rather than silently
merging their article lists — rename one of the tags.

### Markdown pipeline

Astro 7's default processor is Sätteri (`@astrojs/markdown-satteri`), configured in
`astro.config.mjs` via `markdown.processor: satteri({ ... })`. It takes `hastPlugins`
rather than remark/rehype plugins — the legacy `markdown.rehypePlugins` option requires
switching to `unified()` from `@astrojs/markdown-remark`, which this project does not do.

`src/plugins/base-url-plugin.mjs` is a Sätteri hast plugin that prefixes root-relative
URLs (`/articles/`, `/images/x.png`) inside Markdown with the base path. Astro only
resolves `base` for links in `.astro` files, so on a subpath deployment such links would
404 without it. It covers `href`/`src`/`action`/`data` and `srcset`; absolute,
protocol-relative, and already-base-prefixed URLs are left alone.

**It does nothing while `base` is `'/'`** — both visitors early-return on an empty base.
It is kept wired up so a move back to a subpath needs no code change.

It works in two passes because Markdown produces two kinds of node:

- `element` visitor — links and images written in Markdown syntax. Hast nodes are
  read-only here: mutate via `ctx.setProperty()`, not by assignment, and use Sätteri's
  default React property casing (`srcSet`, not `srcset`).
- `raw` visitor (`prefixRawHtml()`) — hand-written HTML in Markdown, which Sätteri keeps
  as an opaque `raw` string. It is rewritten textually, so it scans for *start tags only*:
  comments and `script`/`style` bodies are skipped whole, and an attribute is rewritten
  only when the tag is one that actually takes that URL attribute. Without that scoping a
  plain `/…` string inside JS, CSS, or body text would be rewritten too.
  (Note: Sätteri rejects HTML with unquoted attribute values — `<img src=/a.png>` is
  escaped to text before the plugin ever sees it — so always quote attributes.)

**Do not enable `features: { rawHtml: true }`.** It would turn raw HTML into real
elements and let the `element` visitor handle both cases, but its reparse round-trips the
tree through HTML and drops `code.data.lang`, which is where the highlighter reads the
fence language from — every code block silently degrades to `plaintext` with no colors.

### Syntax highlighting

Shiki (built into Astro) with the single theme `one-dark-pro`, configured in
`astro.config.mjs`. Code blocks are deliberately dark in both light and dark page themes,
so there is no dual-theme `--shiki-dark` CSS to maintain — Shiki writes the colors as
inline styles and `.prose pre.astro-code` in `src/styles/global.css` only styles the
container (`--code-border` gives it a border that works against a light page).

To change the palette, swap `shikiConfig.theme`; any bundled Shiki theme name works
(`dracula`, `night-owl`, `tokyo-night`, `material-theme-palenight`, `nord`, …).

If code blocks ever render without colors, check `data-language` in the built HTML — a
`plaintext` on a fenced block that declared a language means the fence language was lost
upstream (see the Markdown pipeline note above), not a theme problem.

### Styling

Plain CSS in `src/styles/global.css`, imported once by `BaseLayout.astro`. Theming uses
CSS custom properties on `:root` with a `prefers-color-scheme: dark` override. Rendered
Markdown is wrapped in `.prose`.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) runs `check` → `test` → `build` on both
pushes to `main` and pull requests. Artifact upload and the `deploy` job are gated on
`github.event_name == 'push' && github.ref == 'refs/heads/main'`, so a PR build never
publishes to production Pages. Uses Node 22 and `actions/deploy-pages@v4`.

`BaseLayout` takes a `noindex` prop. GitHub Pages serves `404.html` for *every* unknown
URL, so emitting a canonical/`og:url` there would point every missing page at `/404/`;
`noindex` drops both and emits `<meta name="robots" content="noindex">` instead.

`public/CNAME` holds `surumebeer.me` and is copied to `dist/CNAME` on every build — that
is what tells GitHub Pages which custom domain to serve. **Deleting it un-sets the custom
domain in the repo settings on the next deploy**, so leave it in place unless the domain
is actually changing. DNS (apex A/AAAA records pointing at GitHub Pages) is configured
outside this repo.

## Key Conventions

- Astro components are server-rendered at build time; no client-side JS is shipped.
- Internal links in `.astro` files go through `withBase()`; internal links in Markdown are
  handled by the base-url hast plugin.
- Do not use `any` or `unknown` in TypeScript.
