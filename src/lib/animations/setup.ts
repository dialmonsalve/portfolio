import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

import { initCardTilt } from "./cards";
import { initFAB } from "./fab";
import { initBackToTop } from "./footer";
import { initHeader } from "./header";
import { initHero } from "./hero";
import { initMagnetic } from "./magnetic";
import { revealOnScroll, showRevealedItems } from "./reveal";
import { initTechnologies } from "./technologies";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

type Cleanup = (() => void) | undefined;

let mm: gsap.MatchMedia | undefined;

function setupAnimations() {
  mm?.revert();
  mm = gsap.matchMedia();

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      finePointer: "(hover: hover) and (pointer: fine)",
    },
    (context) => {
      const { reduced = false, finePointer = false } = context.conditions ?? {};
      const cleanups: Cleanup[] = [initBackToTop(reduced)];

      initHeader(reduced);
      initFAB(reduced);

      if (reduced) {
        showRevealedItems();
      } else {
        initHero();
        revealOnScroll();
        if (finePointer) {
          cleanups.push(initTechnologies(), initCardTilt(), initMagnetic());
        }
      }

      return () => cleanups.forEach((cleanup) => cleanup?.());
    },
  );
}

document.addEventListener("astro:page-load", setupAnimations);
