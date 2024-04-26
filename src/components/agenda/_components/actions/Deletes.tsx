"use client";

import { useState } from "react";
import { Button } from "@/components";
import { useDeleteAgenda } from "@/hooks";
import { DeleteCard } from "..";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
export function Deletes({
  agendaId,
  refetch,
}: {
  agendaId: number;
  refetch?: () => Promise<any>;
}) {
  const [isDelete, setDelete] = useState(false);
  const { deleteAgenda, isLoading } = useDeleteAgenda();

  function onClose() {
    setDelete((prev) => !prev);
  }
  async function deletes() {
    await deleteAgenda({ agendaId });
    if (refetch) refetch();
    onClose();
  }
  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        disabled={isLoading}
        className="h-fit text-red-500 w-fit px-0"
      >
        <DeleteOutline size={22} />
      </Button>
      {isDelete && (
          <DeleteCard close={onClose} loading={isLoading} deletes={deletes} />
    
      )}
    </>
  );
}

