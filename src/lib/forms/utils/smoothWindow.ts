export default function smooth(element?: Element | null) {
  const cards = document.querySelector("#container-cards");
  const target = element ?? cards?.lastElementChild?.lastElementChild ?? cards?.lastElementChild;

  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  });
}
