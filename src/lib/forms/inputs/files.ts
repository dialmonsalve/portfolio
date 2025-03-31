import Modal from "@lib/components/modal.js";
import inputComponent from "../components/inputComponent.js";

import { AppInput, AppRadioButtons, ModalBody } from "../../web-components";

import addRequiredToInput from "../utils/addRequiredToInput.js";
import cleanTextInputs from "../utils/cleanTextInputs.js";

import { MULTIPLE_RADIOS, REQUIRED_RADIOS } from "../const";

import type { Container } from "../utils/container.js";
import type { CreateOptions } from "../interfaces/index.js";

const checkboxFormats = [
  "doc",
  "xls",
  "ppt",
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "mp4",
  "avi",
  "mov",
  "mkv",
  "mp3",
  "wav",
  "ogg",
  "aac",
  "txt",
  "csv",
  "zip",
  "rar",
  "7z",
  "odt",
  "ods",
  "odp",
  "rtf",
];

export class InputFiles {
  private readonly container;

  constructor({ container }: { container: Container }) {
    this.container = container;
  }
  create = ({ incrementId, containerCards }: CreateOptions) => {
    const parentImage = document.createElement("div");
    const paragraph = document.createElement("p");
    const containerVoucher = document.createElement("div");
    const label = document.createElement("label");
    const image = document.createElement("img");
    const input = document.createElement("input");
    const containerNameFiles = document.createElement("div");

    const textLabel = paragraph.textContent || "";
    const id = `files-${incrementId}`;
    const name = `files-${incrementId}-${textLabel}`;

    parentImage.classList.add("container-components__image");
    parentImage.id = `parent-${id}`;

    paragraph.className = "capitalize text-primary";
    paragraph.id = `label-${incrementId}`;

    label.classList.add("text-primary", "cursor-pointer");
    label.htmlFor = id;
    label.id = "input-files";
    label.textContent = "upload files";

    image.classList.add("h-20", "shadow", "rounded-md", "active:shadow-inset");
    image.src = "/upload.svg";
    image.alt = "voucher upload";

    input.classList.add("voucher-input", "hidden");
    input.type = "file";
    input.id = id;
    input.setAttribute("name", name);
    input.setAttribute("data-required", "false");
    input.setAttribute("multiple", "false");

    containerVoucher.classList.add("container-voucher");

    containerNameFiles.id = `name-${id}`;
    containerNameFiles.classList.add("container-name-files");

    label.appendChild(image);

    containerVoucher.appendChild(label);
    containerVoucher.appendChild(input);

    parentImage.appendChild(paragraph);
    parentImage.appendChild(containerVoucher);
    parentImage.appendChild(containerNameFiles);

    this.container.create("input", {
      containerCards,
      incrementId,
      type: "",
      name,
      children: [parentImage],
      action: (evt) =>
        new Modal({
          title: `update input file`,
          content: () => this.bodyModal(evt.target as HTMLButtonElement),
          action: () => this.update(evt.target as HTMLButtonElement),
        }).build(),
    });
  };

