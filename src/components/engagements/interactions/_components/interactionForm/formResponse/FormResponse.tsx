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
interface FormResponseProps {
  data:
    | {
        [key: string]: TFormattedEngagementFormAnswer[];
      }
    | undefined;
}
export default function FormResponses({ data }: FormResponseProps) {
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
        <div key={Math.random()} className="w-full mb-6 sm:mb-8">
          {Array.isArray(value) &&
            value?.map((item) => (
              <div className="w-full">
                {item?.type === "INPUT_TEXT" && <TextTypeResponse />}

                {item?.type === "INPUT_DATE" && <DateTypeResponse />}

                {item?.type === "INPUT_CHECKBOX" && <CheckBoxTypeResponse />}

                {item?.type === "INPUT_MULTIPLE_CHOICE" && (
                  <CheckBoxTypeResponse />
                )}

                {item?.type === "INPUT_RATING" && <RatingTypeResponse />}

                {item?.type === "ATTACHMENT" && <UploadTypeResponse />}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
