#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

/**
 * Parses frontmatter from markdown content.
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error("No frontmatter found");
  }

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const descriptionMatch = frontmatter.match(
    /^description:\s*["']?(.+?)["']?\s*$/m,
  );

  return {
    title: titleMatch?.[1] ?? "",
    description: descriptionMatch?.[1] ?? "",
  };
}

/**
 * Reads all blog posts and returns their metadata.
 */
function getBlogPosts() {
  const blogDir = path.join(rootDir, "src/content/blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    let filePath;
    let slug;

    if (entry.isDirectory()) {
      filePath = path.join(blogDir, entry.name, "index.md");
      slug = entry.name;
    } else if (entry.name.endsWith(".md")) {
      filePath = path.join(blogDir, entry.name);
      slug = entry.name.replace(/\.md$/, "");
    } else {
      continue;
    }

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const { title, description } = parseFrontmatter(content);

    posts.push({ slug, title, description });
  }

  return posts;
}

// Generate the fixture
const posts = getBlogPosts();
const fixturesDir = path.join(rootDir, "tests/fixtures");

fs.mkdirSync(fixturesDir, { recursive: true });
fs.writeFileSync(
  path.join(fixturesDir, "posts.json"),
  JSON.stringify(posts, null, 2),
);

console.log(`Generated tests/fixtures/posts.json with ${posts.length} posts`);
