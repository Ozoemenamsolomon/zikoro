import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";
import { useDeletePartner, useFetchSingleEvent } from "@/hooks";
import {
  PartnerWidget,
  ExhibitionHall,
  AddExhibitionHall,
  AddSponsorLevel,
} from "..";
import { useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Eye } from "@styled-icons/evil/Eye";
import { Button } from "@/components";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";
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
  const { loading: delLoading, deletes, deleteAll } = useDeletePartner();
  const [isAddHall, setAddHall] = useState(false);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  function onToggle() {
    setOpen((prev) => !prev);
  }

  function onClose() {
    setAddHall((prev) => !prev);
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
      <div className="w-full  flex flex-col border-r">
        <div className="flex p-3 border-b items-center justify-between w-full">
          <div className="flex items-center gap-x-2">
            <p className="font-medium">Partners</p>
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

          <div
            //  onClick={""}
            className=" flex items-center px-4 group rounded-md justify-center bg-transparent   transition-all transform duration-300 ease-in-out gap-x-2 h-11 sm:h-12"
          >
            <p>Exhibition Hall</p>
            <button onClick={onClose}>
              <PlusCircle size={22} />
            </button>
            <button onClick={onToggle} className="">
              <Eye size={40} />
            </button>
          </div>
        </div>
        <div className="w-full p-3">
          <table className="w-full border-x border-b rounded-t-lg ">
            <tr className="w-full rounded-t-lg grid grid-cols-7 text-sm font-medium items-center bg-gray-100 gap-3 px-3 py-4 ">
              <th className="text-start col-span-2 w-full">
                <label className=" w-full flex  relative partner-container">
                  <input onChange={(e) => selectAllRow(e)} type="checkbox" />
                  <span className="partner-checkmark"></span>
                  <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
                    Partner
                  </p>
                </label>
              </th>
              <th className=" text-start col-span-1 w-full">Contact</th>
              <th className="text-start">Partner Type</th>
              <th className="text-start">Sponsor Category</th>
              <th className="text-start">Exhibiton Hall</th>
              <th className="text-start">Booth</th>
            </tr>
            {loading && (
              <tr className="w-full col-span-full h-[300px] flex items-center justify-center">
                <td>
                  <LoaderAlt size={50} className="animate-spin" />
                </td>
              </tr>
            )}
            {!loading && Array.isArray(partners) && partners?.length === 0 && (
              <tr>
                <td>
                  <EmptyCard
                    width="100"
                    height="100"
                    text="No available partner for this event"
                  />
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
                  className={
                    index === partners?.length - 1 ? "border-b-0" : "border-b"
                  }
                  item={item}
                  key={`${item?.name}${index}`}
                />
              ))}
          </table>
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
