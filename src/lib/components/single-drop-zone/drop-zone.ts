
import type { ImageOptimized } from "@lib/utils/dial-drop-zone/interfaces";
import { Alert } from "../alert";
import { Events } from "@lib/utils/dial-drop-zone/events";
import { Errors } from "@lib/utils/dial-drop-zone/error-files";
import { UpdateDOMToSend } from "./updateDOMToSend";

interface Options {
  name: string;
  height: number;
  width: number;
  mode?: "cover" | "contain";
}

export class DropZone {
  private dropZone = document.querySelector(
    "#single-drop-zone"
  ) as HTMLLabelElement;
  private fileInput = this.dropZone?.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  private IMAGES: ImageOptimized[] = [];
  private height: number;
  private width: number;
  private name: string;
  private mode?: "cover" | "contain";
  static IMAGE = {} as ImageOptimized;
  public action: () => void;

  constructor(action: () => void, options: Options) {
    const events = new Events()
    events.handleDragEvents(this.dropZone);

    this.dropZone.addEventListener("drop", (e) => this.onDrop(e));
    this.fileInput.addEventListener("change", (evt) => this.onInputChange(evt));

    this.action = action;

    this.height = options.height;
    this.width = options.width;
    this.name = options.name;
    this.mode = options.mode
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

  private handleRequest(files: FileList, input: HTMLInputElement) {
    try {
      const errors = new Errors()
      errors.handleFiles(files, input);

      new UpdateDOMToSend({
        action: () => this.action(),
        files,
        dropZone: this.dropZone,
        allImages: this.IMAGES,
        width: this.width,
        height: this.height,
        mode:this.mode,
        name: this.name,

      }).createImages();

      DropZone.IMAGE = this.IMAGES[0];

      this.dropZone.classList.add("hidden");
    } catch (error) {
      if (error instanceof Object) {
        new Alert({ message: error.toString(), type: "error" });
      }
    }
  }
}