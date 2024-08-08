"use client";

import Image from "next/image";
import { Time } from "styled-icons/ionicons-outline";
import { FeedStar } from "styled-icons/octicons";
import { TQuestion, TQuiz } from "@/types";
import { millisecondsToTime } from "@/utils";
import { useMemo } from "react";
import { cn } from "@/lib";
import { DeleteQuestion, CopyQuestion, EditQuestion, AddQuestion } from "..";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit } from "styled-icons/boxicons-solid";
import { Button } from "@/components";
import { useState } from "react";
export function QuestionCard({
  question,
  id,
  quiz,
  setActiveQuestion,
  activeQuestion,
  refetch,
}: {
  question: TQuestion;
  id: number;
  quiz: TQuiz<TQuestion[]>;
  setActiveQuestion: (q: TQuestion) => void;
  activeQuestion: TQuestion | null;
  refetch: () => Promise<any>;
}) {
  const [isOpen, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question?.id });
  const duration = useMemo(() => {
    return millisecondsToTime(Number(question?.duration || 0));
  }, [question?.duration]);

  function onClose() {
    setOpen((prev) => !prev);
  }

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transition,
          transform: CSS.Transform.toString(transform),
          touchAction: "none",
        }}
        onClick={() => setActiveQuestion(question)}
        role="button"
        className={cn(
          "w-full p-3 rounded-lg gap-2 grid grid-cols-7",
          activeQuestion &&
            activeQuestion?.id === question?.id &&
            "bg-basePrimary/10"
        )}
      >
        {question?.questionImage ? (
          <Image
            src={question?.questionImage}
            alt="question-image"
            width={600}
            height={400}
            className="w-full h-[140px] sm:h-[180px] rounded-lg col-span-3"
          />
        ) : (
          <div className="w-full h-[140px] sm:h-[180px] rounded-lg col-span-3 animate-pulse bg-gray-200 "></div>
        )}
        <div className="text-mobile sm:text-sm w-full flex flex-col items-start justify-start col-span-4 gap-y-3">
          <p className="text-gray-400">{`Question ${id + 1}`}</p>
          <p className="w-full line-clamp-3 font-medium leading-6">
            <div
              className="innerhtml"
              dangerouslySetInnerHTML={{
                __html: question?.question,
              }}
            />
          </p>
          <div className="flex items-center gap-x-2">
           {quiz?.interactionType !== "poll" && <div className="flex bg-basePrimary/10 px-2 py-1 items-center font-medium text-xs text-basePrimary gap-x-1">
              <p>{`${question?.points ?? "0"}pts`}</p>
              <FeedStar size={15} />
            </div>}
            {quiz?.interactionType !== "poll" && <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
              <p>{duration ?? 0}</p>
              <Time size={15} />
            </div>}
            <DeleteQuestion
              refetch={refetch}
              quiz={quiz}
              questionId={question?.id}
            />
            <CopyQuestion
              refetch={refetch}
              quiz={quiz}
              questionId={question?.id}
            />
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
          </div>
        </div>
      </div>

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
