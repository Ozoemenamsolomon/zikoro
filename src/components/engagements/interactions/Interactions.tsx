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
  FormCard,
  StaticInteractionModal,
  EventQaSetting,
} from "./_components";
import { useMemo, useState } from "react";
import Image from "next/image";
import { verifyingAccess } from "@/utils";
import { useRouter } from "next/navigation";
import { useGetData } from "@/hooks/services/request";
import { TEngagementFormQuestion, TEventQa } from "@/types/engagements";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { TOrganization } from "@/types";
import { EventQaCard } from "./_components/cards/EventQaCard";
export default function Interactions({ eventId }: { eventId: string }) {
  const [isOpen, setOpen] = useState(false);
  const [isOpenInteractionModal, setOpenInteractionModal] = useState(false);
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const [interactionType, setInteractionType] = useState("");
  const { organization } = useOrganizationStore();
  const { quizzes, isLoading, getQuizzes } = useGetQuizzes(eventId);
  const [isEventQa, setIsEventQa] = useState(false);
  const {
    data,
    isLoading: loading,
    getData,
  } = useGetData<TEngagementFormQuestion[]>(`/engagements/${eventId}/form`);
  const {
    data: eventQas,
    isLoading: loadingEventQas,
    getData: getEventQas,
  } = useGetData<TEventQa[]>(`/engagements/${eventId}/qa`);
  const router = useRouter();

  function onClose() {
    setOpen((prev) => !prev);
    setOpenInteractionModal(false);
  }

  function toggleInteractionModal() {
    setOpenInteractionModal((prev) => !prev);
  }

  const visibleQuizzes = useMemo(() => {
    if (!isIdPresent && !isOrganizer && Array.isArray(quizzes)) {
      const filteredQuizzes = quizzes?.filter(
        (quiz) => !quiz?.accessibility?.disable
      );

      return filteredQuizzes;
    } else {
      return quizzes;
    }
  }, [quizzes, isIdPresent, isOrganizer]);

  const visibleForm = useMemo(() => {
    if (!isIdPresent && !isOrganizer && Array.isArray(data)) {
      const filteredQuizzes = data?.filter((form) => !form?.isActive);

      return filteredQuizzes;
    } else {
      return data;
    }
  }, [data, isIdPresent, isOrganizer]);

  const visibleQas = useMemo(() => {
    if (!isIdPresent && !isOrganizer && Array.isArray(eventQas)) {
      const filteredQas = eventQas?.filter((qa) => !qa?.accessibility?.disable);

      return filteredQas;
    } else {
      return eventQas;
    }
  }, [eventQas, isIdPresent, isOrganizer]);

  const interactioDataLength = useMemo(() => {
    if (visibleForm && visibleQuizzes && visibleQas) {
      return [...visibleForm, ...visibleQuizzes, ...visibleQas].length;
    } else {
      return 0;
    }
  }, [visibleForm, visibleQuizzes, visibleQas]);

  //console.log({ visibleQuizzes, quizzes, isIdPresent, isOrganizer });
  function toggleQa() {
    setIsEventQa((p) => !p);
    setOpenInteractionModal(false);
  }
  function toggleQuiz() {
    // const liveQuizCount = quizzes?.filter(
    //   ({ accessibility }) => accessibility?.live
    // )?.length;
    // if (liveQuizCount >= 3) {
    //   verifyingAccess({
    //     textContent:
    //       "You have reached the maximum limit of 3 Live Quiz.",
    //     isNotUpgrading: true,
    //   });
    //   return;
    // }
    setInteractionType("quiz");
    onClose();
  }

  function togglePoll() {
    // const pollCount = quizzes?.filter(
    //   ({ interactionType }) => interactionType === "poll"
    // )?.length;
    // if (pollCount >= 3) {
    //   verifyingAccess({
    //     textContent: "You have reached the maximum limit of 3 polls. ",
    //     isNotUpgrading: true,
    //   });
    //   return;
    // }
    setInteractionType("poll");
    onClose();
  }

  function goToForm() {
    router.push(`/event/${eventId}/engagements/interactions/form/create`);
  }

  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
        <div className="flex items-end w-full justify-end p-4">
          {!isLoading && !loading && interactioDataLength > 0 && (
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
          {!isLoading && !loading && interactioDataLength === 0 && (
            <div className="w-full col-span-full flex items-center justify-center h-[350px]">
              <EmptyState
                isNotAttendee={isIdPresent || isOrganizer}
                toggleInteractionModal={toggleInteractionModal}
                organization={organization}
              />
            </div>
          )}
          {!isLoading &&
            !loading &&
            !loadingEventQas &&
            Array.isArray(visibleQuizzes) &&
            visibleQuizzes.map((quiz, index) => (
              <InteractionCard
                refetch={getQuizzes}
                isNotAttendee={isIdPresent || isOrganizer}
                key={quiz.quizAlias}
                quiz={quiz}
              />
            ))}
          {!isLoading &&
            !loading &&
            !loadingEventQas &&
            Array.isArray(visibleForm) &&
            visibleForm.map((form, index) => (
              <FormCard
                refetch={getData}
                isNotAttendee={isIdPresent || isOrganizer}
                key={form.formAlias}
                form={form}
              />
            ))}
          {!isLoading &&
            !loading &&
            !loadingEventQas &&
            Array.isArray(visibleQas) &&
            visibleQas.map((qa, index) => (
              <EventQaCard
                refetch={getEventQas}
                isNotAttendee={isIdPresent || isOrganizer}
                key={qa.QandAAlias}
                eventQa={qa}
              />
            ))}
        </div>
      </div>
      {isOpen && (
        <QuizSettings
          refetch={getQuizzes}
          eventAlias={eventId}
          close={onClose}
          interactionType={interactionType}
        />
      )}
      {isOpenInteractionModal && (
        <InteractionsSelectionModal
          close={toggleInteractionModal}
          toggleQuiz={toggleQuiz}
          togglePoll={togglePoll}
          goToForm={goToForm}
          toggleQa={toggleQa}
        />
      )}
      {isEventQa && (
        <EventQaSetting
          eventAlias={eventId}
          close={toggleQa}
          refetch={getEventQas}
        />
      )}
    </InteractionLayout>
  );
}

function EmptyState({
  toggleInteractionModal,
  isNotAttendee,
  organization,
}: {
  toggleInteractionModal: () => void;
  isNotAttendee: boolean;
  organization: TOrganization | null;
}) {
  return (
    <div className="w-full flex flex-col gap-y-6 items-center justify-center h-[24rem]">
      <Image
        className="w-fit h-fit"
        src="/chatbubble.png"
        alt="empty"
        width={150}
        height={150}
      />
      <h2 className="text-basePrimary font-semibold text-base sm:text-2xl">
        {organization?.subscriptionPlan?.toLowerCase() === "free"
          ? "Features are only available for a paid plan"
          : !isNotAttendee
          ? "No Interaction Yet"
          : "You have not created any interaction yet."}
      </h2>
      {isNotAttendee && (
        <p className="text-gray-500 text-xs sm:text-sm">
          Let's go, create your first interaction
        </p>
      )}

      {organization?.subscriptionPlan.toLowerCase() !== "free" ? (
        <Button
          onClick={toggleInteractionModal}
          className={cn(
            "bg-basePrimary text-white hidden rounded-lg",
            isNotAttendee && "flex"
          )}
        >
          <p> Create Interaction 🎊</p>
        </Button>
      ) : (
        <StaticInteractionModal />
      )}
    </div>
  );
}
