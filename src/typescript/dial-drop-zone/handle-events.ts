import { HandleFiles } from "./handle-files";
import { StylesDropZone } from "./styles-drop-zone";
import { UpdateDOM } from "./update-DOM";

export default class HandleEvents {
  constructor() {}

  static onDragEvents = (dz: HTMLLabelElement, dropZone: HTMLLabelElement) => {
    (["dragenter", "dragover", "dragleave", "drop"] as const).forEach(
      (eventName) => {
        dz.addEventListener(eventName, HandleEvents.preventDefaults);
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

  static onDrop = async (
    e: DragEvent,
    dropZone: HTMLLabelElement,
    fileInput: HTMLInputElement
  ) => {
    const files = e.dataTransfer?.files;

    if (files) {
      HandleFiles.handleFiles(files, fileInput, dropZone);

      UpdateDOM.createImages(files, dropZone);
    }
  };

  static onInputChange = (evt: Event, dropZone: HTMLLabelElement) => {
    const target = evt.target as HTMLInputElement;

    const files = target.files;

    if (files) {
      HandleFiles.handleFiles(files, target, dropZone);

      UpdateDOM.createImages(files, dropZone);
    }
  };
}
