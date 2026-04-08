import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initFAB } from "./fab";
import { initHeader } from "./header";

function setupAnimations() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  initHeader();
  initFAB();
}

setupAnimations();

document.addEventListener("astro:after-swap", setupAnimations);
