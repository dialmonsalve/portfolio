import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projectSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  images: z.array(z.string()),
  isExternalProject: z.boolean(),
  href: z.string().nonempty(),
  technology: z.string().nonempty(),
  scripts: z.string().nonempty(),
  styles: z.string().nonempty(),
  pngImage: z.string().nonempty(),
  webpImage: z.string().nonempty(),
  metaTitle: z.string().nonempty(),
  metaDescription: z.string().nonempty(),
  slug: z.string().nonempty(),
});

export const collections = {
  projects_es: defineCollection({
    loader: glob({
      pattern: "**/[^_]*.{md,mdx}",
      base: "./src/content/projects_es",
    }),
    schema: projectSchema,
  }),
  projects_en: defineCollection({
    loader: glob({
      pattern: "**/[^_]*.{md,mdx}",
      base: "./src/content/projects_en",
    }),
    schema: projectSchema,
  }),
};
