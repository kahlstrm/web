# Add Markdown Blog System with SEO

Implements a complete markdown-based blog system using Astro Content Collections with full SEO optimization.

## Blog Features

- **Two post formats**: Simple `.md` files or directory-based with assets
- **Content Collections**: Type-safe blog posts with Zod schema validation
- **Syntax highlighting**: GitHub Dark theme with 100+ languages (Shiki)
- **Dynamic routing**: `/blog` index and `/blog/[slug]` post pages
- **Git workflow**: Feature branches = drafts, main = published

## SEO Optimizations

- Open Graph and Twitter Card meta tags
- Canonical URLs on all pages
- Structured data (JSON-LD) for blog posts
- Automatic sitemap generation via `@astrojs/sitemap`
- Sitemap discovery via `<link rel="sitemap">` in HTML head

## UI Improvements

- Fixed footer positioning (proper flexbox layout)
- Fixed horizontal scrollbar on homepage
- Added example blog posts with image assets

## Developer Experience

- Example posts for testing (visible in dev/preview)
- Script to fetch Vercel preview URLs automatically
- Comprehensive CLAUDE.md documentation
- Pre-commit checks: format, typecheck, build

## Files Changed

**New:**
- `src/pages/blog/` - Blog routing (index + dynamic slug)
- `src/content/blog/` - Example blog posts
- `src/content/config.ts` - Content collection schema
- `src/components/BlogCard.astro` - Post preview cards
- `src/components/Navigation.astro` - Site navigation
- `src/utils/blog.ts` - Post filtering utilities
- `scripts/get-preview-url.sh` - Vercel URL fetcher
- `CLAUDE.md` - Development guide

**Modified:**
- `src/layouts/Layout.astro` - SEO meta tags
- `astro.config.mjs` - Site URL and sitemap integration
- `package.json` - Added `@astrojs/sitemap` devDependency

## Configuration

Site URL: `https://kahlstrm.xyz`

Blog post schema:
```yaml
title: string (required)
description: string (required)
pubDate: date (required)
author: string (default: "kahlstrm")
```
