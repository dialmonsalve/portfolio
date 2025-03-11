import button from "../components/button";
import addPage from "./addPage";

const doc = document;
const $ = (selector: string) => doc.querySelector(selector);
const $containerForms = $(".container-forms");

export default function removePage(evt: MouseEvent, incrementId: number) {
  const target = evt.target as HTMLButtonElement;

  const parentDiv = target.closest(".container-card-form.card");

  const buttonAdd = button(
    {
      id: "add-page",
      text: "add-page",
      spanClass: "button-square-add",
      buttonClass: "card__button-add",
    },
    (evt) => addPage(evt, incrementId)
  );

  if (!parentDiv) return;

  const isLastCard = parentDiv === $containerForms?.lastElementChild;
  const previousCard = $containerForms?.querySelector(
    ".container-card-form.card:nth-last-child(2)"
  );

  if ($containerForms?.children.length === 2) {
    previousCard?.appendChild(buttonAdd);
    parentDiv.remove();
  } else if (isLastCard) {
    previousCard?.appendChild(buttonAdd);
    parentDiv.remove();
  } else {
    parentDiv.remove();
  }
}
