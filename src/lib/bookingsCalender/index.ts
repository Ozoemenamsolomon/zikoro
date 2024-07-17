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
    // Group appointments by day and hour for weekly view
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
  