import "../../web-components";

import { Typography } from "../inputs/typography";
import addPage from "../utils/addPage";

import { Container } from "./container";

import { Input } from "./input";

interface ITypography {
  tag: "h2" | "p";
  type: "paragraph" | "heading";
  classes: string;
  incrementId: number;
}

interface IInput {
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
  incrementId: number;
}

class FormsApp extends HTMLElement {
  private containerCards!: HTMLDivElement | null;
  private heading!: HTMLHeadingElement | null;
  private paragraph!: HTMLParagraphElement | null;
  private text!: HTMLInputElement | null;
  private time!: HTMLInputElement | null;
  private email!: HTMLInputElement | null;
  private password!: HTMLInputElement | null;
  private phone!: HTMLInputElement | null;
  private date!: HTMLInputElement | null;
  private checkbox!: HTMLInputElement | null;
  private radio!: HTMLInputElement | null;
  private number!: HTMLInputElement | null;
  private buttonCreate!: HTMLButtonElement | null;

  constructor() {
    super();
    // signature();
    // select();
    // radioButtons();
    // files();
  }

  connectedCallback() {
    this.initializeElements();
    this.setupEventListeners();

    // this.startAutoSlide();
  }

  private initializeElements() {
    this.containerCards =
      this.querySelector<HTMLDivElement>(".container-forms");

    this.buttonCreate = document.querySelector<HTMLButtonElement>("#add-page");

    // typography
    this.heading = this.querySelector<HTMLHeadingElement>("#heading");
    this.paragraph = this.querySelector<HTMLParagraphElement>("#paragraph");

    //input
    this.text = this.querySelector<HTMLInputElement>("#text");
    this.time = this.querySelector<HTMLInputElement>("#time");
    this.email = this.querySelector<HTMLInputElement>("#email");
    this.password = this.querySelector<HTMLInputElement>("#password");
    this.phone = this.querySelector<HTMLInputElement>("#phone");
    this.date = this.querySelector<HTMLInputElement>("#date");
    this.checkbox = this.querySelector<HTMLInputElement>("#checkbox");
    this.number = this.querySelector<HTMLInputElement>("#number");
    this.radio = this.querySelector<HTMLInputElement>("#radio-buttons");
  }

  private setupEventListeners() {
    const classes =
      "block px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

    this.buttonCreate?.addEventListener("click", (evt) =>
      addPage({
        target: evt.target as HTMLButtonElement,
        containerForms: this.containerCards,
        incrementId: 0,
      })
    );

    this.heading?.addEventListener("click", () =>
      this.createTypography({
        incrementId: 0,
        tag: "h2",
        type: "heading",
        classes:
          "w-full text-center text-2xl uppercase text-zinc-600 dark:text-gray-200",
      })
    );

    this.paragraph?.addEventListener("click", () =>
      this.createTypography({
        incrementId: 0,
        tag: "p",
        type: "paragraph",
        classes: "w-full text-lg text-zinc-600 dark:text-gray-200",
      })
    );

    this.text?.addEventListener("click", () =>
      this.createInput({
        type: "text",
        classes,
        incrementId: 0,
      })
    );

    this.time?.addEventListener("click", () =>
      this.createInput({
        type: "time",
        classes,
        incrementId: 0,
      })
    );

    this.email?.addEventListener("click", () =>
      this.createInput({
        type: "email",
        classes,
        incrementId: 0,
      })
    );

    this.password?.addEventListener("click", () =>
      this.createInput({ type: "password", classes, incrementId: 0 })
    );

    this.phone?.addEventListener("click", () =>
      this.createInput({ type: "tel", classes, incrementId: 0 })
    );

    this.date?.addEventListener("click", () =>
      this.createInput({ type: "date", classes, incrementId: 0 })
    );

    this.checkbox?.addEventListener("click", () =>
      this.createInput({ type: "checkbox", classes, incrementId: 0 })
    );

    this.number?.addEventListener("click", () =>
      this.createInput({
        type: "number",
        classes: `${classes} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
        incrementId: 0,
      })
    );

    this.radio?.addEventListener("click", () =>
      this.createInput({ type: "radio", classes: "", incrementId: 0 })
    );
  }

  createTypography = ({ tag, type, classes, incrementId }: ITypography) => {
    incrementId++;

    const typography = new Typography({
      container: new Container(),
      tag,
      type,
      classes,
    });

    typography.create({ incrementId, containerCards: this.containerCards });
    this.smooth();
  };

  createInput = ({ classes, incrementId, type }: IInput) => {
    incrementId++;

    const input = new Input({
      container: new Container(),
      type,
      classes,
    });

    input.create({ incrementId, containerCards: this.containerCards });
    this.smooth();
  };

  smooth() {
    const scroller = document.querySelector("main");
    scroller?.scrollTo({
      top: scroller.scrollHeight - window.innerHeight + 220,
      behavior: "smooth",
    });
  }
}

customElements.define("forms-app", FormsApp);
