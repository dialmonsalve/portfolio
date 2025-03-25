import type {
  AppInput,
  AppRadioButtons,
  AppTextarea,
} from "@lib/web-components";

import cleanTextInputs from "./cleanTextInputs";

export type InputTypes =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "number"
  | "date"
  | "time"
  | "radio"
  | "checkbox"
  | "area";

export class UpdateInputsOnDOM {
  constructor(
    private readonly target: HTMLButtonElement,
    private readonly type: InputTypes,
    private readonly incrementId: number,
    private readonly inputType :|"input" | "textarea" | "select" 
  ) {}

  private parentDiv() {
    const parentContainer = this.target.closest(".container-components");
    const parentInputs = parentContainer?.lastElementChild;

    if (!parentInputs) {
      throw new Error("Parent down't exist");
    }

    const input = parentInputs.querySelector(this.inputType);
    const label = parentInputs.querySelector("label");

    if (!input) {
      throw new Error("Input doesn't exist");
    }

    if (!label) {
      throw new Error("Label down't exist");
    }

    return {
      parentInputs,
      input,
      label,
    };
  }

  public updateInputLabel() {
    const { label } = this.parentDiv();

    const containerInputLabel = document.querySelector(
      "#container-input-label"
    ) as AppInput;

    const labelText = cleanTextInputs(label);

    const newLabel = containerInputLabel.change
      ? containerInputLabel.value
      : labelText;

    if (newLabel === "") {
      return label;
    }

    if (!label) {
      throw new Error("label doesn't exist");
    }

    label.textContent = newLabel;

    return label;
  }

  public updateInputPlaceholder() {
    const { input } = this.parentDiv();

    const containerInputPlaceholder = document.querySelector(
      "#container-input-placeholder"
    ) as AppInput;

    const newPlaceholder = containerInputPlaceholder.change
      ? containerInputPlaceholder.value
      : input?.getAttribute("placeholder") || "";

    const name = `${this.type}-${this.incrementId}`;
    input?.setAttribute("placeholder", newPlaceholder);
    input?.setAttribute("name", name);
  }

  public updateInputMin() {
    const { input } = this.parentDiv();

    const containerInputMin = document.querySelector(
      "#container-input-min"
    ) as AppInput;

    const newMin = containerInputMin.change
      ? containerInputMin.value
      : input?.getAttribute("min") || "";

    const name = `${this.type}-${this.incrementId}`;
    input?.setAttribute("min", newMin);
    input?.setAttribute("name", name);
    return newMin;
  }

  public updateInputMax() {
    const { input } = this.parentDiv();
    const containerInputMax = document.querySelector(
      "#container-input-max"
    ) as AppInput;

    const newMax = containerInputMax.change
      ? containerInputMax.value
      : input?.getAttribute("max") || "";

    const name = `${this.type}-${this.incrementId}`;
    input?.setAttribute("max", newMax);
    input?.setAttribute("name", name);

    return newMax;
  }

  public updateRadiosRequired(): "true" | "false" {
    const { input } = this.parentDiv();
    const radioButtonsRequired = document.querySelector(
      "#container-radios-required"
    ) as AppRadioButtons;

    const newCheckedRequired = radioButtonsRequired.change
      ? radioButtonsRequired.value
      : input?.getAttribute("data-required") || "false";

    input?.setAttribute("data-required", newCheckedRequired);

    return newCheckedRequired as "true";
  }

  public updateRadiosPosition() {
    const { parentInputs } = this.parentDiv();

    const radioButtonsPosition = document.querySelector(
      "#container-radios-position"
    ) as AppRadioButtons;

    const newCheckedPosition = radioButtonsPosition.change
      ? radioButtonsPosition.value
      : parentInputs?.getAttribute("disposition") || "row";

    const position =
      newCheckedPosition === "row"
        ? "flex items-center gap-2"
        : "flex flex-col gap-2";

    parentInputs.className = position;

    parentInputs?.setAttribute("disposition", newCheckedPosition);
  }

  public updateInputArea() {
    const containerArea = document.querySelector(
      "#container-area-label"
    ) as AppTextarea;

    const { parentInputs, input } = this.parentDiv();

    const paragraph = parentInputs.querySelector("p");

    const labelText = cleanTextInputs(paragraph);
    const $paragraph = parentInputs?.querySelector("p") as HTMLParagraphElement;

    // const newCheckedRequired = this.updateRadiosRequired()

    // const input = parentInputs?.querySelector("input");

    // input?.setAttribute("data-required", newCheckedRequired);
    const paragraphText = cleanTextInputs($paragraph);

    const newLabel = containerArea?.change
      ? containerArea.value
      : paragraphText || "";

    if (newLabel === "") {
      return { input, paragraph };
    }

    $paragraph.textContent = newLabel;

    containerArea.setAttribute("new_value", `${labelText}`);
    // input!.setAttribute("data-required", newCheckedRequired);

    return { input, paragraph };
  }
}
