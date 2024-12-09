import StampCard from "@/components/marketPlace/stampCard/StampCard";

import { metaGenerator } from "../../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <StampCard eventId={eventId} />;
}
