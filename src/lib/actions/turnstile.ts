interface RenderOptions {
  sitekey: string;
  appearance?: "always" | "execute" | "interaction-only";
  size?: "normal" | "compact" | "flexible";
  theme?: "auto" | "light" | "dark";
  language?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => boolean | void;
  "before-interactive-callback"?: () => void;
  "after-interactive-callback"?: () => void;
}

export interface Turnstile {
  render: (container: HTMLElement, options: RenderOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading: Promise<Turnstile> | undefined;

export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  loading ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile no disponible")),
    );
    script.addEventListener("error", () => {
      loading = undefined;
      script.remove();
      reject(new Error("No se pudo cargar Turnstile"));
    });
    document.head.appendChild(script);
  });

  return loading;
}
