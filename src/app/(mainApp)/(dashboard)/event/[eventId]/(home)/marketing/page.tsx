import MarketingPage from "./_components/MarketingLayout";

export default function page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <MarketingPage currentTab={currentTab} />;
}
