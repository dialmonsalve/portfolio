import { ActionError, actions } from "astro:actions";
import { Errors } from "./errors";
import { Alert } from "@lib/components/alert";

class SendForm extends HTMLElement {
  private form!: HTMLFormElement;
  private button!: HTMLButtonElement;
  private name!: HTMLInputElement;
  private phone!: HTMLInputElement;
  private email!: HTMLInputElement;
  private description!: HTMLTextAreaElement;

  constructor() {
    super();
  }

  private initializeElements() {
    this.form = this.querySelector("form") as HTMLFormElement;
    this.button = this.querySelector("button") as HTMLButtonElement;
    this.name = this.querySelector("#name") as HTMLInputElement;
    this.phone = this.querySelector("#phone") as HTMLInputElement;
    this.email = this.querySelector("#email") as HTMLInputElement;
    this.description = this.querySelector(
      "#description"
    ) as HTMLTextAreaElement;

    if (!this.form) throw new Error("Form element not found");
  }

  connectedCallback() {
    this.initializeElements();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.form.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      if (!this.form) return;
      const formData = new FormData(this.form);

      this.button.disabled = true;
      this.button.textContent = "Enviando...";
      this.button.classList.add("disabled:bg-gray-400", "disabled:bg-text-200")

      const { data, error } = await actions.sendEmail(formData);

      if (error) {
        this.errors(error, "Enviar");
        return;
      }

      if (data) {
        this.successData("Enviar");
      }
    });
  }

  private errors = (error: ActionError, oldTextButton: string) => {
    const errors = new Errors({
      error,
      fields: [this.name, this.phone, this.email, this.description],
      oldTextButton,
      button: this.button,
    });

    errors.create();
  };

  private successData = (oldTextButton: string) => {
    new Alert({
      message: `El mensaje ha sido enviado con éxito`,
      type: "success",
    });

    this.button.disabled = false;
    this.button.textContent = oldTextButton;

    this.name.value = "";
    this.email.value = "";
    this.phone.value = "";
    this.description.value = "";
  };
}

customElements.define("send-form", SendForm);
