export function getLinkClasses(isSamePath:boolean) {
  return [
    "flex items-center transition-colors lg:gap-1 lg:text-[12px] text-primary xl:text-md 2xl:text-xl text-center border-b-transparent capitalize cursor-pointer",
    isSamePath
      ? "text-slate-900 dark:text-white"
      : "text-primary ",
  ];
}