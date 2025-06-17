class ObserverBg extends HTMLElement {
  constructor() {
    super();
    const background = this.querySelector(
      "#background-nebula"
    ) as HTMLDivElement;
    const mainScrollContainer = document.getElementById(
      "main-scroll-container"
    );

    if (!mainScrollContainer || !background) {
      console.warn("Elementos necesarios no encontrados para ObserverBg.");
      return;
    }

    const scrollProgressTracker = document.createElement("div");
    scrollProgressTracker.id = "scroll-progress-tracker";
    scrollProgressTracker.style.height = "100vh";
    scrollProgressTracker.style.width = "1px";
    scrollProgressTracker.style.position = "absolute";
    scrollProgressTracker.style.top = "0";
    scrollProgressTracker.style.left = "0";
    scrollProgressTracker.style.pointerEvents = "none";
    scrollProgressTracker.style.opacity = "0";

    this.appendChild(scrollProgressTracker);

    const updateScale = () => {
      const scrollTop = mainScrollContainer.scrollTop;
      const scrollHeight = mainScrollContainer.scrollHeight;
      const clientHeight = mainScrollContainer.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      let progress = 0;
      if (maxScrollTop > 0) {
        progress = scrollTop / maxScrollTop;
      }

      progress = Math.min(1, Math.max(0, progress));

      const initialScale = 1.2;
      const finalScale = 1;
      const scaleRange = initialScale - finalScale;
      const currentScale = initialScale - progress * scaleRange;
      background.style.transform = `scale(${currentScale})`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          updateScale();
        }
      },
      {
        root: mainScrollContainer,
        rootMargin: "0px",

        threshold: [0, 1],
      }
    );

    observer.observe(scrollProgressTracker);

    let ticking = false;

    mainScrollContainer.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScale();
          ticking = false;
        });
        ticking = true;
      }
    });
    updateScale();
  }
}

customElements.define("change-bg", ObserverBg);
