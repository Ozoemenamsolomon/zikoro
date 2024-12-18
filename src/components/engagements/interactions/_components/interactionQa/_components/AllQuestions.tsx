"use client";

import { useMemo, useState } from "react";
import { AskandReplyCard } from "./AskandReplyCard";
import { InlineIcon } from "@iconify/react";
import { Button } from "@/components/custom_ui/Button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";
import { TEventQa, TEventQAQuestion, TUserAccess } from "@/types";

import toast from "react-hot-toast";
import { usePostRequest } from "@/hooks/services/request";
import { HiDotsHorizontal } from "react-icons/hi";
import { generateAlias } from "@/utils";
import { EmptyQaState } from "./EmptyQaState";
import useAccessStore from "@/store/globalAcessStore";

export function AllQuestions({
  isAttendee,
  userDetail,
  eventQAQuestions,
  refetch,
  initiateReply,
  replyQuestion,
  replyToNull,
  qa,
}: {
  userDetail: TUserAccess | null;
  isAttendee?: boolean;
  eventQAQuestions: TEventQAQuestion[];
  refetch: () => Promise<any>;
  initiateReply: (t: TEventQAQuestion | null) => void;
  replyQuestion: TEventQAQuestion | null;
  replyToNull: () => void;
  qa: TEventQa;
}) {
  // const [replyQuestion, setReplyQuestion] = useState<TEventQAQuestion | null>(
  //   null
  // );

  const [reply, setReply] = useState("");
  const [name, setName] = useState(userDetail?.userNickName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { postData } = usePostRequest("/engagements/qa/qaQuestion");
  const { setUserAccess } = useAccessStore();

  const alias = useMemo(() => {
    return generateAlias();
  }, []);

  async function submitReply(e: any) {
    e.preventDefault();
    if (!reply) {
      return toast.error("Pls add your reply");
    }
    if (!replyQuestion) return;
    setIsSubmitting(true);

    const {
      moderationDetails,
      Responses,
      questionStatus,
      QandAAlias,
      id,
      ...restData
    } = replyQuestion;

    const user = isAttendee
      ? {
          userId: userDetail?.userId || alias,
          userNickName: userDetail?.userNickName || name || "",
          userImage: userDetail?.userImage || name || "",
        }
      : userDetail;
    const payload: Partial<TEventQAQuestion> = {
      ...replyQuestion,
      Responses: Array.isArray(replyQuestion?.Responses)
        ? [
            ...replyQuestion?.Responses,
            {
              ...restData,
              ...user,
              questionAlias: generateAlias(),
              content: reply,
              anonymous: isAnonymous,
              vote: 0,
              voters: [],
              created_at: new Date().toISOString(),
            },
          ]
        : [
            {
              ...restData,
              ...user,
              questionAlias: generateAlias(),
              content: reply,
              anonymous: isAnonymous,
              vote: 0,
              voters: [],
              created_at: new Date().toISOString(),
            },
          ],
    };

    await postData({ payload });
    setReply("");
    setName("");
    if (isAttendee && userDetail !== null) {
      setUserAccess({
        userId: userDetail?.userId || alias,
        userNickName: userDetail?.userNickName || name || "",
        userImage: userDetail?.userImage || name || "",
      });
    }
    if (!qa?.accessibility?.live) {
      initiateReply(null);
    }
    refetch();
    setIsSubmitting(false);
  }

  const useAcronym = useMemo(() => {
    if (qa?.accessibility?.allowAnonymous) {
      return "A";
    } else if (typeof userDetail?.userImage === "string") {
      const splittedName = userDetail?.userImage?.split(" ");
      if (splittedName?.length > 1) {
        return `${splittedName[0].charAt(0) ?? ""}${
          splittedName[1].charAt(0) ?? ""
        }`;
      } else
        return `${splittedName[0].charAt(0) ?? ""}${
          splittedName[0].charAt(1) ?? ""
        }`;
    } else return "A";
  }, [userDetail]);

  if (eventQAQuestions?.length === 0) {
    return (
      <EmptyQaState
        title="No Question Yet!"
        description="All Questions will appear here. You can ask your question"
      />
    );
  }
  return (
    <div
      className={cn(
        "w-full max-w-2xl overflow-y-auto  no-scrollbar h-full mx-auto",
        replyQuestion !== null && "bg-white p-4 h-fit"
      )}
    >
      {!replyQuestion ? (
        <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
          {Array.isArray(eventQAQuestions) &&
            eventQAQuestions.map((quest, index) => (
              <AskandReplyCard
                key={quest.questionAlias}
                eventQa={quest}
                className="bg-white border"
                showReply={initiateReply}
                isAttendee={isAttendee}
                refetch={refetch}
                userDetail={userDetail}
                qa={qa}
              />
            ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-start justify-start gap-4 ">
          <button
            onClick={() => replyToNull()}
            className="flex items-center gap-x-1 text-mobile sm:text-sm"
          >
            <InlineIcon
              fontSize={20}
              icon="material-symbols-light:arrow-back"
            />
            <p>Replying</p>
          </button>
          <AskandReplyCard
            eventQa={replyQuestion}
            showReply={initiateReply}
            userDetail={userDetail}
            qa={qa}
            isReply
          />
          <form
            onSubmit={submitReply}
            className={cn(
              "w-full flex items-center border rounded-lg p-3 justify-center gap-3 flex-col",
              !qa?.accessibility?.canRespond && "hidden"
            )}
          >
            <div className="w-full flex items-end gap-x-2">
              {!qa?.accessibility?.allowAnonymous &&
              userDetail?.userImage?.startsWith("https://") ? (
                <Image
                  src={(userDetail?.userImage as string) || "/zikoro.png"}
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

              <div className="w-[80%] flex flex-col gap-y-2 items-start">
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="border-0 border-b rounded-none w-full"
                  placeholder="Enter a name"
                  type="text"
                />
                <Input
                  value={reply}
                  onChange={(e) => {
                    setReply(e.target.value);
                  }}
                  className="border-0 border-b rounded-none w-full"
                  placeholder="Enter your reply"
                  type="text"
                />
              </div>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="h-10 w-10 bg-basePrimary rounded-full px-0 "
              >
                {isSubmitting ? (
                  <HiDotsHorizontal
                    size={20}
                    className="animate-pulse text-white"
                  />
                ) : (
                  <InlineIcon icon="prime:send" color="#ffffff" fontSize={30} />
                )}
              </Button>
            </div>
            {qa?.accessibility?.allowAnonymous && (
              <label
                htmlFor="isAnonymous"
                className="flex items-center gap-x-2"
              >
                <input
                  id="anonymous"
                  name="anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(!isAnonymous)}
                  className="accent-basePrimary h-4 w-4 rounded-lg"
                />
                <p className="text-sm ">Reply as anyonymous</p>
              </label>
            )}
          </form>

          <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
            {Array.isArray(replyQuestion?.Responses) &&
              replyQuestion?.Responses.map((quest, index) => (
                <AskandReplyCard
                  key={index}
                  className="border bg-[#F9FAFF]"
                  isReply
                  eventQa={quest}
                  refetch={refetch}
                  responseId={quest?.questionAlias}
                  originalQuestion={replyQuestion}
                  userDetail={userDetail}
                  showReply={initiateReply}
                  qa={qa}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
