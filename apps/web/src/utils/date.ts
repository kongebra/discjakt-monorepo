export function getTimeSinceDate(inputDate: Date): string {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - inputDate.getTime();

  // Calculate the time differences in seconds, minutes, hours, days, weeks, and years
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  // Determine the appropriate time unit and construct the output string
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (weeks < 52) {
    return `${weeks}w`;
  } else {
    return `${years}y`;
  }
}
