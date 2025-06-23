enum Color {
  "yellow" = "yellow",
  "green" = "green",
  "purple" = "purple",
  "red" = "red",
}

interface IModal {
  title: string;
  type?: Color;
  content?: () => HTMLElement | undefined;
  action?: (e: MouseEvent) => void;
  twoButtons?: boolean;
}

export default class Modal {
  private readonly title: string;
  private readonly twoButtons?: boolean;
  private content?: () => HTMLElement | undefined;
  private action?: (e: MouseEvent) => void;

  constructor({ title, twoButtons, content, action }: IModal) {
    this.title = title;
    this.content = content;
    this.twoButtons = twoButtons;
    this.action = action;
  }

  build = () => {
    const windowModal = document.querySelector(".modal.show-modal");

    if (windowModal) return;

    const body = document.querySelector("body");

    const modal = document.createElement("div");
    modal.classList.add(
      "modal",
      "show-modal",
      "absolute",
      "w-full",
      "h-screen",
      "top-0",
      "z-999",
      "flex",
      "bg-white/10",
      "dark:bg-slate/10",
      "backdrop-blur-xs"
    );

    const containerModal = document.createElement("div");
    containerModal.classList.add(
      "rounded-md",
      "max-w-100",
      "w-100",
      "bg-gray-100",
      "mx-auto",
      "my-auto",
      "p-6",
      "flex",
      "flex-col",
      "items-center",
      "gap-6",
      "border-t-4",
      "border-green-500"
    );

    const modalHeader = this.header();

    containerModal.appendChild(modalHeader);

    const nodeChild = this.body();
    containerModal.appendChild(nodeChild);

    const modalFooter = this.footer(modal);

    containerModal.appendChild(modalFooter);

    modal.appendChild(containerModal);

    modal.addEventListener("click", (e) => {
      const target = e.target as HTMLDivElement;
      if (target.classList.contains("show-modal")) this.closeModal(target);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal(modal);
    });

    body?.appendChild(modal);
  };

  private header = () => {
    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const titleModal = document.createElement("p");
    titleModal.classList.add("uppercase", "dark:text-slate-800");
    titleModal.textContent = this.title;
    modalHeader.appendChild(titleModal);
    return modalHeader;
  };

  private body = () => {
    const element = document.createElement("div");

    const nodeChild = this.content ? this.content() : element;

    if (!nodeChild) return element;

    return nodeChild;
  };


  private footer = (modal: HTMLDivElement) => {
    const modalFooter = document.createElement("div");
    modalFooter.classList.add("flex", "self-end", "gap-4");

    const buttonFooter1 = document.createElement("button");
    buttonFooter1.classList.add(
      "text-white",
      "py-2",
      "px-4",
      "rounded-md",
      "shadow-2xs",
      "shadow-gray-300",
      "uppercase",
      "bg-green-600",
      "cursor-pointer",
      "hover:opacity-80"
    );
    buttonFooter1.textContent = "ok";

    const buttonFooter2 = document.createElement("button");
    buttonFooter2.classList.add(
      "text-white",
      "py-2",
      "px-4",
      "rounded-md",
      "shadow-2xs",
      "shadow-gray-300",
      "uppercase",
      "bg-red-400",
      "cursor-pointer",
      "hover:opacity-80"
    );
    buttonFooter2.textContent = "Cancel";

    modalFooter.appendChild(buttonFooter1);
    if (this.twoButtons) modalFooter.appendChild(buttonFooter2);

    if (this.action) {
      buttonFooter1.addEventListener("click", this.action);
    }

    buttonFooter1.addEventListener("click", () => this.closeModal(modal));

    buttonFooter2.addEventListener("click", () => this.closeModal(modal));

    return modalFooter;
  };

  closeModal = (modal: HTMLDivElement) => {
    modal.classList.add("hide-modal");
    setTimeout(() => {
      modal.remove();
    }, 300);
  };
}
