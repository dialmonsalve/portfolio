import { actions } from "astro:actions";
import { clearFieldError, showFieldErrors } from "./errors";
import { Alert } from "@/lib/components/alert";
import { loadTurnstile, type Turnstile } from "./turnstile";

const TOKEN_TIMEOUT = 15000;

interface Messages {
  send: string;
  sending: string;
  success: string;
  error: string;
  captchaError: string;
  errors: Record<string, string>;
}

class SendForm extends HTMLElement {
  private form!: HTMLFormElement;
  private button!: HTMLButtonElement;
  private label!: HTMLElement;
  private spinner!: HTMLElement;
  private messages!: Messages;
  private captcha!: HTMLElement;
  private turnstile?: Turnstile;
  private widgetId?: string;
  private token?: string;
  private waiters: ((token?: string) => void)[] = [];

  connectedCallback() {
    this.form = this.querySelector("form") as HTMLFormElement;
    this.button = this.form.querySelector("button[type=submit]") as HTMLButtonElement;
    this.label = this.button.querySelector("[data-label]") as HTMLElement;
    this.spinner = this.button.querySelector("[data-spinner]") as HTMLElement;
    this.messages = JSON.parse(this.dataset.messages ?? "{}");
    this.captcha = this.form.querySelector("[data-turnstile]") as HTMLElement;

    this.form.addEventListener("input", (evt) => {
      const field = evt.target as HTMLInputElement | HTMLTextAreaElement;
      if (field.hasAttribute("aria-invalid")) clearFieldError(field);
    });

    this.form.addEventListener("submit", this.handleSubmit);
    this.initTurnstile();
  }

  disconnectedCallback() {
    if (this.widgetId) this.turnstile?.remove(this.widgetId);
    this.widgetId = undefined;
    this.resolveWaiters(undefined);
  }

  private async initTurnstile() {
    const sitekey = this.dataset.siteKey;
    if (!sitekey || !this.captcha) return;

    try {
      this.turnstile = await loadTurnstile();
    } catch (err) {
      console.error(err);
      return;
    }

    if (!this.isConnected) return;

    this.widgetId = this.turnstile.render(this.captcha, {
      sitekey,
      appearance: "interaction-only",
      size: "flexible",
      theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      language: document.documentElement.lang || "auto",
      callback: (token) => {
        this.token = token;
        this.resolveWaiters(token);
      },
      "expired-callback": () => {
        this.token = undefined;
      },
      "before-interactive-callback": () => this.captcha.toggleAttribute("data-interactive", true),
      "after-interactive-callback": () => this.captcha.removeAttribute("data-interactive"),
    });
  }

  private resolveWaiters(token?: string) {
    this.waiters.splice(0).forEach((resolve) => resolve(token));
  }

  private waitForToken() {
    if (this.token) return Promise.resolve(this.token);
    if (!this.widgetId) return Promise.resolve(undefined);

    return new Promise<string | undefined>((resolve) => {
      this.waiters.push(resolve);
      const check = () => {
        if (!this.waiters.includes(resolve)) return;
        if (this.captcha.hasAttribute("data-interactive")) {
          window.setTimeout(check, TOKEN_TIMEOUT);
          return;
        }
        this.waiters.splice(this.waiters.indexOf(resolve), 1);
        resolve(undefined);
      };
      window.setTimeout(check, TOKEN_TIMEOUT);
    });
  }

  private resetTurnstile() {
    this.token = undefined;
    if (this.widgetId) this.turnstile?.reset(this.widgetId);
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

    const token = await this.waitForToken();
    if (!token) {
      this.setLoading(false);
      new Alert({ message: this.messages.captchaError, type: "error" });
      return;
    }

    const formData = new FormData(this.form);
    formData.set("cf-turnstile-response", token);

    const { data, error } = await actions.sendEmail(formData);
    this.setLoading(false);
    this.resetTurnstile();

    if (error?.code === "FORBIDDEN") {
      new Alert({ message: this.messages.captchaError, type: "error" });
      return;
    }

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
