import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useDeletePartner, useFetchSingleEvent } from "@/hooks";
import { PartnerWidget, ExhibitionHall, AddExhibitionHall } from "..";
import { AddPartners } from "@/components/partners/_components";
import { useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Eye } from "@styled-icons/evil/Eye";
import { Button } from "@/components";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";

import { cn } from "@/lib";
import Image from "next/image";
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
  const { data: event, refetch: refetchSingleEvent } =
    useFetchSingleEvent(eventId);
  const [isOpen, setOpen] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const { loading: delLoading, deletes, deleteAll } = useDeletePartner();
  const [isAddHall, setAddHall] = useState(false);

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

  /**** */

  return (
    <>
      <div className="w-full  flex flex-col">
        <div className="flex py-3 items-center justify-between w-full">
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

          {Array.isArray(partners) && partners?.length > 0 && (
            <div className=" flex items-center group rounded-md justify-center bg-transparent   transition-all transform duration-300 ease-in-out gap-x-2 h-11 sm:h-12">
              <p>Exhibition Hall</p>
              <button onClick={onClose}>
                <PlusCircle size={22} />
              </button>
              <button onClick={onToggle} className="">
                <Eye size={40} />
              </button>

              <Button
                onClick={onPartner}
                className="text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
              >
                <PlusCircle size={22} />
                <p>Partner</p>
              </Button>
            </div>
          )}
        </div>
        <div className="w-full  partner-scroll-style overflow-x-auto">
          <div
            className={cn(
              "pb-3 w-full",
              Array.isArray(partners) &&
                partners?.length > 0 &&
                "min-w-[1000px]"
            )}
          >
            <table className="w-full  rounded-lg ">
              <thead className="w-full">
                {!loading &&
                  Array.isArray(partners) &&
                  partners?.length > 0 && (
                    <tr className="w-full rounded-t-lg grid grid-cols-7 text-sm font-semibold  items-center bg-gray-100 gap-3 px-3 py-4 ">
                      <td className="text-start col-span-2 w-full">
                        <label className=" w-full flex  relative items-center gap-x-2">
                          <input
                            onChange={(e) => selectAllRow(e)}
                            type="checkbox"
                            className="accent-basePrimary w-3 h-3"
                          />
                          <span className="partner-checkmark"></span>
                          <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
                            Partner
                          </p>
                        </label>
                      </td>
                      <td className=" text-start col-span-1 w-full">Contact</td>
                      <td className="text-start">Partner Type</td>
                      <td className="text-start">Sponsor Category</td>
                      <td className="text-start">Exhibiton Hall</td>
                      <td className="text-start">Booth</td>
                    </tr>
                  )}
              </thead>
              <tbody className="w-full">
                {loading && (
                  <tr className="w-full col-span-full h-[300px] flex items-center justify-center">
                    <td>
                      <LoaderAlt size={50} className="animate-spin" />
                    </td>
                  </tr>
                )}
                {!loading &&
                  Array.isArray(partners) &&
                  partners?.length === 0 && (
                    <tr>
                      <td>
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
                              This page is empty. Partners will appear here
                            </p>
                            <Button
                              onClick={onPartner}
                              className="text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
                            >
                              <PlusCircle size={22} />
                              <p>Partner</p>
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                {!loading &&
                  Array.isArray(partners) &&
                  partners?.map((item, index) => (
                    <PartnerWidget
                      refetch={refetch}
                      selectRowFn={selectRow}
                      selectedRows={selectedRows}
                      event={event}
                      partners={partners}
                      className={"border-b border-x"}
                      item={item}
                      key={`${item?.name}${index}`}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isOpen && (
        <ExhibitionHall
          close={onToggle}
          eventId={eventId}
          refetchSingleEvent={refetchSingleEvent}
          partners={partners}
        />
      )}

      {isPartner && (
        <AddPartners
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
    </>
  );
}