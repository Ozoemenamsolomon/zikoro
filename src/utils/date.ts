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

export function formatDate(inputDateString) {
  const inputDate = new Date(inputDateString);

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(inputDate);

  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

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
  const formattedDate = `${(originalDate.getMonth() + 1).toString().padStart(2, '0')}/${
    originalDate.getDate().toString().padStart(2, '0')
  }/${originalDate.getFullYear()}`;

  return formattedDate;
}