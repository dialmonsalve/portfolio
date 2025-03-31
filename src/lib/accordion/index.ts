class AccordionDial extends HTMLElement {
  constructor() {
    super();
    const accordions = this.querySelectorAll(".accordion-header");

    accordions.forEach((header) => {
      header.addEventListener("click",  (evt) => {
        const tar = evt.target as HTMLButtonElement;
        const target = tar.closest(".accordion-header");

        const content = target?.nextElementSibling as HTMLDivElement;
        const span = target?.querySelector("#icon-link") as HTMLSpanElement;

        accordions.forEach((acc) => {
          const accContent = acc?.nextElementSibling as HTMLDivElement;
          const button = accContent?.previousElementSibling;
          const span = button?.querySelector("#icon-link") as HTMLSpanElement;
          if (!span) return;
          span.textContent = "+";

          if (!accContent) return;
          if (accContent !== content && accContent.style.maxHeight) {
            accContent.style.maxHeight = "";
          }
        });

        if (!content) return;
        if (content.style.maxHeight) {
          content.style.maxHeight = "";
          span.textContent = "+";
        } else {
          content.style.maxHeight = content?.scrollHeight + 4 + "px";
          span.textContent = "-";
        }
      });
    });
  }
}

customElements.define("accordion-dial", AccordionDial);