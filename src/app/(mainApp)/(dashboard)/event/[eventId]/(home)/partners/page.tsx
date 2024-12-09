import { Partners } from "@/components/partners/Partners";
import { metaGenerator } from "../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });

interface PageProps {
  params: {
    eventId: string;
  }

}

export default async function Page({  params: { eventId } }: PageProps) {

  return <Partners  eventId={eventId} />;
}
