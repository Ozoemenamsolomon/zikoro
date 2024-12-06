import Agenda from "@/components/agenda/Agenda";
import { metaGenerator } from "../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });


export default function page({
  params: { eventId },
  searchParams
}: {
  params: { eventId: string };
  searchParams: any
}) {
  return <Agenda eventId={eventId} searchParams={searchParams} />;
}
