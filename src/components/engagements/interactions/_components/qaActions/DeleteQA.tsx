"use client";

import { Button } from "@/components";
import { useState } from "react";
import { DeleteModal } from "..";
import { useDeleteRequest } from "@/hooks/services/request";
export function DeleteQA({ QandAAlias, refetch }: {refetch: () =>Promise<any>; QandAAlias: string }) {
  const {deleteData, isLoading} = useDeleteRequest(`/engagements/qa/${QandAAlias}/delete`)
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  async function deletes() {
    await deleteData();
    refetch()
    onClose()
  }

  return (
    <>
      <Button
        onClick={() => {
          onClose();
        }}
        className="items-center h-10 w-full text-red-600 hover:bg-gray-100 justify-start text-xs"
      >
        Delete
      </Button>
      {isOpen && (
        <DeleteModal
          close={onClose}
          loading={isLoading}
          asyncDelete={deletes}
        />
      )}
    </>
  );
}
