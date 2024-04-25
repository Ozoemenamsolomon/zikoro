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
}: {
  event?: Event | null;
  session: TAgenda;
  refetch?: () => Promise<any>;
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
          eventId={session?.eventId}
          close={onClose}
          refetch={refetch}
        />
      )}
    </>
  );
}
