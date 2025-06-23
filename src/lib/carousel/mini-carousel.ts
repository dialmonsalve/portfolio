class MiniDialCarousel extends HTMLElement {
  private carousel!: HTMLDivElement;
  private buttons!: NodeListOf<HTMLButtonElement>;
  private firstImage!: HTMLLIElement;
  private widthImage!: number;
  private autoSlideInterval!: number;
  private interactionTimeout!: number;

  constructor() {
    super();
  }

  private initializeElements() {
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

    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleButtonClick(button);
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
    }, 2000);
  };

  disconnectedCallback() {
    clearInterval(this.autoSlideInterval);
    clearTimeout(this.interactionTimeout);
  }
}

customElements.define("mini-dial-carousel", MiniDialCarousel);
