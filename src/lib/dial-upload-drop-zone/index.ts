import { HandleFiles } from "src/lib/components/dial-drop-zone/handle-files";
import HandleEvents from "../components/dial-drop-zone/handle-events";
import { UpdateDOMToSend } from "src/lib/components/dial-drop-zone/update-DOM-to-send";
import type { ImageOptimized } from "@lib/components/dial-drop-zone/interfaces";

import { actions } from "astro:actions";

export class DialUploadDropZone extends HTMLElement {
  private dropZone = this.querySelector("#drop-zone") as HTMLLabelElement;
  constructor() {
    super();

    const fileInput = this.dropZone?.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    HandleEvents.onDragEvents(this.dropZone);

    this.dropZone.addEventListener("drop", (e) => this.onDrop(e, fileInput));

    fileInput.addEventListener("change", (evt) => this.onInputChange(evt));
  }

  private onDrop = async (e: DragEvent, fileInput: HTMLInputElement) => {
    const files = e.dataTransfer?.files;

    if (files && files.length > 0) {
      try {
        HandleFiles.handleFiles(files, fileInput, this.dropZone);

        const images = await UpdateDOMToSend.createImages(files, this.dropZone);

        new UpdateDOMToSend(() => this.action(images));
      } catch (error) {
        if (error instanceof Object) {
          DialUploadDropZone.createAlertOnError(error.toString());
        }
      }
    }
  };

  private onInputChange = async (evt: Event) => {
    const target = evt.target as HTMLInputElement;

    const files = target.files;

    if (files && files.length > 0) {
      try {
        HandleFiles.handleFiles(files, target, this.dropZone);

        const images = await UpdateDOMToSend.createImages(files, this.dropZone);

        new UpdateDOMToSend(() => this.action(images));
      } catch (error) {
        if (error instanceof Object) {
          DialUploadDropZone.createAlertOnError(error.toString());
        }
      }
    }
  };

  static createAlertOnError = (message: string) => {
    const divAlert = document.querySelector("#error-alert");
    const body = document.querySelector("body");

    if (divAlert) divAlert.remove();

    const div = document.createElement("div");
    const paragraph = document.createElement("p");

    paragraph.textContent = message;
    paragraph.classList.add("text-xs", "text-white");

    div.id = "error-alert";
    div.classList.add(
      "fixed",
      "top-20",
      "right-2",
      "bg-red-500",
      "z-10",
      "p-2",
      "transition-all",
      "rounded-full",
      "translate-x-[150%]"
    );

    div.setAttribute("role", "alert");
    div.setAttribute("aria-live", "assertive");

    div.appendChild(paragraph);
    body?.appendChild(div);

    requestAnimationFrame(() => {
      div.classList.replace("translate-x-[150%]", "translate-x-0");
    });

    const removeAlert = () => {
      div.classList.add("translate-x-[150%]");
      div.addEventListener("transitionend", () => div.remove(), { once: true });
    };

    const animationDuration = 4000;
    const startTime = Date.now();

    const checkTime = () => {
      if (Date.now() - startTime >= animationDuration) {
        removeAlert();
      } else {
        requestAnimationFrame(checkTime);
      }
    };

    requestAnimationFrame(checkTime);
  };

  private action(images: ImageOptimized[] | undefined) {
    
    images?.map(async (image) => {
      const buffer = await image.webpImage.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const imageType = image.webpImage.type.split("/").at(-1)!;

      const {data, error} = await actions.createImageOnCloud({ base64Image, imageType });

      if(error){

        return
      }

      if(data){
        console.log("Subido de manera correcta");
        window.location.href = "/projects/convert-images"
      }
    });
  }
}

customElements.define("dial-upload-drop-zone", DialUploadDropZone);
