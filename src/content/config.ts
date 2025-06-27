import { defineCollection } from "astro:content";
import { z } from "astro:schema";

const collectionProject = defineCollection({
  type: "content",
  schema: z.object({
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
  }),
});

export const collections = {
  projects_es: collectionProject,
  projects_en: collectionProject,
};
