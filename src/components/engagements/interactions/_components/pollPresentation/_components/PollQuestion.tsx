"use client";

import { TQuiz, TQuestion, TAnswer } from "@/types";
import { AvatarFullConfig } from "react-nice-avatar";
import { cn } from "@/lib";
import { useState, useEffect, useMemo } from "react";
import { Maximize2 } from "styled-icons/feather";
import { useUpdateQuiz, useCreateAnswer } from "@/hooks";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "@/components/custom_ui/Button";
import { ArrowBackOutline } from "styled-icons/evaicons-outline";
import Image from "next/image";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { PollOption } from "./PollOption";

type ChosenAnswerStatus = {
  isCorrect: boolean;
  correctOption: number;
};

type TQuestionProps = {
  isLeftBox: boolean;
  pollParticipantId: string;
  toggleLeftBox: () => void;

  poll: TQuiz<TQuestion[]>;

  attendeeDetail: {
    attendeeId: string | null;
    attendeeName: string;
    avatar: Required<AvatarFullConfig>;
    email: string;
    phone: string;
  };
  isOrganizer: boolean;
  isIdPresent: boolean;
  answer: TAnswer[];
  quizAnswer: TAnswer[];
  refetchQuiz: () => Promise<any>;
  getAnswer: (questionId: string) => Promise<any>;
  refetchQuizAnswers: (id: number) => Promise<any>;
  onOpenScoreSheet: () => void;
  goBack: () => void;
  updateQuiz: (q: TQuiz<TQuestion[]>) => void;
  updateQuizResult: (q: TQuiz<TQuestion[]>) => void;
};

