import { DialDropZone } from "../utils/dial-drop-zone";

export class UploadDropZone extends HTMLElement {
  constructor() {
    super();

    new DialDropZone("download", {
      animationOnDeleteImage: "spinOut",
      format: "webp",
      conserveOriginalName: true,
      quality: 60,
    });
  }
}

customElements.define("dial-upload-drop-zone", UploadDropZone);
