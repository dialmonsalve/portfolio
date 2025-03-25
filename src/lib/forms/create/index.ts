// import inputComponent from "../components/inputComponent";

// import {
//   AppInput,
//   AppRadioButtons,
//   AppTextarea,
//   ModalBody,
// } from "../../web-components";

// import Modal from "@lib/components/modal";
// import type { Container } from "../utils/container";

// const radioButtonsData = [
//   {
//     name: "heading",
//     value: "h2",
//     labelText: "title",
//     id: "h2",
//   },
//   {
//     name: "heading",
//     value: "h3",
//     labelText: "subtitle",
//     id: "h3",
//   },
//   {
//     name: "heading",
//     value: "h4",
//     labelText: "subtitle 2",
//     id: "h4",
//   },
//   {
//     name: "heading",
//     value: "h5",
//     labelText: "normal",
//     id: "h5",
//   },
//   {
//     name: "heading",
//     value: "h6",
//     labelText: "normal 2",
//     id: "h6",
//   },
// ];

// interface CreateOptions {
//   incrementId: number;
//   containerCards: HTMLDivElement | null;
// }

// interface ConstructOptions {
//   container: Container;
//   elementToCreate: "h2" | "p";
//   type: "heading" | "paragraph";
//   classes: string;
// }

// export class Typography {
//   private readonly container;
//   private readonly elementToCreate;
//   private readonly type;
//   private readonly classes;
//   constructor({ container, elementToCreate, type, classes }: ConstructOptions) {
//     this.classes = classes;
//     this.container = container;
//     this.elementToCreate = elementToCreate;
//     this.type = type;
//   }
//   create = ({ incrementId, containerCards }: CreateOptions) => {
//     const element = document.createElement(this.elementToCreate);

//     const name = `${this.type}-${incrementId}`;

//     element.id = name;
//     element.className = this.classes;
//     element.textContent = `Edit ${this.type}`;

//     this.container.create("input", {
//       containerCards,
//       incrementId,
//       type: this.type,
//       name: element.id,
//       children: [element],
//       action: (evt) =>
//         new Modal({
//           twoButtons: true,
//           title: "update title",
//           content: () => this.bodyModal(evt.target as HTMLButtonElement),
//           action: () => this.update(evt.target as HTMLButtonElement),
//         }).build(),
//     });
//   };

//   private bodyModal = (target: HTMLButtonElement) => {
//     const parentDiv = new ModalBody();
  
//     const parentContainer = target.closest(".container-components");
//     const parentInputs = parentContainer?.lastElementChild;
//     const containerInput = inputComponent({
//       name: `input-${this.type}`,
//       type: "text",
//       id: `container-input-${this.type}`,
//       label: "sadfsdafsadf",
//     });

//     if (!parentInputs) {
//       throw new Error(`Not parent input`);
//     }

//     const element = parentInputs.lastElementChild;

//     if (!element) {
//       throw new Error(`Not element has been created`);
//     }

//     if (this.type === "heading") {
//       return this.createHeading(parentDiv, element, containerInput);
//     }

//     if (this.type === "paragraph") {
//       return this.createParagraph(target);
//     }

//     throw new Error(`This ${this.type} is not allowed`);
//   };

//   private createHeading = (
//     parentDiv: ModalBody,
//     element: Element,
//     containerInput: HTMLElement
//   ) => {
//     const radioButtons = new AppRadioButtons();

//     radioButtons.id = "container-radios-headings";
//     radioButtons.setAttribute("name", "headings");

//     const tagName = element?.tagName;
//     const oldLabel = element?.textContent?.trim();
//     const newLabel = radioButtons.change ? radioButtons.value : oldLabel || "";

//     const updatedRadios = radioButtonsData.map((radio) => ({
//       ...radio,
//       isChecked: radio.value.toUpperCase() === tagName,
//     }));

//     containerInput.setAttribute("new_value", newLabel);

//     radioButtons.setAttribute("radios", JSON.stringify(updatedRadios));

//     parentDiv.appendChild(containerInput);
//     parentDiv.appendChild(radioButtons);

//     return parentDiv;
//   };

//   private createParagraph = (target: HTMLButtonElement) => {
//     const parentDiv = new ModalBody();
//     const containerInput = new AppTextarea();

//     containerInput.setAttribute("name", "input-headings");
//     containerInput.setAttribute("label", "title");
//     containerInput.setAttribute("input_id", "input-headings");
//     containerInput.id = "container-input-headings";

//     const parentInputs = target.closest(".container-components");

//     if (!parentInputs) return;

//     const $paragraph = parentInputs.lastElementChild?.querySelector("p");

//     const newTitle = $paragraph?.innerHTML;

//     const textContent = newTitle?.replace(/<br\s*\/?>/gi, "\n");

//     containerInput.setAttribute("new_value", textContent || "");

//     parentDiv.appendChild(containerInput);

//     return parentDiv;
//   };

//   update(target: HTMLButtonElement) {
//     const parentContainer = target.closest(".container-components");
//     const parentInputs = parentContainer?.lastElementChild;

//     if (!parentInputs) {
//       throw new Error(`Not parent input`);
//     }

//     if (this.type === "paragraph") {
//       const paragraph = parentInputs.querySelector(this.elementToCreate);
//       const containerInput = document.querySelector(
//         "#container-input-headings"
//       ) as AppInput;

//       if (!paragraph) {
//         throw new Error(`Not paragraph selected`);
//       }

//       paragraph.className = this.classes;

//       const newValue = containerInput.change
//         ? containerInput.value.trim()
//         : paragraph?.innerHTML?.trim() || "";

//       if (newValue === "") return;

//       const text = newValue.replace(/\n/g, "<br>");

//       paragraph!.innerHTML = text || "";
//     }

//     if (this.type === "heading") {
//       const headingElement = parentInputs.lastElementChild;

//       const radioButtons = document.querySelector(
//         "#container-radios-headings"
//       ) as AppRadioButtons;
//       const containerInput = document.querySelector(
//         "#container-input-headings"
//       ) as AppInput;

//       const newChecked = radioButtons.change
//         ? radioButtons.value
//         : headingElement?.tagName.toLowerCase() || "";

//       const newValue = containerInput.change
//         ? containerInput.value
//         : headingElement?.textContent;

//       const id = headingElement?.id;
//       const name = headingElement?.getAttribute("name");

//       headingElement?.remove();

//       const $heading = document.createElement(newChecked) as HTMLHeadElement;
//       $heading.id = id!;
//       $heading.setAttribute("name", name || "");

//       const num =
//         newChecked === "h2"
//           ? "w-full text-center text-3xl uppercase text-zinc-600 dark:text-gray-200"
//           : newChecked === "h3"
//           ? "w-full text-2xl uppercase text-zinc-600 dark:text-gray-200"
//           : newChecked === "h4"
//           ? "w-full text-xl uppercase text-zinc-600 dark:text-gray-200"
//           : newChecked === "h5"
//           ? "w-full text-lg uppercase text-zinc-600 dark:text-gray-200"
//           : "w-full text-md uppercase text-zinc-600 dark:text-gray-200";

//       $heading.className = num;
//       $heading.textContent = newValue || "";

//       parentInputs?.appendChild($heading);
//     }
//   }
// }
