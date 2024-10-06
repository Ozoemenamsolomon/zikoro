import { redirect, useRouter, useSearchParams } from "next/navigation";

const Page = ({
  searchParams: { badgeId },
}: {
  searchParams: { badgeId: string };
}) => {
  return redirect("create?badgeId=" + badgeId);
};

export default Page;
