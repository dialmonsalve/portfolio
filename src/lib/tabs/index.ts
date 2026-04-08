class DialTabs extends HTMLElement {
  constructor() {
    super();
    const tabs = this.querySelectorAll(".tabs button");
    const tabContents = this.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        tab.classList.add("active");
        const target = tab.getAttribute("data-tab") ?? "";
        document.getElementById(target)?.classList.add("active");
      });
      tabs[0].classList.add("active");
      tabContents[0].classList.add("active");
    });
  }
}
customElements.define("dial-tabs", DialTabs);
