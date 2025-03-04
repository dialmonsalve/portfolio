import { Translate, type Link } from "@interfaces/links";

const LINKS: Link[] = [
  {
    href: "/",
    name: Translate["nav.home"],
    icon: "home",
    target: "_self",
    hasChildren: false,
  },

  {
    href: "/projects",
    name: Translate["nav.projects"],
    icon: "projects",
    target: "_self",
    hasChildren: true,
    subMenu: [
      {
        name: Translate["nav.convert-images"],
        href: "/projects/convert-images",
        target: "_self",
      },
      {
        name: Translate["nav.form"],
        href: "/projects/form",
        target: "_self",
      },
      {
        name: Translate["nav.dialui-components"],
        href: "https://dialui-components.netlify.app",
        target: "_blank",
      },
      {
        name: Translate["nav.msc"],
        href: "https://www.marbleslabpr.com/",
        target: "_blank",
      },
      {
        name: Translate["nav.rain"],
        href: "https://rain.scgroup.one/",
        target: "_blank",
      },
    ],
  },
  {
    href: "/about",
    name: Translate["nav.about"],
    icon: "logo",
    target: "_self",
  },
  {
    href: "/contacto",
    name: Translate["nav.contact"],
    icon: "contact",
    target: "_self",
  },
];

export default LINKS;
