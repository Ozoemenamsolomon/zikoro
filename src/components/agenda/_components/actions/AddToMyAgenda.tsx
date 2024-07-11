"use client";

import { CalendarCheck } from "styled-icons/bootstrap";
import { Button } from "@/components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useCreateMyAgenda } from "@/hooks";
import { EngagementsSettings } from "@/types/engagements";
import { cn } from "@/lib";
import { TMyAgenda } from "@/types";
import toast from "react-hot-toast";
export function AddToMyAgenda({
  attendeeId,
  sessionAlias,
  isMyAgenda,
  refetch,
  myAgendas,
  engagementsSettings,
}: {
  sessionAlias: string;
  attendeeId?: number;
  isMyAgenda: boolean;
  refetch?: () => Promise<any>;
  myAgendas?: TMyAgenda[];
  engagementsSettings?: EngagementsSettings | null;
}) {
  const { createMyAgenda, isLoading } = useCreateMyAgenda();

  async function add() {
    const myAgendapointsAllocation =
      engagementsSettings?.pointsAllocation["add to agenda"];
    if (myAgendapointsAllocation?.status && attendeeId) {
      // points

      // from myAgenda table, check if attendee already earned the max. points
      // return if is true, else do give him points
      const addedAgendas = myAgendas?.filter(
        (agenda) => agenda?.attendeeId === attendeeId
      );
      if (addedAgendas && addedAgendas?.length > 0) {
        const sum = addedAgendas?.reduce(
          (acc, agenda) => acc + agenda.points,
          0
        );
        if (
          sum >=
          myAgendapointsAllocation?.points *
            myAgendapointsAllocation?.maxOccurrence
        ) {
          toast.error("You have reached the maximum points for this session");
          return;
        }

        await createMyAgenda({
          payload: {
            sessionAlias,
            attendeeId,
            points: myAgendapointsAllocation?.points,
          },
        });
      }

    
    } else {
      await createMyAgenda({ payload: { sessionAlias, attendeeId } });
    }

    if (refetch) refetch();
  }

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={add}
        className="h-fit w-fit gap-x-2 px-0"
      >
        <CalendarCheck
          className={cn("text-basePrimary", !isMyAgenda && "text-gray-600")}
          size={20}
        />
        {isLoading && <LoaderAlt className="animate-spin" size={10} />}
      </Button>
    </>
  );
}
