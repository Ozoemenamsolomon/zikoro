import { format, parseISO, parse, isToday, isAfter, isBefore } from "date-fns";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  const dayWithSuffix = getDayWithSuffix(date.getDate());

  // Remove the first character (leading space) from formattedDate
  const correctedFormattedDate = formattedDate.substring(2);

  return `${dayWithSuffix} ${correctedFormattedDate}`;
}

function getDayWithSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedTime;
}

export function dateFormatting(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
}

export function calculateTimeDifference(startStr: any, endStr: any): string {
  const startTime: Date = new Date(startStr);
  const endTime: Date = new Date(endStr);

  const timeDifference: number = endTime.getTime() - startTime.getTime();

  const days: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours: number = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const result: string[] = [];

  // Day
  if (days + 1 > 0) {
    result.push(`${days + 1} ${days + 1 === 1 ? "Day" : "Days"}`);
  }

  // Hour
  /**
     if (hours > 0) {
      result.push(`${hours} ${hours === 1 ? "Hour" : "Hours"}`);
    }
   */

  return result.join(" ");
}

export function hasTimeElapsed(targetDateTimeStr: any): boolean {
  const targetDateTime: Date = new Date(targetDateTimeStr);
  const currentDateTime: Date = new Date();

  return currentDateTime.getTime() > targetDateTime.getTime();
}

export function isDateGreaterThanToday(targetDate: string): boolean {
  const targetDateTime = new Date(targetDate);

  // Add one day to targetDateTime
  targetDateTime.setDate(targetDateTime.getDate() + 1);

  const today = new Date();
  //

  return targetDateTime < today;
}

export function formatShortDate(inputDate: string): string {
  const [year, month, day] = inputDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(date);
}

export function generateDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference between the local time zone and UTC
  const timeZoneOffset = start.getTimezoneOffset() * 60 * 1000;

  // Adjust start and end dates to UTC for consistent comparisons
  const startDateTime = start.setTime(start.getTime() - timeZoneOffset);
  const endDateTime = end.setTime(end.getTime() - timeZoneOffset);
  const currentStartDate = new Date(startDateTime);
  const currentEndDate = new Date(endDateTime);

  const dateRange: Array<{ date: string; formattedDate: string }> = [];

  function formatDate(date: Date): string {
    // Get the day, month, and year parts
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();

    // Get the weekday (e.g., Fri, Sat)
    const weekday = date.toLocaleString("en-GB", { weekday: "short" });

    // Return the formatted date string
    return `${weekday} ${day}, ${month} ${year}`;
  }

  let currentDate = new Date(currentStartDate);

  while (currentDate <= currentEndDate) {
    // Create an object for the current date with both date formats
    const dateObj = {
      date: currentDate.toISOString()?.split(".")[0],
      formattedDate: formatDate(currentDate),
    };

    // Add the date object to the array
    dateRange.push(dateObj);

    // Increment the current date by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Return the array of date range objects
  return dateRange;
}

export function formatLongDate(dateString: string): string {
  const date = new Date(dateString);
  // Get the day, month, and year parts
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();

  // Get the weekday (e.g., Fri, Sat)
  const weekday = date.toLocaleString("en-GB", { weekday: "long" });

  // Return the formatted date string
  return `${day} ${weekday}, ${month} ${year}`;
}

export function millisecondsToTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function formateJSDate(date: Date | string): string {
  if (
    typeof date === "string" &&
    date.match(/^\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2} [AP]M$/)
  ) {
    return date; 
  }

  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "MM/dd/yyyy h:mm aa");
}

export const parseFormattedDate = (dateString: string): Date => {
  if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return new Date(dateString);
  } else {
    return parse(dateString, "MM/dd/yyyy h:mm aa", new Date());
  }
};



  // get the current date if falls btw the event date else, current date is event start date
export   const getEffectiveDate = (startDateISO: string, endDateISO: string): string => {
    const today = new Date();
    const startDate = new Date(startDateISO);
    const endDate = new Date(endDateISO);

    if (
      isToday(startDate) ||
      (isAfter(today, startDate) && isBefore(today, endDate))
    ) {
      return today.toISOString().split(".")[0];
    }
    return startDateISO;
  };


  export function convertISOToFormattedDate(isoString: string): string {
    const parsedDate = parseISO(isoString);
    return format(parsedDate, "MM/dd/yyyy h:mm aa");
  }