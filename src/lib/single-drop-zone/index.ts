import { DropZone } from "@lib/components/single-drop-zone/drop-zone";
import type { ImageOptimized } from "@lib/utils/dial-drop-zone/interfaces";

export class DialSingleDropZone extends HTMLElement {

  constructor() {
    super();

    const name = this.dataset.name!;
    const height = Number(this.dataset.height || 0);
    const width = Number(this.dataset.width || 0);

    const image = DropZone.IMAGE;

    new DropZone(() => this.action(image), {
      width,
      height,
      name,
    });
  }

  public async action(image: ImageOptimized) {
    console.log({ image });
  }
}

customElements.define("dial-single-drop-zone", DialSingleDropZone);
