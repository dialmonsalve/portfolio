import button from "../components/button";

import removeElementForm from "../utils/removeElements";

import { REQUIRED_RADIOS } from "../const";
import cleanTextInputs from "../utils/cleanTextInputs";
import addRequiredToInput from "../utils/addRequiredToInput";
import {
  AppInput,
  AppRadioButtons,
  AppTextarea,
  ModalBody,
} from "../../web-components";
import sign from "../components/signature.ts";
import Modal from "@lib/components/modal.ts";

import type { CreateOptions } from "../interfaces";

export class Signature {
  constructor() {}

  create = ({ incrementId, containerCards }: CreateOptions) => {
    const parentDiv = document.createElement("div");
    const parentSignature = document.createElement("div");
    const signature = document.createElement("div");
    const inputHidden = document.createElement("input");
    const label = document.createElement("label");
    const canvas = document.createElement("canvas");
    const buttonClear = document.createElement("button");

    const buttonIdUpdate = `signature-update-${incrementId}`;
    const buttonIdRemove = `signature-remove-${incrementId}`;
    const containerId = `card-signature-${incrementId}`;

    const newLabel = "Edit signature";
    const id = `signature-${incrementId}`;

    parentSignature.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "px-1",
      "w-full",
      "gap-2"
    );
    parentSignature.setAttribute("disposition", "row");

    signature.classList.add("flex", "flex-col", "gap-1", );

    label.classList.add("capitalize", "text-slate-600", "dark:text-white");
    label.textContent = newLabel;

    inputHidden.type = "hidden";
    inputHidden.id = `hidden-${incrementId}`;

    const name = `signature-${incrementId}-${newLabel}`;

    canvas.setAttribute("data-required", "false");
    canvas.setAttribute("name", `canvas-${name}`);
    canvas.id = `canvas-${id}`;
    canvas.className = "border border-gray-400 rounded-md";

    buttonClear.id = `clear-${id}`;
    buttonClear.className =
      "cursor-pointer bg-red-400 text-white px-2 py-1 rounded-md hover:bg-red-600 w-fit";
    buttonClear.type = "button";
    buttonClear.textContent = "clear";

    canvas.height = 150;
    canvas.width = 400;

    const buttonUpdate = button(
      {
        id: buttonIdUpdate,
        text: "",
        spanClass: "button-square-update",
        buttonClass: "inputs-btn-update",
      },
      (evt) => {
        const modal = new Modal({
          title: "update signature",
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () =>
            this.update(evt.target as HTMLButtonElement, { incrementId }),
        });
        modal.build();
      }
    );

    const buttonDelete = button(
      {
        id: buttonIdRemove,
        text: "",
        spanClass: "button-square-remove",
        buttonClass: "inputs-btn-delete",
      },
      removeElementForm
    );

    const lastChildren = containerCards?.lastElementChild;

    parentDiv.classList.add(
      "container-components",
      "isDraggable",
      "relative",
      "flex",
      "gap-4",
      "p-4",
      "border",
      "rounded-sm",
      "w-full",
      "border-gray-500"
    );
    parentDiv.id = containerId;

    parentDiv.appendChild(buttonDelete);
    parentDiv.appendChild(buttonUpdate);

    signature.appendChild(label);
    signature.appendChild(canvas);
    signature.appendChild(inputHidden);
    signature.appendChild(buttonClear);

    parentSignature.appendChild(signature);

    parentDiv.appendChild(parentSignature);

    lastChildren?.appendChild(parentDiv);

    sign({
      id: `canvas-${id}`,
      name: `hidden-${incrementId}`,
      clear: `clear-${id}`,
    });
  };

  private bodyModal(target: HTMLButtonElement) {
    const parentDiv = new ModalBody();
    const radioButtonsRequired = new AppRadioButtons();
    const containerArea = new AppTextarea();

    radioButtonsRequired.setAttribute("label", "Required:");
    radioButtonsRequired.id = "container-radios-required";
    radioButtonsRequired.setAttribute("name", "inputs-required");

    containerArea.setAttribute("label", "Label");
    containerArea.setAttribute("input_id", "area");
    containerArea.id = "container-area-label";

    const parentInputs = target.closest(".container-components");

    if (!parentInputs) return;

    const canvas = parentInputs.querySelector("canvas");
    const label = parentInputs.querySelector("label");

    const labelText = cleanTextInputs(label);

    const newCheckedRequired = canvas?.getAttribute("data-required");

    const updatedRequiredRadios = REQUIRED_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedRequired,
    }));

    containerArea.setAttribute("new_value", labelText);
    radioButtonsRequired.setAttribute(
      "radios",
      JSON.stringify(updatedRequiredRadios)
    );

    parentDiv.appendChild(containerArea);
    parentDiv.appendChild(radioButtonsRequired);

    return parentDiv;
  }

  private update(
    target: HTMLButtonElement,
    { incrementId }: { incrementId: number }
  ) {
    const radioButtonsRequired = document.querySelector(
      "#container-radios-required"
    ) as AppInput;
    const containerArea = document.querySelector(
      "#container-area-label"
    ) as AppTextarea;
    const parentInputs = target.closest(".container-components");

    const canvas = parentInputs?.querySelector("canvas");
    const label = parentInputs?.querySelector("label");

    const labelText = cleanTextInputs(label);

    const newLabel = containerArea.change
      ? containerArea.value
      : labelText || "";

    const newCheckedRequired = radioButtonsRequired.change
      ? radioButtonsRequired.value
      : canvas?.getAttribute("data-required") || "false";

    label!.textContent = newLabel;

    addRequiredToInput({
      checkedRequired: newCheckedRequired as "false",
      elementRequired: label!,
    });

    const name = `signature-${incrementId}-${newLabel}`;

    canvas?.setAttribute("data-required", newCheckedRequired);
    canvas?.setAttribute("name", name);
  }
}
