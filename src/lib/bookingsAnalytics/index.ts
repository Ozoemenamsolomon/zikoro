import { Booking } from "@/types/appointments";

export const totalBookings = (
    {curr, prev, type}:
    {curr:Booking[], prev:Booking[], type:string}
) => {
    let status:'+'|'-'|''=''
    console.log({curr,prev,type})
    // TODO: calculate the difference between curr and prev


    return {
        count:curr?.length, 
        type:type==='week' ? 'this week' : type==='month' ? 'this month' : 'this year',
        status: status
    }
}

export interface KPIData {
    appointmentName: string;
    numberOfBookings: number;
    percentageChange: string;
    brandColor: string;
    isIncrease: boolean; 
  }
  
  export const generateKPIData = (current: Booking[], previous: Booking[]): KPIData[] => {
    const currentGrouped = groupByAppointmentName(current);
    const previousGrouped = groupByAppointmentName(previous);
  
    const kpiData: KPIData[] = [];
  
    for (const appointmentName in currentGrouped) {
      const currentCount = currentGrouped[appointmentName].length;
      const previousCount = previousGrouped[appointmentName]?.length || 0;
  
      let percentageChange = 0;
      let isIncrease = true;
  
      if (previousCount === 0) {
        percentageChange = currentCount > 0 ? 100 : 0; // 100% increase if there were no previous bookings
      } else {
        percentageChange = ((currentCount - previousCount) / (currentCount + previousCount)) * 100;
        isIncrease = percentageChange >= 0; // Determine if the change is an increase or decrease
      }
  
      kpiData.push({
        appointmentName: appointmentName,
        brandColor: currentGrouped[appointmentName][0]?.scheduleColour!,
        numberOfBookings: currentCount,
        percentageChange: Math.abs(percentageChange).toFixed(2),
        isIncrease, 
      });
    }
  
    return kpiData;
  };
  
  const groupByAppointmentName = (bookings: Booking[]): { [key: string]: Booking[] } => {
    return bookings.reduce((acc: { [key: string]: Booking[] }, booking: Booking) => {
      const appointmentName = booking.appointmentLinkId.appointmentName;
  
      if (!acc[appointmentName]) {
        acc[appointmentName] = [];
      }
      acc[appointmentName].push(booking);
  
      return acc;
    }, {});
  };
  
 // Mapping function to remove suffix 'ly'
 export const getTypeLabel = (type: string) => {
  const typeMap: { [key: string]: string } = {
    weekly: 'week',
    monthly: 'month',
    yearly: 'year',
  };
  return typeMap[type] || type;
};