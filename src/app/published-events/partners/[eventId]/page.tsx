import { Partners } from "@/components/partners/Partners";


interface PageProps {
  params: {
    eventId: string;
  };
}

export default async function Page({ params: { eventId } }: PageProps) {

  return <Partners  eventId={eventId} />;
}
