"use client";

import { CalendarCheck } from "@styled-icons/bootstrap/CalendarCheck";
import { Button } from "@/components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useCreateMyAgenda } from "@/hooks";
import { cn } from "@/lib";
export function AddToMyAgenda({
  attendeeId,
  sessionAlias,
  isMyAgenda,
  refetch
}: {
  sessionAlias: string;
  attendeeId?: number;
  isMyAgenda: boolean;
  refetch?: () => Promise<any>
}) {
  const { createMyAgenda, isLoading } = useCreateMyAgenda();

  async function add() {
    await createMyAgenda({ payload: { sessionAlias, attendeeId } });
    if (refetch) refetch()
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
