"use client";
import { TFormattedEngagementFormAnswer } from "@/types/engagements";
import { InlineIcon } from "@iconify/react";
import {
  CheckBoxTypeResponse,
  DateTypeResponse,
  RatingTypeResponse,
  TextTypeResponse,
  UploadTypeResponse,
} from "./responseTypes";
import Image from "next/image";
interface FormResponseProps {
  data:
    | {
        [key: string]: TFormattedEngagementFormAnswer[];
      }
    | undefined;
}
export default function FormResponses({ data }: FormResponseProps) {
  function getRefinedData(
    dataArray: TFormattedEngagementFormAnswer[],
    type: string
  ) {
    const filteredData = dataArray?.filter((v) => v?.type !== type);

    return filteredData;
  }

  if (!data || (Array.isArray(data) && data?.length === 0)) {
    return (
      <div className="w-[95%] max-w-xl mx-auto h-[300px] p-4 rounded-lg bg-gradient-to-b gap-y-6 from-white to-basePrimary/20 flex flex-col items-center justify-center">
        <InlineIcon
          icon="fluent:emoji-meh-24-regular"
          color="#001fcc"
          fontSize={30}
        />

        <div className="flex gap-y-2 flex-col items-center justify-center ">
          <h2 className="font-semibold text-xl">No responses yet</h2>
          <p>Responses from the participants will appear here</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full px-4 mx-auto max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-4 sm:mt-6">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={Math.random()}
          className="w-full rounded-lg border p-4 mb-6 sm:mb-8"
        >
          <div className="w-full flex flex-col items-start justify-start">
            <div>
              {value?.find((v) => v?.questionId === key)?.question ? (
                <Image
                  alt=""
                  className="w-full rounded-lg h-[15rem]"
                  src={value?.find((v) => v?.questionId === key)?.questionImage}
                />
              ) : (
                ""
              )}
            </div>
            <p>{value?.length} Responses</p>
          </div>
          {Array.isArray(value) &&
            value?.map((item) => (
              <div className="w-full">
                {item?.type === "INPUT_TEXT" && (
                  <div className="w-full flex flex-col items-start justify-start gap-y-2">
                    <TextTypeResponse response={item} />
                  </div>
                )}
                {item?.type === "INPUT_DATE" && (
                  <div className="w-full flex flex-col items-start justify-start gap-y-2">
                    <DateTypeResponse response={item} />
                  </div>
                )}

                

                {item?.type === "ATTACHMENT" && (
                  <div className="w-full flex flex-col items-start justify-start gap-y-2">
                    <UploadTypeResponse response={item} />
                  </div>
                )}
              </div>
            ))}
          {Array.isArray(value) &&
            value?.some((v) => v?.questionId === key) &&
            getRefinedData(value, "INPUT_RATING")?.length > 0 && (
              <RatingTypeResponse
                responses={getRefinedData(value, "INPUT_RATING")}
              />
            )}
             {Array.isArray(value) &&
            value?.some((v) => v?.questionId === key) &&
            getRefinedData(value, "INPUT_CHECKBOX")?.length > 0 && (
              <CheckBoxTypeResponse
                responses={getRefinedData(value, "INPUT_CHECKBOX")}
              />
            )}
             {Array.isArray(value) &&
            value?.some((v) => v?.questionId === key) &&
            getRefinedData(value, "INPUT_MULTIPLE_CHOICE")?.length > 0 && (
              <CheckBoxTypeResponse
                responses={getRefinedData(value, "INPUT_MULTIPLE_CHOICE")}
              />
            )}
        </div>
      ))}
    </div>
  );
}
