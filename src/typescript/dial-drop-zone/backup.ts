import { Image } from "./Image";

export class DialDropZone extends HTMLElement {

  constructor() {
    super();

    const dropZones: NodeListOf<HTMLLabelElement> =
      this.querySelectorAll(".drop-zone");

    dropZones.forEach((dz) => {
      const dropZone = dz.closest("#drop-zone") as HTMLLabelElement;

      const fileInput = dropZone?.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

     

      DialDropZone.onDragEvents(dz, dropZone);

      dropZone.addEventListener("drop", (e) =>
        DialDropZone.onDrop(e, dropZone, fileInput)
      );

      fileInput.addEventListener("change", (evt) =>
        DialDropZone.onInputChange(evt, dropZone)
      );
    });
  }

  static onInputChange = (evt: Event, dropZone: HTMLLabelElement) => {
    const target = evt.target as HTMLInputElement;

    const files = target.files;

    if (files) {
      DialDropZone.handleFiles(files, target, dropZone);
      DialDropZone.createImages(files, dropZone);
    }
  };

  static onDrop = async (
    e: DragEvent,
    dropZone: HTMLLabelElement,
    fileInput: HTMLInputElement
  ) => {
    const files = e.dataTransfer?.files;

    if (files) {
      DialDropZone.handleFiles(files, fileInput, dropZone);

      DialDropZone.createImages(files, dropZone);
    }
  };

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

        image.onload = () => {
          spinner.getElement().remove();
        };

        container.appendChild(containerImg);
        parent?.appendChild(container);

        
      });
    } catch (error) {
      dropZone.classList.remove("hidden");
    } finally {
      oneSpinner.getElement().remove();
    }
  };

  static preventDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  static onDragEvents = (dz: HTMLLabelElement, dropZone: HTMLLabelElement) => {
    (["dragenter", "dragover", "dragleave", "drop"] as const).forEach(
      (eventName) => {
        dz.addEventListener(eventName, DialDropZone.preventDefaults);
        document.body.addEventListener(eventName, DialDropZone.preventDefaults);
      }
    );

    (["dragenter", "dragover"] as const).forEach((eventName) => {
      dropZone.addEventListener(eventName, () =>
        DialDropZone.highlight(dropZone)
      );
    });

    (["dragleave", "drop"] as const).forEach((eventName) => {
      dropZone.addEventListener(eventName, () =>
        DialDropZone.unHighlight(dropZone)
      );
    });
  };

  static highlight = (dropZone: HTMLLabelElement) => {
    dropZone.classList.add(
      "border-blue-500",
      "bg-blue-500",
      "dark:border-slate-800"
    );
  };

  static unHighlight = (dropZone: HTMLLabelElement) => {
    dropZone.classList.remove(
      "border-blue-500",
      "bg-blue-500",
      "dark:border-slate-800"
    );
  };

  static createFileList = (files: File[]): FileList => {
    const dataTrasfer = new DataTransfer();
    files.forEach((file) => dataTrasfer.items.add(file));
    return dataTrasfer.files;
  };

  static handleFiles = (files: FileList, fileInput: HTMLInputElement, dropZone:HTMLLabelElement) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const paragraph = dropZone.parentElement?.querySelector(
      "#lbl-selected-files"
    ) as HTMLParagraphElement;

    if (fileInput && validFiles.length > 0) {
      fileInput.files = DialDropZone.createFileList(validFiles);
    }

    paragraph.innerHTML = `<strong>${validFiles.length} archivos seleccionados</strong>`;

    return validFiles.length;
  };
}

customElements.define("dial-drop-zone", DialDropZone);

class Spinner {
  private spinnerElement: HTMLDivElement;

  constructor(className: string = "") {
    this.spinnerElement = this.createSpinner(className);
  }

  private createSpinner(className: string): HTMLDivElement {
    const div = document.createElement("div");

    div.className = className;

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute(
      "class",
      "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
    );
    svg.setAttribute("viewBox", "0 0 100 101");
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", svgNS);

    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute(
      "d",
      "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
    );
    path1.setAttribute("fill", "currentColor");
    svg.appendChild(path1);

    const path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute(
      "d",
      "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
    );
    path2.setAttribute("fill", "currentFill");
    svg.appendChild(path2);

    div.appendChild(svg);

    return div;
  }

  public getElement(): HTMLDivElement {
    return this.spinnerElement;
  }
}