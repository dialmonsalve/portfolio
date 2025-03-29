import {
  AppTextarea,
  ModalBody,
} from "../../web-components";
import Modal from "@lib/components/modal";

import addRequiredToInput from "../utils/addRequiredToInput";
import { UpdateInputsOnDOM } from "../utils/updateInputsOnDOM";
import { createInputsOnDOM } from "../utils/createInputsOnDOM";
import type { ConstructorCheckbox, CreateOptions } from "../interfaces";


interface OptionsSelect extends ConstructorCheckbox {
  tag: "input" | "select";
  tagOptions: "label" | "option";
}

interface Options {
  value: string;
  id: string;
  valueToShow: string;
}

export class SingleSelect {
  private readonly container;
  private readonly classes;
  private tag: "input" | "select";
  private tagOptions: "label" | "option";
  constructor({ container, classes, tag, tagOptions }: OptionsSelect) {
    this.classes = classes;
    this.container = container;
    this.tag = tag;
    this.tagOptions = tagOptions;
  }
  create = ({ incrementId, containerCards }: CreateOptions) => {
    const label = document.createElement("p");
    const input = document.createElement(this.tag);

    const newLabel = `edit ${this.tag}`;
    const id = `${this.tag}-${incrementId}`;

    label.classList.add("capitalize", "text-zinc-600", "dark:text-gray-200");
    label.textContent = newLabel;

    input.className = `${this.classes}`;

    input.setAttribute("name", id);
    input.id = id;

    input.setAttribute("autocomplete", "on");
    input.setAttribute("data-required", "false");

    if (input instanceof HTMLInputElement) {
      input.type = "hidden";
    }

    this.container.create("input", {
      containerCards,
      incrementId,
      type: this.tag,
      name: id,
      children: [label, input || document.createElement("span")],
      action: (evt) =>
        new Modal({
          title: `update radio buttons`,
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () =>
            this.update(evt.target as HTMLButtonElement, incrementId),
        }).build(),
    });
  };

  private bodyModal = (target: HTMLButtonElement) => {
    const modalBody = new ModalBody();
    const inputDOM = new createInputsOnDOM(target);
    const inputLabel = inputDOM.createInputLabel("p");

    modalBody.appendChild(inputLabel);

    const parentContainer = target.closest(".container-components");

    const radioButtonsRequired = inputDOM.createRadiosRequired(this.tag);
    const radioButtonsPosition = inputDOM.createRadiosPosition();

    const containerArea = new AppTextarea();

    const parentInputs = parentContainer?.lastElementChild;

    if (!parentInputs) return;

    containerArea.setAttribute("name", "area");
    containerArea.setAttribute("label", "options");

    containerArea.id = "container-area-label";

    const options = parentInputs.querySelectorAll(this.tagOptions);

    let newOptions = "";

    options.forEach((node, index) => {
      newOptions += node.textContent;
      if (index < options.length - 1) {
        newOptions += "\n";
      }
    });

    containerArea.setAttribute("new_value", newOptions);

    modalBody.appendChild(containerArea);
    modalBody.appendChild(radioButtonsRequired);
    modalBody.appendChild(radioButtonsPosition);

    return modalBody;
  };

  private update(target: HTMLButtonElement, incrementId: number) {
    const parentContainer = target.closest(".container-components");
    const parentInputs = parentContainer?.lastElementChild;
    const paragraph = parentInputs?.querySelector("p");

    if (this.tag === "input") {
      const updateInputsOnDOM = new UpdateInputsOnDOM(
        target,
        "number",
        incrementId,
        "input",
        "p"
      );

      updateInputsOnDOM.updateInputLabel();
      const newCheckedRequired = updateInputsOnDOM.updateRadiosRequired();
      updateInputsOnDOM.updateRadiosPosition();

      const containerArea = document.querySelector(
        "#container-area-label"
      ) as AppTextarea;

      const labels = parentInputs?.querySelectorAll("label");

      let oldOptions = "";

      labels?.forEach((node, index) => {
        oldOptions += node.textContent;
        if (index < labels.length - 1) {
          oldOptions += "\n";
        }
      });

      const newOptions = containerArea.change
        ? containerArea.value
        : oldOptions;

      addRequiredToInput({
        checkedRequired: newCheckedRequired as "false",
        elementRequired: paragraph!,
      });

      const options: Options[] = [];

      const optionsLabel: string[] = newOptions.split("\n");
      const allRadios = parentInputs?.querySelectorAll('input[type="radio"]');
      const allLabels = parentInputs?.querySelectorAll("label");
      allRadios?.forEach((radio) => radio.remove());
      allLabels?.forEach((label) => label.remove());

      optionsLabel.forEach((elem, idx) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        const valueOpt = `radio-buttons-${incrementId}-${idx + 1}`;
        const nameOpt = elem;

        label.htmlFor = valueOpt;
        label.textContent = nameOpt;

        radio.type = "radio";
        radio.className = "radio"
        label.className = "label-radio"
        radio.setAttribute("data-required", newCheckedRequired);
        radio.setAttribute("name", `radio-buttons-${incrementId}`);
        radio.id = valueOpt;

        options.push({ value: nameOpt, id: valueOpt, valueToShow: nameOpt });

        parentInputs?.appendChild(radio);
        parentInputs?.appendChild(label);
      });
    } else if (this.tag === "select") {
      const select = parentInputs?.querySelector("select");

      const updateInputsOnDOM = new UpdateInputsOnDOM(
        target,
        "number",
        incrementId,
        "select",
        "p"
      );

      updateInputsOnDOM.updateInputLabel();
      const newCheckedRequired = updateInputsOnDOM.updateRadiosRequired();
      updateInputsOnDOM.updateRadiosPosition();

      const containerArea = document.querySelector(
        "#container-area-label"
      ) as AppTextarea;

      const oldTagOptions = parentInputs?.querySelectorAll("option");

      let oldOptions = "";

      oldTagOptions?.forEach((node, index) => {
        oldOptions += node.textContent;
        if (index < oldTagOptions.length - 1) {
          oldOptions += "\n";
        }
      });

      const newOptions = containerArea.change
        ? containerArea.value
        : oldOptions;

      addRequiredToInput({
        checkedRequired: newCheckedRequired as "false",
        elementRequired: paragraph!,
      });

      select?.setAttribute("data-required", newCheckedRequired);
      const allOptions = parentInputs?.querySelectorAll("select option");

      allOptions?.forEach((option) => option.remove());

      const options: Options[] = [];

      const optionsLabel: string[] = newOptions.split("\n");

      optionsLabel.forEach((elem, idx) => {
        const opt = document.createElement("option");
        opt.setAttribute("name", `option-${incrementId}-${idx + 1}`);
        opt.id = `option-${incrementId}-${idx + 1}`;
        opt.value = elem;
        opt.textContent = elem;

        options.push({
          value: elem,
          valueToShow: elem,
          id: `option-${idx + 1}`,
        });

        select?.appendChild(opt);
      });
    }
  }
}
