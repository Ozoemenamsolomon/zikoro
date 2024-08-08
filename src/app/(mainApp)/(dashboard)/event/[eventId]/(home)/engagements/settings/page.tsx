"use client";
import { InteractionLayout } from "@/components/engagements/_components";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useGetData, useMutateData } from "@/hooks/services/request";
import { cn } from "@/lib";
import useEventStore from "@/store/globalEventStore";
import { EngagementsSettings, TPointsAllocation } from "@/types/engagements";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";

const DEFAULT_POINTS_ALLOCATION: TPointsAllocation = {
  "Checked in for an event": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "update profile": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "schedule an appointment": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "exchange contacts": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "add to agenda": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "rate a session": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "download presentation file": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "buy products": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "participate in polls": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "participate in quiz": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "ask a question": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "like a question": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "visit exhibitor booth": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "engage in discussions": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "download exhibitor catalogue": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "checked in for a session": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
  "share on social media": {
    maxOccurrence: 5,
    points: 5,
    maxPoints: 5,
    status: false,
  },
};

function EmptyState({
  addPointsAllocation,
  updatePointsAllocationIsLoading,
}: {
  addPointsAllocation: (pointsAllocation: TPointsAllocation) => Promise<void>;
  updatePointsAllocationIsLoading: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-y-3 items-center justify-center h-[24rem]">
      <Image
        className="w-fit h-fit"
        src="/chatbubble.png"
        alt="empty"
        width={150}
        height={150}
      />
      <h2 className="text-basePrimary font-semibold text-base sm:text-2xl">
        You haven't allocated engagement points
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm">
        Let's go, Allocate engagement points
      </p>

      <Button
        onClick={() => addPointsAllocation(DEFAULT_POINTS_ALLOCATION)}
        className={cn("bg-basePrimary text-white rounded-lg flex")}
        disabled={updatePointsAllocationIsLoading}
      >
        <p> Allocate Points 🎊</p>
      </Button>
    </div>
  );
}

const page = () => {
  const {eventId} = useParams()
  const [pointsAllocation, setAllocation] = useState<TPointsAllocation>(
    DEFAULT_POINTS_ALLOCATION
  );
  const { event } = useEventStore();
  const {
    data: engagementsSettings,
    isLoading: engagementsSettingsIsLoading,
    getData: getEngagementsSettings,
  } = useGetData<EngagementsSettings>(
    `engagements/${eventId}/settings`
  );

  console.log(engagementsSettings);

  useEffect(() => {
    if (engagementsSettingsIsLoading || !engagementsSettings) return;

    setAllocation(engagementsSettings.pointsAllocation);
  }, [engagementsSettings]);

  const {
    mutateData: updatePointsAllocation,
    isLoading: updatePointsAllocationIsLoading,
  } = useMutateData<Omit<EngagementsSettings, "id" | "created_at">>(
    `engagements/${eventId}/settings`
  );

  const handleInputChange = (key: string, ppty: string, newValue: any) => {
    setAllocation((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [ppty]: newValue,
      },
    }));
  };

  const addPointsAllocation = async (pointsAllocation: TPointsAllocation) => {
    console.log("here");
    await updatePointsAllocation({
      payload: engagementsSettings
        ? {
            ...engagementsSettings,
            eventAlias: eventId,
            pointsAllocation,
          }
        : {
            eventAlias: eventId,
            pointsAllocation,
          },
    });
    await getEngagementsSettings();
  };

  return (
    <InteractionLayout eventId={event?.eventAlias}>
      {engagementsSettingsIsLoading && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
      {!engagementsSettingsIsLoading &&
        (!engagementsSettings ? (
          <div className="w-full col-span-full flex items-center justify-center h-[350px]">
            <EmptyState
              addPointsAllocation={addPointsAllocation}
              updatePointsAllocationIsLoading={updatePointsAllocationIsLoading}
            />
          </div>
        ) : (
          <div className="py-8 px-4 space-y-4">
            <h1 className="text-lg font-bold text-center my-8">
              Decide how points should be allocated for each engagement
            </h1>
            <div className="space-y-2">
              <Button
                onClick={() => addPointsAllocation(pointsAllocation)}
                className={cn(
                  "bg-basePrimary text-white rounded-lg flex ml-auto"
                )}
                disabled={updatePointsAllocationIsLoading}
              >
                <p>Update Allocations</p>
              </Button>
              <div className="overflow-x-auto">
                <table className="min-w-max bg-white border border-gray-300">
                  <thead className="font-bold">
                    <tr className="bg-[#001FCC]/10 grid grid-cols-5 text-gray-800">
                      <th className="py-2 px-4 border-b capitalize text-lg font-medium ">
                        Engagements
                      </th>
                      <th className="py-2 px-4 border-b capitalize text-lg font-medium ">
                        Max Occurrence
                      </th>
                      <th className="py-2 px-4 border-b capitalize text-lg font-medium ">
                        Points
                      </th>
                      <th className="py-2 px-4 border-b capitalize text-lg font-medium ">
                        Maximum Points
                      </th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(pointsAllocation).map(
                      ([engagement, innerObj]) => (
                        <tr key={engagement} className="grid grid-cols-5">
                          <td
                            className={cn(
                              "py-2 px-4 border-b capitalize font-medium",
                              innerObj.status
                                ? "text-gray-700"
                                : "text-gray-500"
                            )}
                          >
                            {engagement}
                          </td>
                          {Object.entries(innerObj).map(
                            ([ppty, value]) =>
                              ppty !== "status" &&
                              ppty !== "maxPoints" &&
                              (engagement === "update profile" &&
                              ppty === "maxOccurrence" ? (
                                <td className="py-2 px-4 border-b text-gray-500 text-center text-sm">
                                  Not Applicable
                                </td>
                              ) : (
                                <td
                                  key={ppty}
                                  className="py-2 px-4 border-b text-gray-500"
                                >
                                  <div className="flex items-center gap-2 justify-center">
                                    <input
                                      className="w-[50px] border-0 outline-none disabled:bg-transparent"
                                      type="number"
                                      value={value}
                                      onInput={(e) =>
                                        handleInputChange(
                                          engagement,
                                          ppty,
                                          e.currentTarget.value
                                        )
                                      }
                                      disabled={!innerObj.status}
                                    />
                                    <div className="flex flex-col justify-around">
                                      <button
                                        disabled={!innerObj.status}
                                        onClick={() =>
                                          handleInputChange(
                                            engagement,
                                            ppty,
                                            ++value
                                          )
                                        }
                                      >
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          strokeWidth={0}
                                          viewBox="0 0 320 512"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z" />
                                        </svg>
                                      </button>
                                      <button
                                        disabled={!innerObj.status}
                                        onClick={() =>
                                          handleInputChange(
                                            engagement,
                                            ppty,
                                            --value
                                          )
                                        }
                                      >
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          strokeWidth={0}
                                          viewBox="0 0 320 512"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              ))
                          )}
                          <td className="py-2 px-4 border-b text-gray-500 text-center text-sm">
                            {(engagement === "update profile"
                              ? 16
                              : innerObj.maxOccurrence) * innerObj.points}
                          </td>
                          <td className="py-2 px-4 border-b text-gray-500 flex justify-center">
                            <Switch
                              className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
                              checked={innerObj.status}
                              onCheckedChange={(checked) =>
                                handleInputChange(engagement, "status", checked)
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
    </InteractionLayout>
  );
};

export default page;
