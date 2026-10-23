import gsap from "gsap";

interface MagneticOptions {
  trigger: HTMLElement;
  target?: HTMLElement;
  strength?: number;
  scale?: number;
}

export function magnetic({
  trigger,
  target = trigger,
  strength = 0.3,
  scale = 1,
}: MagneticOptions) {
  const xTo = gsap.quickTo(target, "x", { duration: 0.3, ease: "power2.out" });
  const yTo = gsap.quickTo(target, "y", { duration: 0.3, ease: "power2.out" });

  const onMove = (evt: PointerEvent) => {
    const { left, top, width, height } = trigger.getBoundingClientRect();
    xTo((evt.clientX - left - width / 2) * strength);
    yTo((evt.clientY - top - height / 2) * strength);
    if (scale !== 1) gsap.to(target, { scale, duration: 0.3, ease: "power2.out" });
  };

  const onLeave = () => {
    gsap.to(target, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  trigger.addEventListener("pointermove", onMove);
  trigger.addEventListener("pointerleave", onLeave);

  return () => {
    trigger.removeEventListener("pointermove", onMove);
    trigger.removeEventListener("pointerleave", onLeave);
  };
}

export function initMagnetic() {
  const elements = document.querySelectorAll<HTMLElement>("[data-magnetic]");
  const cleanups = Array.from(elements, (element) =>
    magnetic({ trigger: element, strength: 0.4 }),
  );

  return () => cleanups.forEach((cleanup) => cleanup());
}
