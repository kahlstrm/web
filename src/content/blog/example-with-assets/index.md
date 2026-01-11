---
title: "Blog Post with Assets"
description: "Example of a directory-based blog post with images and other assets"
pubDate: 2026-01-11
tags: ["example", "assets"]
---

This is an example of a **directory-based blog post**. The markdown file is located at `example-with-assets/index.md`, which allows you to keep images and other assets in the same directory.

## Directory Structure

```
src/content/blog/
├── example-post.md              # Simple format
└── example-with-assets/         # Directory format
    ├── index.md                 # Main content
    ├── image.png                # Images
    └── data.json                # Other assets
```

## Benefits

- **Organized assets**: Keep all files related to a post together
- **Relative paths**: Reference images with `./image.png`
- **Clean URLs**: Both formats produce the same URL structure

## Including Images

With directory-based posts, you can easily include images using relative paths:

![Pixel Art Character](./kalski.png)

Just place your images in the same directory as `index.md` and reference them with `./filename.png`.

## Simple Posts vs. Directory Posts

Choose the format based on your needs:

- **Simple** (`post.md`): Best for text-only posts
- **Directory** (`post/index.md`): Best for posts with images/assets

Both work seamlessly with the same blog system!
