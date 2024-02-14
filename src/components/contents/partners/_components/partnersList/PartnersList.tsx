import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";
import { useFetchPartners, useFetchSingleEvent } from "@/hooks";
import { PartnerWidget } from "..";
import { useMemo } from "react";

export function PartnersList({ eventId }: { eventId: string }) {
  const { data, loading, refetch } = useFetchPartners(eventId);
  const { data: event } = useFetchSingleEvent(eventId);


  return (
    <div className="w-full lg:col-span-5 flex flex-col border-r">
      <div className="flex p-3 border-b items-center justify-between w-full">
        <p className="font-medium">Partners</p>
      </div>
      <div className="w-full p-3">
        <div className="w-full border-x border-b ">
          <div className="w-full rounded-t-lg grid grid-cols-6 text-sm font-medium items-center bg-gray-100 gap-3 px-3 py-4 ">
            <p>Partner</p>
            <p className="col-span-1 w-full">Contact</p>
            <p>Partner Type</p>
            <p>Sponsor Type</p>
            <p>Exhibiton Hall</p>
            <p>Booth</p>
          </div>
          {loading && (
            <div className="w-full col-span-full h-[300px] flex items-center justify-center">
              <LoaderAlt size={50} className="animate-spin" />
            </div>
          )}
          {!loading && Array.isArray(data) && data?.length === 0 && (
            <EmptyCard
              width="100"
              height="100"
              text="No available partner for this event"
            />
          )}
          {!loading &&
            Array.isArray(data) &&
            data?.map((item, index) => (
              <PartnerWidget
              refetch={refetch}
              event={event}
                className={
                  index === data?.length - 1 ? "border-b-0" : "border-b"
                }
                item={item}
                key={`${item?.name}${index}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
