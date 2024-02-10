import { SingleEventHome } from "@/components/singleEventHome/SingleEventHome";

interface PageProps {
  params: {
    eventId: string;
  };
}

export default async function Page({ params: { eventId } }: PageProps) {
  return <SingleEventHome eventId={eventId} />;
}
