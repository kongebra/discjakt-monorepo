export function slugify(input: string): string {
  return (
    input
      .toLowerCase() // Convert the string to lowercase
      // replace nowrwegian characters
      .replace(/æ/g, "ae")
      .replace(/ø/g, "o")
      .replace(/å/g, "a")
      .replace(/\s+/g, "-") // Replace whitespaces with hyphens
      .replace(/[^\w-]+/g, "") // Remove non-word characters except hyphens
      .replace(/--+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, "")
  ); // Remove leading and trailing hyphens
}
