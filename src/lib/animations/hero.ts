import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function initHero() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return;

  const photo = hero.querySelector("[data-hero-photo]");
  const title = hero.querySelector<HTMLElement>("[data-hero-title]");
  const points = hero.querySelectorAll("[data-hero-point]");

  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (photo) {
    timeline.fromTo(
      photo,
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 1, scale: 1, duration: 0.6 },
    );
  }

  if (title) {
    gsap.set(title, { autoAlpha: 1 });
    const split = SplitText.create(title, { type: "words,chars" });
    timeline.from(
      split.chars,
      { autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.025 },
      "-=0.25",
    );
  }

  if (points.length) {
    timeline.fromTo(
      points,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 },
      "-=0.2",
    );
  }
}
