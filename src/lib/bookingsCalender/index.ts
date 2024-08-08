import { Booking } from "@/types/appointments";

export function formatAppointmentsByMonth(data: Booking[]): Record<string, Booking[]> {
    // Group appointments by date for monthly view
    const formatted = data.reduce((acc, appointment) => {
      const date = new Date(appointment.appointmentDate as string).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(appointment);
      return acc;
    }, {} as Record<string, Booking[]>);
  
    return formatted;
  }
  
  export function formatAppointmentsByWeek(data: Booking[]): Record<string, Record<number, Booking[]>> {
    //TODO: Group appointments by day and 5mins interval for weekly view
    const formatted = data.reduce((acc, appointment) => {
      const date = new Date(appointment.appointmentDate as string);
      const day = date.toDateString();
      const hour = new Date(`${day} ${appointment.appointmentTime}`).getHours();
      if (!acc[day]) acc[day] = {};
      if (!acc[day][hour]) acc[day][hour] = [];
      acc[day][hour].push(appointment);
      return acc;
    }, {} as Record<string, Record<number, Booking[]>>);
  
    return formatted;
  }
  

  // export function formatAppointmentsByWeek(data: Booking[]): Record<string, Record<string, Booking[]>> {
  //   // Helper function to round the time down to the nearest 5-minute interval
  //   const roundToFiveMinutes = (date: Date) => {
  //     const ms = 1000 * 60 * 5; // 5 minutes in milliseconds
  //     return new Date(Math.floor(date.getTime() / ms) * ms);
  //   };
  
  //   const formatted = data.reduce((acc, appointment) => {
  //     const appointmentDate = new Date(appointment.appointmentDate as string);
  //     const appointmentTime = appointment.appointmentTime;
  
  //     // Check if appointmentTime is valid
  //     if (appointmentTime) {
  //       const [hours, minutes] = appointmentTime.split(':').map(Number);
  //       appointmentDate.setHours(hours, minutes);
  
  //       const roundedTime = roundToFiveMinutes(appointmentDate);
  //       const day = appointmentDate.toDateString();
  //       const timeKey = roundedTime.toTimeString().slice(0, 5); // 'HH:MM' format
  
  //       if (!acc[day]) acc[day] = {};
  //       if (!acc[day][timeKey]) acc[day][timeKey] = [];
  //       acc[day][timeKey].push(appointment);
  //     }
  
  //     return acc;
  //   }, {} as Record<string, Record<string, Booking[]>>);
  
  //   return formatted;
  // }
  