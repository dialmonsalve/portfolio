export class StylesDropZone {
  constructor(private readonly dropZone: HTMLLabelElement) {}

  public highlight = () => {
    this.dropZone.classList.add("border-primary", "bg-primary/10");
  };

  public unHighlight = (dropZone: HTMLLabelElement) => {
    dropZone.classList.remove("border-primary", "bg-primary/10");
  };
}
