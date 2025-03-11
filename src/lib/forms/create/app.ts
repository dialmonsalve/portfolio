import "../../web-components";

import { Typography } from "../inputs/typography";
import smooth from "../utils/smoothWindow";

import { Container } from "./container";
import createPage from "./createPage";
import { Input } from "./input";

interface ITypography {
  element: HTMLParagraphElement | HTMLHeadingElement | null;
  containerCards: HTMLDivElement | null;
  tag: "h2" | "p";
  type: "paragraph" | "heading";
  classes: string;
}

interface IInput {
  element: HTMLInputElement | null;
  containerCards: HTMLDivElement | null;
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "date"
    | "time"
    | "checkbox"
    | "radio";
  classes: string;
}

class FormsApp extends HTMLElement {
  constructor() {
    super();

    const classes =
      "block px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

    const containerCards =
      this.querySelector<HTMLDivElement>(".container-forms");

    const heading = this.querySelector<HTMLHeadingElement>("#heading");
    this.createTypography({
      element: heading,
      containerCards,
      tag: "h2",
      type: "heading",
      classes:
        "w-full text-center text-2xl uppercase text-zinc-600 dark:text-gray-200",
    });

    const paragraph = this.querySelector<HTMLParagraphElement>("#paragraph");
    this.createTypography({
      element: paragraph,
      containerCards,
      tag: "p",
      type: "paragraph",
      classes: "w-full text-lg text-zinc-600 dark:text-gray-200",
    });

    createPage();

    const text = this.querySelector<HTMLInputElement>("#text");
    this.createInput({
      type: "text",
      containerCards,
      element: text,
      classes,
    });

    const time = this.querySelector<HTMLInputElement>("#time");
    this.createInput({
      type: "time",
      containerCards,
      element: time,
      classes,
    });

    const email = this.querySelector<HTMLInputElement>("#email");
    this.createInput({
      type: "email",
      containerCards,
      element: email,
      classes,
    });

    const password = this.querySelector<HTMLInputElement>("#password");
    this.createInput({
      type: "password",
      containerCards,
      element: password,
      classes,
    });

    const phone = this.querySelector<HTMLInputElement>("#phone");
    this.createInput({
      type: "tel",
      containerCards,
      element: phone,
      classes,
    });

    const date = this.querySelector<HTMLInputElement>("#date");
    this.createInput({
      type: "date",
      containerCards,
      element: date,
      classes,
    });

    const checkbox = this.querySelector<HTMLInputElement>("#checkbox");
    this.createInput({
      type: "checkbox",
      containerCards,
      element: checkbox,
      classes,
    });

    const radio = this.querySelector<HTMLInputElement>("#radio-buttons");
    this.createInput({
      type: "radio",
      containerCards,
      element: radio,
      classes: "",
    });

    const number = this.querySelector<HTMLInputElement>("#number");
    this.createInput({
      type: "number",
      containerCards,
      element: number,
      classes: `${classes} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
    });

    // signature();
    // select();
    // radioButtons();
    // files();
  }

  createTypography = ({
    element,
    containerCards,
    tag,
    type,
    classes,
  }: ITypography) => {
    let incrementId = 0;

    element?.addEventListener("click", () => {
      incrementId++;

      const typography = new Typography({
        container: new Container(),
        tag,
        type,
        classes,
      });

      typography.create({ incrementId, containerCards });
      smooth();
    });
  };

  createInput = ({ classes, element, type, containerCards }: IInput) => {
    let incrementId = 0;

    element?.addEventListener("click", () => {
      incrementId++;

      const input = new Input({
        container: new Container(),
        type,
        classes,
      });

      input.create({ incrementId, containerCards });
      smooth();
    });
  };
}

customElements.define("forms-app", FormsApp);
