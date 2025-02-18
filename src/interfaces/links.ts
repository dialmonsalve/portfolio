export interface Link {
  href: string;
  icon: string;
  target: "_blank" | "_parent" | "_self" | "_top";
  name: Translate;
  hasChildren?: boolean;
  subMenu?: Submenu[];
}

export interface Submenu {
  href: string;
  name: Translate;
  target: "_blank" | "_parent" | "_self" | "_top";
}

export enum Translate {
  "nav.home" = "nav.home",
  "nav.contact" = "nav.contact",
  "nav.about" = "nav.about",
  "nav.services" = "nav.services",
  "nav.projects" = "nav.projects",
  "nav.web-components" = "nav.web-components",
  "nav.convert-images" = "nav.convert-images",
  "nav.dialui-components" = "nav.dialui-components"
}
