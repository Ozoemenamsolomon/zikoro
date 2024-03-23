import CreateEvent from "@/components/createEvent/CreateEvent";

export default function Page({
  params: { organizationId },
}: {
  params: { organizationId: string };
}) {

  return <CreateEvent organizationId={organizationId} />;
}
