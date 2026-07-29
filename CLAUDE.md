# Development Guide for Claude Code

This document describes the development workflow and checks that should be run before committing changes.

## Toolchain

Node.js and pnpm versions are pinned in `mise.toml` and provisioned by [mise](https://mise.jdx.dev).

```bash
mise trust     # First time in a fresh clone
mise install   # Install the pinned Node.js and pnpm
```

Once installed, `node` and `pnpm` resolve through mise's shims — no `nvm` step is needed.

### pnpm version, in three places

The pnpm version is pinned in `mise.toml` (local + CI) and in `package.json`'s `packageManager`
(Vercel). **Both must be updated together.** Regenerate the `packageManager` hash with
`corepack use pnpm@<version>` rather than editing it by hand — corepack validates the integrity hash.

Vercel only supports pnpm 6–10 natively and infers the version from `lockfileVersion`, which pnpm 11
leaves at `9.0`. The `ENABLE_EXPERIMENTAL_COREPACK=1` environment variable is set in the Vercel
project settings so that Vercel reads `packageManager` instead of guessing. **Do not remove it** —
without it Vercel silently falls back to pnpm 10 while local and CI use 11. It is a project setting,
so it lives outside this repo and won't survive recreating the Vercel project from scratch.

### pnpm configuration lives in pnpm-workspace.yaml

pnpm 11 reads only auth/registry settings from `.npmrc`, so all pnpm config is in
`pnpm-workspace.yaml`. Two settings there are load-bearing:

- `shamefullyHoist: true` — Astro resolves `sharp` as a hoisted transitive dep. Without this the
  install still succeeds and the build then fails with `MissingSharp`.
- `allowBuilds` — replaces pnpm 10's `onlyBuiltDependencies`. Without it `esbuild` and `sharp` build
  scripts are skipped.

`minimumReleaseAge: 1440` refuses packages published less than a day ago. Dependabot opens PRs
immediately on release, so its CI may fail for the first 24 hours; re-run the job or lower the value.

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

# 4. Visual regression tests (optional, for visual changes)
pnpm test:visual   # Run visual regression tests against baselines
```

### Visual Regression Testing

The project uses Playwright for visual regression testing to catch unintended visual changes.

**Initial Setup (first time only):**

```bash
# Install Playwright browsers
pnpm exec playwright install chromium

# Build the site and generate baseline screenshots
pnpm build:offline
pnpm test:visual:update
```

**Running Visual Tests:**

```bash
# Run all visual regression tests
pnpm test:visual

# Run tests with interactive UI
pnpm test:visual:ui

# View HTML test report
pnpm test:visual:report

# Debug a specific test
pnpm test:visual:debug
```

**Updating Baselines (when intentional visual changes are made):**

```bash
# After making intentional visual changes
pnpm build:offline
pnpm test:visual:update

# Commit the updated baseline screenshots
git add tests/
git commit -m "Update visual regression baselines"
```

**Test Coverage:**

Visual regression tests capture screenshots for:
- Homepage (desktop + mobile)
- Blog list page (desktop + mobile)
- Example blog post (desktop + mobile)
- Example blog post with assets (desktop + mobile)

**Viewports:**
- Desktop: 1920x1080
- Mobile: 375x667

**Baseline Screenshots:**

Baseline images are stored in `tests/visual.spec.ts-snapshots/` and committed to git. When tests run, Playwright compares current screenshots against these baselines and reports any pixel differences.

**Handling Test Failures:**

If visual tests fail:
1. Review the diff images in the HTML report: `pnpm test:visual:report`
2. If changes are intentional, update baselines: `pnpm test:visual:update`
3. If changes are bugs, fix the issue and re-run tests
4. Commit updated baselines only when changes are intentional

**CI Integration:**

Visual regression tests are not yet integrated into CI. To add them:
1. Install Playwright browsers in CI: `pnpm exec playwright install --with-deps chromium`
2. Build the site: `pnpm build:offline`
3. Run tests: `pnpm test:visual`
4. Upload diff artifacts on failure for debugging

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
│   └── blog/                      # Blog posts
│       ├── simple-post.md         # Simple format (text-only)
│       └── post-with-assets/      # Directory format (with images/assets)
│           ├── index.md
│           └── image.png
├── content.config.ts              # Content collection schema and loader
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

Astro 7 defaults to the Sätteri Markdown processor, but this project keeps the
remark/rehype pipeline because `src/utils/rehype-popover-lightbox.mjs` is a rehype plugin.
That requires `@astrojs/markdown-remark` to stay installed as an explicit dependency —
removing it breaks the build with a config validation error.

### Content Schema

Defined in `src/content.config.ts`:
- `title` (string, required)
- `description` (string, required)
- `pubDate` (date, required)
- `author` (string, defaults to "kahlstrm")

The collection uses the Content Layer `glob()` loader. Entry ids are bare slugs — the
loader collapses `my-post/index.md` to `my-post`, so both blog formats share one URL
shape. Use `post.id` for the slug and `post.filePath` for the on-disk path. The
"Blog Post Routes" test in `tests/visual/blog-list.spec.ts` guards this.

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
