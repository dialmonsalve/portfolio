import gsap from "gsap";

const MAX_TILT = 6;

export function initCardTilt() {
  const cards = gsap.utils.toArray<HTMLElement>("[data-tilt]");

  const cleanups = cards.map((card) => {
    const image = card.querySelector("img");
    gsap.set(card, { transformPerspective: 900 });

    const rotateX = gsap.quickTo(card, "rotationX", {
      duration: 0.4,
      ease: "power2.out",
    });
    const rotateY = gsap.quickTo(card, "rotationY", {
      duration: 0.4,
      ease: "power2.out",
    });

    const onEnter = () => {
      if (image) gsap.to(image, { scale: 1.04, duration: 0.4, ease: "power2.out" });
    };

    const onMove = (evt: PointerEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (evt.clientX - left) / width - 0.5;
      const y = (evt.clientY - top) / height - 0.5;
      rotateY(x * MAX_TILT * 2);
      rotateX(-y * MAX_TILT * 2);
    };

    const onLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
      if (image) gsap.to(image, { scale: 1, duration: 0.4, ease: "power2.out" });
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
