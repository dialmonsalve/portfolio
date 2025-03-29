import addPage from "./utils/addPage";

import { Container } from "./utils/container";

import { Input } from "./inputs/input";
import { Typography } from "./inputs/typography";
import { Checkbox } from "./inputs/checkbox";
import { SingleSelect } from "./inputs/singleSelect";
import { Signature } from "./inputs/signature";
import { createFiles } from "./inputs/files";

interface Options {
  classes: string;
  incrementId: number;
  tag: "input" | "select";
  tagOptions: "label" | "option";
}

interface ITypography {
  tag: "h2" | "p";
  type: "paragraph" | "heading";
  classes: string;
  incrementId: number;
}

interface IInput {
  inputType: "input" | "textarea";
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "date"
    | "time"
    | "radio"
    | "area";
  classes: string;
  incrementId: number;
}

class FormsApp extends HTMLElement {
  private containerCards!: HTMLDivElement | null;
  private heading!: HTMLButtonElement | null;
  private paragraph!: HTMLButtonElement | null;
  private text!: HTMLButtonElement | null;
  private time!: HTMLButtonElement | null;
  private email!: HTMLButtonElement | null;
  private password!: HTMLButtonElement | null;
  private phone!: HTMLButtonElement | null;
  private date!: HTMLButtonElement | null;
  private checkbox!: HTMLButtonElement | null;
  private number!: HTMLButtonElement | null;
  private textarea!: HTMLButtonElement | null;
  private buttonCreate!: HTMLButtonElement | null;
  private radio!: HTMLButtonElement | null;
  private select!: HTMLButtonElement | null;
  private signature!: HTMLButtonElement | null;
  private files!: HTMLButtonElement | null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.initializeElements();
    this.setupEventListeners();
  }

  private initializeElements() {
    this.containerCards =
      this.querySelector<HTMLDivElement>(".container-forms");

    this.buttonCreate = document.querySelector<HTMLButtonElement>("#add-page");

    // typography
    this.heading = this.querySelector<HTMLButtonElement>("#heading");
    this.paragraph = this.querySelector<HTMLButtonElement>("#paragraph");

    //inputs
    this.text = this.querySelector<HTMLButtonElement>("#text");
    this.time = this.querySelector<HTMLButtonElement>("#time");
    this.email = this.querySelector<HTMLButtonElement>("#email");
    this.password = this.querySelector<HTMLButtonElement>("#password");
    this.phone = this.querySelector<HTMLButtonElement>("#phone");
    this.date = this.querySelector<HTMLButtonElement>("#date");
    this.checkbox = this.querySelector<HTMLButtonElement>("#checkbox");
    this.number = this.querySelector<HTMLButtonElement>("#number");
    this.radio = this.querySelector<HTMLButtonElement>("#radio-buttons");
    this.textarea = this.querySelector<HTMLButtonElement>("#textarea");
    this.select = this.querySelector<HTMLButtonElement>("#select");
    this.files = this.querySelector<HTMLButtonElement>("#files");

    this.signature = this.querySelector<HTMLButtonElement>("#signature");
  }

  private setupEventListeners() {
    let incrementId = 0;
    const classes =
      "block px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

    this.buttonCreate?.addEventListener("click", (evt) => {
      incrementId++;
      addPage({
        target: evt.target as HTMLButtonElement,
        containerForms: this.containerCards,
        incrementId,
      });
    });

    this.heading?.addEventListener("click", () => {
      incrementId++;
      this.createTypography({
        incrementId: 0,
        tag: "h2",
        type: "heading",
        classes:
          "w-full text-center text-2xl uppercase text-zinc-600 dark:text-gray-200",
      });
    });

    this.paragraph?.addEventListener("click", () => {
      incrementId++;
      this.createTypography({
        incrementId,
        tag: "p",
        type: "paragraph",
        classes: "w-full text-lg text-zinc-600 dark:text-gray-200",
      });
    });

    this.text?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "text",
        classes,
        incrementId,
      });
    });

    this.time?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "time",
        classes,
        incrementId,
      });
    });

    this.email?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "email",
        classes,
        incrementId,
      });
    });

    this.password?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "password",
        classes,
        incrementId,
      });
    });

    this.phone?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "tel",
        classes,
        incrementId,
      });
    });

    this.date?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "date",
        classes,
        incrementId,
      });
    });

    this.number?.addEventListener("click", () => {
      incrementId++;
      this.createInput({
        inputType: "input",
        type: "number",
        classes: `${classes} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
        incrementId,
      });
    });

    this.textarea?.addEventListener("click", () => {
      incrementId++;

      this.createInput({
        inputType: "textarea",
        type: "area",
        classes: `${classes}`,
        incrementId,
      });

    });

    this.checkbox?.addEventListener("click", () => {
      incrementId++;
      this.createCheckbox({
        classes,
        incrementId,
      });

    });

    this.radio?.addEventListener("click", () => {
      incrementId++;
      this.createSingleOption({
        classes: "",
        incrementId,
        tag: "input",
        tagOptions: "label",
      });
    });

    this.select?.addEventListener("click", () => {
      incrementId++;
      this.createSingleOption({
        classes,
        incrementId,
        tag: "select",
        tagOptions: "option",
      });
    });

    this.signature?.addEventListener("click", () => {
      incrementId++;
      new Signature().create({
        incrementId,
        containerCards: this.containerCards,
      });
      this.smooth();
    });

    this.files?.addEventListener("click", () => {
      incrementId++;
      createFiles({ incrementId, containerCards: this.containerCards });
      this.smooth();
    });
  }

  createTypography = ({ tag, type, classes, incrementId }: ITypography) => {
    const typography = new Typography({
      container: new Container(),
      tag,
      type,
      classes,
    });

    typography.create({ incrementId, containerCards: this.containerCards });
    this.smooth();
  };

  createInput = ({ classes, incrementId, type, inputType }: IInput) => {
    const input = new Input(inputType, {
      container: new Container(),
      type,
      classes,
    });

    input.create({ incrementId, containerCards: this.containerCards });
    this.smooth();
  };

  createCheckbox = ({
    classes,
    incrementId,
  }: {
    classes: string;
    incrementId: number;
  }) => {
    const checkbox = new Checkbox({
      container: new Container(),
      classes,
    });

    checkbox.create({ incrementId, containerCards: this.containerCards });
    this.smooth();
  };

  createSingleOption = ({ classes, incrementId, tag, tagOptions }: Options) => {
    incrementId++;
    const radios = new SingleSelect({
      container: new Container(),
      classes,
      tag,
      tagOptions,
    });

    radios.create({ incrementId, containerCards: this.containerCards });
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
