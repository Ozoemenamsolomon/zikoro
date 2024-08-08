"use client";

import { Button } from "@/components";
import { TAgenda, Event } from "@/types";
import { AddSession } from "..";
import { useState } from "react";
import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
export function Edit({
  session,
  event,
  refetch,
  refetchEvent
}: {
  event?: Event | null;
  session: TAgenda;
  refetch?: () => Promise<any>;
  refetchEvent?: () => Promise<any>;
}) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClose()
        }}
        className="h-fit w-fit px-0"
      >
        <EditOutline size={20} />
      </Button>
      {isOpen && (
        <AddSession
          event={event}
          eventStartDate={event?.startDateTime}
          session={session}
          eventId={session?.eventAlias}
          close={onClose}
          refetch={refetchEvent}
          refetchSession={refetch}
        />
      )}
    </>
  );
}
