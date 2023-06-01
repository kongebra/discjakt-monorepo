export function parsePrice(price: string): number {
  // Remove thousands separators.
  price = price
    // remove all non-digits except for periods and commas
    .replace(/[^\d.,]/g, "")
    .replace(/(\d)\.(?=\d{3}(?:\.|$))/g, "$1")
    .replace(/(\d),(?=\d{3}(?:,|$))/g, "$1");

  // Remove the last comma or period and everything after it, then parse as integer.
  price = price.replace(/[\.,]\d*$/, "");

  const number = parseInt(price, 10);
  if (isNaN(number)) {
    throw new Error("Invalid input");
  }

  return number;
}
