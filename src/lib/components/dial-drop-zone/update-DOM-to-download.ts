import { DownLoadImages } from "./download-images";
import { Image } from "./Image";

import Spinner from "./spinner";

interface ImageOptimized {
  urlObj: string;
  fileName: string;
  ext: string;
  webpImage: File;
}

export class UpdateDOMToDownload {
  constructor() {}

  static createImages = async (files: FileList, dropZone: HTMLLabelElement) => {
    const parent = dropZone.closest("#parent-drop-zone") as HTMLDivElement;
    const container = document.createElement("div");

    dropZone.classList.add("hidden");
    container.classList.add("grid", "gap-2");
    const image = new Image(true);

    const oneSpinner = new Spinner();
    parent?.appendChild(oneSpinner.getElement());

    try {
      const images = await image.create(files);

      const imagesLength = images.length;

      UpdateDOMToDownload.andAddClasesAtParentNode(imagesLength, container);

      images.map((imageOptimized) => {
        const spinner = new Spinner("absolute top-12 left-10");
        const containerImg = document.createElement("div");

        containerImg?.appendChild(spinner.getElement());

        const image = UpdateDOMToDownload.andCreateImage(imageOptimized);

        image.onload = () => {
          spinner.getElement().remove();
        };

        container.appendChild(containerImg);
        containerImg.appendChild(image);

        parent?.appendChild(container);
      });
      const containerLinks = document.createElement("div");
      containerLinks.classList.add("flex", "gap-2");

      const link = UpdateDOMToDownload.andCreateLink();
      const linkClear = UpdateDOMToDownload.andCreateLinkToCleanScreen();
      const downloadImages = new DownLoadImages();

      if (imagesLength > 1) {
        const zipBlob = await downloadImages.multiple(images);
        const zipUrl = URL.createObjectURL(zipBlob);
        link.href = zipUrl;
        link.download = "imagenes.zip";
      } else {
        downloadImages.simple(link);
      }

      containerLinks.appendChild(link);
      containerLinks.appendChild(linkClear);
      parent.appendChild(containerLinks);
    } catch (error) {
      dropZone.classList.remove("hidden");
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

  static andCreateLink = () => {
    const link = document.createElement("a");

    link.textContent = "Descargar";

    link.classList.add(
      "bg-primary",
      "cursor-pointer",
      "py-1",
      "px-2",
      "text-white",
      "rounded-md",
      "hover:opacity-80"
    );

    return link;
  };

  static andCreateLinkToCleanScreen = () => {
    const link = document.createElement("a");

    link.href = "/projects/convert-images";

    link.textContent = "Subir más";

    link.classList.add(
      "bg-green-700",
      "dark:bg-blue-700",
      "cursor-pointer",
      "py-1",
      "px-2",
      "text-white",
      "rounded-md",
      "hover:opacity-80"
    );

    return link;
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
