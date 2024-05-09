"use client";

import { Button } from "@/components";
import { InteractionLayout } from "../../../_components";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { PlayBtn } from "@styled-icons/bootstrap/PlayBtn";
import { Settings } from "@styled-icons/feather/Settings";
import Image from "next/image";
import { ActiveQuestion, QuestionCard } from "..";
import { useState } from "react";
import { QuizSettings } from "../modals/QuizSetting";
export default function QuizQuestion({ eventId }: { eventId: string }) {
  const [isOpen, setOpen] = useState(false);

  function onOpen() {
    setOpen((prev) => !prev);
  }
  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full border-b p-4 flex items-center justify-between">
        <Button className="px-0 w-fit h-fit gap-x-2 text-sm">
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
            //  onClick={onClose}
            className="text-gray-50 bg-basePrimary gap-x-2 h-10 font-medium flex"
          >
            <PlusCircle size={20} />
            <p>Question</p>
          </Button>
          <Button
            //  onClick={onClose}
            className="text-basPrimaray hover:text-gray-50 bg-white hover:bg-basePrimary gap-x-2 h-10 font-medium flex"
          >
            <PlayBtn size={20} />
            <p>Present</p>
          </Button>
        </div>
      </div>
      <div className="w-full grid grid-cols-1  md:grid-cols-5 h-full pb-20">
        <ActiveQuestion />
        <div className="w-full md:col-span-3 border-l p-2 grid grid-cols-1 gap-3">
          {[...Array(4).map((_) => <QuestionCard key={_} />)]}
        </div>
      </div>
      {isOpen && <QuizSettings close={onOpen} />}
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
