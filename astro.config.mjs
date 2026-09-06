// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { siteConfig } from "./src/config/site.ts";

export default defineConfig({
  site: siteConfig.domain,
  base: siteConfig.base,
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !page.endsWith("/rss.xml"),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-IN",
          te: "te-IN",
        },
      },
    }),
  ],
});
