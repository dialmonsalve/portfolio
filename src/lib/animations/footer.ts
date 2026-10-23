import gsap from "gsap";

export function initBackToTop(reduced: boolean) {
  const link = document.querySelector<HTMLAnchorElement>("[data-back-to-top]");
  if (!link) return;

  const focusHeader = () =>
    document
      .querySelector<HTMLElement>("#header [tabindex], #header a, #header button")
      ?.focus({ preventScroll: true });

  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();

    if (reduced) {
      window.scrollTo(0, 0);
      focusHeader();
      return;
    }

    gsap.to(window, {
      scrollTo: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: focusHeader,
    });
  };

  link.addEventListener("click", onClick);
  return () => link.removeEventListener("click", onClick);
}
