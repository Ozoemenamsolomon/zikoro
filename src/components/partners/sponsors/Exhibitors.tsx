import { PartnerCard } from "./_components";
import { TPartner } from "@/types";
import { useMemo } from "react";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";

export function Exhibitors({
  data,
  loading,
}: {
  data: TPartner[];
  loading: boolean;
}) {
  const exhibitors = useMemo(() => {
    return data.filter((v) => v.partnerType.toLowerCase() === "exhibitor");
  }, [data]);

  return (
    <div className="w-full grid lg:grid-cols-2 mt-6 items-center gap-6 px-4">
      {loading && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={50} className="animate-spin" />
        </div>
      )}
      {!loading && exhibitors.length === 0 && (
        <EmptyCard text="No available sponsors for this event" />
      )}

      {!loading &&
        exhibitors.length > 0 &&
        exhibitors.map((sponsor) => (
          <PartnerCard key={sponsor.id} sponsor={sponsor} />
        ))}
    </div>
  );
}
