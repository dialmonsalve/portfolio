// @ts-check
import { defineConfig, envField } from "astro/config";

import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const SITE = "https://dialmonsalve.com";
// https://astro.build/config
export default defineConfig({
  site: `${SITE}/`,
  adapter: cloudflare(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  output: "server",
  build: {
    format: "file",
  },
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
      filter: (page) => page !== `${SITE}/`,
      serialize: (item) => ({ ...item, url: item.url.replace(/(?<=.)\/$/, "") }),
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-CO", en: "en-US" },
      },
    }),
  ],
});
