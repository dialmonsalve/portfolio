class DialTabs extends HTMLElement {
  private tabs: HTMLButtonElement[];
  private tabContents: HTMLElement[];

  constructor() {
    super();
    this.tabs = Array.from(this.querySelectorAll(".tabs button"));
    this.tabContents = Array.from(this.querySelectorAll(".tab-content"));

    this.querySelector(".tabs")?.setAttribute("role", "tablist");

    this.tabs.forEach((tab, index) => {
      const target = tab.getAttribute("data-tab") ?? "";
      tab.id ||= `${target}-button`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", target);

      const panel = document.getElementById(target);
      panel?.setAttribute("role", "tabpanel");
      panel?.setAttribute("aria-labelledby", tab.id);

      tab.addEventListener("click", () => this.activate(tab));
      tab.addEventListener("keydown", (evt) => this.handleKeydown(evt, index));
    });

    if (this.tabs[0]) this.activate(this.tabs[0]);
  }

  private activate(tab: HTMLButtonElement) {
    this.tabs.forEach((btn) => {
      const isActive = btn === tab;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", `${isActive}`);
      btn.tabIndex = isActive ? 0 : -1;
    });

    const target = tab.getAttribute("data-tab") ?? "";
    this.tabContents.forEach((content) =>
      content.classList.toggle("active", content.id === target),
    );
  }

  private handleKeydown(evt: KeyboardEvent, index: number) {
    const last = this.tabs.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = keys[evt.key];
    if (next === undefined) return;

    evt.preventDefault();
    this.tabs[next].focus();
    this.activate(this.tabs[next]);
  }
}
customElements.define("dial-tabs", DialTabs);
