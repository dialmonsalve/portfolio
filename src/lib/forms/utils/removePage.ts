import button from "../components/button";
import addPage from "./addPage";

interface Options {
  containerForms: HTMLDivElement | null;
  incrementId: number;
}

export default function removePage(evt: MouseEvent, options: Options) {
  const { containerForms, incrementId } = options;

  const target = evt.target as HTMLButtonElement;

  const parentDiv = target.closest(".container-card-form.card");

  const buttonAdd = button(
    {
      id: "add-page",
      text: "add-page",
      spanClass: "button-square-add",
      buttonClass:
        "absolute -top-5 right-0 text-primary text-xs flex gap-1 items-center cursor-pointer hover:scale-130 transition-all",
    },
    (evt) =>
      addPage({
        containerForms,
        incrementId,
        target: evt.target as HTMLButtonElement,
      })
  );

  if (!parentDiv) return;

  const isLastCard = parentDiv === containerForms?.lastElementChild;
  const previousCard = containerForms?.querySelector(
    ".container-card-form.card:nth-last-child(2)"
  );

  if (containerForms?.children.length === 2) {
    previousCard?.appendChild(buttonAdd);
    parentDiv.remove();
  } else if (isLastCard) {
    previousCard?.appendChild(buttonAdd);
    parentDiv.remove();
  } else {
    parentDiv.remove();
  }
}
