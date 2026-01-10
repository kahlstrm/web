---
title: "Welcome to the Blog"
description: "An example post demonstrating markdown, code highlighting, and images. Only visible in development mode."
pubDate: 2026-01-10
tags: ["example", "markdown", "astro"]
---

This is an example blog post to demonstrate the features of this markdown-based blog system. This post will only appear in **development mode** and will be automatically hidden in production.

## Features

This blog system supports:

- ✅ Markdown formatting
- ✅ Syntax highlighting for code
- ✅ Images with automatic optimization
- ✅ Tags and metadata
- ✅ Dev/production filtering

## Code Highlighting

Here's some TypeScript code with syntax highlighting:

```typescript
interface BlogPost {
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
}

function createPost(data: BlogPost): void {
  console.log(`Creating post: ${data.title}`);
  console.log(`Published on: ${data.pubDate.toISOString()}`);
}

const examplePost: BlogPost = {
  title: "My First Post",
  description: "This is an example",
  pubDate: new Date(),
  tags: ["example", "typescript"],
};

createPost(examplePost);
```

And here's some Python:

```python
def fibonacci(n: int) -> int:
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## Markdown Formatting

You can use all standard markdown features:

### Lists

**Unordered:**

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

**Ordered:**

1. First step
2. Second step
3. Third step

### Quotes

> "The best way to predict the future is to invent it."
> — Alan Kay

### Inline Code

You can use inline code like `const x = 42;` or `import { foo } from 'bar'`.

### Links

Check out [Astro](https://astro.build) for more information about the framework powering this blog.

## Getting Started

To create your own blog posts:

1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter with title, description, and date
3. Write your content in markdown
4. Commit and push to git
5. Done! Your post is live.

---

**Note:** This is an example post. To create your own posts, simply add markdown files to the `src/content/blog/` directory and commit them to git.
