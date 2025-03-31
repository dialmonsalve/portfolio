import { ActionError, isActionError, isInputError } from "astro:actions";

type Inputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface ErrorsCreate {
  error: ActionError;
  fields: Inputs[];
  button: HTMLButtonElement;
  oldTextButton: string;
}

export class Errors {
  private readonly error: ActionError;
  private readonly fields: Inputs[];
  private readonly button: HTMLButtonElement;
  private readonly oldTextButton: string;
  constructor({ error, fields, button, oldTextButton }: ErrorsCreate) {
    this.error = error;
    this.fields = fields;
    this.button = button;
    this.oldTextButton = oldTextButton;
  }
  create = () => {
    if (isInputError(this.error)) {
      this.error.issues.map((err) => {
        const path = err.path.toString();
        this.fields.forEach((field) => {
          if (path === field.id) {
            this.updateDOM(err.message, field.parentNode);
            this.button.disabled = false;
            this.button.textContent = this.oldTextButton;
          }
        });
      });
    }

    if (isActionError(this.error)) {
      const errors = this.error.message.split(",");
      errors.map((message) => {
        this.updateDOM(message, this.fields[0].parentNode!.parentNode, true);
        this.button.disabled = false;
        this.button.textContent = this.oldTextButton; 
      });
    }
  };

  private updateDOM = (
    message: string,
    parent: ParentNode | null,
    backErrors?: boolean
  ) => {
    const paragraph = document.createElement("p");

    paragraph.classList.add(
      "bg-red-400",
      "text-white",
      "p-1",
      "rounded-md",
      "text-xs",
      "animate-message"
    );
    paragraph.textContent = message;
    const paragraphs = parent?.querySelectorAll("p");

    if (!backErrors) {
      if (paragraphs?.length === 1)
        paragraphs?.forEach((paragraph) => paragraph.remove());
      parent?.appendChild(paragraph);
    } else {
      parent?.prepend(paragraph);
    }

    paragraph.addEventListener("animationend", (e) => {
      if (e.animationName === "messageExit") {
        paragraph.remove();
      }
    });
  };
}