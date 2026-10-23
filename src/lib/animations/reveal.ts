import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function revealOnScroll() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal="scroll"]');
  if (!items.length) return;

  gsap.set(items, { autoAlpha: 0, y: 24 });

  ScrollTrigger.batch(items, {
    start: "top 92%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        overwrite: true,
      }),
  });
}

export function showRevealedItems() {
  gsap.set("[data-reveal]", { autoAlpha: 1 });
}
