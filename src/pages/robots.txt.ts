import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() || "https://kahlstrm.xyz";
  const isProduction = siteUrl.includes("kahlstrm.xyz");

  const robotsTxt = isProduction
    ? `User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap-index.xml`
    : `User-agent: *
Disallow: /`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
