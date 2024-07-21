export function generateBookingICS(appointment: { start: Date, end: Date, summary: string, description: string, location: string }): string {
    const start = appointment.start.toISOString().replace(/-|:|\.\d+/g, '');
    const end = appointment.end.toISOString().replace(/-|:|\.\d+/g, '');
  
    return `
  BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//Your Company//Your Product//EN
  BEGIN:VEVENT
  UID:${start}@yourdomain.com
  DTSTAMP:${start}
  DTSTART:${start}
  DTEND:${end}
  SUMMARY:${appointment.summary}
  DESCRIPTION:${appointment.description}
  LOCATION:${appointment.location}
  END:VEVENT
  END:VCALENDAR
    `.trim();
  }
  