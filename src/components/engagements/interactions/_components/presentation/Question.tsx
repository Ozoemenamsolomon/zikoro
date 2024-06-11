"use client";

import Image from "next/image";
import { Option } from "..";
import { Button } from "@/components";
import { Maximize2 } from "@styled-icons/feather/Maximize2";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { useCreateAnswer, useUpdateQuiz, getCookie } from "@/hooks";
import {
  TQuiz,
  TRefinedQuestion,
  TAnswer,
  TQuestion,
  TConnectedUser,
} from "@/types";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { LoaderAlt } from "styled-icons/boxicons-regular";

type ChosenAnswerStatus = {
  isCorrect: boolean;
  correctOption: number;
};
export function Qusetion({
  isRightBox,
  isLeftBox,
  toggleRightBox,
  toggleLeftBox,
  quiz,
  updateQuiz,
  attendeeDetail,
  isOrganizer,
  isIdPresent,
  quizParticipantId,
  answer,
  getAnswer,
  refetchQuizAnswers,
  quizAnswer,
  refetchQuiz,
  onOpenScoreSheet,
  updateQuizResult,
}: {
  isRightBox: boolean;
  isLeftBox: boolean;
  quizParticipantId: string;
  toggleLeftBox: () => void;
  toggleRightBox: () => void;
  quiz: TQuiz<TRefinedQuestion[]>;
  updateQuiz: (q: TQuiz<TRefinedQuestion[]>) => void;
  attendeeDetail: { attendeeId: string | null; attendeeName: string };
  isOrganizer: boolean;
  isIdPresent: boolean;
  answer: TAnswer[];
  quizAnswer: TAnswer[];
  refetchQuiz: () => Promise<any>;
  getAnswer: (questionId: string) => Promise<any>;
  refetchQuizAnswers: (id: number) => Promise<any>;
  onOpenScoreSheet: () => void;
  updateQuizResult: (q: TQuiz<TRefinedQuestion[]>) => void;
}) {
  const [currentQuestion, setCurrentQuestion] =
    useState<TRefinedQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [millisecondsLeft, setMillisecondsLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnswerMetric, setShowAnswerMetric] = useState(false);
  const [transiting, setShowTransiting] = useState(false);
  const { updateQuiz: updatingQuiz, isLoading: isUpdating } = useUpdateQuiz();
  const player = getCookie<TConnectedUser>("player");
  const [chosenAnswerStatus, setChosenAnswerStatus] =
    useState<ChosenAnswerStatus | null>(null);
  const { createAnswer } = useCreateAnswer();

  useEffect(() => {
    (async () => {
      if (quiz && quiz?.accessibility?.live && (isIdPresent || isOrganizer)) {
        const { liveMode, ...restData } = quiz;
        const { startingAt } = liveMode;

        const payload: Partial<TQuiz<TQuestion[]>> = {
          ...restData,
          liveMode: {
            startingAt,
            questionIndex: currentQuestionIndex,
            questions: quiz?.questions?.map((item) => {
              return {
                ...item,
                options: item?.options?.map(({ isCorrect, ...rest }) => rest),
              };
            }),
            current: quiz?.questions[currentQuestionIndex],
            isTransitioning: quiz?.accessibility?.countdown,
          },
        };

        await updatingQuiz({ payload });
        await refetchQuiz();
        setCurrentQuestion(quiz.questions[currentQuestionIndex]);

        // console.log("admin 1");
      }
      // console.log("not suppose to be here")
    })();
  }, []);

  useEffect(() => {
    if (quiz && !quiz?.accessibility?.live) {
      setCurrentQuestion(quiz.questions[currentQuestionIndex]);
    }
  }, [quiz, currentQuestionIndex]);

  //attendee
  useEffect(() => {
    if (quiz && quiz?.accessibility?.live && !isOrganizer && !isIdPresent) {
      if (quiz?.liveMode?.current) {
        setCurrentQuestion(quiz?.liveMode?.current);
        setShowAnswerMetric(false);
      }
      if (typeof quiz?.liveMode?.questionIndex === "number") {
        setCurrentQuestionIndex(quiz?.liveMode?.questionIndex);
      }
      if (quiz?.liveMode?.isTransitioning) {
        setShowTransiting(quiz?.liveMode?.isTransitioning);
      }

      if (typeof quiz?.liveMode?.isShowAnswerMetric === "boolean") {
        setShowAnswerMetric(quiz?.liveMode?.isShowAnswerMetric);
      }
      if (quiz?.liveMode?.answerStatus === null) {
        setChosenAnswerStatus(quiz?.liveMode?.answerStatus);
      }
      if (typeof quiz?.liveMode?.explanation === "boolean") {
        setShowExplanation(quiz?.liveMode?.explanation);
      }
    }
  }, [quiz]);

  // isOptionSelected
  useEffect(() => {
    (async () => {
      if (quiz && quiz?.accessibility?.live && (isOrganizer || isIdPresent)) {
        if (quiz?.liveMode?.isOptionSelected && currentQuestion) {
          await getAnswer(currentQuestion?.id);
        }
      }
    })();
  }, [quiz]);
  // console.log("yu", quiz?.liveMode);

  const timing = useMemo(() => {
    const minutes = Math.floor(
      millisecondsLeft / Number(currentQuestion?.duration)
    );
    const seconds = Math.floor(
      (millisecondsLeft % Number(currentQuestion?.duration)) / 1000
    );
    // console.log(minutes, seconds, millisecondsLeft)

    return seconds;
  }, [millisecondsLeft, currentQuestion]);

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

  // goto next question when time exceeds limit
  /**
   useEffect(() => {
    if (millisecondsLeft <= 0) {
      // nextQuestion();
     console.log(millisecondsLeft)
      setShowAnswerMetric(true);
    }
  }, [millisecondsLeft]);
 */

  useEffect(() => {
    if (currentQuestion?.duration) {
      setMillisecondsLeft(Number(currentQuestion?.duration));
    }
  }, [currentQuestion?.duration]);
  useEffect(() => {
    if (currentQuestion?.id) {
      getAnswer(currentQuestion?.id);
    }
  }, [currentQuestion?.id]);

  async function nextQuestion() {
    if (quiz?.accessibility?.live) {
      const { questions, ...restData } = quiz;

      const payload: Partial<TQuiz<TQuestion[]>> = {
        ...restData,
        questions: quiz?.questions?.map((item) => {
          return {
            ...item,
            options: item?.options?.map(({ isCorrect, ...rest }) => rest),
          };
        }),
        liveMode: {
          questionIndex: currentQuestionIndex + 1,
          current: quiz?.questions[currentQuestionIndex + 1],
          isTransitioning: quiz?.accessibility?.countdown,
          answerStatus: null,
          explanation: false,
        },
      };
      if (isIdPresent || isOrganizer) {
        setCurrentQuestion(quiz?.questions[currentQuestionIndex + 1]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowTransiting(quiz?.accessibility?.countdown);
      }

      await updatingQuiz({ payload });
      refetchQuiz();
    } else {
      setShowAnswerMetric(false);
      setShowExplanation(false);
      setChosenAnswerStatus(null);
      //if (currentQuestionIndex < quiz.questions.length) {
      // }
      setShowTransiting(true);
      setTimeout(() => {
        setShowTransiting(false);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 6000);
    }
  }

  // admin
  useEffect(() => {
    if (quiz && quiz?.accessibility?.live && (isIdPresent || isOrganizer)) {
      setShowTransiting(quiz?.accessibility?.countdown);
      // console.log("admin");
    }
  }, []);

  async function showMetric() {
    if (!quiz?.accessibility?.live) {
      setShowAnswerMetric(true);
    } else {
      if (timing > 0) return;
      const { questions, liveMode, ...restData } = quiz;
      const { startingAt } = liveMode;
      const payload: Partial<TQuiz<TQuestion[]>> = {
        ...restData,
        questions: quiz?.questions?.map((item) => {
          return {
            ...item,
            options: item?.options?.map(({ isCorrect, ...rest }) => rest),
          };
        }),
        liveMode: {
          startingAt,
          isShowAnswerMetric: true,
        },
      };

      await updatingQuiz({ payload });
      setShowAnswerMetric(true);
      refetchQuiz();
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  /**
    // update question time limit
    if (millisecondsLeft > 0) {
      const updatedQuiz: TQuiz<TRefinedQuestion[]> = {
        ...quiz,
        questions: quiz?.questions?.map((item) => {
          if (item?.id === currentQuestion?.id) {
            return {
              ...item,
              duration: String(millisecondsLeft),
            };
          }
          return item;
        }),
      };
      updateQuiz(updatedQuiz);
    }
   */

  const optionLetter = ["A", "B", "C", "D"];

  // console.log("answer", answer)
  async function selectOption(id: string) {
    /**
     if (!attendeeDetail?.attendeeId) {
      toast.error("Only attendee can answer the question");
      return;
    }
    */
    setLoading(true);
    if (currentQuestion) {
      const updatedOptions = currentQuestion?.options?.map((item) => {
        if (item?.optionId === id) {
          return {
            ...item,
            isCorrect: item?.isAnswer === id,
          };
        }
        return item;
      });
      setCurrentQuestion({ ...currentQuestion, options: updatedOptions });

      // user score: (correct 1, wrong 0), dependent on time

      // checking if the correct answer is chosen
      const isCorrectAnswer = currentQuestion?.options?.some(
        (item) => item?.isAnswer === id
      );

      // index of current Question
      const index = quiz?.questions?.findIndex(
        (item) => item?.id === currentQuestion?.id
      );

      // find the index of the correct option
      const correctAnswerIndex = currentQuestion?.options?.findIndex(
        (opt) => opt.isAnswer !== ""
      );
      setChosenAnswerStatus({
        isCorrect: isCorrectAnswer,
        correctOption: correctAnswerIndex,
      });
      //
      const score = isCorrectAnswer ? 1 : 0;
      // calculate the user point
      const attendeePoints =
        ((score * millisecondsLeft) / Number(currentQuestion?.duration)) *
        Number(currentQuestion?.points);
      //console.log(maxPoints)

      // update quiz state
      const updatedQuiz: TQuiz<TRefinedQuestion[]> = {
        ...quiz,
        questions: quiz?.questions?.map((item) => {
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
      if (!quiz?.accessibility?.live) {
        updateQuiz(updatedQuiz);
      }
      updateQuizResult(updatedQuiz);

      // setCurrentQuestion(quiz?.questions[index])

      const payload: Partial<TAnswer> = {
        ...attendeeDetail,
        quizId: quiz?.id,
        questionId: currentQuestion?.id,
        quizParticipantId: quiz?.accessibility?.live
          ? player?.userId
          : quizParticipantId,
        attendeePoints,
        answerDuration: millisecondsLeft,
        quizAlias: quiz?.quizAlias,
        maxPoints: Number(currentQuestion?.points),
        maxDuration: Number(currentQuestion?.duration),
        selectedOptionId: { optionId: id },
        correctOptionId: {
          optionId:
            currentQuestion?.options?.find(({ isAnswer }) => isAnswer === id)
              ?.optionId || "",
        },
      };

      await createAnswer({ payload });

      if (quiz?.accessibility?.live) {
        const { questions, liveMode, ...restData } = quiz;
        const payload: Partial<TQuiz<TQuestion[]>> = {
          ...restData,
          questions: quiz?.questions?.map((item) => {
            return {
              ...item,
              options: item?.options?.map(({ isCorrect, ...rest }) => rest),
            };
          }),
          liveMode: {
            isOptionSelected: true,
          },
        };

        await updatingQuiz({ payload });
        refetchQuiz();
      }

      await getAnswer(currentQuestion?.id);
      refetchQuizAnswers(quiz?.id);
      setLoading(false);
    }
  }

  function toggleExplanationVisibility() {
    setShowExplanation((prev) => !prev);
  }

  async function onNextBtnClick() {
    if (
      showAnswerMetric &&
      currentQuestionIndex >= quiz?.questions?.length - 1
    ) {
      onOpenScoreSheet();
      if (quiz?.accessibility?.live) {
        const { questions, liveMode, ...restData } = quiz;
        const payload: Partial<TQuiz<TQuestion[]>> = {
          ...restData,
          questions: quiz?.questions?.map((item) => {
            return {
              ...item,
              options: item?.options?.map(({ isCorrect, ...rest }) => rest),
            };
          }),
          liveMode: {
            isEnded: true,
          },
        };

        await updatingQuiz({ payload });
        refetchQuiz();
        onOpenScoreSheet();
      }
    } else if (
      showAnswerMetric &&
      currentQuestionIndex < quiz?.questions?.length - 1
    ) {
      nextQuestion();
      setShowAnswerMetric(false);
    } else {
      showMetric();
    }
  }

  // console.log("yeahssss", showAnswerMetric);

  return (
    <div
      className={cn(
        "w-full h-[90vh] overflow-y-auto bg-white relative  px-6 pt-12  border-x  space-y-3 col-span-7",
        isLeftBox && isRightBox && (isIdPresent || isOrganizer) && "col-span-5",
        !isLeftBox && !isRightBox && "col-span-full ",
        !isIdPresent && !isOrganizer && "col-span-full max-w-3xl mx-auto"
      )}
    >
      <>
        {transiting ? (
          <Transition setShowTransiting={setShowTransiting} />
        ) : (
          <>
            <Button
              onClick={toggleRightBox}
              className={cn("absolute right-2 top-2", isRightBox && "hidden")}
            >
              <Maximize2 size={20} />
            </Button>
            <Button
              onClick={toggleLeftBox}
              className={cn("absolute bottom-1 left-1", isLeftBox && "hidden")}
            >
              <Maximize2 size={20} />
            </Button>
            <div className=" gap-3 pb-2 w-full flex items-end justify-between">
              <Button
                //onClick={goBack}
                className="gap-x-1 self-start w-fit h-fit px-2"
              >
                <ArrowBackOutline size={20} />
                <p className="text-sm">Exit Quiz</p>
              </Button>
              <p className="text-xs sm:text-mobile text-gray-500">{`${
                currentQuestionIndex + 1
              }/${quiz?.questions?.length} Questions`}</p>
            </div>

            <div className="flex items-center flex-col justify-center w-full gap-3">
              <div
                className="innerhtml w-full"
                dangerouslySetInnerHTML={{
                  __html: currentQuestion?.question ?? "",
                }}
              />

              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col items-center justify-center gap-y-2">
                  {currentQuestion?.duration && (
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
                  )}
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
                <Option
                  key={index}
                  option={option}
                  isOrganizer={isOrganizer}
                  showAnswerMetric={showAnswerMetric}
                  answer={answer}
                  isDisabled={
                    timing === 0 ||
                    arr?.some(({ isCorrect }) => typeof isCorrect === "boolean")
                  }
                  isIdPresent={isIdPresent}
                  selectOption={selectOption}
                  optionIndex={optionLetter[index]}
                />
              ))}
            </div>

            <div
              className={cn(
                "w-full flex items-start justify-between",
                chosenAnswerStatus === null && "items-end justify-end"
              )}
            >
              {chosenAnswerStatus !== null && (
                <div className="flex flex-col items-start justify-start text-mobile">
                  <p
                    className={cn(
                      "text-green-500",
                      !chosenAnswerStatus.isCorrect && "text-red-500"
                    )}
                  >
                    You answered{" "}
                    {chosenAnswerStatus.isCorrect ? "correctly" : "incorrectly"}
                  </p>
                  <p className="font-medium text-sm">{`Correct Answer is ${
                    optionLetter[chosenAnswerStatus.correctOption]
                  }`}</p>
                </div>
              )}
              <p className="self-end bg-basePrimary/20 rounded-3xl text-sm text-basePrimary px-2 py-1">{`${
                currentQuestion?.points
              } ${Number(currentQuestion?.points) > 1 ? `pts` : `pt`}`}</p>
            </div>

            {quiz?.accessibility?.review && (
              <div
                className={cn("block", chosenAnswerStatus === null && "hidden")}
              >
                {showExplanation && (
                  <p className="mb-3 text-xs sm:text-sm text-gray-500">
                    {currentQuestion?.feedBack ?? "No Explanation"}
                  </p>
                )}
                <button
                  onClick={toggleExplanationVisibility}
                  className="text-xs sm:text-sm text-basePrimary underline"
                >
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </button>
              </div>
            )}

            {quiz?.accessibility?.live &&
            !isIdPresent &&
            !isOrganizer ? null : (
              <Button
                disabled={loading || isUpdating} //
                onClick={onNextBtnClick}
                className="text-gray-50  mx-auto w-[180px] my-8 bg-basePrimary gap-x-2 h-11 font-medium flex"
              >
                {isUpdating && <LoaderAlt size={22} className="animate-spin" />}
                <p>Next </p>
              </Button>
            )}

            <div className="w-full hidden items-end justify-between">
              <div className="flex items-center gap-x-2">
                <Button
                  onClick={previousQuestion}
                  className={cn(
                    "text-basePrimary w-[95px] border border-basePrimary hover:text-gray-50 bg-white hover:bg-basePrimary gap-x-2 h-10 font-medium hidden",
                    currentQuestionIndex > 0 && "flex"
                  )}
                >
                  <p>Previous</p>
                </Button>
                <Button
                  onClick={nextQuestion}
                  className={cn(
                    "text-gray-50 w-[95px] bg-basePrimary gap-x-2 h-10 font-medium hidden",
                    currentQuestionIndex < quiz?.questions?.length && "flex"
                  )}
                >
                  <p>Next</p>
                </Button>
              </div>

              <p className="w-1 h-1"></p>
            </div>

            <p className="text-center bg-white text-sm w-full mx-auto sticky inset-x-0 bottom-0 p-2 ">
              Powered By Zikoro
            </p>
          </>
        )}
      </>
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
