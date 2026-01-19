import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AstroIntegration } from "astro";

/**
 * Astro integration that wraps blog images in links (post-build).
 * Runs after image optimization so we get the correct processed URLs.
 */
export function imageLinks(): AstroIntegration {
  return {
    name: "image-links",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        await processDirectory(dir.pathname);
      },
    },
  };
}

async function processDirectory(dirPath: string): Promise<void> {
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith(".html")) {
      await processHtmlFile(fullPath);
    }
  }
}

async function processHtmlFile(filePath: string): Promise<void> {
  const content = await readFile(filePath, "utf-8");

  // Wrap <img> tags in <a> tags that open in new tab
  // Skip images already wrapped in links
  const updated = content.replace(
    /(<a\s[^>]*>)?\s*<img\s+([^>]*)>\s*(<\/a>)?/g,
    (match, openA, imgAttrs, closeA) => {
      // Already wrapped in a link - skip
      if (openA && closeA) return match;

      // Extract src from img attributes
      const srcMatch = imgAttrs.match(/src="([^"]*)"/);
      if (!srcMatch) return match;

      const src = srcMatch[1];
      return `<a href="${src}" target="_blank" rel="noopener noreferrer"><img ${imgAttrs}></a>`;
    },
  );

  if (updated !== content) {
    await writeFile(filePath, updated);
  }
}
