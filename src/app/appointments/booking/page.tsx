import Booking from "@/components/appointments/booking";

const BookingPage = async ({searchParams:{ alias }} : {searchParams: { alias: string }}) => {
  return <Booking alias={alias} />;
};

export default BookingPage;
