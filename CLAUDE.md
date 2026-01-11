# Development Guide for Claude Code

This document describes the development workflow and checks that should be run before committing changes.

## Development Workflow

### Before Committing

Always run these checks before committing:

```bash
# 1. Format check (and auto-fix if needed)
pnpm format        # Check formatting
pnpm format:fix    # Auto-fix formatting issues

# 2. Type check
pnpm typecheck     # Run Astro type checking

# 3. Build verification
pnpm build:offline # Build without GitHub API (for CI/offline)
# or
pnpm build         # Build with GitHub API (production)
```

### Development Server

```bash
pnpm dev           # Start development server
pnpm start         # Alias for dev
```

### CI Pipeline

The CI automatically runs:
1. Format check (`pnpm format`)
2. Type check (`pnpm typecheck`)
3. Production build (`pnpm build`)

All checks must pass for PRs to be merged.

### Vercel Preview Deployments

After pushing to the remote branch, Vercel automatically creates preview deployments.

**Getting the Preview URL:**

```bash
./scripts/get-preview-url.sh
```

This script fetches the preview URL from GitHub API and displays quick links for testing.

**Post-Push Verification:**

Wait 10-15 seconds after `git push` for the deployment to complete, then verify:

1. **Homepage loads correctly** - Navigate to the root URL
2. **Blog index page shows all posts** - Navigate to `/blog`
3. **Individual blog posts render properly** - Test:
   - `/blog/example-post` (simple format)
   - `/blog/example-with-assets` (directory format)
4. **Check browser console for errors** - Open DevTools console

If the preview doesn't update after 15 seconds, check the Vercel deployment logs in the GitHub PR.

## Blog System

### Adding a New Blog Post

Blog posts support two formats:

**Simple Format** (text-only posts):
```bash
src/content/blog/my-post.md
```

**Directory Format** (posts with images/assets):
```bash
src/content/blog/my-post/
├── index.md       # Main content
├── image.png      # Images
└── data.json      # Other assets
```

Both formats produce the same URL: `/blog/my-post`

#### Frontmatter Template

```markdown
---
title: "Post Title"
description: "Brief description for preview"
pubDate: 2026-01-10
author: kahlstrm        # Optional, defaults to "kahlstrm"
---

# Your Content Here

Write your markdown content with code blocks, images, etc.
```

#### Publishing Workflow

1. Create your blog post (simple `.md` or directory with `index.md`)
2. Add images/assets in the same directory (directory format only)
3. Commit and push to a feature branch
4. Posts are published when merged to main

### Example Posts

Example posts (with "example" in the slug) are:
- Visible in local development (no VERCEL_ENV set)
- Visible in Vercel preview deployments (VERCEL_ENV=preview)
- Hidden in production deployments (VERCEL_ENV=production)

## Project Structure

```
src/
├── content/
│   ├── blog/                      # Blog posts
│   │   ├── simple-post.md         # Simple format (text-only)
│   │   └── post-with-assets/      # Directory format (with images/assets)
│   │       ├── index.md
│   │       └── image.png
│   └── config.ts                  # Content collection schema
├── pages/
│   ├── blog/
│   │   ├── index.astro            # Blog listing page
│   │   └── [slug].astro           # Individual blog post pages
│   └── index.astro                # Homepage
├── components/
│   ├── BlogCard.astro             # Blog post preview card
│   └── Navigation.astro           # Site navigation
├── layouts/
│   └── Layout.astro               # Main layout wrapper
└── utils/
    └── blog.ts                    # Blog filtering utilities
```

## Key Features

- **Zero runtime dependencies** - Uses Astro's built-in features
- **Type-safe** - Zod schema validation for blog posts
- **Flexible blog formats** - Simple `.md` or directory-based with assets
- **Syntax highlighting** - GitHub Dark theme, 100+ languages
- **Git-based workflow** - Branches are drafts, main is published
- **Offline builds** - Falls back to example.json when API unavailable

## Configuration

### Markdown

Configured in `astro.config.mjs`:
- Theme: `github-dark`
- Code wrapping: enabled
- Syntax highlighting: Shiki (build-time)

### Content Schema

Defined in `src/content/config.ts`:
- `title` (string, required)
- `description` (string, required)
- `pubDate` (date, required)
- `author` (string, defaults to "kahlstrm")

## GitHub API Data Fetching

The homepage fetches repository data from GitHub API to display project cards.

**Development mode**: Uses `example.json` (no API calls)
**Production build**: Uses GitHub API (live data)
**Offline build**: Use `pnpm build:offline` or set `PUBLIC_SKIP_GITHUB_API=true` to use `example.json`

## Troubleshooting

### Build Fails with Network Error

If the build fails due to GitHub API being unavailable, use `pnpm build:offline` instead of `pnpm build`.

### Format Check Fails

Run `pnpm format:fix` to auto-format all files.

### Type Check Warnings

Minor warnings (unused variables, implicit any) are non-critical and can be ignored if they don't affect functionality.
