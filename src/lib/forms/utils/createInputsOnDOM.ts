import { AppInput, AppRadioButtons, AppTextarea } from "@lib/web-components";
import { POSITION_RADIOS, REQUIRED_RADIOS } from "../const";
import cleanTextInputs from "./cleanTextInputs";

import type { InputComponent, Radios } from "../interfaces";

export class createInputsOnDOM {
  constructor(private readonly target: HTMLButtonElement) {}

  private parentDiv() {
    const parentContainer = this.target.closest(".container-components");

    if (!parentContainer) {
      throw new Error("Parent input does'nt exist");
    }

    const parentInputs = parentContainer.lastElementChild;

    if (!parentInputs) {
      throw new Error("Parent input does'nt exist");
    }
    return parentInputs;
  }

  private inputComponent({ name, type, label, id }: InputComponent) {
    const containerInput = new AppInput();

    containerInput.setAttribute("name", name);
    containerInput.setAttribute("type", type);
    containerInput.setAttribute("label", label);
    containerInput.id = id;

    return containerInput;
  }

  private radioOptions({ type }: Radios) {
    const radioButtonsRequired = new AppRadioButtons();

    radioButtonsRequired.setAttribute("label", `${type}:`);
    radioButtonsRequired.id = `container-radios-${type}`;
    radioButtonsRequired.setAttribute("name", `inputs-${type}`);

    return radioButtonsRequired;
  }

  public createInputLabel(element: "label" | "p" = "label") {
    const parentInputs = this.parentDiv();
    const label = parentInputs.querySelector(element);   

    const containerInputLabel = this.inputComponent({
      name: "input-label",
      type: "text",
      label: "Label",
      id: "container-input-label",
    });

    const labelText = cleanTextInputs(label);

    containerInputLabel.setAttribute("new_value", labelText);

    return containerInputLabel;
  }

  public createInputPlaceholder() {
    const parentInputs = this.parentDiv();

    const input = parentInputs.querySelector("input");

    const containerInputPlaceholder = this.inputComponent({
      name: "input-placeholder",
      type: "text",
      label: "Placeholder",
      id: "container-input-placeholder",
    });

    const newPlaceholder = input?.getAttribute("placeholder") || "";
    containerInputPlaceholder!.setAttribute("new_value", newPlaceholder);

    return containerInputPlaceholder;
  }

  public createInputMin() {
    const parentInputs = this.parentDiv();

    const containerInputMin = this.inputComponent({
      name: "input-min",
      type: "number",
      label: "Min",
      id: "container-input-min",
    });

    const input = parentInputs.querySelector("input");

    const newMin = input?.getAttribute("min") || "";
    containerInputMin.setAttribute("new_value", newMin);

    return containerInputMin;
  }

  public createInputMax() {
    const parentInputs = this.parentDiv();
    const input = parentInputs.querySelector("input");

    const containerInputMax = this.inputComponent({
      name: "input-max",
      type: "number",
      label: "Max",
      id: "container-input-max",
    });

    const newMax = input?.getAttribute("max") || "";
    containerInputMax.setAttribute("new_value", newMax);

    return containerInputMax;
  }

  public createRadiosRequired(typeInput: "input" | "textarea" | "select") {
    const parentInputs = this.parentDiv();

    const radioButtonsRequired = this.radioOptions({
      type: "required",
    });
    const input = parentInputs.querySelector(typeInput);
    
    const newCheckedRequired = input?.getAttribute("data-required");

    const updatedRequiredRadios = REQUIRED_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedRequired,
    }));

    radioButtonsRequired.setAttribute(
      "radios",
      JSON.stringify(updatedRequiredRadios)
    );

    return radioButtonsRequired;
  }

  public createRadiosPosition() {
    const parentInputs = this.parentDiv();

    const radioButtonsPosition = this.radioOptions({
      type: "position",
    });

    const newCheckedPosition = parentInputs.getAttribute("disposition");

    const updatedPositionRadios = POSITION_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedPosition,
    }));

    radioButtonsPosition.setAttribute(
      "radios",
      JSON.stringify(updatedPositionRadios)
    );

    return radioButtonsPosition;
  }

  public createInputArea() {
    const containerArea = new AppTextarea();

    const parentInputs = this.target.closest(".container-components");

    const paragraph = parentInputs?.querySelector("p");

    containerArea.setAttribute("name", "area");
    containerArea.setAttribute("label", "Label");
    containerArea.id = "container-area-label";

    const labelText = cleanTextInputs(paragraph);

    containerArea.setAttribute("new_value", `${labelText}`);

    return containerArea;
  }
}
