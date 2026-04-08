import { DialDropZone } from "../utils/dial-drop-zone";

export class UploadDropZone extends HTMLElement {
  private form: HTMLFormElement;
  private hiddenInput: HTMLInputElement;

  constructor() {
    super();
    this.form = document.createElement("form");
    this.hiddenInput = document.createElement("input");
    this.initializeForm();

    new DialDropZone("upload", {
      animationOnDeleteImage: "spinOut",
      format: "webp",
      conserveOriginalName: true,
      quality: 60,
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

  }
}

customElements.define("dial-upload-drop-zone", UploadDropZone);
