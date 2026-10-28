/** Capitalize the first letter for display, preserving acronyms and other casing. */
export function capitalizeFirstLetter(value: string) {
  return value.replace(/\S/u, (letter) => letter.toUpperCase());
}
