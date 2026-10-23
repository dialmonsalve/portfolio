import { actions } from "astro:actions";
import { clearFieldError, showFieldErrors } from "./errors";
import { Alert } from "@/lib/components/alert";

interface Messages {
  send: string;
  sending: string;
  success: string;
  error: string;
  errors: Record<string, string>;
}

class SendForm extends HTMLElement {
  private form!: HTMLFormElement;
  private button!: HTMLButtonElement;
  private label!: HTMLElement;
  private spinner!: HTMLElement;
  private messages!: Messages;

  connectedCallback() {
    this.form = this.querySelector("form") as HTMLFormElement;
    this.button = this.form.querySelector("button[type=submit]") as HTMLButtonElement;
    this.label = this.button.querySelector("[data-label]") as HTMLElement;
    this.spinner = this.button.querySelector("[data-spinner]") as HTMLElement;
    this.messages = JSON.parse(this.dataset.messages ?? "{}");

    this.form.addEventListener("input", (evt) => {
      const field = evt.target as HTMLInputElement | HTMLTextAreaElement;
      if (field.hasAttribute("aria-invalid")) clearFieldError(field);
    });

    this.form.addEventListener("submit", this.handleSubmit);
  }

  private setLoading(loading: boolean) {
    this.button.disabled = loading;
    this.spinner.classList.toggle("hidden", !loading);
    this.label.textContent = loading ? this.messages.sending : this.messages.send;
  }

  private handleSubmit = async (evt: SubmitEvent) => {
    evt.preventDefault();

    this.form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[aria-invalid]")
      .forEach(clearFieldError);

    this.setLoading(true);
    const { data, error } = await actions.sendEmail(new FormData(this.form));
    this.setLoading(false);

    if (error) {
      const handled = showFieldErrors(error, this.form, this.messages.errors);
      if (!handled) new Alert({ message: this.messages.error, type: "error" });
      return;
    }

    if (data) {
      new Alert({ message: this.messages.success, type: "success" });
      this.form.reset();
    }
  };
}

customElements.define("send-form", SendForm);
