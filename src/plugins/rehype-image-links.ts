import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * Rehype plugin that wraps images in anchor tags that open in a new tab.
 * Images already wrapped in links are skipped.
 */
export function rehypeImageLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "img") return;
      if (!parent || index === undefined) return;

      // Skip if already wrapped in a link
      if (parent.type === "element" && (parent as Element).tagName === "a") {
        return;
      }

      const src = node.properties?.src;
      if (!src || typeof src !== "string") return;

      // Create anchor element wrapping the image
      const link: Element = {
        type: "element",
        tagName: "a",
        properties: {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        children: [node],
      };

      // Replace the image with the link containing the image
      (parent as Element).children[index] = link;
    });
  };
}
