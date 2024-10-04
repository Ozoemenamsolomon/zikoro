import MarketingPage from "./_components/MarketingPage";

export function page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <MarketingPage currentTab={currentTab} />;
}
