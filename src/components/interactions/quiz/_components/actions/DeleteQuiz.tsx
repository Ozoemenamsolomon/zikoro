"use client";

import { Button } from "@/components";
import { useState } from "react";
import { useDeleteQuiz } from "@/hooks";
import { DeleteModal } from "..";
export function DeleteQuiz({ quizAlias }: { quizAlias: string }) {
  const { deleteQuiz, isLoading } = useDeleteQuiz();
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  async function deletes() {
    await deleteQuiz({ quizId: quizAlias });
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
