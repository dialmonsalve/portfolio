import { Alert } from "@lib/components/alert";
import { Errors } from "@lib/utils/dial-drop-zone/error-files";
import { Events } from "@lib/utils/dial-drop-zone/events";

import { UpdateDOMToDownload } from "@lib/utils/dial-drop-zone/update-DOM-to-download";
import { UpdateDOMToUpload } from "@lib/utils/dial-drop-zone/update-DOM-to-upload";

import type {
  Formats,
  IAnimationService,
  ImageOptimized,
} from "@lib/utils/dial-drop-zone/interfaces";

interface Options {
  conserveOriginalName?: boolean;
  animationOnDeleteImage?: IAnimationService;
  format?: Formats;
  quality?: number;
}

const ALLOWED_FORMATS = ["webp", "png", "jpeg", "jpg"];

export class DialDropZone {
  private dropZone = document.querySelector("#drop-zone") as HTMLLabelElement;
  private fileInput = this.dropZone?.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  private type: "download" | "upload";
  private conserveOriginalName?: boolean;
  private animationOnDeleteImage?: IAnimationService;
  private format?: Formats;
  private quality?: number;

  private action?: () => void;

  static IMAGES: ImageOptimized[] = [];

  constructor(type: "download" | "upload", options?: Options) {
    new Events().handleDragEvents(this.dropZone);

    this.dropZone.addEventListener("drop", (e) => this.onDrop(e));

    this.fileInput.addEventListener("change", (evt) => this.onInputChange(evt));

    this.type = type;

    if (this.type !== "download" && this.type !== "upload") {
      throw new Error("Set the type of dial drop zone");
    }

    this.conserveOriginalName = options?.conserveOriginalName;
    this.animationOnDeleteImage = options?.animationOnDeleteImage || "fadeOut";
    this.format = options?.format || "webp";
    this.quality = options?.quality;

    if (
      (this.quality && this.quality > 100) ||
      (this.quality && this.quality < 1)
    ) {
      throw new Error("Quality must be between 1 and 100");
    }

    if (!ALLOWED_FORMATS.includes(this.format)) {
      throw new Error(`${this.format} is a format not allowed`);
    }
  }

  private onDrop = async (e: DragEvent) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleRequest(files, this.fileInput);
    }
  };

  private onInputChange = async (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleRequest(target.files, target);
    }
  };

  private async handleRequest(files: FileList, input: HTMLInputElement) {
    try {
      new Errors().handleFiles(files, input);

      if (this.type === "upload") {
        new UpdateDOMToUpload({
          action: this.action,
          files,
          dropZone: this.dropZone,
          allImages: DialDropZone.IMAGES,
          conserveOriginalName: this.conserveOriginalName,
          animations: this.animationOnDeleteImage,
          format: this.format,
          quality: this.quality,
        }).createImages();
      } else if (this.type === "download") {
        new UpdateDOMToDownload({
          files,
          dropZone: this.dropZone,
          allImages: DialDropZone.IMAGES,
          conserveOriginalName: this.conserveOriginalName,
          animations: this.animationOnDeleteImage,
          format: this.format,
          quality: this.quality,
        }).createImages();
      } else {
        throw new Error(`type: ${this.type} not allowed`);
      }
    } catch (error) {
      if (error instanceof Object) {
        new Alert({ message: error.toString(), type: "error" });
      }
    }
  }

  public handleAction = (action: () => void) => {
    if (this.type === "download") {
      throw new Error(
        "The dial-drop-zone action of type download has no effect"
      );
    }

    this.action = action;
  };
}
