import MarketingPage from "./_components/MarketingLayout";

import { metaGenerator } from "../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });

export default function page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <MarketingPage currentTab={currentTab} />;
}
