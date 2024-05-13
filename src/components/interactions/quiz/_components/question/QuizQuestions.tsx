"use client";

import { Button } from "@/components";
import { InteractionLayout } from "../../../_components";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { PlayBtn } from "@styled-icons/bootstrap/PlayBtn";
import { Settings } from "@styled-icons/feather/Settings";
import Image from "next/image";
import { ActiveQuestion, QuestionCard, QuizSettings, AddQuestion } from "..";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateQuiz, useUpdateQuiz } from "@/hooks";
export default function QuizQuestion({ eventId }: { eventId: string }) {
  const { createQuiz, isLoading, quiz } = useCreateQuiz();
  const { updateQuiz, isLoading: updating } = useUpdateQuiz();
  const [openQuestionModal, setOpenQusetionModal] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  function onOpen() {
    setOpen((prev) => !prev);
  }
  function onToggle() {
    setOpenQusetionModal((prev) => !prev);
  }

  function questionHeight(num: number) {
    setHeight(num);
  }

  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full border-b p-4 flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="px-0 w-fit h-fit gap-x-2 text-sm"
        >
          <ArrowBackOutline size={18} />
          <p>Back</p>
        </Button>

        <p className="text-gray-500">Quiz Title</p>

        <div className="flex items-center gap-x-2">
          <button
            onClick={onOpen}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1"
          >
            <Settings size={22} />
          </button>
          <Button
              onClick={onToggle}
            className="text-gray-50 bg-basePrimary gap-x-2 h-10 font-medium flex"
          >
            <PlusCircle size={20} />
            <p>Question</p>
          </Button>
          <Link
            href={`/quiz/${eventId}/present/${1}`} //  onClick={onClose}
            className="text-basePrimary px-0 w-fit h-fit  hover:text-black gap-x-2 font-medium flex"
          >
            <PlayBtn size={20} />
          </Link>
        </div>
      </div>
      <div className="w-full grid grid-cols-1  lg:grid-cols-5 pb-20">
        <div className="w-full p-3 sm:p-4 lg:col-span-2">
          <ActiveQuestion setHeight={questionHeight} />
        </div>

        <div
          style={{ maxHeight: height === 0 ? "initial" : height + 30 }}
          className="w-full lg:col-span-3 border-l p-2  lg:overflow-y-auto space-y-3"
        >
          {[1, 2, 3, 4, 5, 6].map((_) => (
            <QuestionCard key={_} />
          ))}
        </div>
      </div>
      {isOpen && (
        <QuizSettings
          createQuiz={createQuiz}
          updateQuiz={updateQuiz}
          isLoading={isLoading || updating}
          close={onOpen}
          quiz={quiz}
          eventAlias={eventId}
        />
      )}
      {openQuestionModal && <AddQuestion updateQuiz={updateQuiz} close={onToggle} quiz={quiz}/>}
    </InteractionLayout>
  );
}

function EmptyState() {
  return (
    <div className="w-full flex flex-col gap-y-3 items-center justify-center h-[24rem]">
      <Image
        className="w-fit h-fit"
        src="/quizimage.png"
        alt="empty"
        width={250}
        height={350}
      />
      <p className="text-gray-500">No Quiz</p>
    </div>
  );
}
