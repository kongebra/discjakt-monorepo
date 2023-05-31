export function slugify(input: string): string {
  return input
    .toLowerCase() // Convert the string to lowercase
    .replace(/\s+/g, "-") // Replace whitespaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters except hyphens
    .replace(/--+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