export function PollQuestion({
  isLeftBox,
  attendeeDetail,
  isOrganizer,
  isIdPresent,
  poll,
  refetchQuiz,
  updateQuiz,
  getAnswer,
  updateQuizResult,
  pollParticipantId,
  onOpenScoreSheet,
  refetchQuizAnswers,
  goBack,
  toggleLeftBox,
  answer,
}: TQuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [millisecondsLeft, setMillisecondsLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [transiting, setShowTransiting] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const { updateQuiz: updatingQuiz, isLoading: isUpdating } = useUpdateQuiz();
  const { createAnswer } = useCreateAnswer();
  const [showAnswerMetric, setShowAnswerMetric] = useState(false);

  useEffect(() => {
    (async () => {
      if (poll && poll?.accessibility?.live && (isIdPresent || isOrganizer)) {
        const { liveMode, ...restData } = poll;
        const { startingAt } = liveMode;

        const payload: Partial<TQuiz<TQuestion[]>> = {
          ...restData,
          liveMode: {
            startingAt,
            questionIndex: currentQuestionIndex,

            current: poll?.questions[currentQuestionIndex],
            isTransitioning: poll?.accessibility?.countdown,
          },
        };

        await updatingQuiz({ payload });
        await refetchQuiz();
        setCurrentQuestion(poll.questions[currentQuestionIndex]);

        // console.log("admin 1");
      }
      // console.log("not suppose to be here")
    })();
  }, []);

  useEffect(() => {
    if (poll && !poll?.accessibility?.live) {
      setCurrentQuestion(poll.questions[currentQuestionIndex]);
    }
  }, [poll, currentQuestionIndex]);

  // isOptionSelected
  useEffect(() => {
    (async () => {
      if (poll && poll?.accessibility?.live && (isOrganizer || isIdPresent)) {
        if (poll?.liveMode?.isOptionSelected && currentQuestion) {
          await getAnswer(currentQuestion?.id);
        }
      }
    })();
  }, [poll]);

  const timing = useMemo(() => {
    const seconds = Math.floor(
      (millisecondsLeft % Number(currentQuestion?.duration)) / 1000
    );
    // console.log(minutes, seconds, millisecondsLeft)

    return seconds;
  }, [millisecondsLeft, currentQuestion]);
  useEffect(() => {
    if (Number(currentQuestion?.duration) > 0) {
      setMillisecondsLeft(Number(currentQuestion?.duration));
    }
  }, [currentQuestion?.id]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setMillisecondsLeft((prevMilliseconds) => {
        if (prevMilliseconds <= 1000) {
          //  setShowAnswerMetric(true);
          clearInterval(countdownInterval);
          return 0;
        }

        return prevMilliseconds - 1000;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [millisecondsLeft]);

  useEffect(() => {
    if (currentQuestion?.id) {
      getAnswer(currentQuestion?.id);
    }
  }, [currentQuestion?.id]);

  // admin
  useEffect(() => {
    if (poll && poll?.accessibility?.live && (isIdPresent || isOrganizer)) {
      setShowTransiting(poll?.accessibility?.countdown);
      // console.log("admin");
    }
  }, []);

  async function nextQuestion() {
    if (poll?.accessibility?.live) {
      const { questions, liveMode, ...restData } = poll;

      const payload: Partial<TQuiz<TQuestion[]>> = {
        ...restData,

        liveMode: {
          startingAt: liveMode?.startingAt,
          questionIndex: currentQuestionIndex + 1,
          current: poll?.questions[currentQuestionIndex + 1],
          isTransitioning: poll?.accessibility?.countdown,
          answerStatus: null,
          explanation: false,
        },
      };
      if (isIdPresent || isOrganizer) {
        setCurrentQuestion(poll?.questions[currentQuestionIndex + 1]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowTransiting(poll?.accessibility?.countdown);
      }

      await updatingQuiz({ payload });
      refetchQuiz();
    } else {
      setShowAnswerMetric(false);
      setShowExplanation(false);

      //if (currentQuestionIndex < quiz.questions.length) {
      // }
      if (poll?.accessibility?.countdown) {
        setShowTransiting(poll?.accessibility?.countdown);
        setTimeout(() => {
          setShowTransiting(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 6000);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  }

  //   async function showMetric() {
  //     if (!poll?.accessibility?.live) {
  //       setShowAnswerMetric(true);
  //     } else {
  //      // if (timing > 0) return;
  //       const { questions, liveMode, ...restData } = poll;
  //       const { startingAt } = liveMode;
  //       const payload: Partial<TQuiz<TQuestion[]>> = {
  //         ...restData,
  //         liveMode: {
  //           startingAt,
  //           isShowAnswerMetric: true,
  //           isOptionSelected: true,
  //         },
  //       };

  //       await updatingQuiz({ payload });
  //       setShowAnswerMetric(true);
  //       refetchQuiz();
  //     }
  //   }

  const optionLetter = ["A", "B", "C", "D"];

  // console.log("answer", answer)
  async function selectOption(id: string) {
    setLoading(true);
    if (currentQuestion) {
      const updatedOptions = currentQuestion?.options?.map((item) => {
        return {
          ...item,
          isAnswer: id,
        };
      });
      setCurrentQuestion({ ...currentQuestion, options: updatedOptions });

      // user score: (correct 1, wrong 0), dependent on time

      //   // index of current Question
      //   const index = poll?.questions?.findIndex(
      //     (item) => item?.id === currentQuestion?.id
      //   );

      // update quiz state
      const updatedQuiz: TQuiz<TQuestion[]> = {
        ...poll,
        questions: poll?.questions?.map((item) => {
          if (item?.id === currentQuestion?.id) {
            return {
              ...item,
              options: updatedOptions,
            };
          }
          return item;
        }),
      };

      // udpate chosen option state, if quiz is not live
      if (!poll?.accessibility?.live) {
        updateQuiz(updatedQuiz);
      }
      updateQuizResult(updatedQuiz);

      const payload: Partial<TAnswer> = {
        ...attendeeDetail,
        quizId: poll?.id,
        eventAlias: poll?.eventAlias,
        questionId: currentQuestion?.id,
        quizParticipantId: pollParticipantId,
        quizAlias: poll?.quizAlias,
        maxPoints: Number(currentQuestion?.points),
        maxDuration: Number(currentQuestion?.duration),
        selectedOptionId: { optionId: id },
      };
      setIsOptionSelected(true);
      await createAnswer({ payload });

      if (poll?.accessibility?.live) {
        const { questions, liveMode, ...restData } = poll;
        const payload: Partial<TQuiz<TQuestion[]>> = {
          ...restData,
          liveMode: {
            startingAt: liveMode?.startingAt,
            isOptionSelected: true,
          },
        };

        await updatingQuiz({ payload });
        refetchQuiz();
      }

      await getAnswer(currentQuestion?.id);
      refetchQuizAnswers(poll?.id);
      setLoading(false);
      setShowAnswerMetric(true);
    }
  }

  function toggleExplanationVisibility() {
    setShowExplanation((prev) => !prev);
  }

  // quiz result
  async function openQuizResult() {
    onOpenScoreSheet();
    if (poll?.accessibility?.live) {
      const { questions, liveMode, ...restData } = poll;
      const payload: Partial<TQuiz<TQuestion[]>> = {
        ...restData,

        liveMode: {
          isEnded: true,
          startingAt: liveMode?.startingAt,
        },
      };

      await updatingQuiz({ payload });
      refetchQuiz();
      onOpenScoreSheet();
    }
  }

  async function onNextBtnClick() {
    setIsOptionSelected(false);
    if (
      showAnswerMetric &&
      currentQuestionIndex >= poll?.questions?.length - 1
    ) {
      await openQuizResult();
    } else if (
      showAnswerMetric &&
      currentQuestionIndex < poll?.questions?.length - 1
    ) {
      nextQuestion();
      setShowAnswerMetric(false);
    } else if (
      !poll.accessibility?.review &&
      currentQuestionIndex < poll?.questions?.length - 1
    ) {
      nextQuestion();
      setShowAnswerMetric(false);
    } else if (
      !poll.accessibility?.review &&
      currentQuestionIndex >= poll?.questions?.length - 1
    ) {
      await openQuizResult();
    } else {
      // showMetric();
    }
  }

  return (
    <div
      className={cn(
        "w-full h-[90vh]  bg-white relative    border-x border-y  col-span-7",
        isLeftBox && (isIdPresent || isOrganizer) && "col-span-7",
        !isLeftBox && "col-span-full rounded-xl max-w-4xl mx-auto",
        !isIdPresent &&
          !isOrganizer &&
          "col-span-full rounded-xl max-w-3xl mx-auto",
        isLeftBox && "rounded-r-xl"
      )}
    >
      <div className="w-full overflow-y-auto no-scrollbar px-6 pt-12 space-y-3  h-[90%] pb-52 ">
        <>
          {transiting ? (
            <Transition setShowTransiting={setShowTransiting} />
          ) : (
            <>
              <div className=" gap-3 pb-2 w-full flex items-end justify-between">
                <Button
                  onClick={goBack}
                  className={cn(
                    "gap-x-1 self-start w-fit h-fit px-2 invisible",
                    (isIdPresent || isOrganizer) && "visible"
                  )}
                >
                  <ArrowBackOutline size={20} />
                  <p className="text-sm">Exit Poll</p>
                </Button>
                <p className="text-xs sm:text-mobile text-gray-500">{`${
                  currentQuestionIndex + 1
                }/${poll?.questions?.length} Questions`}</p>
              </div>

              <div className="flex items-center flex-col justify-center w-full gap-3">
                <div
                  className="innerhtml w-full"
                  dangerouslySetInnerHTML={{
                    __html: currentQuestion?.question ?? "",
                  }}
                />

                <div className="w-full flex items-center justify-between">
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center gap-y-2",
                      !currentQuestion?.duration && "invisible"
                    )}
                  >
                    <div className="w-[70px] h-[70px]">
                      <CircularProgressbar
                        styles={buildStyles({
                          pathColor: "#991b1b",
                          trailColor: "#ffffff",
                          textColor: "black",
                          textSize: "60px",
                        })}
                        strokeWidth={3}
                        minValue={0}
                        maxValue={Number(currentQuestion?.duration) / 1000}
                        value={timing}
                        text={`${timing === 0 ? "" : timing}`}
                      />
                    </div>
                  </div>
                  {currentQuestion?.questionImage ? (
                    <Image
                      className="w-52 sm:w-72 rounded-md h-48 sm:h-52 object-cover"
                      alt="quiz"
                      src={currentQuestion?.questionImage}
                      width={400}
                      height={400}
                    />
                  ) : (
                    <div className="w-1 h-1"></div>
                  )}
                  <p className="flex flex-col justify-center items-center gap-y-2">
                    <span className="text-[40px] ">{answer?.length || 0}</span>
                    <span>{` Answered`}</span>
                  </p>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion?.options.map((option, index, arr) => (
                  <PollOption
                    key={index}
                    selectOption={selectOption}
                    option={option}
                    answer={answer}
                    isDisabled={arr?.some(
                      ({ isAnswer }) => isAnswer?.length > 0
                    )}
                    showAnswerMetric={showAnswerMetric}
                    isOrganizer={isOrganizer}
                    isIdPresent={isIdPresent}
                    optionIndex={optionLetter[index]}
                    poll={poll}
                  />
                ))}
              </div>

              <div className="w-full rounded-b-xl flex flex-col items-center justify-center mx-auto absolute inset-x-0 bottom-0 gap-y-3  bg-white py-2">
                {poll?.accessibility?.live &&
                !isIdPresent &&
                !isOrganizer ? null : (
                  <Button
                    disabled={loading || isUpdating} //
                    onClick={onNextBtnClick}
                    className="text-gray-50  mx-auto w-[180px] my-4 bg-basePrimary gap-x-2 h-11 font-medium flex"
                  >
                    {isUpdating && (
                      <LoaderAlt size={22} className="animate-spin" />
                    )}
                    <p>Next </p>
                  </Button>
                )}
                {poll.branding.poweredBy && (
                  <p className="text-center bg-white text-sm w-full  p-2 ">
                    Powered By Zikoro
                  </p>
                )}

                <Button
                  onClick={toggleLeftBox}
                  className={cn(
                    "absolute bottom-1 left-1",
                    isLeftBox && "hidden"
                  )}
                >
                  <Maximize2 size={20} />
                </Button>
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
}

function Transition({
  setShowTransiting,
}: {
  setShowTransiting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prevMilliseconds) => {
        if (prevMilliseconds <= 1) {
          setShowTransiting(false);
          clearInterval(countdownInterval);
          return 0;
        }
        return prevMilliseconds - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [secondsLeft]);

  return (
    <div className="w-full h-full flex items-center flex-col gap-y-3 justify-center">
      <div className="w-[170px] h-[170px]">
        <CircularProgressbar
          styles={buildStyles({
            pathColor: "#001fcc",
            trailColor: "#e5e7eb",
            textColor: "black",
            textSize: "50px",
          })}
          strokeWidth={5}
          minValue={0}
          maxValue={5}
          value={secondsLeft}
          text={`${secondsLeft === 0 ? "GO" : secondsLeft}`}
        />
      </div>
      <p className="font-semibold text-base sm:text-xl bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text">
        Prepare for next question
      </p>
    </div>
  );
}
