import { defineCollection, z } from "astro:content";

const collectionProject = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    isExternalProject: z.boolean(),
    href: z.string(),
    technology: z.string(),
    scripts: z.string(),
    styles: z.string(),
  }),
});

export const collections = {
  projects_es: collectionProject,
  projects_en: collectionProject,
};
