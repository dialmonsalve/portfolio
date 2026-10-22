// @ts-check
import { readdirSync } from "node:fs";
import { defineConfig, envField } from "astro/config";

import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const SITE = "https://dialmonsalve.com";
const LOCALES = ["es", "en"];
const STATIC_ROUTES = [
  "",
  "/about",
  "/projects",
  "/projects/form",
  "/projects/convert-images",
  "/projects/web-components",
];

const projectSlugs = (lang) =>
  readdirSync(new URL(`./src/content/projects_${lang}/`, import.meta.url))
    .filter((file) => /^[^_].*\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));

const sitemapPages = LOCALES.flatMap((lang) => [
  ...STATIC_ROUTES.map((route) => `${SITE}/${lang}${route}`),
  ...projectSlugs(lang).map((slug) => `${SITE}/${lang}/projects/${slug}`),
]);

// https://astro.build/config
export default defineConfig({
  site: `${SITE}/`,
  adapter: cloudflare(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
    },
  },

  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  integrations: [
    sitemap({
      customPages: sitemapPages,
      filter: (page) => page !== `${SITE}/`,
      serialize: (item) => ({ ...item, url: item.url.replace(/(?<=.)\/$/, "") }),
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-CO", en: "en-US" },
      },
    }),
  ],
});
