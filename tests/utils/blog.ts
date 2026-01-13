import * as fs from "fs";
import * as path from "path";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
}

/**
 * Parses frontmatter from markdown content.
 */
function parseFrontmatter(content: string): { title: string; description: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error("No frontmatter found");
  }

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);

  return {
    title: titleMatch?.[1] ?? "",
    description: descriptionMatch?.[1] ?? "",
  };
}

/**
 * Reads all blog posts from the content directory and returns their metadata.
 * Handles both simple (.md) and directory-based (folder/index.md) formats.
 */
export function getBlogPosts(): BlogPostMeta[] {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  const posts: BlogPostMeta[] = [];

  for (const entry of entries) {
    let filePath: string;
    let slug: string;

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
