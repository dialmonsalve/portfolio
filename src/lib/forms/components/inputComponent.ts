import { AppInput } from "@lib/web-components";

interface InputComponent {
  name: string;
  type: string;
  label: string;
  id: string;
}

export default function inputComponent({
  name,
  type,
  label,
  id,
}: InputComponent) {
  const containerInput = new AppInput();

  containerInput.setAttribute("name", name);
  containerInput.setAttribute("type", type);
  containerInput.setAttribute("label", label);
  containerInput.id = id;

  return containerInput;
}
