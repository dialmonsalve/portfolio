import { Image } from "./Image";

export class LoadImages extends HTMLElement {
  constructor() {
    super();

    const body = document.querySelector("body");
    const drawer = document.createElement("canvas");

    const uploads = this.querySelectorAll(
      `.uploader-image`
    ) as NodeListOf<HTMLDivElement>;
    drawer.style.display = "none";
    drawer.id = "drawer";
    body?.appendChild(drawer);

    for (const item of uploads) {
      const $parentDiv = this.querySelector(
        `#container-${item.id}`
      ) as HTMLDivElement;

      $parentDiv?.addEventListener("click", this.addImageByClick);
      $parentDiv?.addEventListener("drop", this.addImageByDrop);
      $parentDiv?.addEventListener("dragover", this.changeStatus);
      $parentDiv.addEventListener("dragleave", this.dragLeave);
    }
  }

  addImageByClick = (evt: MouseEvent) => {
    evt.stopPropagation();

    const target = evt.target as HTMLInputElement;

    if(target.id ==='drag-and-drop-text') return
    const parent = target.closest("#container-components");
    const obj = parent?.querySelector('input[type="file"]') as HTMLInputElement;

    obj?.addEventListener("change", this.loadImage);
    obj?.click();
  };

  addImageByDrop = (evt: DragEvent) => {
    evt.preventDefault();

    const target = evt.target as HTMLInputElement;
    const parent = target.closest("#container-components") as HTMLDivElement;

    const file = evt.dataTransfer?.files.item(0);

    new Image().create(file, parent);

    const $container = parent.querySelector(
      "#container-image"
    ) as HTMLDivElement;

    $container.classList.remove("border-green-500");
    $container.classList.add("border-gray-300");
  };

  loadImage = (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    const file = target.files?.[0];
    const obj = document.querySelector(
      `#container-${target.id}`
    ) as HTMLDivElement;

    new Image().create(file, obj);
  };

  changeStatus = (evt: DragEvent) => {
    evt.preventDefault();
    const target = evt.target as HTMLDivElement;
    const parent = target.closest("#container-components") as HTMLDivElement;
    const $container = parent.querySelector(
      "#container-image"
    ) as HTMLDivElement;

    $container.classList.remove("border-gray-300");
    $container.classList.add("border-green-500");
  };

  dragLeave = (evt: DragEvent) => {
    const target = evt.target as HTMLInputElement;
    const parent = target.closest("#container-components") as HTMLDivElement;

    const $container = parent.querySelector(
      "#container-image"
    ) as HTMLDivElement;

    $container.classList.remove("border-green-500");
    $container.classList.add("border-gray-300");
  };
}

customElements.define("load-images", LoadImages);
