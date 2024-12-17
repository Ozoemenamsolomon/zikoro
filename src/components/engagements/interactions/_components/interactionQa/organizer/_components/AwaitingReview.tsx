"use client";

import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import { TEventQa, TEventQAQuestion } from "@/types";
import { InlineIcon } from "@iconify/react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useDeleteRequest, usePostRequest } from "@/hooks/services/request";
import { toZonedTime } from "date-fns-tz";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { EmptyQaState } from "../../_components/EmptyQaState";

function ActionModal({
  transparentColor,
  description,
  iconColor,
  iconName,
  title,
  mainColor,
  buttonText,
  buttonColor,
  close,
  loading,
  actionFn,
}: {
  transparentColor: string;
  iconColor: string;
  iconName: string;
  title: string;
  mainColor: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  close: () => void;
  loading: boolean;
  actionFn: () => Promise<any>;
}) {
  return (
    <div className="w-full h-full inset-0 bg-black/50 fixed ">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg flex flex-col items-start justify-start gap-y-8 max-w-2xl h-fit p-6 absolute m-auto inset-0"
      >
        <Button onClick={close} className="self-end mb-3 w-fit h-fit px-0">
          <InlineIcon icon="material-symbols-light:close" fontSize={22} />
        </Button>

        <div className="w-full flex flex-col items-center justify-center gap-y-5">
          <div
            className={cn(
              "rounded-full h-28 w-28 flex items-center justify-center ",
              transparentColor
            )}
          >
            <InlineIcon icon={iconName} fontSize={60} color={iconColor} />
          </div>

          <h3 className={cn("font-semibold text-base sm:text-xl", mainColor)}>
            {title}
          </h3>
          <p>{description}</p>
        </div>

        <div className="w-full flex font-semibold items-center justify-around">
          <Button
            onClick={actionFn}
            disabled={loading}
            className={cn("h-11 rounded-lg gap-x-2 text-white ", buttonColor)}
          >
            {buttonText}
            {loading && <LoaderAlt size={20} className="animate-spin" />}
          </Button>
          <Button
            disabled={loading}
            onClick={close}
            className="w-fit h-fit px-0"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function AwaitingReviewCard({
  refetch,
  eventQa,
  qa
}: {
  eventQa: TEventQAQuestion;
  refetch: () => Promise<any>;
  qa: TEventQa
}) {
  const [isDelete, setIsDelete] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const { deleteData, isLoading: isDeleting } = useDeleteRequest<
    Partial<TEventQAQuestion>
  >(`/engagements/qa/qaQuestion/${eventQa?.questionAlias}/delete`);
  const { postData, isLoading } = usePostRequest<Partial<TEventQAQuestion>>(
    "/engagements/qa/qaQuestion"
  );

  function onToggleDelete() {
    setIsDelete((p) => !p);
  }

  function onToggleApprove() {
    setIsApprove((p) => !p);
  }

  const formattedTime = useMemo(() => {
    const utcDate = new Date(eventQa?.created_at);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = toZonedTime(utcDate, timeZone);

    if (isToday(localDate)) {
      return `Today ${format(localDate, "hh:mm a")}`;
    }

    if (isYesterday(localDate)) {
      return `Yesterday ${format(localDate, "hh:mm a")}`;
    }

    return format(localDate, "MM dd yyyy hh:mm a");
  }, [eventQa?.created_at]);

  async function approve() {
    await postData({ payload: { ...eventQa, questionStatus: "verified" } });
    refetch();
    setIsApprove(false);
  }

  async function deletes() {
    await deleteData();
    refetch();
    setIsDelete(false);
  }

  const useAcronym = useMemo(() => {
    if (eventQa?.anonymous || qa?.accessibility?.allowAnonymous) {
      return "A";
    } else if (typeof eventQa?.userImage === "string") {
      const splittedName = eventQa?.userImage?.split(" ");
      if (splittedName?.length > 1) {
        return `${splittedName[0].charAt(0) ?? ""}${
          splittedName[1].charAt(0) ?? ""
        }`;
      } else
        return `${splittedName[0].charAt(0) ?? ""}${
          splittedName[0].charAt(1) ?? ""
        }`;
    } else return "A";
  }, [eventQa]);

  return (
    <>
      <div className="w-full p-4 bg-white rounded-lg border h-fit flex gap-y-3 sm:gap-y-4 flex-col items-start justify-start">
        <div className="w-full flex items-start justify-between ">
          <div className="flex items-center gap-x-2">
          {(!eventQa?.anonymous && !qa?.accessibility?.allowAnonymous) && eventQa?.userImage?.startsWith("https://") ? (
            <Image
              src={(eventQa?.userImage as string) || "/zikoro.png"}
              alt=""
              className="rounded-full h-12 object-contain border w-12"
              width={100}
              height={100}
            />
          ) : (
            <div className="w-[3rem] bg-gradient-to-tr border-basePrimary from-custom-bg-gradient-start border to-custom-bg-gradient-end h-[3rem] rounded-full flex items-center justify-center">
              <p className="gradient-text  bg-basePrimary text-lg uppercase">
                {useAcronym}
              </p>
            </div>
          )}
            <div className="flex items-start flex-col justify-start gap-1">
              <p className="font-semibold text-sm sm:text-desktop">
                {eventQa?.anonymous ? "Anonymous" : eventQa?.userNickName ?? ""}
              </p>
              <p className="text-tiny sm:text-mobile text-gray-500">
                {formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            <button onClick={onToggleApprove}>
              <InlineIcon
                icon="codicon:check-all"
                color="#001fcc"
                fontSize={22}
              />
            </button>
            <button onClick={onToggleDelete}>
              <InlineIcon
                icon="mingcute:delete-line"
                color="#dc2626"
                fontSize={22}
              />
            </button>
          </div>
        </div>

        <p className="text-start">{eventQa?.content ?? ""}</p>
      </div>
      {isDelete && (
        <ActionModal
          buttonColor="bg-red-600"
          buttonText="Delete Question"
          close={onToggleDelete}
          description="Deleted question will not be visible to others"
          title="You are about to delete this question"
          transparentColor="bg-red-600/10"
          iconColor="#dc2626"
          mainColor="text-red-600"
          iconName="mingcute:delete-line"
          loading={isDeleting}
          actionFn={deletes}
        />
      )}
      {isApprove && (
        <ActionModal
          buttonColor="bg-[#001fcc]"
          buttonText="Approve Question"
          close={onToggleApprove}
          description="Approved question will not be visible to others"
          title="You are about to approve this question"
          transparentColor="bg-[#001fcc]/10"
          iconName="codicon:check-all"
          iconColor="#001fcc"
          mainColor="text-[#001fcc]"
          loading={isLoading}
          actionFn={approve}
        />
      )}
    </>
  );
}

export function AwaitingReview({
  awaitingReview,
  refetch,
  qa
}: {
  awaitingReview: TEventQAQuestion[];
  refetch: () => Promise<any>;
  qa: TEventQa
}) {
  if (awaitingReview?.length === 0) {
    return (
      <EmptyQaState title="No question is awaiting review" description="" />
    );
  }

  return (
    <div className="w-full max-w-2xl overflow-y-auto  no-scrollbar h-full mx-auto">
      <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
        {awaitingReview.map((quest, index) => (
          <AwaitingReviewCard
            key={quest.questionAlias}
            eventQa={quest}
            qa={qa}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
}
