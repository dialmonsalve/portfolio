import inputComponent from "../components/inputComponent";

import { AppInput, AppRadioButtons, ModalBody } from "../../web-components";
import { type Container } from "../create/container";
import Modal from "@lib/components/modal";
import cleanTextInputs from "../utils/cleanTextInputs";
import { POSITION_RADIOS, REQUIRED_RADIOS } from "../const";
import addRequiredToInput from "../utils/addRequiredToInput";

interface CreateOptions {
  incrementId: number;
  containerCards: HTMLDivElement | null;
}

interface ConstructOptions {
  container: Container;
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "date"
    | "time"
    | "checkbox"
    | "radio";
  classes: string;
}

export class Input {
  private readonly container;
  private readonly type;
  private readonly classes;
  constructor({ container, classes, type = "text" }: ConstructOptions) {
    this.classes = classes;
    this.container = container;
    this.type = type;
  }
  create = ({ incrementId, containerCards }: CreateOptions) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    const newLabel = `edit ${this.type}`;
    const id = `${this.type}-${incrementId}`;
    const name = `${this.type}-${incrementId}-${newLabel}`;

    label.classList.add("capitalize", "text-zinc-600", "dark:text-gray-200");
    label.htmlFor = id;
    label.textContent = newLabel;

    const isPassword = this.type === "password" ? "text" : this.type;

    input.type = isPassword;
    input.setAttribute("name", name);
    input.id = id;
    input.className = `${this.classes} ${
      this.type === "checkbox" ? "-order-1" : ""
    }`;

    input.setAttribute("autocomplete", "on");
    input.setAttribute("data-required", "false");

    this.container.create({
      containerCards,
      incrementId,
      type: this.type,
      name,
      children: [label, input],
      action: (evt) =>
        new Modal({
          title: `update ${this.type}`,
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () => this.update(evt.target as HTMLButtonElement),
        }).build(),
    });
  };

  private bodyModal = (target: HTMLButtonElement) => {
    const parentDiv = new ModalBody();
    const parentContainer = target.closest(".container-components");
    const parentInputs = parentContainer?.lastElementChild;
    const container = inputComponent({
      name: "input-label",
      type: "text",
      label: "Label",
      id: "container-input-label",
    });

    if (!parentInputs) {
      throw new Error(`Not parent input`);
    }

    const element = parentInputs.lastElementChild;

    if (!element) {
      throw new Error(`Not element has been created`);
    }

    if (this.type === "checkbox") {
    }

    if (this.type === "date") {
      return this.createDate(parentDiv, target, container);
    }

    throw new Error(`This ${this.type} is not allowed`);
  };

  createDate(
    parentDiv: ModalBody,
    target: HTMLButtonElement,
    container: AppInput
  ) {
    const radioButtonsRequired = new AppRadioButtons();
    const radioButtonsPosition = new AppRadioButtons();

    radioButtonsRequired.setAttribute("label", "Required:");
    radioButtonsRequired.id = "container-radios-required";
    radioButtonsRequired.setAttribute("name", "inputs-required");

    radioButtonsPosition.setAttribute("name", "inputs-position");
    radioButtonsPosition.setAttribute("label", "Position:");
    radioButtonsPosition.id = "container-radios-position";

    const parentContainer = target.closest(".container-components");

    const parentInputs = parentContainer?.lastElementChild;

    if (!parentInputs) return;

    const label = parentInputs.querySelector("label");
    const input = parentInputs.querySelector("input");

    const labelText = cleanTextInputs(label);

    const newCheckedPosition = parentInputs.getAttribute("disposition");
    const newCheckedRequired = input?.getAttribute("data-required");

    const updatedRequiredRadios = REQUIRED_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedRequired,
    }));

    const updatedPositionRadios = POSITION_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedPosition,
    }));

    container.setAttribute("new_value", labelText);
    radioButtonsRequired.setAttribute(
      "radios",
      JSON.stringify(updatedRequiredRadios)
    );
    radioButtonsPosition.setAttribute(
      "radios",
      JSON.stringify(updatedPositionRadios)
    );

    parentDiv.appendChild(container);
    parentDiv.appendChild(radioButtonsRequired);
    parentDiv.appendChild(radioButtonsPosition);

    return parentDiv;
  }

  update(target: HTMLButtonElement) {
    const parentContainer = target.closest(".container-components");
    const parentInputs = parentContainer?.lastElementChild as HTMLDivElement;
    const radioButtonsRequired = document.querySelector(
      "#container-radios-required"
    ) as AppRadioButtons;
    const radioButtonsPosition = document.querySelector(
      "#container-radios-position"
    ) as AppRadioButtons;
    const containerInputLabel = document.querySelector(
      "#container-input-label"
    ) as AppInput;

    const label = parentContainer?.querySelector("label") as HTMLLabelElement;
    const input = parentContainer?.querySelector("input");

    const labelText = cleanTextInputs(label);

    const newLabel = containerInputLabel.change
      ? containerInputLabel.value
      : labelText;

    const newCheckedRequired = radioButtonsRequired.change
      ? radioButtonsRequired.value
      : input?.getAttribute("data-required") || "false";

    const newCheckedPosition = radioButtonsPosition.change
      ? radioButtonsPosition.value
      : parentInputs?.getAttribute("disposition") || "row";

    if (newLabel === "") return;

    label.textContent = newLabel;

    addRequiredToInput({
      checkedRequired: newCheckedRequired as "false",
      elementRequired: label,
    });

    parentInputs.className = "";
    parentInputs?.classList.add(`container-control-${newCheckedPosition}`);
    parentInputs?.setAttribute("disposition", newCheckedPosition);

    input?.setAttribute("data-required", newCheckedRequired);
  }
}
