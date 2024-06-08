"use client";

import { Button } from "@/components";
import { TQuiz, TQuestion } from "@/types";
import { useState } from "react";
import { useUpdateQuiz } from "@/hooks";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { DeleteModal } from "..";
export function DeleteQuestion({
  quiz,
  questionId,
  refetch,
}: {
  questionId: string;
  quiz: TQuiz<TQuestion[]>;
  refetch: () => Promise<any>;
}) {
  const [isOpen, setOpen] = useState(false);
  const { updateQuiz, isLoading } = useUpdateQuiz();

  function onClose() {
    setOpen((prev) => !prev);
  }

  async function deletes() {
    const updateQuestion = quiz?.questions?.filter(
      ({ id }) => id !== questionId
    );

    await updateQuiz({ payload: { ...quiz, questions: updateQuestion } });
    refetch();
    onClose();
  }

  return (
    <>
      <Button
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
      className="px-0 w-fit text-red-500 h-fit">
        <DeleteOutline size={18} />
      </Button>

      {isOpen && (
        <DeleteModal
          close={onClose}
          asyncDelete={deletes}
          loading={isLoading}
        />
      )}
    </>
  );
}
