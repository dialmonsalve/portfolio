import HandleEvents from "./handle-events";

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

      HandleEvents.onDragEvents(dz, dropZone);

      dropZone.addEventListener("drop", (e) =>
        HandleEvents.onDrop(e, dropZone, fileInput)
      );

      fileInput.addEventListener("change", (evt) =>
        HandleEvents.onInputChange(evt, dropZone)
      );
    });
  }
}

customElements.define("dial-drop-zone", DialDropZone);
