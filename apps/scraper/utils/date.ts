// calculate days since input date
export function calculateDaysSince(date: Date): number {
  // get current date
  const now = new Date();
  // calculate difference in milliseconds
  const diff = now.getTime() - date.getTime();
  // convert milliseconds to days
  const days = diff / (1000 * 60 * 60 * 24);
  // return days
  return days;
}
