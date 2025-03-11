export default class ModalBody extends HTMLElement {

  constructor() {
    super();

    this.style.display = "flex";
    this.style.flexDirection = "column";
    this.style.gap = "1rem";
    this.style.width = "100%";
  }

  connectedCallback() {
    const slot = document.createElement("slot");
    this.appendChild(slot);
  }
}

customElements.define("app-modal-body", ModalBody);
