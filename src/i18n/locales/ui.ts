export const defaultLang = "es";

type language = "en" | "es";

export const ui: Record<language, Record<string, string>> = {
  es: {
    home: "inicio",
    projects: "proyectos",
    about: "acerca de",
    menu: "menú de navegación",
    breadcrumbs: "ruta de navegación",
    addTag: "agregar tag",
    skipToContent: "Saltar al contenido",
  },
  en: {
    home: "home",
    projects: "projects",
    about: "about",
    menu: "navigation menu",
    breadcrumbs: "breadcrumb",
    addTag: "add tag",
    skipToContent: "Skip to content",
  },
} as const;

export const routes: Record<string, Record<string, string>> = {
  es: {},
  en: {},
};
