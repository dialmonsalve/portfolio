import { AnimationService } from "@lib/components/animationService";

import { AbstractUpdateDOM } from "./abstract-update-DOM";
import type { Formats, IAnimationService } from "./interfaces";

interface ImageOptimized {
  url: string;
  webpImage: File;
}

interface IUpdateDOM {
  action?: () => void;
  files: FileList;
  dropZone: HTMLLabelElement;
  allImages: ImageOptimized[];
  conserveOriginalName?: boolean;
  format?: Formats;
  quality?: number;
  animations?: IAnimationService;
}

export class UpdateDOMToUpload extends AbstractUpdateDOM {
  private readonly animations: IAnimationService;

  constructor(config: IUpdateDOM) {
    super(config);

    this.animations = config.animations || "fadeOut";
  }

  protected createSaveButton = (): HTMLElement | undefined => {
    const container = document.createElement("div");
    container.classList.add("flex", "gap-2");

    const btn = document.querySelector("#save-images");

    if (btn) {
      return;
    }

    const button = document.createElement("button");
    button.id = "save-images";
    button.textContent = "Guardar";
    button.classList.add(
      "bg-primary",
      "cursor-pointer",
      "py-1",
      "px-2",
      "text-white",
      "rounded-md",
      "hover:opacity-80"
    );

    if (this.config.action) {
      button.addEventListener("click", this.config.action);
    }

    container.appendChild(button);

    return container;
  };

  protected deleteImages(images: ImageOptimized[], imageName: string) {
    const index = images.findIndex(
      (elemento) => elemento.webpImage.name === imageName
    );

    if (index !== -1) {
      this.allImages.splice(index, 1);
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
