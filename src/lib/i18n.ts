const messages = {
  es: {
    save: "Guardar",
    delete: "Eliminar",
    oneFileSelected: "1 archivo seleccionado",
    filesSelected: "{n} archivos seleccionados",
    unsupportedFiles: "Archivo o archivos no soportados",
    allOptionsSelected: "¡Todas las opciones han sido seleccionadas!",
  },
  en: {
    save: "Save",
    delete: "Delete",
    oneFileSelected: "1 file selected",
    filesSelected: "{n} files selected",
    unsupportedFiles: "Unsupported file or files",
    allOptionsSelected: "All options have been selected!",
  },
};

type MessageKey = keyof (typeof messages)["es"];

export function clientT(key: MessageKey, values: Record<string, string | number> = {}) {
  const lang = document.documentElement.lang === "en" ? "en" : "es";
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, `${value}`),
    messages[lang][key],
  );
}
