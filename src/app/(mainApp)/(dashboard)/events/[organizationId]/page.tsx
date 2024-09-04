import OrganizationHome from "@/components/eventHome/OrganizationHome";

function Page({
  params: { organizationId },
}: {
  params: { organizationId: string };
}) {
  return <OrganizationHome organizationId={organizationId} />;
}

export default Page;
