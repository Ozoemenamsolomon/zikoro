import {SponsorDetails} from "@/components/partners/sponsors/SponsorDetail"

export default function Page({
  params: { partnerId },
}: {
  params: { partnerId: string };
}) {
  return <SponsorDetails />;
}
