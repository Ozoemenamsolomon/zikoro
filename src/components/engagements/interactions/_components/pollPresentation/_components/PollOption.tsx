"use client";

import { cn } from "@/lib";
import { TAnswer, TQuiz, TQuestion } from "@/types";
import { useMemo } from "react";
import { QUser, QUsers } from "@/constants";

type TOption = {
  optionId: string;
  isAnswer: string;
  option: string;
};
export function PollOption({
  optionIndex,
  option,
  selectOption,
  isOrganizer,
  isIdPresent,
  answer,
  showAnswerMetric,
  isDisabled,
  poll,
}: {
  optionIndex: string;
  option: TOption;
  selectOption?: (id: string) => void;
  isOrganizer: boolean;
  isIdPresent: boolean;
  answer: TAnswer[];
  showAnswerMetric?: boolean;
  isDisabled: boolean;
  poll: TQuiz<TQuestion[]>;
}) {
  const chosedOption = useMemo(() => {
    const i = answer?.filter((ans) => {
      return option?.optionId === ans?.selectedOptionId?.optionId;
    });

    return i?.length || 0;
  }, [answer]);

  // organizer will only see the question and how ppl answer it
  // players will be able to click the question and immeditely see how ppl answered it.
  return (
    <>
      {isOrganizer || isIdPresent ? (
        <OrganizerQuestOption
          optionIndex={optionIndex}
          option={option?.option ?? ""}
          showAnswerMetric={showAnswerMetric}
          chosen={((chosedOption / answer?.length) * 100).toFixed(0)}
          numOfChosen={chosedOption}
          poll={poll}
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
            option?.optionId === option?.isAnswer && "bg-[#001fcc]/10"
          )}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-start w-full">
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
              <div className="flex items-center gap-x-1">
                <div className="text-mobile border-r bordder-gray-300 px-1 flex items-center gap-x-1">
                  <QUsers />
                  <span>{chosedOption || 0}</span>
                </div>
                <div className="text-mobile">
                  <span>
                    {chosedOption
                      ? `${((chosedOption / answer?.length) * 100).toFixed(0)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {showAnswerMetric && (
            <div className="w-full relative h-2 rounded-3xl bg-gray-200">
              <span
                style={{
                  width: chosedOption
                    ? `${((chosedOption / answer?.length) * 100).toFixed(0)}%`
                    : "0%",
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
  poll,
  numOfChosen,
}: {
  optionIndex: string;
  option: string;
  showAnswerMetric?: boolean;
  chosen?: string;
  numOfChosen: number;

  poll?: TQuiz<TQuestion[]>;
}) {
  return (
    <button
      className={cn(
        "w-full px-4 text-gray-500 gap-y-2  min-h-[44px] h-fit rounded-md border border-basePrimary bg-gray-100"
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

        <div className="flex items-center gap-x-1">
          <div className="text-mobile border-r px-1 border-gray-300 flex items-center gap-x-1">
            <QUsers />
            <span>{numOfChosen ?? 0}</span>
          </div>
          <div className="text-mobile">
            <span>{`${chosen ?? "0"}%`}</span>
          </div>
        </div>
      </div>
      {
        <div className="w-full relative h-2 rounded-3xl bg-gray-200">
          <span
            style={{
              width: `${chosen ?? "0"}%`,
            }}
            className="absolute rounded-3xl inset-0 bg-basePrimary h-full"
          ></span>
        </div>
      }
    </button>
  );
}

// showAnswerMetric && showAnswerMetric &&
