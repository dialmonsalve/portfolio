export class StylesDropZone {
  constructor(private readonly dropZone: HTMLLabelElement) {}

  public highlight = () => {
    this.dropZone.classList.add(
      "border-blue-500",
      "bg-blue-500",
      "dark:border-slate-800"
    );
  };

  public unHighlight = (dropZone: HTMLLabelElement) => {
    dropZone.classList.remove(
      "border-blue-500",
      "bg-blue-500",
      "dark:border-slate-800"
    );
  };
}
