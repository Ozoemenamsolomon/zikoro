"use client";

import { Button } from "@/components";
import { InteractionLayout } from "../../../_components";
import { ArrowBackOutline } from "styled-icons/evaicons-outline";
import { PlusCircle } from "styled-icons/bootstrap";
import { PlayBtn } from "styled-icons/bootstrap";
import { Settings } from "styled-icons/feather";
import Image from "next/image";
import { ActiveQuestion, QuestionCard, QuizSettings, AddQuestion } from "..";
import { useState, useEffect } from "react";
import { cn } from "@/lib";
import Link from "next/link";
import {
  useVerifyUserAccess,
  useCheckTeamMember,
  useUpdateQuiz,
} from "@/hooks";
import { useRouter } from "next/navigation";
import { TQuiz, TQuestion } from "@/types";
import { useGetQuiz } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

function EmptyState() {
  return (
    <div className="w-full flex flex-col gap-y-3 items-center justify-center h-[24rem]">
      <Image
        className="w-fit h-fit"
        src="/emptyquiz.png"
        alt="empty"
        width={250}
        height={350}
      />
      <p className="text-gray-500">No Question</p>
    </div>
  );
}

export default function QuizQuestion({
  quizId,
  eventId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, isLoading, getQuiz } = useGetQuiz({ quizId });
  const { updateQuiz } = useUpdateQuiz();
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const [openQuestionModal, setOpenQusetionModal] = useState(false);
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(
    null
  );

  const [height, setHeight] = useState<number>(0);
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

  function onToggle() {
    setOpenQusetionModal((prev) => !prev);
  }

  function questionHeight(num: number) {
    setHeight(num);
  }

  function setActiveQuestion(question: TQuestion) {
    setCurrentQuestion(question);
  }

  useEffect(() => {
    if (quiz && Array.isArray(quiz?.questions)) {
      setQuestions(quiz?.questions);
    }
  }, [quiz]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    }),
    useSensor(TouchSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // get position
  const getPosition = (id: string): number | undefined =>
    questions.findIndex((item) => item?.id === id);

  async function handleDrop(e: DragEndEvent) {
    if (!questions) return;
    const { active, over } = e;

    if (active?.id === over?.id) return;
    const originPos = getPosition(active?.id as string)!;
    const destPos = getPosition(over?.id as string)!;
    const updatedQuestion = arrayMove(questions, originPos, destPos);
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...quiz,
      questions: updatedQuestion,
    };
    setQuestions(updatedQuestion);
    //async
    await updateQuiz({ payload });
  }

  return (
    <InteractionLayout eventId={eventId}>
      {isLoading ? (
        <div className="w-full flex items-center justify-center h-[20rem]">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="w-full border-b p-4 flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="px-0 w-fit h-fit gap-x-2 text-sm"
            >
              <ArrowBackOutline size={18} />
              <p>Back</p>
            </Button>

            <input
              defaultValue={quiz?.coverTitle}
              placeholder="Quiz Title"
              className="outline-none border-0 p-2 bg-transparent text-gray-500"
            />
            {(isIdPresent || isOrganizer) && quizId ? (
              <div className="flex items-center gap-x-2">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1"
                >
                  <Settings size={22} />
                </button>
                <Button
                  onClick={onToggle}
                  className={cn(
                    "text-gray-50 bg-basePrimary gap-x-2 h-10 font-medium flex"
                  )}
                >
                  <PlusCircle size={20} />
                  <p>Question</p>
                </Button>
                <Link
                  href={
                    quiz?.interactionType === "poll"
                      ? `/poll/${eventId}/present/${quiz?.quizAlias}`
                      : `/quiz/${eventId}/present/${quiz?.quizAlias}`
                  }
                  className="text-basePrimary px-0 w-fit h-fit  hover:text-black gap-x-2 font-medium flex"
                >
                  <PlayBtn size={20} />
                </Link>
              </div>
            ) : (
              <p className="w-1 h-1"></p>
            )}
          </div>
          <div className="w-full grid grid-cols-1  lg:grid-cols-5 pb-20">
            {!quiz?.questions ||
            (Array.isArray(quiz?.questions) &&
              quiz?.questions?.length === 0) ? (
              <div className="w-full h-[300px] flex items-center justify-center col-span-full">
                <EmptyState />
              </div>
            ) : (
              <>
                <div className="w-full p-3 sm:p-4 lg:col-span-2">
                  {quiz && (
                    <ActiveQuestion
                      setActiveQuestion={setActiveQuestion}
                      quiz={quiz}
                      activeQuestion={currentQuestion}
                      setHeight={questionHeight}
                    />
                  )}
                </div>

                <div
                  style={{ maxHeight: height === 0 ? "initial" : height + 30 }}
                  className="w-full lg:col-span-3 border-l p-2  lg:overflow-y-auto space-y-3"
                >
                  {quiz?.questions && (
                    <>
                      <DndContext
                        collisionDetection={closestCorners}
                        onDragEnd={handleDrop}
                        sensors={sensors}
                      >
                        <SortableContext
                          items={questions}
                          strategy={verticalListSortingStrategy}
                        >
                          {Array.isArray(questions) &&
                            questions.map((question, index) => (
                              <QuestionCard
                                refetch={getQuiz}
                                key={question?.id}
                                id={index}
                                quiz={quiz}
                                setActiveQuestion={setActiveQuestion}
                                activeQuestion={currentQuestion}
                                question={question}
                              />
                            ))}
                        </SortableContext>
                      </DndContext>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {openQuestionModal && (
        <AddQuestion refetch={getQuiz} close={onToggle} quiz={quiz} />
      )}
      {isOpen && quiz && (
        <QuizSettings
          refetch={getQuiz}
          eventAlias={quiz?.eventAlias}
          close={onClose}
          quiz={quiz}
          interactionType={quiz?.interactionType || "quiz"}
        />
      )}
    </InteractionLayout>
  );
}
