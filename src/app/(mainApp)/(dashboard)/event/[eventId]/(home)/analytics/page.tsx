import AnalyticsPage from "./_components/AnalyticsPage";

export default function Page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <AnalyticsPage currentTab={currentTab} />;
}
