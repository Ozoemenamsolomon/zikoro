"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { useMemo, useState } from "react";
import { useFetchSingleEvent, useDeleteEventExhibitionHall } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";

type TExhibitonHall = {
  name: string;
  capacity: string;
  seat: number;
};

export function ExhibitionHall({
  eventId,
  partners,
  close,
  refetchSingleEvent,
}: {
  partners: any[];
  eventId: string;
  close: () => void;
  refetchSingleEvent: () => Promise<null | undefined>;
}) {
  const { data, loading, refetch } = useFetchSingleEvent(eventId);
  const [selectedHall, setSelectedHall] = useState<string[]>([]);
  const {
    deleteAll,
    loading: exLoading,
    deleteExhibitionHall,
  } = useDeleteEventExhibitionHall(eventId);

  // format exhibition hall array
  const formatExhibitionHall: TExhibitonHall[] | undefined = useMemo(() => {
    if (Array.isArray(data?.exhibitionHall) && data?.exhibitionHall?.length > 0) {
      return data.exhibitionHall.map((item) => {
        let totalSeat = 0;
        partners.forEach((partner) => {
          if (partner.exhibitionHall === item.name && partner?.boothNumber) {
            totalSeat += partner?.boothNumber?.length;
          }
        });
        return { ...item, seat: totalSeat };
      });

      // exhibitionHall;
    }
    else {
      return []
    }
  }, [data, partners]);

  // select a row
  function handleSelectedHall(value: string) {
    if (selectedHall.includes(value)) {
      setSelectedHall(selectedHall.filter((v) => v !== value));
    } else {
      setSelectedHall((prev) => [...prev, value]);
    }
  }

  // select all the rows
  function selectAllRow(e: React.ChangeEvent<HTMLInputElement>) {
    // console.log(e.target.checked)
    if (e.target.checked && formatExhibitionHall) {
      setSelectedHall(formatExhibitionHall.map(({ name }) => name));
    } else {
      setSelectedHall([]);
    }
  }

  async function handleDelete() {
    if (selectedHall?.length === formatExhibitionHall?.length) {
      await deleteAll();
      refetch();
      refetchSingleEvent();
    } else {
      await deleteExhibitionHall(selectedHall);
      refetch();
      refetchSingleEvent();
    }
    // empty the selected array
    setSelectedHall([]);
  }

  return (
    <div className="w-full h-full inset-0 fixed z-[9999] bg-black/50">
      <div className="w-[95%] sm:w-[600px] absolute inset-0 m-auto h-fit min-h-[200px] max-h-[400px] rounded-md overflow-y-auto pb-8 bg-white">
        <div className="w-full  flex flex-col">
          <div className="flex p-3 border-b items-center justify-between w-full">
            <div className="flex items-center gap-x-2">
              <p className="font-medium">Exhibition Hall</p>
              {selectedHall?.length > 0 && (
                <Button
                  onClick={handleDelete}
                  className="px-2 text-xs gap-x-2 bg-gray-50 py-2 h-fit w-fit"
                >
                  <Delete size={18} />
                  <span>{`Delete ${
                    selectedHall?.length === formatExhibitionHall?.length
                      ? "all"
                      : `${
                          selectedHall?.length === 1
                            ? "a row"
                            : `${selectedHall?.length} rows`
                        }`
                  }`}</span>
                </Button>
              )}
            </div>

            <Button onClick={close} className="px-1 h-fit w-fit">
              <CloseOutline size={24} />
            </Button>
          </div>
          <div className="w-full p-3">
            <div className=" rounded-lg w-full border">
              <div className="w-full grid gap-3 font-medium text-sm grid-cols-3 px-2 py-4 items-center bg-gray-100 rounded-t-lg">
                <label className=" w-full flex  relative items-center gap-x-2">
                  <input
                    className="accent-basePrimary w-3 h-3"
                    onChange={(e) => selectAllRow(e)}
                    type="checkbox"
                  />

                  <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
                    Hall Name
                  </p>
                </label>

                <p>Capacity</p>
                <p>Filled Booth</p>
              </div>
              {loading && (
                <div className="w-full col-span-full h-[300px] flex items-center justify-center">
                  <LoaderAlt size={50} className="animate-spin" />
                </div>
              )}
              {!loading &&
                Array.isArray(formatExhibitionHall) &&
                formatExhibitionHall?.length === 0 && (
                  <EmptyCard
                    width="70"
                    height="70"
                    text="No Exhibition Hall for this event"
                  />
                )}

              {Array.isArray(formatExhibitionHall) &&
                formatExhibitionHall?.map((item, index) => (
                  <ExhibitionHallWidget
                    key={`${item.name}${index}`}
                    className={
                      index === formatExhibitionHall?.length - 1
                        ? "border-b-0"
                        : "border-b"
                    }
                    name={item?.name}
                    capacity={item?.capacity}
                    seat={item?.seat}
                    selectRow={handleSelectedHall}
                    selectedHall={selectedHall}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExhibitionHallWidget({
  className,
  name,
  capacity,
  seat,
  selectRow,
  selectedHall,
}: {
  name: string;
  capacity: string;
  seat: number;
  className: string;
  selectRow: (value: string) => void;
  selectedHall: string[];
}) {
  return (
    <div
      className={cn(
        "grid text-sm grid-cols-3 items-center hover:bg-gray-50 gap-4 px-2 py-4",
        className
      )}
    >
      <label className="w-full flex items-center gap-x-2 relative partner-container">
        <input
          checked={selectedHall.includes(name)}
          onChange={() => selectRow(name)}
          type="checkbox"
          className="accent-basePrimary w-3 h-3"
        />

        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </p>
      </label>
      <p>{Number(capacity)?.toLocaleString()}</p>
      <p>{seat?.toLocaleString()}</p>
    </div>
  );
}
