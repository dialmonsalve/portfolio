export default class AppInput extends HTMLElement {
  private label: string = "";
  private type: string = "";
  private name: string = "";
  private _value: string = "";
  private new_value: string = "";
  private _change: boolean = false;

  constructor() {
    super();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("./styles/input.css", import.meta.url).href;
    this.classList ="container-input"

    this.appendChild(link);
  }

  connectedCallback() {
    const input = document.createElement("input");
    input.type = this.type;
    input.name = this.name;
    input.id = "app-input";
    input.value = this.new_value;
    input.classList.add("input");
    input.classList.add("dark:text-white");

    const label = document.createElement("label");
    label.htmlFor = "app-input";
    label.textContent = this.label;
    label.classList.add("label");
    label.classList.add("dark:text-white");

    input.addEventListener("change", (evt) => this.onChange(evt));

    this.appendChild(label);
    this.appendChild(input);
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case "label":
        this.label = newValue;
        return;
      case "type":
        this.type = newValue;
        return;
      case "name":
        this.name = newValue;
        return;
      case "_value":
        this._value = newValue;
        return;
      case "new_value":
        this.new_value = newValue;
        return;
      default:
        console.warn(`Unrecognized attribute: ${name}`);
    }
  }

  static get observedAttributes() {
    return ["type", "name", "_value", "new_value", "label", "input_id"];
  }

  onChange(evt: Event) {    
    const target = evt.target as HTMLInputElement;
    this._value = target.value;
    this._change = true;
  }

  get value() {
    return this._value;
  }

  get change() {
    return this._change;
  }

  set value(newValue) {
    this._value = newValue;
    const container = this.querySelector(`#app-input`) as HTMLInputElement;
    container.value = newValue;
  }
}

customElements.define("app-input", AppInput);