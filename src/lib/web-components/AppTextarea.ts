export default class AppTextarea extends HTMLElement {
  private label: string;
  private name: string;
  private input_class: string;
  private _value: string;
  private new_value: string;
  private _change: boolean;
  constructor() {
    super();
    this.label = "";
    this.name = "";
    this.input_class = "";
    this._value = "";
    this.new_value = "";
    this._change = false;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("./styles/textarea.css", import.meta.url).href;

    this.appendChild(link);
  }

  connectedCallback() {
    const textarea = document.createElement("textarea");
    const className = this.input_class === "" ? "textarea" : this.input_class;
    textarea.name = this.name;
    textarea.id = "area-form";
    textarea.value = this.new_value;
    textarea.classList.add(className);
    textarea.classList.add("dark:text-white");

    const label = document.createElement("label");
    label.htmlFor = "area-form";
    label.textContent = this.label;
    label.classList.add("label");
    label.classList.add("dark:text-white");

    textarea.addEventListener("change", (evt) => this.onChange(evt));

    this.appendChild(label);
    this.appendChild(textarea);
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case "label":
        this.label = newValue;
        break;
      case "name":
        this.name = newValue;
        break;
      case "input_class":
        this.input_class = newValue;
        break;
      case "_value":
        this._value = newValue;
        break;
      case "new_value":
        this.new_value = newValue;
        break;
      default:
        console.warn(`Unrecognized attribute: ${name}`);
    }
  }

  static get observedAttributes() {
    return ["name", "_value", "new_value", "label", "input_class", "input_id"];
  }

  onChange(evt: Event) {
    const target = evt.target as HTMLInputElement;
    this._value = target.value;
    this._change = true;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    const container = this.querySelector(`#area-form`) as this;
    container.value = newValue;
  }

  get change() {
    return this._change;
  }
}

customElements.define("app-textarea", AppTextarea);
