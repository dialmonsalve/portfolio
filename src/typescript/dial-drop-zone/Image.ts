
interface Images {
  urlObj: string;
  fileName: string;
  ext: string;
}

const drawer = document.createElement("canvas");
drawer.style.display = "none";
drawer.id = "drawer";
document.body.appendChild(drawer);

export class Image {
  constructor() {}

  create = async (files: FileList): Promise<Images[]> => {
    const images = await Promise.all(
      Array.from(files).map(async (file) => {
        const $labelImage = document.querySelector("#label-image");
        if ($labelImage) $labelImage.classList.add("hidden");

        const img = await createImageBitmap(file, {
          resizeQuality: "high",
          premultiplyAlpha: "premultiply",
          imageOrientation: "none",
        });

        drawer.height = img.height;
        drawer.width = img.width;
        const ctx = drawer.getContext("2d");
        ctx?.drawImage(img, 0, 0, img.width, img.height);

        return new Promise((resolve) => {
          drawer.toBlob(
            (blob) => {
              if (!blob) return;
              const uuid = Image.getUUID();
              const ext = "webp";
              const webpImage = new File([blob], uuid, {
                type: `image/${ext}`,
              });

              const urlObj = URL.createObjectURL(webpImage);

              resolve({
                urlObj,
                fileName: uuid,
                ext,
              });
            },
            "image/jpeg",
            // quality
            0.95
          );
          ctx?.reset();
        });
      })
    );
    return images.filter((image): image is Images => image !== null);
  };

  static getUUID = () => {
    const buffer = new ArrayBuffer(24);
    const bigint64 = new BigUint64Array(buffer);

    const uuid = crypto.getRandomValues(bigint64);

    return uuid[0] + "-" + uuid[1] + "-" + uuid[2];
  };

}
