interface IAlert {
  message: string;
  type: "success" | "error";
}

export class Alert {
  constructor({ message, type }: IAlert) {
    const alert = document.createElement("div");
    const paragraph = document.createElement("p");
    paragraph.className = "text-white font-bold text-sm";
    paragraph.textContent = message;
    alert.appendChild(paragraph);

    const colorClass = type === "success" ? "bg-green-700" : "bg-red-500";
    alert.className = `${colorClass} py-0.5 px-4 w-fit rounded-lg fixed z-[99999] top-9 right-3 animate-alert text-xs`;

    document.body.appendChild(alert);

    alert.addEventListener("animationend", () => alert.remove());
  }
}