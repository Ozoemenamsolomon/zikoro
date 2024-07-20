import { PartnerCard } from "./_components";
import { TExPartner } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import Image from "next/image";
import { Button } from "@/components";
import { PlusCircle } from "styled-icons/bootstrap";

export function Exhibitors({
  exhibitors,
  loading,
  eventId
}: {
  exhibitors: TExPartner[];
  loading: boolean;
  eventId: string;
}) {
  return (
    <div className="w-full h-full grid md:grid-cols-2 xl:grid-cols-3 mt-6 items-center gap-6 px-4">
      {loading && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
      {!loading && exhibitors.length === 0 && (
        <div className="w-full col-span-full items-center flex flex-col justify-center h-[300px]">
          <div className="flex items-center justify-center flex-col gap-y-2">
            <Image
              src="/images/epartner.png"
              width={400}
              height={400}
              className="w-[100px] h-[100px]"
              alt="partner"
            />
            <p className="text-[#717171] font-medium">
              This page is empty. Exhibitors will appear here
            </p>
            <Button
              // onClick={""}
              className="text-gray-50 hidden bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
            >
              <PlusCircle size={22} />
              <p>Exhibitors</p>
            </Button>
          </div>
        </div>
      )}

      {!loading &&
        exhibitors.length > 0 &&
        exhibitors.map((sponsor) => (
          <PartnerCard key={sponsor.id} eventId={eventId} sponsor={sponsor} />
        ))}
    </div>
  );
}
