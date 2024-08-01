"use client";

import { TQuiz, TQuestion } from "@/types";
import { Button } from "@/components";
import { Edit } from "styled-icons/boxicons-solid";
import { useState } from "react";
import { AddQuestion } from "..";
export function EditQuestion({
  refetch,
  quiz,
  question,
}: {
  refetch: () => Promise<any>;
  quiz: TQuiz<TQuestion[]>;
  question: TQuestion;
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
          e.preventDefault();
          onClose();
        }}
        className="px-0 w-fit  h-fit"
      >
        <Edit size={18} />
      </Button>

      {isOpen && (
        <>
          <AddQuestion
            refetch={refetch}
            close={onClose}
            question={question}
            quiz={quiz}
          />
        </>
      )}
    </>
  );
}
