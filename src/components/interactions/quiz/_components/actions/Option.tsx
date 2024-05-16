"use client";

import { QUsers } from "@/constants";
import { cn } from "@/lib";
import { CloseCircle } from "@styled-icons/ionicons-sharp/CloseCircle";
import { CheckCircleFill } from "@styled-icons/bootstrap/CheckCircleFill";

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
}: {
  optionIndex: string;
  option: TOption;
  selectOption?: (id: string) => void;
  isOrganizer: boolean;
  isIdPresent: boolean;
}) {
  // console.log("opt", option);
  return (
    <>
      {isOrganizer || isIdPresent ? (
        <OrganizerQuestOption
          optionIndex={optionIndex}
          option={option?.option ?? ""}
        />
      ) : (
        <button
          disabled={typeof option?.isCorrect === "boolean"}
          onClick={() => {
            if (selectOption) {
              selectOption(option?.optionId)
            }
          }}
          className={cn(
            "w-full px-4 text-gray-500 flex items-center justify-between min-h-[44px] h-fit rounded-md border border-gray-500 bg-gray-100",
            typeof option?.isCorrect === "boolean" &&
              option?.isCorrect &&
              "border-basePrimary bg-basePrimary/10"
          )}
        >
          <div className="flex items-start gap-x-2 w-full">
            {option?.isCorrect !== "default" && (
              <>
                {option?.isCorrect ? (
                  <CheckCircleFill className="text-green-500" size={18} />
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

          {typeof option?.isCorrect === "boolean" && (
            <div className="text-mobile flex items-center gap-x-2">
              <span>20%</span>
              <span className="flex items-center gap-x-2">
                <QUsers />
                <p>35</p>
              </span>
            </div>
          )}
        </button>
      )}
    </>
  );
}

function OrganizerQuestOption({
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
