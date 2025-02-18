import { Image } from "./Image";
import Spinner from "./spinner";

import type { ImageOptimized } from "./interfaces";

export class UpdateDOMToSend {
  static action: () => void;
  constructor(action: () => void) {
    UpdateDOMToSend.action = action;
  }

  static createImages = async (
    files: FileList,
    dropZone: HTMLLabelElement
  ): Promise<ImageOptimized[] | undefined> => {
    const parent = dropZone.closest("#parent-drop-zone") as HTMLDivElement;
    const container = document.createElement("div");

    dropZone.classList.add("hidden");
    container.classList.add("grid", "gap-2");
    const image = new Image();

    const oneSpinner = new Spinner();
    parent?.appendChild(oneSpinner.getElement());

    try {
      const images = await image.create(files);

      const imagesLength = images.length;

      UpdateDOMToSend.andAddClasesAtParentNode(imagesLength, container);

      images.map((imageOptimized) => {
        const spinner = new Spinner("absolute top-12 left-10");
        const containerImg = document.createElement("div");

        containerImg?.appendChild(spinner.getElement());

        const image = UpdateDOMToSend.andCreateImage(imageOptimized);

        image.onload = () => {
          spinner.getElement().remove();
        };

        container.appendChild(containerImg);
        containerImg.appendChild(image);

        parent?.appendChild(container);
      });
      const containerLinks = document.createElement("div");
      containerLinks.classList.add("flex", "gap-2");

      const button = UpdateDOMToSend.andCreateButton();

      containerLinks.appendChild(button);
      parent.appendChild(containerLinks);
      return images;
    } catch (error) {
      dropZone.classList.remove("hidden");
      throw new Error(`${error}`);
    } finally {
      oneSpinner.getElement().remove();
    }
  };

  static andCreateImage = (imageOptimized: ImageOptimized) => {
    const image = document.createElement("img");

    image.src = imageOptimized.urlObj;
    image.alt = imageOptimized.fileName;
    image.id = "converted-image";
    image.setAttribute("data-name", imageOptimized.fileName);
    image.className =
      "block w-full object-contain max-h-[120px] cursor-pointer";

    const fullname = `${imageOptimized.fileName}.${imageOptimized.ext}`;

    image.setAttribute("data-name", fullname);

    return image;
  };

  static andCreateButton = () => {
    const button = document.createElement("button");

    button.textContent = "Subir";

    button.classList.add(
      "bg-primary",
      "cursor-pointer",
      "py-1",
      "px-2",
      "text-white",
      "rounded-md",
      "hover:opacity-80"
    );

    button.addEventListener("click", ()=>UpdateDOMToSend.action());

    return button;
  };

  static andAddClasesAtParentNode = (
    imagesLength: number,
    container: HTMLDivElement
  ) => {
    switch (imagesLength) {
      case 1:
        container.classList.add("grid-cols-1");
        break;
      case 2:
        container.classList.add("grid-cols-1", "sm:grid-cols-2");
        break;
      case 3:
        container.classList.add(
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3"
        );
        break;
      default:
        container.classList.add(
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
          "2xl:grid-cols-6"
        );
        break;
    }
  };
}
