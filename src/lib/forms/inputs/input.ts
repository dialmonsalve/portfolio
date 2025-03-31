import { ModalBody } from "../../web-components";
import Modal from "@lib/components/modal";

import addRequiredToInput from "../utils/addRequiredToInput";
import { UpdateInputsOnDOM } from "../utils/updateInputsOnDOM";
import { createInputsOnDOM } from "../utils/createInputsOnDOM";
import type { ConstructOptions, CreateOptions } from "../interfaces";

type InputType = "input" | "textarea";

export class Input {
  private readonly container;
  private readonly type;
  private readonly classes;
  private readonly inputType:InputType
  constructor(inputType:InputType, { container, classes, type = "text" }: ConstructOptions) {
    this.inputType = inputType
    this.classes = classes;
    this.container = container;
    this.type = type;
  }
  create = ({ incrementId, containerCards }: CreateOptions) => {
    const label = document.createElement("label");
    const input = document.createElement(this.inputType);

    const newLabel = `edit ${this.type}`;
    const id = `${this.type}-${incrementId}`;
    const name = `${this.type}-${incrementId}`;

    label.classList.add("capitalize", "text-zinc-600", "dark:text-gray-200", "text-xs", "md:text-md");
    label.htmlFor = id;
    label.textContent = newLabel;

    if(input instanceof HTMLInputElement){
      const isPassword = this.type === "password" ? "text" : this.type;  
      input.type = isPassword;
      input.className = `${this.classes}`;
    }

    input.setAttribute("name", name);
    input.id = id;


    if(input instanceof HTMLTextAreaElement){
      input.classList = `${this.classes} block  w-full resize-none h-[150px]`
    }

    input.setAttribute("autocomplete", "on");
    input.setAttribute("data-required", "false");

    this.container.create(this.inputType,{
      containerCards,
      incrementId,
      type: this.type,
      name,
      children: [label, input],
      action: (evt) =>
        new Modal({
          title: `update ${this.type}`,
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () =>
            this.update(evt.target as HTMLButtonElement, incrementId),
        }).build(),
    });
  };

  private bodyModal = (target: HTMLButtonElement) => {

    if (this.inputType === "input"){
      const modalBody = new ModalBody();
      const inputDOM = new createInputsOnDOM(target);
      const inputLabel = inputDOM.createInputLabel();
      const radioButtonsRequired = inputDOM.createRadiosRequired("input");
      const radioButtonsPosition = inputDOM.createRadiosPosition();
  
      modalBody.appendChild(inputLabel);
  
      const inputPlaceholder = inputDOM.createInputPlaceholder();
      if (
        this.type === "text" ||
        this.type === "tel" ||
        this.type === "password" ||
        this.type === "email"
      ) {
        modalBody.appendChild(inputPlaceholder);
      }
  
      if (this.type === "number") {
        const inputMin = inputDOM.createInputMin();
        const inputMax = inputDOM.createInputMax();
  
        modalBody.appendChild(inputPlaceholder);
        modalBody.appendChild(inputMin);
        modalBody.appendChild(inputMax);
      }
  
      modalBody.appendChild(radioButtonsRequired);
      modalBody.appendChild(radioButtonsPosition);
      return modalBody;

    }else if (this.inputType === "textarea"){
      const modalBody = new ModalBody();
      const inputDOM = new createInputsOnDOM(target);

      const inputLabel = inputDOM.createInputLabel();
      const radioButtonsRequired = inputDOM.createRadiosRequired("textarea");
  
      modalBody.appendChild(inputLabel); 
      modalBody.appendChild(radioButtonsRequired);
      return modalBody;

    }
  };

  private update(target: HTMLButtonElement, incrementId: number) {

    if (this.inputType === "input"){
      const updateInputsOnDOM = new UpdateInputsOnDOM(
        target,
        "number",
        incrementId,
        "input"
      );
      const label = updateInputsOnDOM.updateInputLabel();
      updateInputsOnDOM.updateRadiosPosition();
      const newCheckedRequired = updateInputsOnDOM.updateRadiosRequired();
  
      if (
        this.type === "text" ||
        this.type === "tel" ||
        this.type === "password" ||
        this.type === "email"
      ) {
        updateInputsOnDOM.updateInputPlaceholder();
      }
  
      if (this.type === "number") {
        updateInputsOnDOM.updateInputPlaceholder();
        const newMin = updateInputsOnDOM.updateInputMin();
        const newMax = updateInputsOnDOM.updateInputMax();
        addRequiredToInput({
          checkedRequired: newCheckedRequired,
          elementRequired: label,
          min: Number(newMin),
          max: Number(newMax),
        });
      } else {
        addRequiredToInput({
          checkedRequired: newCheckedRequired,
          elementRequired: label,
        });
      }

    }else if (this.inputType === "textarea"){
      const updateInputsOnDOM = new UpdateInputsOnDOM(
        target,
        "area",
        incrementId,
        "textarea"
      );
      const label = updateInputsOnDOM.updateInputLabel();
      const newCheckedRequired = updateInputsOnDOM.updateRadiosRequired();

      addRequiredToInput({
        checkedRequired: newCheckedRequired,
        elementRequired: label,
      });
    }
  }
}
