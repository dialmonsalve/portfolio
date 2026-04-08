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

  protected createImageContainer = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "justify-items-center",
      "gap-1"
    );
    return container;
  };

  protected createDeleteButton = (): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = "Eliminar";

    button.classList.add(
      "bg-red-400",
      "text-white",
      "text-xs",
      "cursor-pointer",
      "hover:opacity-80",
      "px-2",
      "py-1",
      "rounded-md"
    );
    button.addEventListener("click", this.handleDelete);
    return button;
  };

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
      container.classList.add(
        "grid",
        "gap-2",
        "grid-cols-2",
        "w-full",
        "justify-items-center",
        "items-center"
      );
      return container;
    }

    return parentImages as HTMLElement;
  };

  private processImages = async (
    images: ImageOptimized[]
  ): Promise<HTMLElement[]> => {
    return Promise.all(
      images.map(async (image) => {
        const container = this.createImageContainer();
        const imageElement = this.createImageElement(image);
        const deleteButton = this.createDeleteButton();

        container.appendChild(imageElement);
        container.appendChild(deleteButton);

        await this.loadImageWithSpinner(imageElement, container);
        return container;
      })
    );
  };

  private loadImageWithSpinner = async (
    image: HTMLImageElement,
    container: HTMLDivElement
  ): Promise<void> => {
    const spinner = new Spinner("absolute top-12 left-10");
    container.appendChild(spinner.getElement());

    return new Promise((resolve) => {
      image.onload = () => {
        spinner.getElement().remove();
        resolve();
      };
    });
  };

  private createImageElement = (image: ImageOptimized): HTMLImageElement => {
    const imageElement = document.createElement("img");

    const name = image.webpImage.name;
    const ext = image.webpImage.type.split("/").at(-1);
    imageElement.id = "converted-image";

    imageElement.src = image.url;
    imageElement.alt = image.webpImage.name;
    imageElement.className =
      "block w-full object-contain max-h-[240px] images-to-upload";
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
        ? "1 archivo seleccionado"
        : `${images.length} archivos seleccionado`;

    paragraph.innerHTML = `<strong>${text}</strong>`;

    return images.length;
  };

  protected abstract createSaveButton(): HTMLElement | undefined;

  protected abstract deleteImages(
    images: ImageOptimized[],
    imageName: string
  ): void;

  protected abstract handleDelete(evt: Event): Promise<void>;
}
