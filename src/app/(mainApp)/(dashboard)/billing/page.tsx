import BillingPage from "./_components/BillingPage";

export default function Page({
  searchParams: { currentTab },
}: {
  searchParams: { currentTab: string };
}) {
  return <BillingPage currentTab={currentTab} />;
}
