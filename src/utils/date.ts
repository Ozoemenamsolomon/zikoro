export function getTimeFromDate(date: Date = new Date()): string {
  if (!date) return "N/A";
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const seconds: number = date.getSeconds();

  // Format the time as HH:MM:SS
  const formattedTime: string = `${padZero(hours)}:${padZero(
    minutes
  )}:${padZero(seconds)}`;

  return formattedTime;
}

export function formatDateToHumanReadable(date: Date | undefined): string {
  if (!date) return "";
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

// Helper function to pad a number with leading zero if needed
export function padZero(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}
