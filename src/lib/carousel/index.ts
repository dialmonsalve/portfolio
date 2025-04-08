class DialCarousel extends HTMLElement {
  private slides!: HTMLDivElement;
  private divSlides!: NodeListOf<HTMLDivElement>;
  private buttonsSlide!: NodeListOf<HTMLButtonElement>;
  private slider!: HTMLDivElement;
  private countSlides!: number;
  private index!: number;
  private intervalId!: number;

  constructor() {
    super();
  }

  private changeColorButtons() {
    this.buttonsSlide.forEach((button) => {
      if (this.slides.getAttribute("data-id") === button.id) {
        button.classList.add("active-link");
      } else {
        button.classList.remove("active-link");
      }
    });
  }

  private mouseMove(e: MouseEvent) {
    e.preventDefault();
  }

  private moveSlidesToIndex(index: number) {
    this.slides.style.transform = `translateX(-${
      (index * 100) / this.countSlides
    }%)`;
    this.slides.setAttribute("data-id", `data-${index}`);
  }

  private moveSlides(step: number) {
    const totalSlides = this.slides?.children.length;

    this.index = (this.index + step + totalSlides) % totalSlides;
    this.slides.style.transform = `translateX(-${
      (this.index * 100) / this.countSlides
    }%)`;
    this.slides.setAttribute("data-id", `${this.index}`);
    this.handleUserInteraction();
  }

  private async initializeElements() {
    this.slides = this.querySelector(".image-hero__slides") as HTMLDivElement;
    this.divSlides = document.querySelectorAll(
      ".image-hero__slide"
    ) as NodeListOf<HTMLDivElement>;

    this.buttonsSlide = document.querySelectorAll(
      ".intro-heading__buttons-slide"
    ) as NodeListOf<HTMLButtonElement>;

    this.slider = document.querySelector(".image-hero") as HTMLDivElement;

    this.countSlides = this.divSlides.length;
    this.index = 0;
    this.slides.style.width = `${this.countSlides * 100}%`;

    await this.waitForImages();
  }

  connectedCallback() {
    this.initializeElements();
    this.setupEventListeners();
    this.startAutoSlide();
  }

  private setupEventListeners() {
    let startX: number;

    this.slider?.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.slider?.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX > endX + 50) {
        this.moveSlides(1);
      } else if (startX < endX - 50) {
        this.moveSlides(-1);
      }

      this.changeColorButtons();
    });

    this.slider?.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      this.slider.addEventListener("mousemove", this.mouseMove);
    });

    this.slider?.addEventListener("mouseup", (e) => {
      const endX = e.clientX;
      if (startX > endX + 50) {
        this.moveSlides(1);
      } else if (startX < endX - 50) {
        this.moveSlides(-1);
      }

      this.changeColorButtons();

      this.slider.removeEventListener("mousemove", this.mouseMove);
    });

    if (this.divSlides.length > 1) {
      this.buttonsSlide[0].classList.add("active-link");

      this.buttonsSlide.forEach(($button) => {
        $button.addEventListener("click", (evt) => {
          this.buttonsSlide.forEach((button) =>
            button?.classList.remove("active-link")
          );
          const target = evt.target as HTMLButtonElement;

          const buttonIndex = target.id;

          target.classList.add("active-link");

          this.moveSlidesToIndex(Number(buttonIndex));
          this.handleUserInteraction();
        });
      });
    }

    this.slider?.addEventListener("mouseenter", () => {
      window.clearInterval(this.intervalId);
    });

    this.slider?.addEventListener("mouseleave", () => {
      this.startAutoSlide();
    });
  }

  private startAutoSlide() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    if (this.divSlides.length > 1) {
      this.intervalId = window.setInterval(() => {
        this.moveSlides(1);
        this.changeColorButtons();
      }, 2000);
    }
  }

  private handleUserInteraction() {
    this.startAutoSlide();
  }

  disconnectedCallback() {
    window.clearInterval(this.intervalId);
  }

  private waitForImages(): Promise<void[]> {
    const images = this.querySelectorAll("img");

    return Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );
  }
}

customElements.define("dial-carousel", DialCarousel);
