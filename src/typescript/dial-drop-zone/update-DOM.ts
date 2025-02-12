import { Image } from "./Image";
import Spinner from "./spinner";

export class UpdateDOM {
  constructor() {}

  static createImages = async (files: FileList, dropZone: HTMLLabelElement) => {
    const parent = dropZone.closest("#parent-drop-zone") as HTMLDivElement;
    parent.classList.add("relative");
    const container = document.createElement("div");

    dropZone.classList.add("hidden");
    container.classList.add("grid", "grid-cols-4", "gap-2");
    const image = new Image();

    const oneSpinner = new Spinner();
    parent?.appendChild(oneSpinner.getElement());

    try {
      const images = await image.create(files);

      images.map((i) => {
        const containerImg = document.createElement("div");
        const spinner = new Spinner("absolute top-12 left-10");

        containerImg?.appendChild(spinner.getElement());
        containerImg.classList.add("relative");

        const image = document.createElement("img");

        image.src = i.urlObj;
        image.alt = i.fileName;
        image.id = "converted-image";
        image.className = "block w-full object-contain";

        image.setAttribute("data-name", `${i.fileName}.${i.ext}`);

        containerImg.appendChild(image);

        container.appendChild(containerImg);
        parent?.appendChild(container);

        image.onload = () => {
          spinner.getElement().remove();
        };
      });
    } catch (error) {
      dropZone.classList.remove("hidden");
    } finally {
      oneSpinner.getElement().remove();
    }
  };
}
