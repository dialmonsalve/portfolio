import { StylesDropZone } from "./styles-drop-zone";

export default class HandleEvents {
  constructor() {}

  static onDragEvents = (dropZone: HTMLLabelElement) => {
    (["dragenter", "dragover", "dragleave", "drop"] as const).forEach(
      (eventName) => {
        dropZone.addEventListener(eventName, HandleEvents.preventDefaults);
        document.body.addEventListener(eventName, HandleEvents.preventDefaults);
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

  static preventDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

}
