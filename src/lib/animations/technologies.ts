import gsap from "gsap";

function waveList() {
  const techList = document.querySelector(".tech-list");
  if (!techList) return;
  const items = techList.querySelectorAll(
    ".tech-item",
  ) as NodeListOf<HTMLLIElement>;

  items.forEach((item) => {
    const icon = item.querySelector(".icon-wrapper");

    if (!icon) return;
    item.addEventListener("mousemove", (e) => {
      const { left, top, width, height } = item.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.3;
      const y = (e.clientY - top - height / 2) * 0.3;

      gsap.to(icon, {
        x: x,
        y: y,
        scale: 1.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(icon, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });
}

waveList();
document.addEventListener("astro:after-swap", waveList);
