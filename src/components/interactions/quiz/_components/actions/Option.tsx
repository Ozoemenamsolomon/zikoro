"use client";

import { QUsers } from "@/constants";
import { cn } from "@/lib";
import { CloseCircle } from "@styled-icons/ionicons-outline/CloseCircle";
import { CheckCircle } from "@styled-icons/bootstrap/CheckCircle";
import { TAnswer } from "@/types";
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
}: {
  optionIndex: string;
  option: TOption;
  selectOption?: (id: string) => void;
  isOrganizer: boolean;
  isIdPresent: boolean;
  answer: TAnswer[];
  showAnswerMetric?: boolean;
  isDisabled: boolean;
}) {
  const chosedOption = useMemo(() => {
    const i = answer?.filter((ans) => {
      return option?.optionId === ans?.selectedOptionId?.optionId;
    });

    return i?.length || 0;
  }, [answer]);

  //console.log()
  //
  return (
    <>
      {isOrganizer || isIdPresent ? (
        <OrganizerQuestOption
          optionIndex={optionIndex}
          option={option?.option ?? ""}
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
              "border-green-500 bg-green-500/20",
            typeof option?.isCorrect === "boolean" &&
              !option?.isCorrect &&
              "border-red-500 bg-red-500/20"
          )}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-start gap-x-2 w-full">
              {option?.isCorrect !== "default" && (
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
                <p className="text-start ">{option?.option ?? ""}</p>
              </div>
            </div>

            {showAnswerMetric && (
              <div className="text-mobile">
                <span>{`${((chosedOption / answer?.length) * 100).toFixed(
                  0
                )}%`}</span>
              </div>
            )}
          </div>

          {showAnswerMetric && (
            <div className="w-full relative h-1 rounded-3xl bg-gray-200">
              <span
                style={{
                  width: `${((chosedOption / answer?.length) * 100).toFixed(
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
}: {
  optionIndex: string;
  option: string;
}) {
  return (
    <button className="w-full px-4 text-gray-500 flex items-center justify-between min-h-[44px] h-fit rounded-md border border-gray-500 bg-gray-100">
      <div className="w-full flex items-start gap-x-1">
        <span>{optionIndex}.</span>
        <p className="text-start ">{option ?? ""}</p>
      </div>
    </button>
  );
}
