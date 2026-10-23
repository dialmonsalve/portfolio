const SELECTOR = "details.dropdown";

export function closeDropdowns(except?: Element | null) {
  document
    .querySelectorAll<HTMLDetailsElement>(`${SELECTOR}[open]`)
    .forEach((dropdown) => {
      if (dropdown !== except) dropdown.open = false;
    });
}

document.addEventListener("click", (evt) => {
  const target = evt.target as Element;
  const dropdown = target.closest<HTMLDetailsElement>(SELECTOR);

  closeDropdowns(dropdown);

  const isPointerSelection = evt.detail > 0;
  if (dropdown && isPointerSelection && target.closest(".dropdown-content a, .dropdown-content input")) {
    dropdown.open = false;
  }
});

document.addEventListener("keydown", (evt) => {
  if (evt.key !== "Escape") return;

  const dropdown = document.querySelector<HTMLDetailsElement>(`${SELECTOR}[open]`);
  if (!dropdown) return;

  dropdown.open = false;
  dropdown.querySelector("summary")?.focus();
});

document.addEventListener("focusout", (evt) => {
  const dropdown = (evt.target as Element).closest<HTMLDetailsElement>(SELECTOR);
  const next = evt.relatedTarget as Node | null;

  if (dropdown?.open && next && !dropdown.contains(next)) dropdown.open = false;
});
