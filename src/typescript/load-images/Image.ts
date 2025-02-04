import { LoadImages } from "./upload.ts";
import { values } from "./utils/changeValues.ts";
import { downloadImage } from "./utils/downloadImage.ts";

interface GetImageOptions {
  id: string;
  name?: string;
}

type CreateFile = File | null | undefined;
type Parent = HTMLDivElement | null;

const drawer = document.createElement("canvas");
drawer.style.display = "none";
drawer.id = "drawer";
document.body.appendChild(drawer);

export class Image {
  constructor() {}

  create = (file: CreateFile, parent: Parent) => {
    if (!file) return;
    const { quality, format } = values();

    const $divParent = document.querySelector(".section-images");
    const $divImage = document.querySelector("#card-image") as HTMLDivElement;

    const $labelImage = document.querySelector("#label-image");
    if ($labelImage) $labelImage.classList.add("hidden");

    createImageBitmap(file, {
      resizeQuality: "high",
      premultiplyAlpha: "premultiply",
      imageOrientation: "none",
    }).then((img) => {
      drawer.height = img.height;
      drawer.width = img.width;
      const ctx = drawer.getContext("2d");
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      drawer.toBlob(
        (blob) => {
          const $buttonDownLoad = document.querySelector("#download-image");
          if ($buttonDownLoad) $buttonDownLoad.remove();
          if (!blob) return;
          const fileName = file.name.split(".").at(-2)?.toString() || "";
          const typeOption = format || "jpeg";
          const webpImage = new File([blob], file.name, {
            type: `image/${typeOption}`,
          });
          const inputText = parent?.querySelector(
            "#input-image"
          ) as HTMLInputElement;

          inputText.textContent =
            fileName + "." + webpImage.type.replace("image/", "");

          const urlObj = URL.createObjectURL(webpImage);
          const image = document.createElement("img");
          const label = document.createElement("label");
          const $buttonDownload = document.createElement("button");
          image.src = urlObj;
          image.alt = fileName;
          image.id = "converted-image";
          image.className =
            "inline-block w-full px-5 md:w-50 lg:w-100 cursor-pointer";
          label.innerText = "Click image to delete";
          label.className = "label-reset-image cursor-pointer dark:text-white";

          label.addEventListener("click", this.reset);

          image.addEventListener("click", this.reset);
          image.setAttribute("data-name", `${fileName}.${format}`);
          parent?.querySelector("svg")?.replaceWith(label, image);

          $buttonDownload.textContent = "download";
          $buttonDownload.addEventListener("click", downloadImage);
          $buttonDownload.id = "download-image";
          $buttonDownload.className =
            "text-sm text-white cursor-pointer px-3 py-1 uppercase bg-green-500 shadow-lg shadow-green-500/50 radius-md hover:opacity-80 active:shadow-inset dark:bg-blue-500 dark:shadow-blue-500/50";
          $divParent?.insertBefore($buttonDownload, $divImage);
        },
        "image/jpeg",
        quality
      );
      ctx?.reset();
    });
  };

  // getUUID = () => {
  //   const buffer = new ArrayBuffer(24);
  //   const bigint64 = new BigUint64Array(buffer);

  //   const uuid = crypto.getRandomValues(bigint64);

  //   return uuid[0] + "-" + uuid[1] + "-" + uuid[2];
  // };

  reset = (evt: MouseEvent) => {
    evt.stopPropagation();
    const target = evt.target as HTMLDivElement;
    const parent = target.parentNode as HTMLDivElement;
    const inputText = parent.querySelector("#input-image") as HTMLInputElement;
    const $buttonDownLoad = document.querySelector("#download-image");
    if ($buttonDownLoad) $buttonDownLoad.remove();
    inputText.style.background = "transparent";
    const id = parent.dataset.target!;
    const elem = this.getImage({ id });

    const loadImage = new LoadImages();
    elem.addEventListener("click", loadImage.addImageByClick);
    elem.addEventListener("drop", loadImage.addImageByDrop);
    elem.addEventListener("dragover", loadImage.changeStatus);
    elem.addEventListener("dragleave", loadImage.dragLeave);
    parent.replaceWith(elem);
    inputText.textContent = "";
  };

  getImage = ({ id, name }: GetImageOptions) => {
    const $parentDiv = document.createElement("div");
    const $label = document.createElement("label");
    $parentDiv.id = `container-${id}`;
    $parentDiv.setAttribute("data-target", id);
    $parentDiv.className =
      "new-uploader flex flex-col gap-4 items-center border border-gray-300 p-3 min-w-40 rounded-md shadow-lg shadow-gray-500/50";
    $label.htmlFor = "image";
    $label.id = "label-image";
    $label.className =
      "px-1.5 py-1 block bg-primary rounded-md text-white cursor-pointer shadow-lg shadow-blue-500/50 hover:opacity-85 active:shadow-inset dark:shadow-green-500/50";
    $label.textContent = "Upload image";

    const svg = `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8c68cd"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-sk-target="${id}"
            class="icon icon-tabler icons-tabler-outline icon-tabler-photo-up new-uploader__image cursor-pointer"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"> </path>
            <path d="M15 8h.01"> </path><path
              d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"
            >
            </path>
            <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"> </path>
            <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"> </path>
            <path d="M19 22v-6"> </path>
            <path d="M22 19l-3 -3l-3 3"> </path>
          </svg>`;

    const $name = document.createElement("p");
    $name.id = `input-${id}`;
    $name.className = "text-[10px] text-center";
    $name.setAttribute("data-sk-drawer", `drawer-${id}`);
    $name.setAttribute("name", `input-${name}`);
    $name.setAttribute("data-sk-target", `${id}`);
    $name.setAttribute("data-required", "true");

    $parentDiv.innerHTML = svg;
    $parentDiv.appendChild($label);
    $parentDiv.appendChild($name);

    return $parentDiv;
  };
}
