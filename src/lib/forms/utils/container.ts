import button from "../components/button";
import removeElementForm from "../utils/removeElements";

import type { OptionsCreate } from "../interfaces";

type InputType = "input" | "textarea";

export class Container {
  constructor() {}

  create = (
    inputType: InputType,
    { containerCards, incrementId, type, children, action }: OptionsCreate
  ) => {
    const container = document.createElement("div");
    const parentElement = document.createElement("div");

    const buttonIdRemove = `${type}-remove-${incrementId}`;
    const buttonIdUpdate = `${type}-update-${incrementId}`;

    const buttonUpdate = button(
      {
        id: buttonIdUpdate,
        text: "",
        spanClass: "button-square-update",
        buttonClass: "inputs-btn-update",
      },
      action
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

    container.id = `card-${type}-${incrementId}`;

    container.classList.add(
      "container-components",
      "isDraggable",
      "relative",
      "flex",
      "gap-4",
      "p-4",
      "border",
      "rounded-sm",
      "w-full",
      "border-gray-300",
      "active:border-dotted",
      "active:border-green-900"
    );

    container.setAttribute("draggable", "true");

    parentElement.classList.add(
      "container-control-row",
      "flex",
      "items-center",
      "px-1",
      "w-full",
      "gap-2"
    );

    if (inputType === "textarea") {
      parentElement.classList.add("flex-col", "items-start");
    }

    parentElement.setAttribute("disposition", "row");

    children.forEach((element) => {
      if(element.tagName !== "SPAN"){
        parentElement.append(element);
      }
    });

    container.appendChild(buttonDelete);
    container.appendChild(buttonUpdate);
    container.appendChild(parentElement);

    const lastChildren = containerCards?.lastElementChild;

    lastChildren?.appendChild(container);

    return {
      container,
    };
  };
}
