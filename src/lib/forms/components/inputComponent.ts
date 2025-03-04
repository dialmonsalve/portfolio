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
  const containerInput = document.createElement("app-input");

  containerInput.setAttribute("name", name);
  containerInput.setAttribute("type", type);
  containerInput.setAttribute("label", label);
  containerInput.setAttribute("input_id", name);
  containerInput.id = id;

  return containerInput;
}
