import { clientT } from "@/lib/i18n";
import { Image } from "./image";
import Spinner from "./spinner";

import type { Formats, ImageOptimized } from "./interfaces";

interface IUpdateDOM {
  action?: () => void;
  files: FileList;
  dropZone: HTMLLabelElement;
  allImages: ImageOptimized[];
  conserveOriginalName?: boolean;
  format?: Formats;
  quality?: number;
}

export abstract class AbstractUpdateDOM {
  public parent: HTMLDivElement;
  protected imageProcessor: Image;
  public allImages: ImageOptimized[];

  constructor(protected config: IUpdateDOM) {
    this.parent = config.dropZone.closest(
      "#parent-drop-zone"
    ) as HTMLDivElement;

    this.imageProcessor = new Image(
      config.conserveOriginalName,
      config.format,
      config.quality
    );

    this.allImages = config.allImages;
  }

  protected setImages(images: ImageOptimized[]) {
    this.allImages.push(...images!);
  }

  protected getImages(): ImageOptimized[] {
    return this.allImages;
  }

  protected createImageContainer = (image: ImageOptimized): HTMLDivElement => {
    const container = document.createElement("div");
    container.dataset.imageCard = image.url;
    container.className =
      "flex flex-col gap-2 rounded-xl border border-base-300 bg-base-100 p-2 shadow-sm";
    return container;
  };

  private formatSize(bytes: number) {
    const locale = document.documentElement.lang || "es";
    const kilobytes = bytes / 1024;
    const [value, unit] =
      kilobytes < 1024 ? [kilobytes, "KB"] : [kilobytes / 1024, "MB"];
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${unit}`;
  }

  private createCaption = (image: ImageOptimized): HTMLDivElement => {
    const { name, type, size } = image.webpImage;
    const caption = document.createElement("div");
    caption.className = "flex items-center justify-between gap-2 px-1";

    const info = document.createElement("p");
    info.className = "min-w-0 text-xs leading-tight";

    const fileName = document.createElement("span");
    fileName.className = "block truncate font-medium";
    fileName.textContent = `${name}.${type.split("/").at(-1)}`;
    fileName.title = fileName.textContent;

    const fileSize = document.createElement("span");
    fileSize.className = "block text-muted";
    fileSize.textContent = this.formatSize(size);

    info.append(fileName, fileSize);
    caption.append(info, this.createDeleteButton(fileName.textContent));
    return caption;
  };

  protected createDeleteButton = (fileName: string): HTMLButtonElement => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = clientT("delete");
    button.setAttribute("aria-label", `${clientT("delete")} ${fileName}`);
    button.className =
      "btn btn-ghost btn-xs shrink-0 text-error-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
    button.addEventListener("click", this.handleDelete);
    return button;
  };

  protected getCardFromEvent(evt: Event) {
    const card = (evt.currentTarget as HTMLElement).closest<HTMLElement>(
      "[data-image-card]",
    );
    return { card, url: card?.dataset.imageCard };
  }

  public createImages = async (): Promise<void> => {
    const parentImages = document.querySelector("#parent-images");
    const spinner = new Spinner();

    this.config.dropZone.classList.add(
      "pointer-events-none",
      "duration-300",
      "animate-pulse"
    );

    try {
      const container = this.prepareImageContainer();

      if (parentImages) {
        parentImages?.appendChild(spinner.getElement());
      } else {
        this.parent?.appendChild(spinner.getElement());
      }

      const images = await this.imageProcessor.create(this.config.files);
      this.setImages(images);
      const imageElements = await this.processImages(images);

      this.appendToDOM(container, imageElements);
      this.modifyParagraph();
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      spinner.getElement().remove();
      this.config.dropZone.classList.remove(
        "pointer-events-none",
        "duration-300",
        "animate-pulse"
      );
    }
  };

  private prepareImageContainer = (): HTMLElement => {
    const parentImages = document.querySelector("#parent-images");
    if (!parentImages) {
      const container = document.createElement("div");
      container.id = "parent-images";
      container.className =
        "mt-6 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4";
      return container;
    }

    return parentImages as HTMLElement;
  };

  private processImages = async (
    images: ImageOptimized[]
  ): Promise<HTMLElement[]> => {
    return Promise.all(
      images.map(async (image) => {
        const container = this.createImageContainer(image);
        const frame = document.createElement("div");
        frame.className =
          "relative aspect-square overflow-hidden rounded-lg bg-base-200";
        const imageElement = this.createImageElement(image);

        frame.appendChild(imageElement);
        container.append(frame, this.createCaption(image));

        await this.loadImageWithSpinner(imageElement, frame);
        return container;
      })
    );
  };

  private loadImageWithSpinner = async (
    image: HTMLImageElement,
    container: HTMLDivElement
  ): Promise<void> => {
    const spinner = new Spinner("absolute inset-0 grid place-items-center");
    container.appendChild(spinner.getElement());

    return new Promise((resolve) => {
      image.onload = image.onerror = () => {
        spinner.getElement().remove();
        resolve();
      };
    });
  };

  private createImageElement = (image: ImageOptimized): HTMLImageElement => {
    const imageElement = document.createElement("img");

    const name = image.webpImage.name;
    const ext = image.webpImage.type.split("/").at(-1);

    imageElement.src = image.url;
    imageElement.alt = image.webpImage.name;
    imageElement.className =
      "absolute inset-0 h-full w-full object-contain p-1.5 images-to-upload";
    imageElement.setAttribute("data-name", `${name}.${ext}`);
    return imageElement;
  };

  private appendToDOM = (container: HTMLElement, elements: HTMLElement[]) => {
    const parentImages = document.querySelector("#parent-images");
    const button = this.createSaveButton();
    if (!parentImages) {
      elements.forEach((element) => container.appendChild(element));
      this.parent.appendChild(container);
      if (button) {
        this.parent.appendChild(button);
      }
      return;
    }
    if (button) {
      this.parent.appendChild(button);
    }

    elements.forEach((element) => parentImages?.appendChild(element));
  };

  protected modifyParagraph = () => {
    const paragraph = document.querySelector(
      "#lbl-selected-files"
    ) as HTMLParagraphElement;

    const images = document.querySelectorAll(".images-to-upload");

    const text =
      images.length === 1
        ? clientT("oneFileSelected")
        : clientT("filesSelected", { n: images.length });

    const strong = document.createElement("strong");
    strong.textContent = text;
    paragraph.replaceChildren(strong);

    return images.length;
  };

  protected abstract createSaveButton(): HTMLElement | undefined;

  protected abstract deleteImages(
    images: ImageOptimized[],
    imageUrl: string
  ): void;

  protected abstract handleDelete(evt: Event): Promise<void>;
}
