interface Values {
  dataId: number;
  label: string;
}

class DialMultiSelect extends HTMLElement {
  private selectedIndex = -1;
  private visibleItems: HTMLLIElement[] = [];
  private div: HTMLDivElement;
  private ul: HTMLUListElement;
  private listItem: number[] = [];
  private allSelectedMsg: HTMLLIElement;
  private span: HTMLSpanElement;
  static formAssociated = true;
  private internals: ElementInternals;
  private values: Values[];
  private _name: string = "";
  private _placeholder: string | null;

  constructor() {
    super();
    this.internals = this.attachInternals();

    this.div = this.querySelector("div > div") as HTMLDivElement;
    this.div.tabIndex = 0;

    this.values = JSON.parse(this.value);

    this._placeholder = this.getAttribute("placeholder");

    this.span = this.createSpan();

    this.ul = this.querySelector("ul") as HTMLUListElement;

    this.allSelectedMsg = document.createElement("li");
    this.allSelectedMsg.textContent =
      "¡Todas las opciones han sido seleccionadas!";
    this.allSelectedMsg.className =
      "all-selected-msg pointer-events-none text-xs hidden";
    this.ul.appendChild(this.allSelectedMsg);

    this.setupStyles();
    this.setupEventListeners();
    this.setupClickHandlers();

    this.values.forEach((val) => {
      this.listItem.push(val.dataId);
    });

    if (this.values.length > 0) {
      this.updateDom();
    } else {
      this.div.appendChild(this.span);
    }
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.setAttribute("name", value);
  }

  get placeholder() {
    return this._placeholder ? this._placeholder : "";
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.setAttribute("placeholder", value);
  }

  static get observedAttributes() {
    return ["name", "value", "placeholder"];
  }

  get value(): string {
    return this.getAttribute("value") || "[]";
  }

  set value(newValue: string) {
    try {
      const parsed = JSON.parse(newValue);
      if (Array.isArray(parsed)) {
        this.listItem = parsed.filter((n) => typeof n === "number");
        this.updateListItemsVisibility();
        this.setAttribute("value", JSON.stringify(this.listItem));
      }
    } catch (error) {
      console.error("Invalid value format:", error);
    }
  }

