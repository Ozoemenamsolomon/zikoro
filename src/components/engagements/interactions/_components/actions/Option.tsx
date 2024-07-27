"use client";

import { cn } from "@/lib";
import { CloseCircle } from "styled-icons/ionicons-outline";
import { CheckCircle } from "styled-icons/bootstrap";
import { TAnswer, TQuiz, TQuestion } from "@/types";
import { useMemo } from "react";

type TOption = {
  optionId: string;
  isAnswer: string;
  option: string;
  isCorrect: boolean | string;
};
export function Option({
  optionIndex,
  option,
  selectOption,
  isOrganizer,
  isIdPresent,
  answer,
  showAnswerMetric,
  isDisabled,
  quiz,
}: {
  optionIndex: string;
  option: TOption;
  selectOption?: (id: string) => void;
  isOrganizer: boolean;
  isIdPresent: boolean;
  answer: TAnswer[];
  showAnswerMetric?: boolean;
  isDisabled: boolean;
  quiz: TQuiz<TQuestion[]>;
}) {
  const chosedOption = useMemo(() => {
    const i = answer?.filter((ans) => {
      return option?.optionId === ans?.selectedOptionId?.optionId;
    });

    return i?.length || 0;
  }, [answer]);

  const isCorrectAnswer = useMemo(() => {
    return option?.isAnswer === option?.optionId;
  }, [option]);

  //  console.log(isCorrectAnswer, { isCorrect: option?.isCorrect });

  return (
    <>
      {isOrganizer || isIdPresent ? (
        <OrganizerQuestOption
          optionIndex={optionIndex}
          option={option?.option ?? ""}
          showAnswerMetric={showAnswerMetric}
          chosen={((chosedOption / answer?.length) * 100).toFixed(0)}
          isCorrect={typeof option?.isCorrect === "boolean"}
          isCorrectAnswer={isCorrectAnswer}
          quiz={quiz}
          optionId={option?.optionId}
        />
      ) : (
        <button
          disabled={isDisabled}
          onClick={() => {
            if (selectOption) {
              selectOption(option?.optionId);
            }
          }}
          className={cn(
            "w-full px-4 text-gray-500 space-y-1  min-h-[44px] h-fit rounded-md border border-basePrimary bg-white",
            typeof option?.isCorrect === "boolean" &&
              option?.isCorrect &&
              showAnswerMetric &&
              "border-green-500 bg-green-500/20",
            typeof option?.isCorrect === "boolean" &&
              !option?.isCorrect &&
              showAnswerMetric &&
              "border-red-500 bg-red-500/20",

              isCorrectAnswer &&
              showAnswerMetric &&
              "border-green-500 bg-green-500/20 transform quiz-option-animation",
            typeof option?.isCorrect === "boolean" && !showAnswerMetric && "bg-[#001fcc]/20"
          )}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-start gap-x-2 w-full">
              {option?.isCorrect !== "default" && showAnswerMetric && (
                <>
                  {option?.isCorrect ? (
                    <CheckCircle className="text-green-500" size={18} />
                  ) : (
                    <CloseCircle className="text-red-500" size={20} />
                  )}
                </>
              )}

              <div className="w-full flex items-start gap-x-1">
                <span>{optionIndex}.</span>

                <div
                  className="innerhtml"
                  dangerouslySetInnerHTML={{
                    __html: option?.option ?? "",
                  }}
                />
              </div>
            </div>

            {showAnswerMetric && (
              <div className="text-mobile">
                <span>{`${((chosedOption || 0 / answer?.length) * 100).toFixed(
                  0
                )}%`}</span>
              </div>
            )}
          </div>

          {showAnswerMetric && (
            <div className="w-full relative h-1 rounded-3xl bg-gray-200">
              <span
                style={{
                  width: `${((chosedOption|| 0 / answer?.length) * 100).toFixed(
                    0
                  )}%`,
                }}
                className="absolute rounded-3xl inset-0 bg-basePrimary h-full"
              ></span>
            </div>
          )}
        </button>
      )}
    </>
  );
}

export function OrganizerQuestOption({
  optionIndex,
  option,
  showAnswerMetric,
  chosen,
  isCorrectAnswer,
  isCorrect,
  quiz,
  optionId,
}: {
  optionIndex: string;
  option: string;
  showAnswerMetric?: boolean;
  chosen?: string;
  isCorrectAnswer?: boolean;
  isCorrect?: boolean;
  quiz?: TQuiz<TQuestion[]>;
  optionId?: string;
}) {
  return (
    <button
      className={cn(
        "w-full px-4 text-gray-500 gap-y-1  min-h-[44px] h-fit rounded-md border border-gray-500 bg-gray-100",
        (isCorrect && isCorrectAnswer) ||
          (quiz?.accessibility?.live &&
            quiz?.liveMode?.correctOptionId === optionId &&
            "border-green-500 bg-green-500/20 transform quiz-option-animation")
      )}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <span>{optionIndex}.</span>

          <div
            className="innerhtml"
            dangerouslySetInnerHTML={{
              __html: option ?? "",
            }}
          />
        </div>
        {showAnswerMetric && (
          <div className="text-mobile">
            <span>{`${chosen || 0}%`}</span>
          </div>
        )}
      </div>
      {showAnswerMetric && (
        <div className="w-full relative h-1 rounded-3xl bg-gray-200">
          <span
            style={{
              width: `${chosen ||0}%`,
            }}
            className="absolute rounded-3xl inset-0 bg-basePrimary h-full"
          ></span>
        </div>
      )}
    </button>
  );
}
