import button from "../components/button";
import removeElementForm from "../utils/removeElements";

interface OptionsCreate {
  type: "submit" | "next";
  incrementId: number;
  buttonType: "submit" | "button";
}

const doc = document;

const $ = (selector: string) => doc.querySelector(selector);

const $containerCards = $(".container-forms");

export function create({ type, incrementId, buttonType }: OptionsCreate) {
  const $parentDiv = document.createElement("div");
  const $buttonFormBack = document.createElement("button");
  const $buttonFormNext = document.createElement("button");

  const buttonIdRemove = `both-back-${type}-remove-${incrementId}`;
  const containerId = `card-both-back-${type}-${incrementId}`;

  const btnBack = `both-back-${incrementId}`;
  const btnNext = `both-${type}-${incrementId}`;

  const id = `both-${type}-${incrementId}`;

  const buttonDelete = button(
    {
      id: buttonIdRemove,
      text: "",
      spanClass: "button-square-remove",
      buttonClass: "inputs-btn-delete",
    },
    removeElementForm,
  );

  $parentDiv.classList.add(
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
  $parentDiv.id = containerId;

  $buttonFormBack.className = `btn-back capitalize`;
  $buttonFormBack.id = btnBack;
  $buttonFormBack.setAttribute("name", `btn-back`);
  $buttonFormBack.textContent = "Back";
  $buttonFormBack.type = "button";

  $buttonFormNext.className = `btn-${type} capitalize`;
  $buttonFormNext.id = btnNext;
  $buttonFormNext.setAttribute("name", `btn-${type}`);
  $buttonFormNext.textContent = type;
  $buttonFormNext.type = buttonType;

  $parentDiv.appendChild(buttonDelete);
  $parentDiv.appendChild($buttonFormBack);
  $parentDiv.appendChild($buttonFormNext);

  const $lastChildren = $containerCards?.lastElementChild;

  $lastChildren?.appendChild($parentDiv);


}
