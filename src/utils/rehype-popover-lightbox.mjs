import { createHash } from "node:crypto";

const isElement = (node, tagName) =>
  node?.type === "element" && node.tagName === tagName;

const isIgnorableText = (node) =>
  node?.type === "text" && node.value.trim().length === 0;

const deepCloneNode = (node) => {
  if (!node || typeof node !== "object") {
    return node;
  }

  return {
    ...node,
    properties: node.properties ? { ...node.properties } : undefined,
    children: Array.isArray(node.children)
      ? node.children.map((child) => deepCloneNode(child))
      : undefined,
  };
};

const getStandaloneImage = (paragraphNode) => {
  if (
    !isElement(paragraphNode, "p") ||
    !Array.isArray(paragraphNode.children)
  ) {
    return null;
  }

  const significantChildren = paragraphNode.children.filter(
    (child) => !isIgnorableText(child),
  );

  if (significantChildren.length !== 1) {
    return null;
  }

  const [onlyChild] = significantChildren;
  return isElement(onlyChild, "img") ? onlyChild : null;
};

const appendClassName = (properties, className) => {
  const current = properties?.className;

  if (!current) {
    return [className];
  }

  if (Array.isArray(current)) {
    return [...current, className];
  }

  if (typeof current === "string") {
    return [...current.split(/\s+/).filter(Boolean), className];
  }

  return [className];
};

const buildLightboxFigure = (imgNode, popoverId) => {
  const altText = String(imgNode.properties?.alt ?? "").trim();
  const triggerLabel = altText ? `Open image: ${altText}` : "Open image";
  const closeLabel = altText
    ? `Close image preview: ${altText}`
    : "Close image preview";
  const dialogLabel = altText ? `Image preview: ${altText}` : "Image preview";

  const triggerImage = deepCloneNode(imgNode);
  triggerImage.properties = {
    ...(triggerImage.properties ?? {}),
    className: appendClassName(
      triggerImage.properties,
      "blog-image-lightbox__image",
    ),
  };

  const popoverImage = deepCloneNode(imgNode);
  popoverImage.properties = {
    ...(popoverImage.properties ?? {}),
    className: appendClassName(
      popoverImage.properties,
      "blog-image-lightbox__popover-image",
    ),
  };

  const popoverChildren = [
    {
      type: "element",
      tagName: "button",
      properties: {
        type: "button",
        className: ["blog-image-lightbox__close"],
        popovertarget: popoverId,
        popovertargetaction: "hide",
        "aria-label": closeLabel,
      },
      children: [{ type: "text", value: "Close" }],
    },
    {
      type: "element",
      tagName: "div",
      properties: {
        className: ["blog-image-lightbox__media"],
      },
      children: [popoverImage],
    },
  ];

  if (altText) {
    popoverChildren.push({
      type: "element",
      tagName: "p",
      properties: {
        className: ["blog-image-lightbox__caption"],
      },
      children: [{ type: "text", value: altText }],
    });
  }

  return {
    type: "element",
    tagName: "figure",
    properties: {
      className: ["blog-image-lightbox"],
    },
    children: [
      {
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          className: ["blog-image-lightbox__trigger"],
          popovertarget: popoverId,
          "aria-label": triggerLabel,
        },
        children: [triggerImage],
      },
      {
        type: "element",
        tagName: "div",
        properties: {
          id: popoverId,
          popover: "auto",
          role: "dialog",
          "aria-label": dialogLabel,
          className: ["blog-image-lightbox__popover"],
        },
        children: popoverChildren,
      },
    ],
  };
};

const transformNode = (node, fileHash, imageCounterRef) => {
  if (!node || typeof node !== "object" || !Array.isArray(node.children)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const childNode = node.children[index];
    const standaloneImage = getStandaloneImage(childNode);

    if (standaloneImage) {
      imageCounterRef.value += 1;
      const popoverId = `blog-image-lightbox-${fileHash}-${imageCounterRef.value}`;
      node.children[index] = buildLightboxFigure(standaloneImage, popoverId);
      continue;
    }

    transformNode(childNode, fileHash, imageCounterRef);
  }
};

export default function rehypePopoverLightbox() {
  return (tree, file) => {
    const filePath = typeof file.path === "string" ? file.path : "unknown";
    const fileHash = createHash("sha1")
      .update(filePath)
      .digest("hex")
      .slice(0, 8);
    const imageCounterRef = { value: 0 };

    transformNode(tree, fileHash, imageCounterRef);
  };
}
