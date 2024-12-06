"use client";
import {
  TEngagementFormQuestion,
  TFormattedEngagementFormAnswer,
} from "@/types/engagements";
import { InlineIcon } from "@iconify/react";
import {
  CheckBoxTypeResponse,
  DateTypeResponse,
  RatingTypeResponse,
  TextTypeResponse,
  UploadTypeResponse,
} from "./responseTypes";
import Image from "next/image";
import { cn } from "@/lib";
import { Button } from "@/components/custom_ui/Button";
import { useMemo, useState } from "react";
import { json2csv } from "json-2-csv";
import { saveAs } from "file-saver";
import { useDeleteRequest } from "@/hooks/services/request";
import * as XLSX from "xlsx";
import { ActionCard } from "@/components/custom_ui/ActionCard";
interface FormResponseProps {
  data:
    | {
        [key: string]: TFormattedEngagementFormAnswer[];
      }
    | undefined;
  flattenedResponse: TFormattedEngagementFormAnswer[];
  questions: TEngagementFormQuestion;
  formAlias: string;
}
export default function FormResponses({
  data,
  flattenedResponse,
  questions,
  formAlias,
}: FormResponseProps) {
  const [isDeleting, setDeleting] = useState(false);
  const { deleteData, isLoading } = useDeleteRequest(
    `/engagements/formAnswer/${formAlias}/delete`
  );
  const inputMultiChoiceCheckBox = useMemo(() => {
    const checkData: { key: TFormattedEngagementFormAnswer[] }[] = [];
    if (data) {
      Object.entries(data).map(([key, values]) => {
        if (
          values?.some(
            (v) => v?.type === "INPUT_MULTIPLE_CHOICE" && v?.questionId === key
          )
        ) {
          checkData.push({ key: values });
        }
      });

      return checkData;
    }
    return [];
  }, [data]);

  const inputCheckBox = useMemo(() => {
    const checkData: { key: TFormattedEngagementFormAnswer[] }[] = [];
    if (data) {
      Object.entries(data).map(([key, values]) => {
        if (
          values?.some(
            (v) => v?.type === "INPUT_CHECKBOX" && v?.questionId === key
          )
        ) {
          checkData.push({ key: values });
        }
      });

      return checkData;
    }
    return [];
  }, [data]);

  const inputRating = useMemo(() => {
    const checkData: { key: TFormattedEngagementFormAnswer[] }[] = [];
    if (data) {
      Object.entries(data).map(([key, values]) => {
        if (
          values?.some(
            (v) => v?.type === "INPUT_RATING" && v?.questionId === key
          )
        ) {
          checkData.push({ key: values });
        }
      });

      return checkData;
    }
    return [];
  }, [data]);

  if (!data || (Array.isArray(data) && data?.length === 0)) {
    return (
      <div className="w-[95%] max-w-xl mt-40 mx-auto h-[300px] p-4 rounded-lg bg-gradient-to-b gap-y-6 from-white to-basePrimary/20 flex flex-col items-center justify-center">
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

  type Response = {
    attendeeEmail: string;
    attendeeAlias: string; // NB: not all user registered
    [question: string]: string | undefined;
  };

  async function downloadCsv() {
    try {
      function transformData(data: TFormattedEngagementFormAnswer[]) {
        const result: { [alias: string]: Response } = {};

        data.forEach((entry) => {
          const alias = entry.attendeeAlias;
          //  console.log("alias", alias);
          if (!alias) return;

          if (!result[alias]) {
            result[alias] = {
              attendeeAlias: alias,
              attendeeEmail: entry?.attendeeEmail || "NIL",
            };
          }
          result[alias][entry.question] = Array.isArray(entry.response)
            ? entry.response?.map((v) => v?.selectedOption).toString()
            : entry?.response?.selectedOption
            ? entry?.response?.selectedOption
            : entry?.response;
        });

        return Object.values(result);
      }
      const transformedData = transformData(flattenedResponse);

      console.log(flattenedResponse)

      const worksheet = XLSX.utils.json_to_sheet(transformedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
      XLSX.writeFile(workbook, "response.xlsx");
    } catch (error) {
      console.log(error);
    }
  }

  function toggleDelete() {
    setDeleting((p) => !p);
  }

  async function deleteResponses() {
    await deleteData();
    window.location.reload();
  }
  return (
    <>
      {isDeleting && (
        <ActionCard
          loading={isLoading}
          deletes={deleteResponses}
          close={toggleDelete}
        />
      )}
      <div className="w-full px-4 mx-auto max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-4 sm:mt-6">
        <div className="w-full mb-4 flex items-end gap-x-4 justify-end">
          <Button onClick={toggleDelete} className="items-center gap-x-1">
            <InlineIcon icon="icon-park-twotone:delete-themes" fontSize={22} />
            <p>Clear Responses</p>
          </Button>
          <Button onClick={downloadCsv} className="w-fit  gap-x-1 items-center">
            <p>Export</p>
            <InlineIcon icon="lets-icons:export-duotone" fontSize={22} />
          </Button>
        </div>
        {Object.entries(data).map(([key, value]) => (
          <div
            key={Math.random()}
            className={cn(
              "w-full rounded-lg border p-4 mb-6 sm:mb-8",
              value[0]?.type === "INPUT_MULTIPLE_CHOICE" &&
                value[0]?.questionId === key &&
                "hidden",
              value[0]?.type === "INPUT_CHECKBOX" &&
                value[0]?.questionId === key &&
                "hidden",
              value[0]?.type === "INPUT_RATING" &&
                value[0]?.questionId === key &&
                "hidden"
            )}
          >
            <div
              className={cn(
                "w-full hidden flex-col items-start mb-4 sm:mb-6 justify-start",
                value?.length > 0 && "flex"
              )}
            >
              <div>
                {value?.find((v) => v?.questionId === key)?.question && (
                  <p className="font-medium text-sm sm:text-base mb-2">
                    {value?.find((v) => v?.questionId === key)?.question}
                  </p>
                )}
                {value?.find((v) => v?.questionId === key)?.questionImage ? (
                  <Image
                    alt=""
                    width={2000}
                    height={600}
                    className="w-full rounded-lg h-[15rem]"
                    src={
                      value?.find((v) => v?.questionId === key)
                        ?.questionImage ?? ""
                    }
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
          </div>
        ))}

        {inputCheckBox.length > 0 &&
          inputCheckBox.map((v) => (
            <div className="w-full rounded-lg border p-4 mb-6 sm:mb-8">
              <div
                className={cn(
                  "w-full flex flex-col items-start mb-4 sm:mb-6 justify-start"
                )}
              >
                <div>
                  {v?.key[0]?.question && (
                    <p className="font-medium text-sm sm:text-base mb-2">
                      {v?.key[0]?.question}
                    </p>
                  )}
                  {v?.key[0]?.questionImage ? (
                    <Image
                      alt=""
                      width={2000}
                      height={600}
                      className="w-full rounded-lg h-[15rem]"
                      src={v?.key[0]?.questionImage ?? ""}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <p>{v?.key?.length} Responses</p>
              </div>
              <CheckBoxTypeResponse type="single" responses={v?.key} />
            </div>
          ))}

        {inputMultiChoiceCheckBox.length > 0 &&
          inputMultiChoiceCheckBox.map((v) => (
            <div className="w-full rounded-lg border p-4 mb-6 sm:mb-8">
              <div
                className={cn(
                  "w-full flex flex-col items-start mb-4 sm:mb-6 justify-start"
                )}
              >
                <div>
                  {v?.key[0]?.question && (
                    <p className="font-medium text-sm sm:text-base mb-2">
                      {v?.key[0]?.question}
                    </p>
                  )}
                  {v?.key[0]?.questionImage ? (
                    <Image
                      alt=""
                      width={2000}
                      height={600}
                      className="w-full rounded-lg h-[15rem]"
                      src={v?.key[0]?.questionImage ?? ""}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <p>{v?.key?.length} Responses</p>
              </div>
              <CheckBoxTypeResponse type="multi" responses={v?.key} />
            </div>
          ))}

        {inputRating.length > 0 &&
          inputRating.map((v) => (
            <div className="w-full rounded-lg border p-4 mb-6 sm:mb-8">
              <div
                className={cn(
                  "w-full flex flex-col items-start mb-4 sm:mb-6 justify-start"
                )}
              >
                <div>
                  {v?.key[0]?.question && (
                    <p className="font-medium text-sm sm:text-base mb-2">
                      {v?.key[0]?.question}
                    </p>
                  )}
                  {v?.key[0]?.questionImage ? (
                    <Image
                      alt=""
                      width={2000}
                      height={600}
                      className="w-full rounded-lg h-[15rem]"
                      src={v?.key[0]?.questionImage ?? ""}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <p>{v?.key?.length} Responses</p>
              </div>
              <RatingTypeResponse responses={v?.key} />
            </div>
          ))}
      </div>
    </>
  );
}
