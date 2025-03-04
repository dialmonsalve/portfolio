import modal from "../components/modal";
import inputComponent from "../components/inputComponent";

import storage from "../utils/saveAtLocalStorage";

import type {
  AppInput,
  AppRadioButtons,
  ModalBody,
} from "../../web-components";
import { type Container } from "../create/container";

const radioButtonsData = [
  {
    name: "heading",
    value: "h2",
    labelText: "title",
    id: "h2",
  },
  {
    name: "heading",
    value: "h3",
    labelText: "subtitle",
    id: "h3",
  },
  {
    name: "heading",
    value: "h4",
    labelText: "subtitle 2",
    id: "h4",
  },
  {
    name: "heading",
    value: "h5",
    labelText: "normal",
    id: "h5",
  },
  {
    name: "heading",
    value: "h6",
    labelText: "normal 2",
    id: "h6",
  },
];

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
        modal({
          title: "update title",
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () => this.update(evt.target as HTMLButtonElement),
        }),
    });
  };

  private bodyModal = (target: HTMLButtonElement) => {
    const parentDiv = document.createElement("app-modal-body") as ModalBody;
    const parentContainer = target.closest(".container-components");
    const parentInputs = parentContainer?.lastElementChild;
    const containerInput = inputComponent({
      name: "input-headings",
      type: "text",
      id: "container-input-headings",
      label: "title",
    });

    if (!parentInputs) {
      throw new Error(`Not parent input`);
    }

    const element = parentInputs.lastElementChild;

    if (!element) {
      throw new Error(`Not element has been created`);
    }

    if (this.type === "checkbox") {
      return this.createHeading(parentDiv, element, containerInput);
    }

    if (this.type === "date") {
      return this.createParagraph(parentDiv, element, containerInput);
    }

    throw new Error(`This ${this.type} is not allowed`);
  };

  private createHeading = (
    parentDiv: ModalBody,
    element: Element,
    containerInput: HTMLElement
  ) => {
    const radioButtons = document.createElement(
      "app-radio-buttons"
    ) as AppRadioButtons;

    radioButtons.id = "container-radios-headings";
    radioButtons.setAttribute("name", "headings");

    const tagName = element?.tagName;
    const oldLabel = element?.textContent?.trim();
    const newLabel = radioButtons.change ? radioButtons.value : oldLabel || "";

    const updatedRadios = radioButtonsData.map((radio) => ({
      ...radio,
      isChecked: radio.value.toUpperCase() === tagName,
    }));

    containerInput.setAttribute("new_value", newLabel);

    radioButtons.setAttribute("radios", JSON.stringify(updatedRadios));

    parentDiv.appendChild(containerInput);
    parentDiv.appendChild(radioButtons);

    return parentDiv;
  };

  private createParagraph = (
    parentDiv: ModalBody,
    element: Element,
    containerInput: HTMLElement
  ) => {
    const newTitle = element?.textContent?.trim();
    containerInput.setAttribute("new_value", newTitle || "");
    parentDiv.appendChild(containerInput);

    return parentDiv;
  };

  update(target: HTMLButtonElement) {
    const parentContainer = target.closest(".container-components");
    const parentInputs = parentContainer?.lastElementChild;

    let rest = {};
    if (!parentInputs) {
      throw new Error(`Not parent input`);
    }

    if (this.type === "paragraph") {
      const paragraph = parentInputs.querySelector(this.elementToCreate);
      const containerInput = document.querySelector(
        "#container-input-headings"
      ) as AppInput;

      if (!paragraph) {
        throw new Error(`Not paragraph selected`);
      }

      paragraph.className = this.classes;

      const newValue = containerInput.change
        ? containerInput.value.trim()
        : paragraph?.textContent?.trim() || "";

      if (newValue === "") return;

      paragraph.textContent = newValue || "";

      rest = {
        label: newValue,
      };
    }

    if (this.type === "heading") {
      const headingElement = parentInputs.lastElementChild;

      const radioButtons = document.querySelector(
        "#container-radios-headings"
      ) as AppRadioButtons;
      const containerInput = document.querySelector(
        "#container-input-headings"
      ) as AppInput;

      const newChecked = radioButtons.change
        ? radioButtons.value
        : headingElement?.tagName.toLowerCase() || "";

      const newValue = containerInput.change
        ? containerInput.value
        : headingElement?.textContent;

      const id = headingElement?.id;
      const name = headingElement?.getAttribute("name");

      headingElement?.remove();

      const $heading = document.createElement(newChecked) as HTMLHeadElement;
      $heading.id = id!;
      $heading.setAttribute("name", name || "");

      const num =
        newChecked === "h2"
          ? "w-full text-center text-3xl uppercase text-zinc-600 dark:text-gray-200"
          : newChecked === "h3"
          ? "w-full text-2xl uppercase text-zinc-600 dark:text-gray-200"
          : newChecked === "h4"
          ? "w-full text-xl uppercase text-zinc-600 dark:text-gray-200"
          : newChecked === "h5"
          ? "w-full text-lg uppercase text-zinc-600 dark:text-gray-200"
          : "w-full text-md uppercase text-zinc-600 dark:text-gray-200";

      $heading.className = num;
      $heading.textContent = newValue || "";

      parentInputs?.appendChild($heading);

      rest = {
        heading: newChecked,
        label: newValue,
      };
    }
    storage.update(target, rest);
  }
}
