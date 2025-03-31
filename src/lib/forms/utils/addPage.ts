import button from "../components/button";
import smooth from "./smoothWindow";
import removePage from "./removePage";

interface AddPage {
  target: HTMLButtonElement;
  incrementId: number;
  containerForms: HTMLDivElement | null;
}

export default function addPage({
  containerForms,
  incrementId,
  target,
}: AddPage) {
  incrementId++;
  const buttonIdRemove = `remove-page-${incrementId}`;
  const buttonIdCreate = "add-page";

  const page = document.createElement("div");

  const buttonAdd = button(
    {
      id: buttonIdCreate,
      text: "add-page",
      spanClass: "button-square-add",
      buttonClass:
        "absolute -top-5 right-0 text-primary text-xs flex gap-1 items-center cursor-pointer hover:scale-130 transition-all",
    },
    (evt) =>
      addPage({
        target: evt.target as HTMLButtonElement,
        incrementId,
        containerForms,
      })
  );

  const buttonDelete = button(
    {
      id: buttonIdRemove,
      text: "remove-page",
      spanClass: "button-square-remove",
      buttonClass:
        "absolute -top-5 left-0 text-red-400 text-xs flex gap-1 items-center cursor-pointer hover:scale-130 transition-all",
    },
    (evt) => removePage(evt, { containerForms, incrementId })
  );

  page.classList.add("container-card-form", "card");
  page.classList.add(
    "w-70",
    "xs:w-95",
    "sm:w-150",
    "lg:w-200",
    "relative",
    "p-8",
    "flex",
    "flex-col",
    "gap-5",
    "border",
    "border-gray-400",
    "opacity-100",
    "rounded-xl"
  );
  page.id = `card-${incrementId}`;

  page.appendChild(buttonAdd);
  page.appendChild(buttonDelete);
  containerForms?.appendChild(page);

  const parentButton = target.closest("#add-page");

  if (!parentButton) return;

  parentButton.remove();

  smooth();
}
