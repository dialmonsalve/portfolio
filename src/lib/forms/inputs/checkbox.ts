import { ModalBody } from "../../web-components";
import Modal from "@lib/components/modal";

import addRequiredToInput from "../utils/addRequiredToInput";
import { UpdateInputsOnDOM } from "../utils/updateInputsOnDOM";
import { createInputsOnDOM } from "../utils/createInputsOnDOM";
import type { ConstructorCheckbox, CreateOptions } from "../interfaces";


export class Checkbox {
  private readonly container;
  constructor({ container }: ConstructorCheckbox) {
    this.container = container;
  }
  create = ({ incrementId, containerCards }: CreateOptions) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const div = document.createElement("div");
    const paragraph = document.createElement("p");

    div.className =
      "relative w-11 h-6 bg-gray-400 rounded-full peer dark:bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-600";

    const id = `checkbox-${incrementId}`;

    input.className = "sr-only peer";
    input.value = "";
    input.setAttribute("data-required", "false");
    input.id = id;
    input.name = id;
    input.type = "checkbox";

    label.className = "inline-flex items-center me-5 cursor-pointer";
    label.htmlFor = id;

    paragraph.className =
      "ms-3 text-sm font-medium text-gray-900 dark:text-gray-300  ";
    paragraph.textContent = "edit";

    label.appendChild(input);
    label.appendChild(div);
    label.appendChild(paragraph);

    this.container.create("input", {
      containerCards,
      incrementId,
      type: "checkbox",
      name: "",
      children: [label],
      action: (evt) =>
        new Modal({
          title: `update checkbox`,
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () =>
            this.update(evt.target as HTMLButtonElement, incrementId),
        }).build(),
    });
  };

  private bodyModal = (target: HTMLButtonElement) => {
    const modalBody = new ModalBody();

    const inputDOM = new createInputsOnDOM(target);
    const radioButtonsRequired = inputDOM.createRadiosRequired("input");
    const containerArea = inputDOM.createInputArea();

    modalBody.appendChild(containerArea);
    modalBody.appendChild(radioButtonsRequired);

    return modalBody;
  };

  private update(target: HTMLButtonElement, incrementId: number) {
    const updateInputsOnDOM = new UpdateInputsOnDOM(
      target,
      "checkbox",
      incrementId,
      "input"
    );

    const newCheckedRequired = updateInputsOnDOM.updateRadiosRequired();
    const { input, paragraph } = updateInputsOnDOM.updateInputArea();

    if (!paragraph) {
      throw new Error("Paragraph does'nt exist");
    }
    addRequiredToInput({
      checkedRequired: newCheckedRequired! as "false",
      elementRequired: paragraph,
    });

    input.setAttribute("data-required", newCheckedRequired);
  }
}
