import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import { TEventQa, TEventQAQuestion, TUserAccess } from "@/types";
import { InlineIcon } from "@iconify/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { format, isToday, isYesterday } from "date-fns";
import { formatReviewNumber, generateAlias } from "@/utils";
import { usePostRequest } from "@/hooks/services/request";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import useAccessStore from "@/store/globalAcessStore";

export function AskandReplyCard({
  className,
  showReply,
  isReply,
  eventQa,
  isAttendee,
  refetch,
  userDetail,
  originalQuestion,
  responseId,
  qa
}: {
  className?: string;
  showReply?: (q: TEventQAQuestion) => void;
  isReply?: boolean;
  eventQa?: Partial<TEventQAQuestion>;
  isAttendee?: boolean;
  refetch?: () => Promise<any>;
  userDetail?: TUserAccess | null;
  originalQuestion?: TEventQAQuestion;
  responseId?: string;
  qa: TEventQa
}) {
  const { postData, isLoading } = usePostRequest("/engagements/qa/qaQuestion");
  const { setUserAccess } = useAccessStore();
  const [isLiked, setLiked] = useState(false);
  const formattedTime = useMemo(() => {
    const utcDate = new Date(eventQa?.created_at as string);
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

  const formatResponsesCount = useMemo(() => {
    if (eventQa && Array.isArray(eventQa?.Responses)) {
      return formatReviewNumber(eventQa?.Responses?.length);
    } else {
      return "0";
    }
  }, [eventQa]);

  const formatVotesCount = useMemo(() => {
    if (eventQa) {
      return formatReviewNumber(eventQa?.vote || 0);
    } else {
      return "0";
    }
  }, [eventQa, responseId]);

  /**
    if (responseId && originalQuestion) {
      return formatReviewNumber(originalQuestion?.vote);
    }
    else
   */

  async function voteFn() {
    setLiked(true);
    const id = generateAlias();
    const payload: Partial<TEventQAQuestion> = responseId
      ? {
          ...originalQuestion,
          Responses: originalQuestion?.Responses?.map((resp) => {
            if (resp?.questionAlias === responseId) {
              return {
                ...resp,
                vote: (resp?.vote || 0) + 1,
                voters: Array.isArray(resp?.voters)
                  ? [
                      ...resp?.voters,
                      {
                        userId: userDetail?.userId || id,
                      },
                    ]
                  : [
                      {
                        userId: userDetail?.userId || id,
                      },
                    ],
              };
            }
            return resp;
          }),
        }
      : {
          ...eventQa,
          vote: (eventQa?.vote || 0) + 1,
          voters: Array.isArray(eventQa?.voters)
            ? [
                ...eventQa?.voters,
                {
                  userId: userDetail?.userId || id,
                },
              ]
            : [
                {
                  userId: userDetail?.userId || id,
                },
              ],
        };

    await postData({ payload });
    setUserAccess({ userId: id });

    refetch?.();
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

  useMemo(() => {
    if (eventQa?.voters?.some((qa) => qa?.userId === userDetail?.userId)) {
      setLiked(true);
    }
  }, [userDetail, eventQa]);
  return (
    <div
      className={cn(
        "w-full flex h-fit flex-col items-start p-3 rounded-lg justify-start gap-y-3 sm:gap-y-4",
        className
      )}
    >
      <div className={cn("flex w-full items-center justify-between")}>
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
              {eventQa?.anonymous ||qa?.accessibility?.allowAnonymous
                ? "Anonymous"
                : eventQa?.userNickName ?? "Anonymous"}
            </p>
            <p className="text-tiny sm:text-mobile text-gray-500">
              {formattedTime}
            </p>
          </div>
        </div>

        {isAttendee && (
          <p>{eventQa?.questionStatus === "pending" ? "In Review" : ""}</p>
        )}
      </div>

      <p className="text-start">{eventQa?.content ?? ""}</p>
      <div className="flex items-center justify-center w-full gap-x-3">
        <Button
          onClick={voteFn}
          disabled={
            !userDetail ||
            isLoading ||
            userDetail?.userId === eventQa?.userId ||
            isLiked
          }
          className="rounded-3xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end gap-x-2 px-2 py-1 h-fit"
        >
          <span className="text-mobile">{formatVotesCount}</span>
          {isLiked ? (
            <AiFillLike color="#001fcc" size={20} />
          ) : (
            <AiOutlineLike size={20} />
          )}
        </Button>

        {!isReply && eventQa && (
          <Button
            onClick={() => showReply?.(eventQa as TEventQAQuestion)}
            className="rounded-3xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end gap-x-2 px-2 py-1 h-fit"
          >
            <span className="text-mobile">{formatResponsesCount}</span>
            <InlineIcon fontSize={20} icon="mdi-light:message" />
          </Button>
        )}
      </div>
    </div>
  );
}
