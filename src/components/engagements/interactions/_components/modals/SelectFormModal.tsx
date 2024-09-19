"use client";

import { Button } from "@/components/custom_ui/Button";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import { useGetData } from "@/hooks/services/request";
import { TEngagementFormQuestion } from "@/types/engagements";
import Image from "next/image";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { cn } from "@/lib";

function Widget({
  question,
  setSelectedFormId,
  selectedFormId,
}: {
  selectedFormId: string;
  setSelectedFormId: (id: string) => void;
  question: TEngagementFormQuestion;
}) {
  return (
    <div
    role="button"
      onClick={() => {
       
        setSelectedFormId(question?.formAlias)
      }}
      className={cn(
        "w-full border p-3 rounded-lg grid grid-cols-10 gap-x-3",
        question?.formAlias === selectedFormId && "border-basePrimary"
      )}
    >
      {question?.coverImage &&
      (question?.coverImage as string).startsWith("https") ? (
        <Image
          alt=""
          src={question?.coverImage}
          width={500}
          height={500}
          className="w-full col-span-3 h-[100px] rounded-lg object-cover"
        />
      ) : (
        <div className="col-span-3 h-[100px] rounded-lg bg-gray-200 animate-pulse"></div>
      )}
      <div className="w-full col-span-7 flex items-start justify-start flex-col gap-2">
        <h2 className="font-medium text-base sm:text-lg">
          {question?.title ?? ""}
        </h2>
        <p className="w-full text-ellipsis overflow-hidden whitespace-nowrap">
          {question?.description ?? ""}
        </p>
      </div>
    </div>
  );
}
export function SelectFormModal({
  close,
  eventId,
  setSelectedFormId,
  selectedFormId,
}: {
  close: () => void;
  eventId: string;
  setSelectedFormId: (id: string) => void;
  selectedFormId: string;
}) {
  const { data, isLoading } =
    useGetData<TEngagementFormQuestion[]>(`/engagements/${eventId}/form`);

  return (
    <div className="w-full h-full inset-0 fixed bg-black/30 z-[200]">
      <div
        onClick={(e) => {
          e.stopPropagation();
          
        }}
        className="w-[95%] bg-white max-w-3xl pb-4 rounded-lg absolute m-auto h-fit max-h-[85%] overflow-y-auto inset-0"
      >
        <div className="w-full flex items-center top-0 z-20 bg-white sticky inset-x-0 border-b px-4 py-4 justify-between">
          <h2 className="font-semibold text-base sm:text-lg">Forms</h2>
          <div className="flex items-center gap-x-2">
            <Link
              href={`/event/${eventId}/engagements/interactions/form/create`}
              className="bg-basePrimary text-white flex items-center justify-center font-medium px-4 rounded-lg h-11 "
            >
              Create Form
            </Link>
            <Button onClick={close} className="px-0 h-fit w-fit gap-x-1 ">
              <MdClose size={20} />
              <p>Close</p>
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="w-full h-[20rem] flex items-center justify-center">
            <LoaderAlt size={24} className="animate-spin" />
          </div>
        )}
        {!isLoading && Array.isArray(data) && (
          <div className="w-full flex mt-12  p-4 flex-col items-start justify-start gap-y-3">
            {data?.map((question, index) => (
              <Widget
                key={index}
                selectedFormId={selectedFormId}
                question={question}
                setSelectedFormId={setSelectedFormId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
