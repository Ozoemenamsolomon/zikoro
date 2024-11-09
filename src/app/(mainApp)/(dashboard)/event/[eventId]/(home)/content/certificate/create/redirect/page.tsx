import { redirect } from "next/navigation";

const page = ({ searchParams: { certificateId } }) => {
  return redirect("?certificateId=" + certificateId);
};

export default page;
