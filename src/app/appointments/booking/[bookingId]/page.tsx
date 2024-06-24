import Booking from "@/components/appointments/booking";

const BookingPage = async ({
  params: { bookingId },
}: {
  params: { bookingId: string };
}) => {
  return <Booking id={bookingId} />;
};

export default BookingPage;
