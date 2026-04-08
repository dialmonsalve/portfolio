export interface ImageOptimized {
  url: string;
  webpImage: File;
}

export type IAnimationService = "fadeOut" | "scaleOut" | "spinOut" | "slideOutLeft";

export type Formats = "webp" | "png" | "jpeg" | "jpg";