import { visit } from "unist-util-visit";

/**
 * Rehype plugin that wraps images in lightbox markup.
 * Uses CSS :target selector for zero-JS lightbox functionality.
 *
 * Transforms: <img src="..." alt="...">
 * Into:
 * <a href="#lightbox-{id}" class="image-trigger">
 *   <img src="..." alt="...">
 * </a>
 * <div id="lightbox-{id}" class="lightbox">
 *   <a href="#_" class="lightbox-close">
 *     <img src="..." alt="...">
 *   </a>
 * </div>
 */
export default function rehypeImageLightbox() {
  return (tree) => {
    // First pass: collect all images to transform
    const toTransform = [];

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img") return;
      if (!parent || index === undefined) return;

      // Skip if inside a link (already wrapped or part of markdown link)
      if (parent.tagName === "a") {
        return;
      }

      toTransform.push({ node, index, parent });
    });

    // Second pass: transform collected images (in reverse to preserve indices)
    for (let i = toTransform.length - 1; i >= 0; i--) {
      const { node, index, parent } = toTransform[i];
      const id = `lightbox-${i}`;
      const imgSrc = node.properties.src;
      const imgAlt = node.properties.alt || "";

      // Create the trigger link wrapping the original image
      const triggerLink = {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          className: ["image-trigger"],
        },
        children: [{ ...node }],
      };

      // Create the lightbox overlay
      const lightbox = {
        type: "element",
        tagName: "div",
        properties: {
          id: id,
          className: ["lightbox"],
        },
        children: [
          {
            type: "element",
            tagName: "a",
            properties: {
              href: "#_",
              className: ["lightbox-close"],
              "aria-label": "Close lightbox",
            },
            children: [
              {
                type: "element",
                tagName: "img",
                properties: {
                  src: imgSrc,
                  alt: imgAlt,
                },
                children: [],
              },
            ],
          },
        ],
      };

      // Replace the original img with trigger + lightbox
      parent.children.splice(index, 1, triggerLink, lightbox);
    }
  };
}
