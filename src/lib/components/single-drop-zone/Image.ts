import type { ImageOptimized } from "@lib/utils/dial-drop-zone/interfaces";

const drawer = document.createElement("canvas");
drawer.style.display = "none";
drawer.id = "drawer";
document.body.appendChild(drawer);

type ResizeOptions = {
  targetWidth?: number;
  targetHeight?: number;
  mode?: "cover" | "contain";
};

export class Image {
  constructor(private readonly conserveOriginalName: boolean = false) {}

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    options: ResizeOptions
  ) {
    const { targetWidth, targetHeight, mode = "cover" } = options;

    if (!targetWidth && !targetHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    if (!targetWidth && targetHeight) {
      return {
        width: originalWidth * (targetHeight / originalHeight),
        height: targetHeight,
      };
    }

    if (targetWidth && !targetHeight) {
      return {
        width: targetWidth,
        height: originalHeight * (targetWidth / originalWidth),
      };
    }

    if (targetWidth && targetHeight) {
      return mode === "cover"
        ? this.calculateCover(
            originalWidth,
            originalHeight,
            targetWidth,
            targetHeight
          )
        : { width: targetWidth, height: targetHeight };
    }

    return { width: originalWidth, height: originalHeight };
  }

  private calculateCover(
    originalWidth: number,
    originalHeight: number,
    targetWidth: number,
    targetHeight: number
  ) {
    const originalRatio = originalWidth / originalHeight;
    const targetRatio = targetWidth / targetHeight;

    let srcX = 0,
      srcY = 0,
      srcWidth = originalWidth,
      srcHeight = originalHeight;

    if (originalRatio > targetRatio) {
      srcWidth = originalHeight * targetRatio;
      srcX = (originalWidth - srcWidth) / 2;
    } else {
      srcHeight = originalWidth / targetRatio;
      srcY = (originalHeight - srcHeight) / 2;
    }

    return {
      width: targetWidth,
      height: targetHeight,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
    };
  }

  async create(
    files: FileList,
    order: number,
    resizeOptions: ResizeOptions = {}
  ): Promise<ImageOptimized[]> {
    const images = await Promise.all(
      Array.from(files).map(async (file) => {
        const img = await createImageBitmap(file, {
          resizeQuality: "high",
          premultiplyAlpha: "premultiply",
          imageOrientation: "from-image",
        });

        const dimensions = this.calculateDimensions(
          img.width,
          img.height,
          resizeOptions
        );

        drawer.width = dimensions.width;
        drawer.height = dimensions.height;
        const ctx = drawer.getContext("2d");

        if (!ctx) throw new Error("Canvas context not available");

        if ("srcX" in dimensions) {
          ctx.drawImage(
            img,
            dimensions.srcX,
            dimensions.srcY,
            dimensions.srcWidth,
            dimensions.srcHeight,
            0,
            0,
            dimensions.width,
            dimensions.height
          );
        } else {
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            dimensions.width,
            dimensions.height
          );
        }

        return new Promise((resolve, reject) => {
          drawer.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Blob not created"));

              const fileName = this.conserveOriginalName
                ? file.name.split(".").at(-2)?.toString() || ""
                : crypto.randomUUID();

              const webpImage = new File([blob], `${fileName}.webp`, {
                type: "image/webp",
              });

              const url = URL.createObjectURL(webpImage);
              resolve({
                webpImage,
                url,
                order: order++,
              });
            },
            "image/webp",
            0.6
          );
          ctx.reset();
        });
      })
    );

    return images.filter((image): image is ImageOptimized => image !== null);
  }
}
