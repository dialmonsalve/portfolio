import gsap from "gsap";

export function initFAB() {
  const fab = document.querySelector(".fab") as HTMLDivElement;
  if (!fab) return;

  gsap.set(fab, {
    opacity: 0,
    y: 500,
    pointerEvents: "none",
  });

  gsap.to(fab, {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.5,
    ease: "back.out(3)",
    force3D: true,
    onStart: () => {
      fab.style.pointerEvents = "all";
    },
  });
}
