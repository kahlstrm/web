import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AstroIntegration } from "astro";

/**
 * Astro integration that fixes image link hrefs after build.
 * Updates <a> tags wrapping <img> tags to use the processed image src.
 */
export function fixImageLinks(): AstroIntegration {
  return {
    name: "fix-image-links",
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

  // Match <a> tags that wrap <img> tags and update href to match img src
  // Pattern: <a href="..." ...><img ... src="..." ...></a>
  const updated = content.replace(
    /<a\s+([^>]*href=")[^"]*("[^>]*>)\s*(<img\s+[^>]*src=")([^"]*)("[^>]*>)\s*<\/a>/g,
    (_, aStart, aMiddle, imgStart, imgSrc, imgEnd) => {
      return `<a ${aStart}${imgSrc}${aMiddle}${imgStart}${imgSrc}${imgEnd}</a>`;
    },
  );

  if (updated !== content) {
    await writeFile(filePath, updated);
  }
}
