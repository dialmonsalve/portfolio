const DELAY = 5000;

class DialCarousel extends HTMLElement {
  private viewport!: HTMLElement;
  private slides!: HTMLElement[];
  private dots!: HTMLButtonElement[];
  private toggle!: HTMLButtonElement;
  private messages = { pause: "", play: "" };
  private index = 0;
  private timer?: number;
  private userPaused = false;
  private hovered = false;
  private focused = false;
  private observer?: IntersectionObserver;
  private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  connectedCallback() {
    this.viewport = this.querySelector<HTMLElement>("[data-carousel-viewport]")!;
    this.slides = [...this.querySelectorAll<HTMLElement>("[data-carousel-slide]")];
    this.dots = [...this.querySelectorAll<HTMLButtonElement>("[data-carousel-dot]")];
    this.toggle = this.querySelector<HTMLButtonElement>("[data-carousel-toggle]")!;
    this.messages = JSON.parse(this.dataset.messages ?? "{}");

    if (!this.viewport || this.slides.length === 0) return;

    this.userPaused = this.reducedMotion.matches;

    this.querySelector("[data-carousel-prev]")?.addEventListener("click", this.prev);
    this.querySelector("[data-carousel-next]")?.addEventListener("click", this.next);
    this.toggle?.addEventListener("click", this.togglePlay);
    this.dots.forEach((dot) =>
      dot.addEventListener("click", () => this.goTo(Number(dot.dataset.carouselDot))),
    );

    this.addEventListener("keydown", this.onKeydown);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);

    this.observer = new IntersectionObserver(this.onIntersect, {
      root: this.viewport,
      threshold: 0.6,
    });
    this.slides.forEach((slide) => this.observer?.observe(slide));

    this.update();
  }

  disconnectedCallback() {
    this.stop();
    this.observer?.disconnect();
    this.removeEventListener("keydown", this.onKeydown);
    this.removeEventListener("mouseenter", this.onMouseEnter);
    this.removeEventListener("mouseleave", this.onMouseLeave);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
  }

  private get rotating() {
    return !this.userPaused && !this.hovered && !this.focused;
  }

  private goTo = (index: number) => {
    const total = this.slides.length;
    this.index = (index + total) % total;
    this.viewport.scrollTo({
      left: this.slides[this.index].offsetLeft,
      behavior: this.reducedMotion.matches ? "auto" : "smooth",
    });
    this.markActive();
  };

  private prev = () => this.goTo(this.index - 1);

  private next = () => this.goTo(this.index + 1);

  private togglePlay = () => {
    this.userPaused = !this.userPaused;
    this.update();
  };

  private onKeydown = (evt: KeyboardEvent) => {
    if (evt.key === "ArrowLeft") {
      evt.preventDefault();
      this.prev();
    } else if (evt.key === "ArrowRight") {
      evt.preventDefault();
      this.next();
    }
  };

  private onMouseEnter = () => {
    this.hovered = true;
    this.update();
  };

  private onMouseLeave = () => {
    this.hovered = false;
    this.update();
  };

  private onFocusIn = () => {
    this.focused = true;
    this.update();
  };

  private onFocusOut = (evt: FocusEvent) => {
    if (this.contains(evt.relatedTarget as Node | null)) return;
    this.focused = false;
    this.update();
  };

  private onIntersect = (entries: IntersectionObserverEntry[]) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (!visible) return;
    this.index = this.slides.indexOf(visible.target as HTMLElement);
    this.markActive();
  };

  private markActive() {
    this.dots.forEach((dot, i) => {
      if (i === this.index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  private update() {
    const label = this.userPaused ? this.messages.play : this.messages.pause;
    this.toggle?.setAttribute("aria-label", label);
    this.toggle?.querySelector("[data-icon-pause]")?.toggleAttribute("hidden", this.userPaused);
    this.toggle?.querySelector("[data-icon-play]")?.toggleAttribute("hidden", !this.userPaused);
    this.viewport.setAttribute("aria-live", this.rotating ? "off" : "polite");

    this.stop();
    if (this.rotating) this.timer = window.setInterval(this.next, DELAY);
  }

  private stop() {
    window.clearInterval(this.timer);
    this.timer = undefined;
  }
}

if (!customElements.get("dial-carousel")) {
  customElements.define("dial-carousel", DialCarousel);
}
