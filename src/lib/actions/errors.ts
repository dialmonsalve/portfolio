import { isInputError, type ActionError } from "astro:actions";

type Field = HTMLInputElement | HTMLTextAreaElement;

export function clearFieldError(field: Field) {
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
  document.getElementById(`${field.id}-error`)?.remove();
}

export function showFieldErrors(
  error: ActionError,
  form: HTMLFormElement,
  messages: Record<string, string>,
) {
  if (!isInputError(error)) return false;

  let firstInvalid: Field | undefined;

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    const field = form.querySelector<Field>(`#${CSS.escape(path)}`);
    const container = form.querySelector(`[data-field="${path}"]`);
    if (!field || !container || field.hasAttribute("aria-invalid")) return;

    const message = document.createElement("p");
    message.id = `${field.id}-error`;
    message.className = "mt-1.5 text-xs text-error-strong";
    message.textContent =
      messages[`${path}.${issue.code}`] ?? messages[path] ?? issue.message;

    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", message.id);
    container.appendChild(message);

    firstInvalid ??= field;
  });

  firstInvalid?.focus();
  return true;
}
