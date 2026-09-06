import type { APIRoute } from "astro";
import { getSiteOrigin } from "../utils/urls";

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${getSiteOrigin()}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
