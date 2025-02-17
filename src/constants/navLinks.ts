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
        name: Translate["nav.dialui-components"],
        href: "https://dialui-components.netlify.app",
      },

      {
        name: Translate["nav.convert-images"],
        href: "/projects/convert-images",
      },
      {
        name: Translate["nav.web-components"],
        href: "/projects/web-components",
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
