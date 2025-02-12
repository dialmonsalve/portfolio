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
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const paragraph = dropZone.parentElement?.querySelector(
      "#lbl-selected-files"
    ) as HTMLParagraphElement;

    if (fileInput && validFiles.length > 0) {
      fileInput.files = HandleFiles.createFileList(validFiles);
    }

    paragraph.innerHTML = `<strong>${validFiles.length} archivos seleccionados</strong>`;

    return validFiles.length;
  };
}
