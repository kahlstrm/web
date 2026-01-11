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
pnpm build         # Ensure production build works
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

## Blog System

### Adding a New Blog Post

1. Create a markdown file in `src/content/blog/`:
   ```markdown
   ---
   title: "Post Title"
   description: "Brief description for preview"
   pubDate: 2026-01-10
   author: kahlstrm        # Optional, defaults to "kahlstrm"
   tags: ["tag1", "tag2"]  # Optional
   ---

   # Your Content Here

   Write your markdown content with code blocks, images, etc.
   ```

2. Commit and push to a feature branch

3. Posts are published when merged to main

### Example Posts

Example posts (with "example" in the slug) are:
- Visible in development mode
- Currently visible in production (temporary)
- Will be hidden in production when uncommented in filtering logic

## Project Structure

```
src/
├── content/
│   ├── blog/              # Blog post markdown files
│   └── config.ts          # Content collection schema
├── pages/
│   ├── blog/
│   │   ├── index.astro    # Blog listing page
│   │   └── [slug].astro   # Individual blog post pages
│   └── index.astro        # Homepage
├── components/
│   ├── BlogCard.astro     # Blog post preview card
│   └── Navigation.astro   # Site navigation
└── layouts/
    └── Layout.astro       # Main layout wrapper
```

## Key Features

- **Zero runtime dependencies** - Uses Astro's built-in features
- **Type-safe** - Zod schema validation for blog posts
- **Syntax highlighting** - GitHub Dark theme, 100+ languages
- **Mermaid diagrams** - Build-time SVG rendering (requires Playwright)
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
- `tags` (string[], optional)

## Troubleshooting

### Build Fails with Network Error

The build automatically falls back to `example.json` if GitHub API is unavailable. This is expected behavior in CI/offline environments.

### Format Check Fails

Run `pnpm format:fix` to auto-format all files.

### Type Check Warnings

Minor warnings (unused variables, implicit any) are non-critical and can be ignored if they don't affect functionality.

### Mermaid Diagrams Not Rendering

Mermaid diagrams require Playwright's Chromium browser to render at build time. If you see errors about missing Playwright:

```bash
npx playwright install chromium
```

**Note:** Local builds may fail if network restrictions prevent Playwright downloads. This is expected - the CI/CD pipeline (GitHub Actions, Vercel) will install Playwright automatically and diagrams will render correctly in production.
