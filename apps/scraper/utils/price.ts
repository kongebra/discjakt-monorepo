import { Availability, Currency } from 'database';

export function parsePrice(price: string): number {
  // Remove thousands separators.
  price = price
    // remove all non-digits except for periods and commas
    .replace(/[^\d.,]/g, '')
    .replace(/(\d)\.(?=\d{3}(?:\.|$))/g, '$1')
    .replace(/(\d),(?=\d{3}(?:,|$))/g, '$1');

  // Remove the last comma or period and everything after it, then parse as integer.
  price = price.replace(/[\.,]\d*$/, '');

  const number = parseInt(price, 10);
  if (isNaN(number)) {
    throw new Error('Invalid input');
  }

  return number;
}

export function isCurrency(currency: string): currency is Currency {
  return ['USD', 'EUR', 'GBP', 'NOK', 'SEK', 'DKK'].includes(currency);
}

export function priceToAvailability(price: number): Availability {
  if (price === 0 || price === -1) {
    return 'OutOfStock';
  }

  return 'InStock';
}
