import { StylesDropZone } from "./styles-drop-zone";

export class Events {
  constructor() {}

  public handleDragEvents = (dropZone: HTMLLabelElement) => {
    (["dragenter", "dragover", "dragleave", "drop"] as const).forEach(
      (eventName) => {
        dropZone.addEventListener(eventName, this.preventDefaults);
        document.body.addEventListener(eventName, this.preventDefaults);
      }
    );

    (["dragenter", "dragover"] as const).forEach((eventName) => {
      dropZone.addEventListener(eventName, () => {
        const style = new StylesDropZone(dropZone);
        return style.highlight();
      });
    });

    (["dragleave", "drop"] as const).forEach((eventName) => {
      dropZone.addEventListener(eventName, () => {
        const style = new StylesDropZone(dropZone);
        return style.unHighlight(dropZone);
      });
    });
  };

  private preventDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

}
