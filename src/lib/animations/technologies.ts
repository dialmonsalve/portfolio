import { magnetic } from "./magnetic";

export function initTechnologies() {
  const items = document.querySelectorAll<HTMLElement>(".tech-list .tech-item");

  const cleanups = Array.from(items, (item) => {
    const icon = item.querySelector<HTMLElement>(".icon-wrapper");
    if (!icon) return undefined;
    return magnetic({ trigger: item, target: icon, strength: 0.3, scale: 1.3 });
  });

  return () => cleanups.forEach((cleanup) => cleanup?.());
}