  private addSelectedItem(text: string, id: number) {
    const span = document.createElement("span");
    span.setAttribute("data-id", `${id}`);
    span.className =
      "selected-item bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mr-1 text-xs inline-block mb-0.5 hover:bg-red-200 hover:text-red-600";
    span.innerHTML = `
      ${text}
      <span class="delete-btn ml-1 cursor-pointer hover:text-red-600">x</span>
    `;

    span.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = e.target as HTMLSpanElement;
      const id = Number(target.dataset.id) || 0;

      const index = this.listItem.indexOf(id);

      if (index !== -1) {
        this.listItem.splice(index, 1);
        this.updateValueAndDispatch();
      }

      this.removeSelectedItem(text);
      this.updateVisibleItems();
      this.setupObservers();
      this.div.focus();
    });

    const inputNode = this.getInputNode();
    if (inputNode.parentNode) {
      this.div.insertBefore(span, inputNode);
    } else {
      this.div.appendChild(span);
      this.div.appendChild(inputNode);
    }

    if (this.values.length === 0) {
      this.togglePlaceholder();
    }

    this.updateListItemsVisibility();
  }

  private updateDom() {
    this.values.map((value) => {
      this.addSelectedItem(value.label, value.dataId);

      const li = document.createElement("li");

      li.setAttribute("data-id", value.dataId.toString());
      li.classList =
        "cursor-pointer hover:shadow p-0.5 rounded-md transition-all hover:bg-blue-500 text-xs hover:text-white py-2 px-2";
      li.textContent = value.label;
      this.ul.appendChild(li);

      this.updateListItemsVisibility();
    });
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === "name") {
      this._name = newValue;
    } else if (name === "placeholder") {
      this._placeholder = newValue;
    }
  }

  formDisabledCallback(disabled: boolean) {
    this.div.tabIndex = disabled ? -1 : 0;
  }

  private createSpan = () => {
    this.span = document.createElement("span");

    this.span.className =
      "text-[14px] text-slate-400 absolute top-1/2 left-2 -translate-y-1/2 pointer-events-none";
    this.span.textContent = this._placeholder;

    return this.span;
  };

  private togglePlaceholder() {
    const hasItems = this.ul.querySelectorAll("li.hidden").length > 1;
    if (!hasItems) {
      this.div.appendChild(this.span);
    }
  }

  private setupStyles() {
    this.ul.style.minWidth = `${this.div.offsetWidth}px`;
    this.ul.classList.add(
      "origin-top",
      "transition-all",
      "duration-200",
      "ease-out"
    );
  }

  private setupObservers() {
    const observerOptions = {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    };
    const listObserver = new MutationObserver((mutations) => {
      listObserver.disconnect();
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          this.checkAllSelected();
        }
      });
      listObserver.observe(this.ul, observerOptions);
    });

    listObserver.observe(this.ul, observerOptions);

    new ResizeObserver(() => this.updatePosition()).observe(this.div);
    new ResizeObserver(() => {
      this.ul.style.minWidth = `${this.div.offsetWidth}px`;
    }).observe(this.ul);
  }

  private checkAllSelected() {
    const totalItems = this.ul.querySelectorAll(
      "li:not(.no-results-msg):not(.all-selected-msg)"
    ).length;
    const hiddenItems = this.ul.querySelectorAll(
      "li.hidden:not(.no-results-msg):not(.all-selected-msg)"
    ).length;

    const allSelected = hiddenItems === totalItems;
    this.allSelectedMsg.classList.toggle("hidden", !allSelected);
  }

  private updatePosition() {
    const divRect = this.div.getBoundingClientRect();
    const spaceBelow = window.innerHeight - divRect.bottom;
    const spaceAbove = divRect.top;
    const ulHeight = this.ul.offsetHeight;

    if (spaceBelow > ulHeight || spaceBelow > spaceAbove) {
      this.ul.style.top = `${divRect.height + 4}px`;
      this.ul.style.bottom = "auto";
      this.ul.classList.remove("origin-bottom");
      this.ul.classList.add("origin-top");
    } else {
      this.ul.style.bottom = `${divRect.height + 4}px`;
      this.ul.style.top = "auto";
      this.ul.classList.remove("origin-top");
      this.ul.classList.add("origin-bottom");
    }

    const rightEdge = divRect.left + this.ul.offsetWidth;
    if (rightEdge > window.innerWidth) {
      this.ul.style.right = "0";
      this.ul.style.left = "auto";
    } else {
      this.ul.style.left = "0";
      this.ul.style.right = "auto";
    }
  }

  private setupEventListeners() {
    this.div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        this.handleEnterKey();
        this.span.remove();
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this.handleArrowKeys(e.key);
      }
    });

    this.div.addEventListener("focus", () => {
      this.setupObservers();
      this.showDropdown();
      this.updateVisibleItems();
    });

    this.div.addEventListener("click", () => this.showDropdown());

    document.querySelector("body")?.addEventListener("click", (evt) => {
      const target = evt.target as HTMLBodyElement;
      const isChildren = target.tagName === "UL" || target.tagName === "LI";

      if (target.id !== "container-multi-select" && !isChildren) {
        this.hideDropdown();
      }
    });
  }

  private handleEnterKey() {
    if (this.selectedIndex === -1 || this.visibleItems.length === 0) return;

    const selectedItem = this.visibleItems[this.selectedIndex];
    const itemText = selectedItem.textContent?.trim() || "";

    const id = Number(selectedItem.dataset.id) || 0;

    if (!this.listItem.some((item) => item === id)) this.listItem.push(id);

    if (!this.isAlreadySelected(itemText)) {
      this.addSelectedItem(itemText, id);
    }

    this.div.focus();
  }

  private getInputNode(): Node {
    const textNodes = Array.from(this.div.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    return textNodes || document.createTextNode("");
  }

  private removeSelectedItem(text: string) {
    const items = Array.from(
      this.div.querySelectorAll(".selected-item")
    ).filter((span) => span.firstChild?.textContent?.trim() === text);

    items.forEach((item) => item.remove());
    this.updateListItemsVisibility();
    this.showDropdown();
    this.togglePlaceholder();
  }

  private updateListItemsVisibility() {
    const selectedValues = this.getSelectedValues();
    this.ul.querySelectorAll("li").forEach((li) => {
      const text = li.textContent?.trim() || "";
      li.classList.toggle("hidden", selectedValues.includes(text));
    });
    this.checkAllSelected();
  }

  private getSelectedValues(): string[] {
    return Array.from(this.div.querySelectorAll(".selected-item")).map(
      (span) => span.firstChild?.textContent?.trim() || ""
    );
  }

  private isAlreadySelected(text: string): boolean {
    return this.getSelectedValues().includes(text);
  }

  private handleArrowKeys(key: string) {
    this.updateVisibleItems();
    if (this.visibleItems.length === 0) return;

    const direction = key === "ArrowDown" ? 1 : -1;
    let newIndex = this.selectedIndex + direction;

    if (newIndex < 0) newIndex = this.visibleItems.length - 1;
    if (newIndex >= this.visibleItems.length) newIndex = 0;

    this.updateSelection(newIndex);
  }

  private updateVisibleItems() {
    this.visibleItems.forEach((item) =>
      item.classList.remove("shadow", "bg-blue-500", "text-white")
    );
    this.visibleItems = Array.from(
      this.ul.querySelectorAll("li:not(.hidden):not(.no-results-msg)")
    ) as HTMLLIElement[];
  }

  private updateSelection(newIndex: number) {
    this.selectedIndex = newIndex;

    if (this.visibleItems[this.selectedIndex]) {
      const selectedItem = this.visibleItems[this.selectedIndex];
      selectedItem.classList.add("shadow", "bg-blue-500", "text-white");
      selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  private showDropdown() {
    this.ul.classList.remove("hidden", "opacity-0", "translate-y-[-10px]");
    this.ul.classList.add("opacity-100", "translate-y-0");
    this.updateVisibleItems();
    if (this.visibleItems.length > 0) {
      this.updateSelection(0);
    }
  }

  private hideDropdown() {
    this.ul.classList.add("hidden");
    this.selectedIndex = -1;
    this.visibleItems.forEach((item) =>
      item.classList.remove("shadow", "bg-blue-500", "text-white")
    );
  }
  private clearInput() {
    const spans = this.div.querySelectorAll(".selected-item");
    const inputNode = this.getInputNode();

    this.div.innerHTML = "";
    spans.forEach((span) => this.div.appendChild(span));
    this.div.appendChild(inputNode);

    inputNode.textContent = "";
    this.div.focus();
    this.togglePlaceholder();
  }

  private setupClickHandlers() {
    this.ul.addEventListener("click", (e) => {
      const target = e.target as HTMLLIElement;
      if (
        target.tagName === "LI" &&
        !target.classList.contains("no-results-msg")
      ) {
        const text = target.textContent?.trim() || "";
        const id = Number(target.dataset.id) || 0;

        this.selectItem(text, id);
        this.div.focus();

        if (!this.listItem.some((item) => item === id)) {
          this.listItem.push(id);
          this.updateValueAndDispatch();
        }
      }
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

  private selectItem(text: string, id: number) {
    if (!text || this.isAlreadySelected(text)) return;
    this.addSelectedItem(text, id);
    this.hideDropdown();
    this.clearInput();
    this.updateVisibleItems();
  }
}

customElements.define("dial-multi-select", DialMultiSelect);