import AffiliatesPage from "./_components/affiliates";

export default function Page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <AffiliatesPage currentTab={currentTab} />
}
