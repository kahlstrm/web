import { visit } from "unist-util-visit";

/**
 * Rehype plugin that wraps images in links to open full size in new tab.
 *
 * Transforms: <img src="..." alt="...">
 * Into: <a href="..." target="_blank" class="image-link"><img src="..." alt="..."></a>
 */
export default function rehypeImageLightbox() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img") return;
      if (!parent || index === undefined) return;

      // Skip if already inside a link
      if (parent.tagName === "a") {
        return;
      }

      const imgSrc = node.properties.src;

      // Wrap image in a link that opens full size in new tab
      const link = {
        type: "element",
        tagName: "a",
        properties: {
          href: imgSrc,
          target: "_blank",
          rel: "noopener",
          className: ["image-link"],
        },
        children: [node],
      };

      parent.children[index] = link;
    });
  };
}
