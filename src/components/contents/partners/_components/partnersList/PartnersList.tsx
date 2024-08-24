import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  useDeletePartner,
  useFetchSingleEvent,
  useFormatEventData,
} from "@/hooks";
import { PartnerWidget, ExhibitionHall, AddExhibitionHall } from "..";
import { useMemo, useState } from "react";
import { PlusCircle } from "styled-icons/bootstrap";
import { Eye } from "styled-icons/evil";
import { Button } from "@/components";
import { TPartner } from "@/types";
import { Delete } from "styled-icons/fluentui-system-regular";
import { FiEdit } from "react-icons/fi";
import { cn } from "@/lib";
import { useRouter } from "next/navigation";
import { CiShare2 } from "react-icons/ci";
import { AddPartnerManually } from "@/components/partners/_components/modals/AddPartnerManually";
import { ShareModal } from "@/components/partners/PartnerPayment";
export function PartnersList({
  eventId,
  partners,
  loading,
  refetch,
}: {
  refetch: () => Promise<any>;
  partners: TPartner[];
  loading: boolean;
  eventId: string;
}) {
  const {
    data: event,
    refetch: refetchSingleEvent,
    loading: eventLoading,
  } = useFetchSingleEvent(eventId);
  const [isOpen, setOpen] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const { deletes, deleteAll } = useDeletePartner();
  const [isAddHall, setAddHall] = useState(false);
  const [active, setActive] = useState(1);
  const router = useRouter();
  const { startDate, endDate } = useFormatEventData(event);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  function onToggle() {
    setOpen((prev) => !prev);
  }

  function onClose() {
    setAddHall((prev) => !prev);
  }

  function onPartner() {
    setPartner((prev) => !prev);
  }

  function onShare() {
    setIsShare((prev) => !prev);
  }

  const dataString = useMemo(() => {
    return encodeURIComponent(
      JSON.stringify({
        image: event?.eventPoster,
        eventTitle: event?.eventTitle,
        organizerLogo: event?.organisationLogo,
        startDate,
        endDate,
      })
    );
  }, [event]);
  // **** handle delete ****  //

  // select a row
  function selectRow(value: number) {
    if (selectedRows.includes(value)) {
      setSelectedRows(selectedRows.filter((v) => v !== value));
    } else {
      setSelectedRows((prev) => [...prev, value]);
    }
  }

  // select all the rows
  function selectAllRow(e: React.ChangeEvent<HTMLInputElement>) {
    // console.log(e.target.checked)
    if (e.target.checked) {
      const partnersID = partners.map((item) => item?.id);
      setSelectedRows(partnersID);
    } else {
      setSelectedRows([]);
    }
  }

  // delete selected
  async function deleteSelectedRows() {
    if (selectedRows?.length === partners?.length) {
      await deleteAll();
      refetch();
    } else {
      await deletes(selectedRows);
      refetch();
    }
    // empty the selected array
    setSelectedRows([]);
  }
  const tabs = [
    { id: 1, name: "Active Partners", count: 0 },
    { id: 2, name: "Inactive Partners", count: 0 },
  ];

  const filteredPartners = useMemo(() => {
    if (Array.isArray(partners)) {
      const activePartners = partners?.filter(
        ({ partnerStatus }) => partnerStatus === "active"
      )?.length;
      tabs?.map((tab) => {
        return {
          ...tab,
          count:
            tab?.id === 1 ? activePartners : partners?.length - activePartners,
        };
      });
    }
    if (active === 1) {
      return partners.filter(
        (partner) =>
          partner?.partnerStatus === "active" ||
          partner?.partnerStatus === null
      );
    } else {
      return partners.filter((partner) => partner?.partnerStatus === "inactive");
    }
  }, [active, partners]);
  return (
    <>
      {eventLoading ? (
        <div className="w-full h-[20rem] flex items-center justify-center">
          <LoaderAlt size={30} className="text-basePrimary animate-spin" />
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="w-full h-full  flex flex-col">
            {Array.isArray(partners) && partners?.length > 0 && (
              <div className="flex gap-x-2 items-center self-end">
                <Button onClick={onShare} className="px-0 w-fit h-fit">
                  <CiShare2 size={22} />
                  <p>Share</p>
                </Button>
                <Button
                  onClick={() =>
                    router.push(
                      `/event/${eventId}/content/partners/create-tier`
                    )
                  }
                  className="text-basePrimary  duration-300 ease-in-out transition-all hover:text-gray-50  my-4 border-basePrimary hover:bg-basePrimary  gap-x-2 h-11 sm:h-12 font-medium"
                >
                  <FiEdit size={22} />
                  <p>Edit Tier</p>
                </Button>
                <Button
                  onClick={onPartner}
                  className="text-gray-50  my-4 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
                >
                  <PlusCircle size={22} />
                  <p>Partner</p>
                </Button>
              </div>
            )}

            <div
              className={cn(
                "w-full rounded-lg bg-white",
                Array.isArray(partners) &&
                  partners?.length === 0 &&
                  "bg-[#F9FAFF]"
              )}
            >
              {Array.isArray(partners) && partners?.length > 0 && (
                <div className="flex px-3 py-3 items-center justify-between w-full">
                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center border-b gap-x-2">
                      {tabs.map((tab) => (
                        <button
                          onClick={() => setActive(tab.id)}
                          className={cn(
                            "px-4 py-2",
                            active === tab?.id &&
                              "text-basePrimary font-medium border-b border-basePrimary"
                          )}
                          key={tab.id}
                        >
                          {`${tab.name} (${tab.count})`}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-x-2">
                      {selectedRows?.length > 0 && (
                        <Button
                          onClick={deleteSelectedRows}
                          className="px-2 text-xs gap-x-2 bg-gray-50 py-2 h-fit w-fit"
                        >
                          <Delete size={18} />
                          <span>{`Delete ${
                            selectedRows?.length === partners?.length
                              ? "all"
                              : `${
                                  selectedRows?.length === 1
                                    ? "a row"
                                    : `${selectedRows?.length} rows`
                                }`
                          }`}</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className=" flex items-center group rounded-md justify-center bg-transparent   transition-all transform duration-300 ease-in-out gap-x-2 h-11 sm:h-12">
                    <p>Exhibition Hall</p>
                    <button onClick={onClose}>
                      <PlusCircle size={22} />
                    </button>
                    <button onClick={onToggle} className="">
                      <Eye size={40} />
                    </button>
                  </div>
                </div>
              )}
              <div className="w-full  partner-scroll-style overflow-x-auto">
                <div
                  className={cn(
                    "pb-3 w-full",
                    Array.isArray(partners) &&
                      partners?.length > 0 &&
                      "min-w-[1200px]"
                  )}
                >
                  <table className="w-full  ">
                    <thead className="w-full">
                      {!loading &&
                        Array.isArray(partners) &&
                        partners?.length > 0 && (
                          <tr className="w-full  bg-basePrimary/10 grid grid-cols-9 text-sm font-semibold  items-center bg-gray-100 gap-3 px-3 py-4 ">
                            <td className="text-start col-span-2 w-full">
                              <label className=" w-full flex  relative items-center gap-x-2">
                                <input
                                  onChange={(e) => selectAllRow(e)}
                                  type="checkbox"
                                  className="accent-basePrimary w-4 h-4"
                                />
                                <span className="partner-checkmark"></span>
                                <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
                                  Partner
                                </p>
                              </label>
                            </td>
                            <td className=" text-start col-span-1 w-full">
                              Contact
                            </td>
                            <td className="text-start">Partner Type</td>
                            <td className="text-start">Partner Tier</td>
                            <td className="text-start">Exhibiton Hall</td>
                            <td className="text-start">Booth</td>
                            <td className="text-start">StampCard</td>
                            <td className="text-start">Actions</td>
                          </tr>
                        )}
                    </thead>
                    <tbody className="w-full">
                      {loading && (
                        <tr className="w-full col-span-full h-[300px] flex items-center justify-center">
                          <td>
                            <LoaderAlt size={30} className="animate-spin" />
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        Array.isArray(partners) &&
                        partners?.length === 0 && (
                          <tr className="w-full bg-[#F9FAFF] h-full">
                            <td>
                              <div className="w-full col-span-full items-center flex flex-col justify-center h-[300px]">
                                {Array.isArray(event?.partnerDetails) &&
                                event?.partnerDetails.length > 0 ? (
                                  <div className="flex flex-col items-center gap-y-3">
                                    <p className="text-basePrimary mb-1 text-base sm:text-xl font-medium">
                                      No Partners Yet
                                    </p>
                                    <p className="text-center max-w-md">
                                      Sponsors and exhibitors will show up here
                                      once they register. Share this link to get
                                      started.
                                    </p>
                                    <Button
                                      onClick={onShare}
                                      className="text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
                                    >
                                      <p>Share Partners Registration Page</p>
                                    </Button>

                                    <Button
                                      onClick={() =>
                                        router.push(
                                          `/event/${eventId}/content/partners/create-tier`
                                        )
                                      }
                                      className="  duration-300 ease-in-out transition-all   my-4   gap-x-2 h-11 sm:h-12 font-medium"
                                    >
                                      <FiEdit size={22} />
                                      <p>Edit Tier</p>
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center flex-col gap-y-2">
                                    <p className="text-basePrimary mb-1 text-base sm:text-xl font-medium">
                                      No partners for your event
                                    </p>
                                    <Button
                                      onClick={() => {
                                        router.push(
                                          `/event/${eventId}/content/partners/create-tier`
                                        );
                                      }}
                                      className="text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
                                    >
                                      <p>Create Partner Tiers</p>
                                    </Button>
                                    {/* 
                             <p className="flex items-center gap-x-2">
                               or
                               <button
                                 onClick={onPartner}
                                 className="underline "
                               >
                                 Add Manually
                               </button>
                             </p> */}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      {!loading &&
                        Array.isArray(filteredPartners) &&
                        filteredPartners?.map((item, index) => (
                          <PartnerWidget
                            refetch={refetch}
                            selectRowFn={selectRow}
                            selectedRows={selectedRows}
                            activeTab={active}
                            event={event}
                            partners={partners}
                            className={"border-b border-x"}
                            item={item}
                            key={`${item?.companyName}${index}`}
                          />
                        ))}
                      {!loading &&
                        Array.isArray(filteredPartners) &&
                        filteredPartners?.length === 0 && (
                          <tr className="w-full h-[300px] col-span-full flex items-center justify-center">
                            <td className="font-medium">No Partner</td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <ExhibitionHall
          close={onToggle}
          eventId={eventId}
          refetchSingleEvent={refetchSingleEvent}
          partners={partners}
        />
      )}

      {isPartner && (
        <AddPartnerManually
          refetchPartners={refetch}
          close={onPartner}
          eventId={eventId}
        />
      )}

      {isAddHall && (
        <AddExhibitionHall
          eventId={eventId}
          refetch={refetchSingleEvent}
          close={onClose}
        />
      )}
      {isShare && event && (
        <ShareModal
          text={`https://zikoro.com/live-events/${eventId}/partners?e=${dataString}`}
          close={onShare}
          eventId={eventId}
          header={"Share Partner Registration Page"}
        />
      )}
    </>
  );
}
