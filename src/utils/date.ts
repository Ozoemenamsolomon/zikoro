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
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

export function isWithinTimeRange(dateString: string, dateToCompare: string | null) {
  // Parse the input date string into a Date object
  let date = new Date(dateString);

  // Set the time to 12:00 PM of the current day
  let currentDate = dateToCompare ? new Date(dateToCompare) : new Date();
  currentDate.setHours(12, 0, 0, 0);

  // Get the time for 12:00 PM of the next day
  let nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);

  // Check if the parsed date is within the time range
  return date >= currentDate && date <= nextDay;
}

// Helper function to pad a number with leading zero if needed
export function padZero(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}

export function formatDate(inputDateString: string) {
  const inputDate = new Date(inputDateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(inputDate);

  const day = parts && parts.find((part) => part.type === "day")?.value;
  const month = parts && parts.find((part) => part.type === "month")?.value;
  const year = parts && parts.find((part) => part.type === "year")?.value;

  return { day, month, year };
}

export function convertDateFormat(inputDate: string): string {
  const originalDate = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(originalDate.getTime())) {
    console.error("Invalid date format");
    return "";
  }

  // Format the date as "MM/DD/YYYY"
  const formattedDate = `${(originalDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${originalDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${originalDate.getFullYear()}`;

  return formattedDate;
}

export function formatDateTo(originalDate: Date) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const parsedDate = new Date(originalDate);
  const formattedDate = parsedDate.toLocaleDateString("en-US", options);

  // Extract day, month, and year separately
  const [month, day, year] = formattedDate.split(" ");

  // Convert day to ordinal number
  const ordinalDay = getOrdinalSuffix(parseInt(day, 10));

  // Format the result as "1ST OCTOBER 2023"
  const result = `${ordinalDay} ${month.toUpperCase()} ${year}`;

  return result;
}

// Function to get the ordinal suffix for a number (e.g., 1st, 2nd, 3rd)
export function getOrdinalSuffix(number: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const relevantDigits = number < 30 ? number % 20 : number % 10;

  return `${number}${suffixes[relevantDigits <= 3 ? relevantDigits : 0]}`;
}
