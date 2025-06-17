class MiniDialCarousel extends HTMLElement {
  private carousel!: HTMLDivElement;
  private isDragStart!: boolean;
  private prevPageX!: number;
  private prevScrollLeft!: number;
  private buttons!: NodeListOf<HTMLButtonElement>;
  private firstImage!: HTMLLIElement;
  private widthImage!: number;
  private autoSlideInterval!: number;
  private interactionTimeout!: number;

  constructor() {
    super();
  }

  private mouseMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragStart) return;
    e.preventDefault();
    this.carousel.classList.add("dragging");
    const positionDiff =
      e instanceof MouseEvent
        ? e.pageX - this.prevPageX
        : e.touches[0].pageX - this.prevPageX;
    this.carousel.scrollLeft = this.prevScrollLeft - positionDiff;
  };

  private mouseDown = (e: MouseEvent | TouchEvent) => {
    this.isDragStart = true;
    this.prevPageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    this.prevScrollLeft = this.carousel.scrollLeft;
  };

  private mouseUp = () => {
    this.isDragStart = false;
    this.carousel.classList.remove("dragging");
  };

  private initializeElements() {
    this.isDragStart = false;
    this.carousel = this.querySelector("#carousel") as HTMLDivElement;
    this.buttons = this.querySelectorAll(".button");
    this.firstImage = this.carousel.querySelectorAll("li")[0];
    this.widthImage = this.firstImage.clientWidth + 18;
  }

  connectedCallback() {
    this.initializeElements();
    this.setupEventListeners();
    this.startAutoSlide();
  }

  private setupEventListeners() {
    this.carousel?.addEventListener("mousedown", this.mouseDown);
    this.carousel.addEventListener("mousemove", this.mouseMove);
    this.carousel?.addEventListener("mouseup", this.mouseUp);
    this.carousel?.addEventListener("mouseleave", this.mouseUp);

    this.carousel?.addEventListener("touchstart", this.mouseDown);
    this.carousel.addEventListener("touchmove", this.mouseMove);
    this.carousel?.addEventListener("touchend", this.mouseUp);

    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleButtonClick(button);
        this.resetAutoSlideTimer(); // Reiniciar temporizador al interactuar
      });
    });

    const pauseEvents = ["mousedown", "touchstart"];
    pauseEvents.forEach((ev) => {
      this.carousel.addEventListener(ev, () => {
        clearInterval(this.autoSlideInterval);
      });
    });

    const resumeEvents = ["mouseup", "touchend"];
    resumeEvents.forEach((ev) => {
      this.carousel.addEventListener(ev, () => {
        this.resetAutoSlideTimer();
      });
    });
  }

  private handleButtonClick = (button: HTMLButtonElement) => {
    if (button.id === "left") {
      if (this.carousel.scrollLeft <= 0) {
        this.carousel.scrollLeft = this.carousel.scrollWidth;
      } else {
        this.carousel.scrollLeft -= this.widthImage;
      }
    } else {
      const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;

      if (this.carousel.scrollLeft >= maxScroll - 1) {
        this.carousel.scrollLeft = 0;
      } else {
        this.carousel.scrollLeft += this.widthImage;
      }
    }
  };

  private startAutoSlide = () => {
    this.autoSlideInterval = window.setInterval(() => {
      this.handleNextSlide();
    }, 3000);
  };

  private handleNextSlide() {
    const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;

    if (this.carousel.scrollLeft >= maxScroll - 1) {
      this.carousel.scrollLeft = 0;
    } else {
      this.carousel.scrollLeft += this.widthImage;
    }
  }

  private resetAutoSlideTimer = () => {
    clearInterval(this.autoSlideInterval);
    clearTimeout(this.interactionTimeout);

    this.interactionTimeout = window.setTimeout(() => {
      this.startAutoSlide();
    }, 3000);
  };

  disconnectedCallback() {
    clearInterval(this.autoSlideInterval);
    clearTimeout(this.interactionTimeout);
  }
}

customElements.define("mini-dial-carousel", MiniDialCarousel);
