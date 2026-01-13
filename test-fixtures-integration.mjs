import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Parses frontmatter from markdown content.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = match[1];
  const title = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? "";
  const description =
    frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? "";

  return { title, description };
}

/**
 * Astro integration that generates test fixtures during offline builds.
 * Only runs when PUBLIC_SKIP_GITHUB_API is set.
 */
export default function testFixtures() {
  const isOfflineBuild = process.env.PUBLIC_SKIP_GITHUB_API === "true";

  return {
    name: "test-fixtures",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        if (!isOfflineBuild) return;

        const blogDir = join(process.cwd(), "src/content/blog");
        const entries = readdirSync(blogDir, { withFileTypes: true });
        const posts = [];

        for (const entry of entries) {
          let filePath, slug;

          if (entry.isDirectory()) {
            filePath = join(blogDir, entry.name, "index.md");
            slug = entry.name;
          } else if (entry.name.endsWith(".md")) {
            filePath = join(blogDir, entry.name);
            slug = entry.name.replace(/\.md$/, "");
          } else {
            continue;
          }

          if (!existsSync(filePath)) continue;

          const content = readFileSync(filePath, "utf-8");
          const { title, description } = parseFrontmatter(content);
          posts.push({ slug, title, description });
        }

        mkdirSync("tests/fixtures", { recursive: true });
        writeFileSync(
          "tests/fixtures/posts.json",
          JSON.stringify(posts, null, 2),
        );

        console.log(
          `Generated tests/fixtures/posts.json with ${posts.length} posts`,
        );
      },
    },
  };
}
