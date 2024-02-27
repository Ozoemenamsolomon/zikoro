export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
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
 // console.log({ targetDateTime, today });

  return targetDateTime < today;
}


export function formatShortDate(inputDate: string): string {
  const [year, month, day] = inputDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
}