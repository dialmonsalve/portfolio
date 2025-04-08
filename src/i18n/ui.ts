export const languages = {
  es: "Español",
  en: "English",
};

interface Routes {
  es: {
    about: string;
    projects: string;
    contact: string;
    form: string;
    "convert-images": string;
    "dialui-components": string;
    "web-components": string;
    msc: string;
    rain: string;
  };
  en: {
    about: string;
    projects: string;
    contact: string;
    "projects/form": string;
    "projects/convert-images": string;
    "projects/dialui-components": string;
    "projects/web-components": string;
    "projects/msc": string;
    "projects/rain": string;
  };
}

export const defaultLang = "es";
export const showDefaultLang = false;

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.form": "Create Forms",
    "nav.convert-images": "Convert Images",
    "nav.dialui-components": "Dial-UI components",
    "nav.msc": "Marble Slab Creamery",
    "nav.rain": "Rain",
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Acerca de",
    "nav.services": "Servicios",
    "nav.projects": "Proyectos",
    "nav.contact": "Contacto",
    "nav.form": "Crea Formularios",
    "nav.convert-images": "Conversor de imágenes",
    "nav.dialui-components": "Dial-UI components",
    "nav.msc": "Marble Slab Creamery",
    "nav.rain": "Rain",
  },
} as const;

export const routes: Routes & { [key: string]: any } = {
  es: {
    about: "about",
    contact: "contact",
    projects: "projects",
    form: "projects/form",
    "convert-images": "projects/convert-images",
    "dialui-components": "projects/dialui-components",
    "web-components": "projects/web-components",
    msc: "projects/msc",
    rain: "projects/rain",
  },
  en: {
    about: "about",
    contact: "contact",
    projects: "projects",
    "projects/form": "form",
    "projects/convert-images": "convert-images",
    "projects/dialui-components": "dialui-components",
    "projects/web-components": "web-components",
    "projects/msc": "msc",
    "projects/rain": "rain",
  },
};
