import type { Formats, ImageOptimized } from "./interfaces";

const drawer = document.createElement("canvas");
drawer.style.display = "none";
drawer.id = "drawer";
document.body.appendChild(drawer);

export class Image {
  constructor(
    private readonly conserveOriginalName: boolean = true,
    private readonly format: Formats = "webp",
    private readonly quality: number = 95
  ) {}

  public create = async (files: FileList): Promise<ImageOptimized[]> => {
    const images = await Promise.all(
      Array.from(files).map(async (file) => {
        const img = await createImageBitmap(file, {
          resizeQuality: "high",
          premultiplyAlpha: "premultiply",
          imageOrientation: "from-image",
        });

        drawer.height = img.height;
        drawer.width = img.width;
        const ctx = drawer.getContext("2d");
        ctx?.drawImage(img, 0, 0, img.width, img.height);

        return new Promise((resolve, reject) => {
          drawer.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Blob not created"));

              const fileName = this.conserveOriginalName
                ? file.name.split(".").at(-2)?.toString() || ""
                : crypto.randomUUID();
              const ext = this.format;
              const webpImage = new File([blob], fileName, {
                type: `image/${ext}`,
              });

              const url = URL.createObjectURL(webpImage);
              resolve({
                webpImage,
                url,
              });
            },
            `image/${this.format}`,
            ( this.quality / 100)
          );
          ctx?.reset();
        });
      })
    );
    return images.filter((image): image is ImageOptimized => image !== null);
  };
}
