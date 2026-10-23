import { clientT } from "@/lib/i18n";

interface IModal {
  title: string;
  content?: () => HTMLElement | undefined;
  action?: (e: MouseEvent) => void;
}

let titleCount = 0;

export default class Modal {
  private readonly title: string;
  private content?: () => HTMLElement | undefined;
  private action?: (e: MouseEvent) => void;

  constructor({ title, content, action }: IModal) {
    this.title = title;
    this.content = content;
    this.action = action;
  }

  build = () => {
    if (document.querySelector("dialog.form-modal")) return;

    const opener = document.activeElement as HTMLElement | null;
    const titleId = `form-modal-title-${++titleCount}`;

    const modal = document.createElement("dialog");
    modal.className = "form-modal modal modal-bottom sm:modal-middle";
    modal.setAttribute("aria-labelledby", titleId);

    const containerModal = document.createElement("div");
    containerModal.className =
      "modal-box flex w-full max-w-md flex-col gap-6 border border-base-300 bg-base-100 p-6 text-base-content shadow-none";

    containerModal.appendChild(this.header(titleId));
    containerModal.appendChild(this.body());
    containerModal.appendChild(this.footer(modal));

    modal.appendChild(containerModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.closeModal(modal);
    });

    modal.addEventListener("close", () => {
      modal.remove();
      opener?.focus({ preventScroll: true });
    });

    document.body.appendChild(modal);
    modal.showModal();
  };

  private header = (titleId: string) => {
    const titleModal = document.createElement("h2");
    titleModal.id = titleId;
    titleModal.className =
      "border-b border-base-300 pb-3 text-lg font-semibold first-letter:uppercase";
    titleModal.textContent = this.title;
    return titleModal;
  };

  private body = () => {
    const element = document.createElement("div");

    const nodeChild = this.content ? this.content() : element;

    if (!nodeChild) return element;

    return nodeChild;
  };

  private footer = (modal: HTMLDialogElement) => {
    const modalFooter = document.createElement("div");
    modalFooter.className = "flex justify-end gap-2 border-t border-base-300 pt-4";

    const buttonAccept = document.createElement("button");
    buttonAccept.type = "button";
    buttonAccept.className = "btn btn-primary btn-sm";
    buttonAccept.textContent = clientT("save");

    const buttonCancel = document.createElement("button");
    buttonCancel.type = "button";
    buttonCancel.className = "btn btn-ghost btn-sm border-base-300";
    buttonCancel.textContent = clientT("cancel");

    modalFooter.appendChild(buttonCancel);
    modalFooter.appendChild(buttonAccept);

    buttonAccept.addEventListener("click", (e) => {
      this.action?.(e);
      this.closeModal(modal);
    });

    buttonCancel.addEventListener("click", () => this.closeModal(modal));

    return modalFooter;
  };

  closeModal = (modal: HTMLDialogElement) => {
    modal.close();
  };
}
