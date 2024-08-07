export const generateBookingICS =(
  startDateTimeString: string,
  endDateTimeString: string,
  description: string,
  location: string,
  organizer: { name: string; email: string },
  attendee: { name: string; email: string },
  summary:string,
): string => {
  const startDateTime = new Date(startDateTimeString)
    .toISOString()
    .replace(/-|:|\.\d+/g, "");
  const endDateTime = new Date(endDateTimeString)
    .toISOString()
    .replace(/-|:|\.\d+/g, "");
  const duration =
    new Date(endDateTimeString).getTime() -
    new Date(startDateTimeString).getTime();
  const durationHours = Math.floor(duration / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (duration % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:adamgibbons/ics\nMETHOD:PUBLISH\nX-PUBLISHED-TTL:PT1H\nBEGIN:VEVENT\nUID:dR3_ekmfOhjKQu4yHG7j0\nSUMMARY:${summary}\nDESCRIPTION:${description}\nDTSTAMP:${new Date()
    .toISOString()
    .replace(
      /-|:|\.\d+/g,
      ""
    )}\nDTSTART:${startDateTime}\nLOCATION:${location}\nORGANIZER;CN="${
    organizer.name
  }":MAILTO:${organizer.email}\nATTENDEE;CN="${
    attendee.name ?? "attendee"
  }":mailto:${
    attendee.email
  }\nDURATION:PT${durationHours}H${durationMinutes}M\nEND:VEVENT\nEND:VCALENDAR`;
};
