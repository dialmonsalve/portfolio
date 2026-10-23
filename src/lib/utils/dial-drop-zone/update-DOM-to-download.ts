import { clientT } from "@/lib/i18n";
import { AnimationService } from "@/lib/components/animationService";

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
    container.className = "mt-4 flex gap-2";

    const downloadImages = new DownLoadImages();

    const imgs = this.getImages();
    const lastLink = document.querySelector(
      "#save-images"
    ) as HTMLAnchorElement;

    if (lastLink) {
      if (imgs.length > 1) {
        downloadImages.multiple(imgs).then((resp) => {
          this.setZipLink(lastLink, resp);
        });
      } else {
        downloadImages.simple(lastLink, imgs[0]);
      }
    } else {
      const link = document.createElement("a");
      link.id = "save-images";
      link.textContent = clientT("save");
      link.className =
        "btn btn-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

      if (imgs.length > 1) {
        downloadImages.multiple(imgs).then((resp) => {
          this.setZipLink(link, resp);
        });
      } else {
        downloadImages.simple(link, imgs[0]);
      }

      container.appendChild(link);

      return container;
    }
  };

  private setZipLink(link: HTMLAnchorElement, zip: Blob) {
    this.revokeZipLink(link);
    const zipUrl = URL.createObjectURL(zip);
    link.dataset.zipUrl = zipUrl;
    link.href = zipUrl;
    link.download = "imagenes.zip";
  }

  private revokeZipLink(link: HTMLAnchorElement) {
    if (link.dataset.zipUrl) {
      URL.revokeObjectURL(link.dataset.zipUrl);
      delete link.dataset.zipUrl;
    }
  }

  protected async deleteImages(images: ImageOptimized[], imageUrl: string) {
    const downloadImages = new DownLoadImages();
    const index = images.findIndex(
      (elemento) => elemento.url === imageUrl
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
        this.setZipLink(lastLink, zipBlob);
      } else {
        this.revokeZipLink(lastLink);
        downloadImages.simple(lastLink, imgs[0]);
      }
    }
  }

  protected handleDelete = async (evt: Event) => {
    const { card, url } = this.getCardFromEvent(evt);
    if (!card || !url) return;

    this.deleteImages(this.allImages, url);

    await AnimationService.animateRemove(card, this.animations);

    URL.revokeObjectURL(url);

    const countImages = this.modifyParagraph();

    if (countImages === 0) {
      const button = document.querySelector("#save-images") as HTMLElement;

      button.classList.add("pointer-events-none");
      if (button instanceof HTMLAnchorElement) this.revokeZipLink(button);

      button.parentElement?.remove();
      document.querySelector("#parent-images")?.remove();
    }
  };
}
