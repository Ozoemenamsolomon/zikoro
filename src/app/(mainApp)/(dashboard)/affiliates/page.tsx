import AffiliatesPage from "./_components/AffiliatesPage";

export default function Page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <AffiliatesPage currentTab={currentTab} />
}
\