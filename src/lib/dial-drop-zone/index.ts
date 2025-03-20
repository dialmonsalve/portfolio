// import { ActionError, actions } from "astro:actions";
// import { Errors } from "./forms/Errors";
// import { Alert } from "@lib/components/alert";
// import { navigate } from "astro:transitions/client";

import { DialDropZone } from "../utils/dial-drop-zone";

export class UploadDropZone extends HTMLElement {
  private form: HTMLFormElement;
  private hiddenInput: HTMLInputElement;
  // private button!: HTMLButtonElement;

  constructor() {
    super();
    this.form = document.createElement("form");
    this.hiddenInput = document.createElement("input");
    this.initializeForm();

    new DialDropZone("upload", {
      animationOnDeleteImage: "spinOut",
      format: "jpeg",
      conserveOriginalName: false,
      quality: 50,
    }).handleAction(this.action);
  }

  private initializeForm() {
    this.form.method = "post";
    this.form.enctype = "multipart/form-data";
    this.form.style.display = "none";

    this.hiddenInput.type = "file";
    this.hiddenInput.multiple = true;
    this.hiddenInput.name = "images";
    this.hiddenInput.id = "hidden-file-input";

    this.form.appendChild(this.hiddenInput);
    document.body.appendChild(this.form);
  }

  public async action() {
    console.log({ images: DialDropZone.IMAGES });

    //   this.button = document.querySelector("#save-images") as HTMLButtonElement;

    //   this.button.disabled = true;
    //   this.button.textContent = "Guardando...";
    //   this.button.classList.add(
    //     "bg-gray-400",
    //     "text-gray-600",
    //     "pointer-events-none"
    //   );

    //   const dataTransfer = new DataTransfer();
    //   const select = document.querySelector(
    //     "select#type-device"
    //   ) as HTMLSelectElement;

    //   images.forEach((image) => {
    //     dataTransfer.items.add(image.webpImage);
    //   });

    //   const withSelect = this.dataset.select;
    //   const path = this.dataset.folder;

    //   this.hiddenInput.files = dataTransfer.files;

    //   const formData = new FormData(this.form);

    //   if (withSelect === "true" && path) {
    //     formData.append("path", `${path}/${select.value}`);
    //   } else if (withSelect === "true") {
    //     formData.append("path", select.value);
    //   } else if (path) {
    //     formData.append("path", path);
    //   }

    //   try {
    //     const { data, error } = await actions.uploadImages(formData);

    //     if (error) {
    //       this.errors(error, "Guardar");
    //       return;
    //     }
    //     const message =
    //       data === 1
    //         ? "Imagen almacenada con éxito"
    //         : "Imágenes almacenadas con éxito";

    //     if (data) {
    //       if (typeof window !== "undefined") {
    //         const pathname = window.location.pathname;
    //         navigate(pathname);

    //         document.startViewTransition(() => {
    //           history.pushState(
    //             { alert: { message, type: "success" } },
    //             "",
    //             pathname
    //           );
    //         }).updateCallbackDone;

    //         document.dispatchEvent(new Event("astro:page-load"));
    //       }
    //     }
    //   } catch (error) {
    //     new Alert({
    //       message: "Error en subida, comuníquese con el administrador",
    //       type: "error",
    //     });
    //   } finally {
    //     this.button.removeAttribute("disabled");
    //     this.button.textContent = "Guardar";
    //     this.button.classList.remove(
    //       "bg-gray-400",
    //       "text-gray-600",
    //       "pointer-events-none"
    //     );
    //   }
    // }

    // private errors = (error: ActionError, oldTextButton: string) => {
    //   const errors = new Errors({
    //     error,
    //     fields: [this.hiddenInput],
    //     oldTextButton,
    //     button: this.button,
    //   });

    //   errors.create();
  }
}

// if (typeof document !== "undefined") {
//   document.addEventListener("astro:page-load", () => {
//     const state = history.state?.alert;
//     if (state) {
//       new Alert(state);
//       history.replaceState({ ...history.state, alert: null }, "");
//     }
//   });
// }

customElements.define("dial-upload-drop-zone", UploadDropZone);
