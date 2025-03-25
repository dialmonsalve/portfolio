import type { Container } from "../utils/container";

export interface CreateOptions {
  incrementId: number;
  containerCards: HTMLDivElement | null;
}

export type InputTypes =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "number"
  | "date"
  | "time"
  | "radio"
  | "area";

export interface ConstructOptions {
  container: Container;
  type?: InputTypes;

  classes: string;
}

export interface ConstructorCheckbox extends Omit<ConstructOptions, "type"> {}

export interface InputComponent {
  name: string;
  type: string;
  label: string;
  id: string;
}

export interface Radios extends Pick<InputComponent, "type"> {}

export interface OptionsCreate {
  containerCards: HTMLDivElement | null;
  type: string;
  incrementId: number;
  children: HTMLElement [];
  name: string;
  action: (evt: MouseEvent) => void;
}
