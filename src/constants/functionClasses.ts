export function getLinkClasses(isSamePath:boolean) {
  return [
    "flex items-center transition-colors lg:gap-1 lg:text-[12px] text-brand-100 hover:text-brand-200 dark:hover:text-brand-300 xl:text-md 2xl:text-xl text-center border-b-transparent capitalize cursor-pointer",
    isSamePath
      ? "text-brand-200 dark:text-brand-300 dark:border-brand-300 "
      : "text-brand-100 hover:text-brand-200 dark:text-gray-300 dark:hover:text-brand-300",
  ];
}