import OrganizationHome from "@/components/eventHome/OrganizationHome";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0";

function Page({
  params: { organizationId },
}: {
  params: { organizationId: string };
}) {
  return <OrganizationHome organizationId={organizationId} />;
}

export default Page;

//  withPageAuthRequired(Page, {returnTo: "/"})
