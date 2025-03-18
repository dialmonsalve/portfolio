import { AnimationService } from "@lib/components/animationService";

import { DownLoadImages } from "./download-images";
import { AbstractUpdateDOM } from "./abstract-update-DOM";
import type { Formats, IAnimationService } from "./interfaces";

interface ImageOptimized {
  url: string;
  webpImage: File;
}

interface IUpdateDOM {
  files: FileList;
  dropZone: HTMLLabelElement;
  allImages: ImageOptimized[];
  conserveOriginalName?: boolean;
  format?: Formats;
  quality?: number;
  animations?: IAnimationService;
}

export class UpdateDOMToDownload extends AbstractUpdateDOM {
  private readonly animations: IAnimationService;
  constructor(config: IUpdateDOM) {
    super(config);

    this.animations = config.animations || "fadeOut";
  }

  protected createSaveButton = (): HTMLElement | undefined => {
    const container = document.createElement("div");
    container.classList.add("flex", "gap-2");

    const downloadImages = new DownLoadImages();

    const imgs = this.getImages();
    const lastLink = document.querySelector(
      "#save-images"
    ) as HTMLAnchorElement;

    if (lastLink) {
      if (imgs.length > 1) {
        downloadImages.multiple(imgs).then((resp) => {
          const zipUrl = URL.createObjectURL(resp);
          lastLink.href = zipUrl;
          lastLink.download = "imagenes.zip";
        });
      } else {
        downloadImages.simple(lastLink, imgs[0]);
      }
    } else {
      const link = document.createElement("a");
      link.id = "save-images";
      link.textContent = "Guardar";
      link.classList.add(
        "bg-primary",
        "cursor-pointer",
        "py-1",
        "px-2",
        "text-white",
        "rounded-md",
        "hover:opacity-80"
      );

      if (imgs.length > 1) {
        downloadImages.multiple(imgs).then((resp) => {
          const zipUrl = URL.createObjectURL(resp);
          link.href = zipUrl;
          link.download = "imagenes.zip";
        });
      } else {
        downloadImages.simple(link, imgs[0]);
      }

      container.appendChild(link);

      return container;
    }
  };

  protected async deleteImages(images: ImageOptimized[], imageName: string) {
    const downloadImages = new DownLoadImages();
    const index = images.findIndex(
      (elemento) => elemento.webpImage.name === imageName
    );

    if (index !== -1) {
      images.splice(index, 1);
    }

    const lastLink = document.querySelector(
      "#save-images"
    ) as HTMLAnchorElement;

    if (lastLink) {
      const imgs = this.getImages();

      if (imgs.length > 1) {
        const zipBlob = await downloadImages.multiple(imgs);
        const zipUrl = URL.createObjectURL(zipBlob);
        lastLink.href = zipUrl;
        lastLink.download = "imagenes.zip";
      } else {
        downloadImages.simple(lastLink, imgs[0]);
      }
    }
  }

  protected handleDelete = async (evt: Event) => {
    const target = evt.target as HTMLButtonElement;
    const parentElement = target.parentElement;
    const image = target.previousElementSibling as HTMLImageElement;

    this.deleteImages(this.allImages, image.alt);

    if (parentElement) {
      await AnimationService.animateRemove(parentElement, this.animations);
    }

    const countImages = this.modifyParagraph();

    if (countImages === 0) {
      const button = document.querySelector("#save-images") as HTMLElement;

      button.classList.add("pointer-events-none");

      button.parentElement?.remove();
      document.querySelector("#parent-images")?.remove();
    }
  };
}
