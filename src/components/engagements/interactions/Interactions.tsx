"use client";

import { InteractionLayout } from "../_components";
import { Button } from "@/components";
import {
  useVerifyUserAccess,
  useCheckTeamMember,
  useGetQuizzes,
} from "@/hooks";
import { PlusCircle } from "styled-icons/bootstrap";
import { cn } from "@/lib";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  InteractionCard,
  InteractionsSelectionModal,
  QuizSettings,
} from "./_components";
import { useMemo, useState } from "react";
import Image from "next/image";
export default function Interactions({ eventId }: { eventId: string }) {
  const [isOpen, setOpen] = useState(false);
  const [isOpenInteractionModal, setOpenInteractionModal] = useState(false);
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { quizzes, isLoading, getQuizzes } = useGetQuizzes(eventId);

  function onClose() {
    setOpen((prev) => !prev);
    setOpenInteractionModal(false);
  }

  function toggleInteractionModal() {
    setOpenInteractionModal((prev) => !prev);
  }

  const visibleQuizzes = useMemo(() => {
    if (!isIdPresent && !isOrganizer) {
      const filteredQuizzes = quizzes?.filter(
        (quiz) => !quiz?.accessibility?.disable
      );

      return filteredQuizzes;
    } else {
      return quizzes;
    }
  }, [quizzes, isIdPresent, isOrganizer]);

  //console.log({ visibleQuizzes, quizzes, isIdPresent, isOrganizer });

  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full">
        <div className="flex items-end w-full justify-end p-4">
          {Array.isArray(visibleQuizzes) && visibleQuizzes?.length > 0 && (
            <Button
              onClick={toggleInteractionModal}
              className={cn(
                "text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium hidden",
                (isIdPresent || isOrganizer) && "flex"
              )}
            >
              <PlusCircle size={22} />
              <p>Interactions</p>
            </Button>
          )}
        </div>

        <div className="w-full grid pb-20 mt-3 px-4 sm:mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          {isLoading && (
            <div className="w-full col-span-full flex items-center justify-center h-[350px]">
              <LoaderAlt size={30} className="animate-spin" />
            </div>
          )}
          {!isLoading &&
            Array.isArray(visibleQuizzes) &&
            visibleQuizzes?.length === 0 && (
              <div className="w-full col-span-full flex items-center justify-center h-[350px]">
                <EmptyState
                  isNotAttendee={isIdPresent || isOrganizer}
                  toggleInteractionModal={toggleInteractionModal}
                />
              </div>
            )}
          {!isLoading &&
            Array.isArray(visibleQuizzes) &&
            visibleQuizzes.map((quiz, index) => (
              <InteractionCard
                refetch={getQuizzes}
                isNotAttendee={isIdPresent || isOrganizer}
                key={quiz.quizAlias}
                quiz={quiz}
              />
            ))}
        </div>
      </div>
      {isOpen && (
        <QuizSettings
          refetch={getQuizzes}
          eventAlias={eventId}
          close={onClose}
        />
      )}
      {isOpenInteractionModal && (
        <InteractionsSelectionModal
          close={toggleInteractionModal}
          toggleQuiz={onClose}
        />
      )}
    </InteractionLayout>
  );
}

function EmptyState({
  toggleInteractionModal,
  isNotAttendee,
}: {
  toggleInteractionModal: () => void;
  isNotAttendee: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-y-3 items-center justify-center h-[24rem]">
      <Image
        className="w-fit h-fit"
        src="/chatbubble.png"
        alt="empty"
        width={150}
        height={150}
      />
      <h2 className="text-basePrimary font-semibold text-base sm:text-2xl">
        {!isNotAttendee ? "No Interaction Yet":"You have not created any interaction yet."}
      </h2>
      {isNotAttendee && <p className="text-gray-500 text-xs sm:text-sm">
        Let's go, create your first interaction
      </p>}

      <Button
        onClick={toggleInteractionModal}
        className={cn(
          "bg-basePrimary text-white hidden rounded-lg",
          isNotAttendee && "flex"
        )}
      >
        <p> Create Interaction 🎊</p>
      </Button>
    </div>
  );
}
