import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";
import { useFetchSingleEvent } from "@/hooks";
import { PartnerWidget, ExhibitionHall, AddExhibitionHall } from "..";
import { useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import {Eye} from "@styled-icons/evil/Eye"

export function PartnersList({
  eventId,
  partners,
  loading,
  refetch,
}: {
  refetch: () => Promise<any>;
  partners: any[];
  loading: boolean;
  eventId: string;
}) {
  const { data: event, refetch: refetchSingleEvent } = useFetchSingleEvent(eventId);
  const [isOpen, setOpen] = useState(false);
  const [isAddHall, setAddHall] = useState(false);

  function onToggle() {
    setOpen((prev) => !prev);
  }

  function onClose() {
    setAddHall((prev) => !prev);
  }

  return (
    <>
      <div className="w-full  flex flex-col border-r">
        <div className="flex p-3 border-b items-center justify-between w-full">
          <p className="font-medium">Partners</p>
          <div
            //  onClick={""}
            className=" flex items-center px-4 group rounded-md justify-center bg-transparent   transition-all transform duration-300 ease-in-out gap-x-2 h-11 sm:h-12"
          >
           
            <p>Exhibition Hall</p>
           <button
           onClick={onClose}
           >
           <PlusCircle size={22} />
           </button>
           <button
           onClick={onToggle}
           className="">
           <Eye size={40} />
           </button>
          </div>
        </div>
        <div className="w-full p-3">
          <div className="w-full border-x border-b rounded-t-lg ">
            <div className="w-full rounded-t-lg grid grid-cols-7 text-sm font-medium items-center bg-gray-100 gap-3 px-3 py-4 ">
              <p className="col-span-2 w-full">Partner</p>
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
            {!loading && Array.isArray(partners) && partners?.length === 0 && (
              <EmptyCard
                width="100"
                height="100"
                text="No available partner for this event"
              />
            )}
            {!loading &&
              Array.isArray(partners) &&
              partners?.map((item, index) => (
                <PartnerWidget
                  refetch={refetch}
                  event={event}
                  className={
                    index === partners?.length - 1 ? "border-b-0" : "border-b"
                  }
                  item={item}
                  key={`${item?.name}${index}`}
                />
              ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <ExhibitionHall
          close={onToggle}
          eventId={eventId}
          partners={partners}
        />
      )}

      {isAddHall && (
        <AddExhibitionHall
          eventId={eventId}
          refetch={refetchSingleEvent}
          close={onClose}
        />
      )}
    </>
  );
}
