import { redirect } from "next/navigation";

const page = ({ searchParams: { certificateId } }) => {
  return redirect("certificate/create?certificateId=" + certificateId);
};

export default page;