  private bodyModal(target: HTMLButtonElement) {
    const parentDiv = new ModalBody();
    const radioButtonsRequired = new AppRadioButtons();
    const radioButtonsMultiple = new AppRadioButtons();

    radioButtonsRequired.setAttribute("label", "Required:");
    radioButtonsRequired.setAttribute("name", "inputs-required");
    radioButtonsRequired.id = "container-radios-required";

    radioButtonsMultiple.setAttribute("label", "Multiple:");
    radioButtonsMultiple.setAttribute("name", "inputs-multiple");
    radioButtonsMultiple.id = "container-radios-multiple";

    const ContainerInputLabel = inputComponent({
      name: "input-label",
      type: "text",
      label: "Label",
      id: `container-input-label`,
    });

    const parentInputs = target.closest(".container-components");

    const paragraph = parentInputs?.querySelector("p");
    const input = parentInputs?.querySelector("input");

    const labelParagraph = cleanTextInputs(paragraph);

    const newCheckedMultiple = input?.getAttribute("multiple");

    const newCheckedRequired = input?.getAttribute("data-required");

    if (!parentInputs) return;

    const updatedRequiredRadios = REQUIRED_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedRequired,
    }));

    const updatedPositionRadios = MULTIPLE_RADIOS.map((radio) => ({
      ...radio,
      isChecked: radio.value === newCheckedMultiple,
    }));

    ContainerInputLabel.setAttribute("new_value", `${labelParagraph}`);

    radioButtonsRequired.setAttribute(
      "radios",
      JSON.stringify(updatedRequiredRadios)
    );
    radioButtonsMultiple.setAttribute(
      "radios",
      JSON.stringify(updatedPositionRadios)
    );

    const accept = input?.getAttribute("accept") || "";

    parentDiv.appendChild(ContainerInputLabel);
    parentDiv.appendChild(this.elementsCheck(accept));
    parentDiv.appendChild(radioButtonsRequired);
    parentDiv.appendChild(radioButtonsMultiple);

    return parentDiv;
  }

  private update(target: HTMLButtonElement) {
    const parentDiv = document.querySelector("app-modal-body");
    const parentElement = target.closest(".container-components");
    const checkboxChecked = parentDiv?.querySelectorAll(
      '.container-checkbox input[type="checkbox"]:checked'
    ) as NodeListOf<HTMLInputElement>;
    const containerInputLabel = document.querySelector(
      "#container-input-label"
    ) as AppInput;
    const radioButtonsRequired = document.querySelector(
      "#container-radios-required"
    ) as AppRadioButtons;
    const radioButtonsMultiple = document.querySelector(
      "#container-radios-multiple"
    ) as AppRadioButtons;

    const input = parentElement?.querySelector("input");
    const paragraph = parentElement?.querySelector("p") as HTMLParagraphElement;

    let accept = "";

    for (const checkbox of checkboxChecked) {
      accept = accept.concat(checkbox.value, ",");
    }

    const textParagraph = cleanTextInputs(paragraph);

    const newLabel = containerInputLabel.change
      ? containerInputLabel.value
      : textParagraph || "";

    const newCheckedRequired = radioButtonsRequired.change
      ? radioButtonsRequired.value
      : input?.getAttribute("data-required") || "false";

    const newCheckedMultiple = radioButtonsMultiple.change
      ? radioButtonsMultiple.value
      : input?.getAttribute("multiple") || "false";

    paragraph.textContent = newLabel;

    addRequiredToInput({
      checkedRequired: newCheckedRequired as "false",
      elementRequired: paragraph,
    });

    input?.setAttribute("accept", accept.slice(0, -1));
    input?.setAttribute("data-required", newCheckedRequired);
    input?.setAttribute("multiple", newCheckedMultiple);
  }

  private elementsCheck = (elementChecked = "") => {
    const parentCheckbox = document.createElement("DIV");
    parentCheckbox.classList.add("container-checkbox");
    parentCheckbox.classList.add("grid", "grid-cols-3", "gap-2");
  
    checkboxFormats.map((check) => {
      const containerCheck = document.createElement("div");
      const label = document.createElement("label");
  
      containerCheck.className =
        "relative w-11 h-6 bg-gray-400 rounded-full peer dark:bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-600";
  
      const isChecked = !!elementChecked?.split(",").includes(`.${check}`);
  
      const paragraph = document.createElement("p");
      const input = document.createElement("input");
  
      input.className = "sr-only peer";
      input.value = "";
      input.type = "checkbox";
      input.checked = isChecked;
      input.id = check;
      input.value = `.${check}`;
      input.setAttribute("name", check);
  
      label.className = "flex gap-2 items-center me-5 cursor-pointer";
      label.htmlFor = check;
  
      paragraph.textContent = check;
      paragraph.classList.add("text-slate-600");
  
      label.appendChild(input);
      label.appendChild(containerCheck);
      label.appendChild(paragraph);
  
      parentCheckbox.appendChild(label);
    });
  
    return parentCheckbox;
  };
}
