import { redirect } from "next/navigation";

const page = ({ params: { eventId }, searchParams: { certificateId } }) => {
  return redirect(
    `/event/${eventId}/content/certificate/create?certificateId=${certificateId}`
  );
};

export default page;
