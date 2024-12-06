import AnalyticsPage from "./_components/AnalyticsPage";

import { metaGenerator } from "../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });

export default function Page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <AnalyticsPage currentTab={currentTab} />;
}
