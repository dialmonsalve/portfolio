import type { ImageOptimized } from "@lib/utils/dial-drop-zone/interfaces";
import { AnimationService } from "../animationService";

import { Image } from "./Image";
import Spinner from "@lib/utils/dial-drop-zone/spinner";

interface IUpdateDOMToSend {
  action: () => void;
  files: FileList;
  dropZone: HTMLLabelElement;
  allImages: ImageOptimized[];
  height: number;
  width: number;
  name: string;
  mode?: "cover" | "contain";
}

export class UpdateDOMToSend {
  private parent: HTMLDivElement;
  private parentImages: Element | null;
  private imageProcessor: Image;
  private allImages: ImageOptimized[];
  private height: number;
  private width: number;
  private name: string;
  private mode?: "cover" | "contain";

  constructor(private config: IUpdateDOMToSend) {
    this.parent = config.dropZone.closest(
      "#parent-single-drop-zone"
    ) as HTMLDivElement;
    this.parentImages = document.querySelector("#parent-images");
    this.imageProcessor = new Image();

    this.allImages = config.allImages;
    this.name = config.name;
    this.height = config.height;
    this.width = config.width;
    this.mode = config.mode
  }

  public createImages = async () => {
    const spinner = new Spinner("absolute");
    this.config.dropZone.classList.add(
      "opacity-0",
      "pointer-events-none",
      "transition-opacity",
      "duration-300",
      "animate-pulse"
    );

    try {
      const container = this.prepareImageContainer();

      this.parent?.appendChild(spinner.getElement());

      const images = await this.imageProcessor.create(this.config.files, 0, {
        targetHeight: this.height,
        targetWidth: this.width,
        mode: this.mode
      });
      const imageElements = await this.processImages(images);

      this.appendToDOM(container, imageElements);

      this.allImages.push(...images!);
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      this.config.dropZone.classList.remove(
        "opacity-0",
        "pointer-events-none",
        "animate-pulse"
      );
      spinner.getElement().remove();
    }
  };

  private prepareImageContainer = (): HTMLElement => {
    if (!this.parentImages) {
      const container = document.createElement("div");
      container.id = "parent-images";
      return container;
    }

    this.parentImages.classList.add(
      "flex",
      "items-center",
      "w-full",
      "justify-items-center",
      "flex-col",
      "gap-1"
    );
    return this.parentImages as HTMLElement;
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

  private createImageContainer = (): HTMLDivElement => {
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

  private createImageElement = (image: ImageOptimized): HTMLImageElement => {
    const imageElement = document.createElement("img");
    const name = image.webpImage.name;
    const ext = image.webpImage.type;
    imageElement.src = image.url;
    imageElement.alt = this.name;
    imageElement.className = `inline-block object-contain images-to-upload border border-gray-300 rounded-md shadow shadow-gray-400`;
    imageElement.setAttribute("data-name", `${name}.${ext}`);
    return imageElement;
  };

  private createDeleteButton = (): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = "Eliminar";
    button.type = "button";

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

  private handleDelete = async (evt: Event) => {
    const target = evt.target as HTMLButtonElement;
    const parentElement = target.parentElement;
    const image = target.previousElementSibling as HTMLImageElement;

    const index = this.allImages.findIndex(
      (elemento) => elemento.webpImage.name === image.alt
    );

    if (index !== -1) {
      this.allImages.splice(index, 1);
    }

    if (parentElement) {
      await AnimationService.animateRemove(parentElement, "spinOut");
    }

    this.config.dropZone.classList.remove("hidden");
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

  private appendToDOM = (container: HTMLElement, elements: HTMLElement[]) => {
    if (!this.parentImages) {
      elements.forEach((element) => container.appendChild(element));
      this.parent.appendChild(container);
      return;
    }

    elements.forEach((element) => this.parentImages?.appendChild(element));
  };
}