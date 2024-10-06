import { redirect } from "next/navigation";

const page = ({ searchParams: { certificateId } }) => {
  return redirect("create?certificateId=" + certificateId);
};

export default page;
