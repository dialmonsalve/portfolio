export const defaultLang = "es";

type language = "en" | "es";

export const ui: Record<language, Record<string, string>> = {
  es: {
    home: "inicio",
    projects: "proyectos",
    about: "acerca de"
  },
  en: {
    home: "home",
    projects: "projects",
    about: "about"
  },
} as const;

export const routes: Record<string, Record<string, string>> = {
  es: {},
  en: {},
};
