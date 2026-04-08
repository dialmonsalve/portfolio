import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  const currentScroll = window.scrollY || document.documentElement.scrollTop;
  let isHidden = currentScroll > 160;

  if (isHidden) {
    gsap.set(header, { y: -100, opacity: 0 });
  } else {
    gsap.from(header, { 
      opacity: 0, 
      y: -20, 
      duration: 1, 
      ease: "power2.out" 
    });
  }

  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    onUpdate: (self) => {
      const shouldBeHidden = self.scroll() > 160;

      if (shouldBeHidden && !isHidden) {
        isHidden = true;
        gsap.to(header, {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          pointerEvents: "none",
        });
      } else if (!shouldBeHidden && isHidden) {
        isHidden = false;
        gsap.to(header, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          pointerEvents: "all",
        });
      }
    },
  });
}