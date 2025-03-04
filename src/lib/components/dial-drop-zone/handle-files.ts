export class HandleFiles {
  constructor() {}

  static createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  static handleFiles = (
    files: FileList,
    fileInput: HTMLInputElement,
    dropZone: HTMLLabelElement
  ) => {
    const validFiles = Array.from(files).filter((file) => {
      if (file.type.startsWith("image/")) {
        return true;
      } else {
        throw new Error("File or files not supported");
      }
    });

    const paragraph = dropZone.parentElement?.querySelector(
      "#lbl-selected-files"
    ) as HTMLParagraphElement;

    if (fileInput && validFiles.length > 0) {
      fileInput.files = HandleFiles.createFileList(validFiles);
    }

    const text =
      validFiles.length === 1
        ? "1 archivo seleccionado"
        : `${validFiles.length} archivos seleccionado`;

    paragraph.innerHTML = `<strong>${text}</strong>`;

    return validFiles.length;
  };
}
