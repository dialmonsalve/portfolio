export class Errors {
  constructor() {}

  private createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  public handleFiles = (files: FileList, fileInput: HTMLInputElement) => {
    const validFiles = Array.from(files).filter((file) => {
      if (file.type.startsWith("image/")) {
        return true;
      } else {
        throw new Error("Archivo o archivos no soportados");
      }
    });

    if (fileInput && validFiles.length > 0) {
      fileInput.files = this.createFileList(validFiles);
    }

    return validFiles.length;
  };
}
