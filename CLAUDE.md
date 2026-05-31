# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A [Quartz v4](https://quartz.jzhao.xyz/) static site — a wiki for a D&D/fantasy campaign called "World of Dragons". Content is written in Russian. The site is deployed to GitHub Pages automatically on push to `main`.

## Commands

```bash
# Build the site into public/
npx quartz build

# Serve with hot-reload for local development
npx quartz build --serve

# Sync content from Dropbox source
npm run cp-content

# Type-check and formatting check
npm run check

# Format all files
npm run format

# Run tests
npm test
```

## Architecture

Quartz processes Markdown files from `content/` and outputs static HTML to `public/`. The two user-facing config files are:

- **[quartz.config.ts](quartz.config.ts)** — site-wide config: title, base URL, plugins (transformers → filters → emitters)
- **[quartz.layout.ts](quartz.layout.ts)** — which components appear in each layout slot (left sidebar, right sidebar, before/after body)

### Plugin pipeline (`quartz/plugins/`)

Three stages run in order:

1. **Transformers** (`transformers/`) — parse and transform Markdown AST (frontmatter, OFM syntax, GFM, links, LaTeX, etc.)
2. **Filters** (`filters/`) — drop pages from the build (e.g. `RemoveDrafts` skips files with `draft: true`)
3. **Emitters** (`emitters/`) — produce output files (HTML pages, tag pages, folder pages, sitemap, RSS, OG images, etc.)

### Components (`quartz/components/`)

Preact components rendered server-side. Each component can ship its own CSS and client-side JS via `css` and `afterDOMLoaded`/`beforeDOMLoaded` properties. `quartz.layout.ts` assembles them into page layouts.

### Content structure

```
content/
  characters/
    npcs/          # NPC character pages
  factions/        # Faction pages
  index.md         # Site landing page
```

Character pages use a consistent Markdown convention: bold fields for race/faction/location/status, portrait via `![portrait](https://res.cloudinary.com/dlqsgzg1i/image/upload/...)`, then `##` sections for backstory, role, secrets, etc. Portrait images are hosted on Cloudinary (cloud name: `dlqsgzg1i`).

## Key details

- Node ≥ 22 and npm ≥ 10.9.2 required (see `.node-version`)
- Obsidian-flavored Markdown is enabled — wiki-style `[[links]]` resolve using `shortest` path matching
- Pages with `draft: true` in frontmatter are excluded from the build
- Folders named `private`, `templates`, or `.obsidian` are ignored by the build
- `public/` is the build output directory and should not be edited manually
