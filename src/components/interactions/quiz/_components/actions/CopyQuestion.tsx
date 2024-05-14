"use client";

import { Button } from "@/components";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { TQuiz, TQuestion } from "@/types";
import { nanoid } from "nanoid";
import { useUpdateQuiz } from "@/hooks";
export function CopyQuestion({
  quiz,
  questionId,
  refetch,
}: {
  questionId: string;
  quiz: TQuiz;
  refetch: () => Promise<any>;
}) {
  const { updateQuiz, isLoading } = useUpdateQuiz();

  async function coppied() {
    if(!quiz?.questions) return 
    const updateQuestion = quiz?.questions?.find((quest) => {
     return quest?.id === questionId
    })
    const data: any = {
        ...updateQuestion,
        id: nanoid()
    }
  

    await updateQuiz({ payload: { ...quiz, questions: [...quiz?.questions, {...data}] } });
    refetch();
  }
  return (
    <>
      <Button onClick={coppied} className="px-0 gap-x-2 w-fit h-fit">
        <Copy size={18} />
        {isLoading && <LoaderAlt size={16} className="animate-spin" />}
      </Button>
    </>
  );
}
