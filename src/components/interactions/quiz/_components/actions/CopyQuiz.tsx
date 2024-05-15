"use client";

import { Button } from "@/components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { TQuiz, TQuestion } from "@/types";
import { useCreateQuiz } from "@/hooks";
import { generateAlias } from "@/utils";
export function CopyQuiz({
  quiz,
  refetch,
}: {
  quiz: TQuiz<TQuestion[]>;
  refetch: () => Promise<any>;
}) {
  const { createQuiz, isLoading } = useCreateQuiz();

  async function coppied() {
    const {id, ...restData} = quiz
    const newAlias = generateAlias();

    const payload = {
      ...restData,
      quizAlias: newAlias,
    };

    await createQuiz({ payload });
    refetch();
  }
  return (
    <>
      <Button
      disabled={isLoading}
        onClick={coppied}
        className={
          "items-center h-10 gap-x-2 hover:bg-gray-100 justify-start w-full  text-xs"
        }
      >
        {isLoading && <LoaderAlt size={12} className="animate-spin" />}
        <span>Make a Copy</span>
      </Button>
    </>
  );
}
