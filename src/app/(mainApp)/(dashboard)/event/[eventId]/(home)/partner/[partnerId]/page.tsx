import { PartnerDetails } from "@/components/partners/sponsors/PartnerDetail";

export default function Page({
  params: { partnerId },
}: {
  params: { partnerId: string };
}) {
  return <PartnerDetails partnerId={partnerId} />;
}
