import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

const createImageOnCloud = defineAction({
  input: z.object({
    imageType: z.string().min(1),
    base64Image: z.string().min(1),
  }),

  

  handler: async ({ base64Image, imageType }) => {
    const rep = await cloudinary.uploader.upload(
      `data:image/${imageType};base64,${base64Image}`
    );

    // cloudinary.api.delete_resources([], {type:"upload", resource_type:"image"})

    return rep;
  },
});

export const server = { createImageOnCloud };
