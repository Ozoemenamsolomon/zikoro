import { SponsorCard } from "./_components";
import { TPartner } from "@/types";
import {useMemo} from "react"

export function Sponsors({ data }: { data: TPartner[] }) {

  const sponsors = useMemo(() => {
      return data.filter((v) => v.partnerType.toLowerCase() === "sponsor")
  },[data])
  return (
    <div className="w-full grid lg:grid-cols-2 mt-6 items-center gap-6 px-4">
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor.id} sponsor={sponsor} />
      ))}
    </div>
  );
}
