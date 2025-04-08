import { Alert } from "../components/alert";

class DialMultiTags extends HTMLElement {
  private area: HTMLDivElement;
  private input: HTMLInputElement;
  private listItem: string[] = [];
  private button: HTMLButtonElement;
  private _name: string = "";
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();

    this.area = this.querySelector("div > div") as HTMLDivElement;
    this.input = this.querySelector("input") as HTMLInputElement;

    this.button = this.querySelector("button") as HTMLButtonElement;

    this.listItem = JSON.parse(this.value);

    if (this.listItem.length > 0) {
      this.updateDOM();
    }

    this.setupEventListeners();
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ["name", "value"];
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === "name") {
      this._name = newValue;
    }
  }

  get value(): string {
    return this.getAttribute("value") || "[]";
  }

  set value(newValue: string) {
    try {
      const parsed = JSON.parse(newValue);
      if (Array.isArray(parsed)) {
        this.listItem = parsed.filter((n) => typeof n === "string");
        this.setAttribute("value", JSON.stringify(this.listItem));
      }
    } catch (error) {
      console.error("Invalid value format:", error);
    }
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.setAttribute("name", value);
  }

  private setupEventListeners() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.addTag(e.target as HTMLInputElement);
      }
    });

    this.button.addEventListener("click", () =>
      this.addTag(this.input as HTMLButtonElement)
    );
  }

  private addTag = (target: HTMLButtonElement | HTMLInputElement) => {
    this.input.focus();
    if (this.input.value.length < 3 || this.input.value.trim() <= "") {
      new Alert({
        message: "El tag debe tener al menos 3 caracteres",
        type: "error",
      });
      return;
    }

    if (this.listItem.includes(target.value.trim())) {
      new Alert({
        message: `El tag ${this.input.value} ya está incluido`,
        type: "error",
      });

      this.input.value = "";
      return;
    }

    const regex =
      /^(?!\s)(?!.*\s$)[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+)*$/;

    if (!regex.test(this.input.value.trim())) {
      new Alert({
        message: "Solo se permiten caracteres alfanuméricos",
        type: "error",
      });
      this.input.value = "";
      return;
    }

    this.createSpan(target.value, true);
  };

  updateDOM() {
    this.listItem.forEach((value) => {
      this.createSpan(value, false);
    });
  }

  private createSpan(text: string, isNew: boolean) {
    const span = document.createElement("span");

    span.classList.add(
      "text-white",
      "bg-blue-400",
      "px-2",
      "py-1",
      "rounded-full",
      "text-[10px]",
      "cursor-pointer",
      "hover:bg-red-300"
    );

    span.textContent = `${text.trim()} x`;

    if (isNew) {
      this.listItem.push(text.trim());
      this.updateValueAndDispatch();
    }

    this.area.appendChild(span);
    this.input.value = "";

    span.addEventListener("click", (evt) => {
      const tar = evt.target as HTMLSpanElement;
      const index = this.listItem.indexOf(text);

      if (index !== -1) {
        this.listItem.splice(index, 1);
        this.updateValueAndDispatch();
      }
      tar.remove();
    });
  }

  private updateValueAndDispatch() {
    const newValue = JSON.stringify(this.listItem);
    this.setAttribute("value", newValue);
    this.internals.setFormValue(newValue);

    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      composed: true,
      detail: {
        value: newValue,
        name: this.name,
      },
    });

    this.dispatchEvent(changeEvent);
  }
}

customElements.define("dial-multi-tags", DialMultiTags);