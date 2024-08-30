"use client";
import Image from "next/image";
import { TQuiz, TQuestion, TAnswer } from "@/types";
import { Button } from "@/components";
import { useMemo } from "react";
import { ArrowBackOutline } from "styled-icons/evaicons-outline";
import { QUser, QUsers } from "@/constants";
export function AnswerSheet({
  poll,
  answers,
  close,
}: {
  poll: TQuiz<TQuestion[]> | null;
  answers: TAnswer[];
  close?: () => Promise<void>;
}) {
console.log(answers)
  const answerSheet = useMemo(() => {
    if (poll && answers) {
    
      const result = poll?.questions?.map((question) => {
        const questionAnswer = answers?.filter((answer) => answer?.questionId === question?.id)
        return {
          ...question,
          options: question?.options?.map((option) => {
            const i = questionAnswer?.filter((ans) => {
              return option?.optionId === ans?.selectedOptionId?.optionId;
            });
            return {
              ...option,
              numOfChosen: String(i?.length),
              chosen: ((i?.length / questionAnswer?.length) * 100).toFixed(0),
            };
          }),
        };
      });

      return result;
    } else {
      return [];
    }
  }, [poll, answers]);

  const optionLetter = ["A", "B", "C", "D"];
  return (
    <div className="w-full h-full inset-0 fixed overflow-y-auto bg-gray-100">
      <div className="w-full max-w-3xl absolute top-0 mx-auto inset-x-0 bg-white p-4">
      {close &&  <Button onClick={close} className="gap-x-1 self-start w-fit h-fit px-2">
          <ArrowBackOutline size={20} />
          <p className="text-sm">Back</p>
        </Button>}

        <div className="W-full max-w-xl mx-auto mt-8 flex gap-y-3 flex-col items-start justify-start">
          {Array.isArray(answerSheet) &&
            answerSheet?.map((question, index) => {
              return (
                <div className="w-full grid grid-cols-1 mb-4 gap-y-3">
                  <h2>{`Question ${index + 1}`}</h2>

                  <div
                    className="innerhtml w-full"
                    dangerouslySetInnerHTML={{
                      __html: question?.question ?? "",
                    }}
                  />
                  {question?.questionImage && (
                    <Image
                      className="w-full h-48 "
                      src={question?.questionImage}
                      width={700}
                      height={300}
                      alt=""
                    />
                  )}

                  <div className="grid grid-cols-1 gap-4 items-center">
                    {question?.options.map((option, index) => (
                      <div className="w-full space-y-2">
                        <div className="w-full flex items-start justify-between">
                          <div className="flex items-start gap-x-2">
                            <p>{`${optionLetter[index]}.`}</p>
                            <p
                              className=""
                              dangerouslySetInnerHTML={{
                                __html: option?.option ?? "",
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-x-1">
                            <div className="text-mobile border-r bordder-gray-300 px-1 flex items-center gap-x-1">
                              <QUsers />
                              <span>{option?.numOfChosen || 0}</span>
                            </div>
                            <div className="text-mobile">
                              <span>
                                {option?.chosen ? `${option?.chosen}%` : "0%"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full relative h-2 rounded-3xl bg-gray-200">
                          <span
                            style={{
                              width: option?.chosen
                                ? `${option?.chosen}%`
                                : "0%",
                            }}
                            className="absolute rounded-3xl inset-0 bg-basePrimary h-full"
                          ></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
