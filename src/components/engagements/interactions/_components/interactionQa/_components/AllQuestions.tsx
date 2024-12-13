import { useState } from "react";
import { AskandReplyCard } from "./AskandReplyCard";
import { InlineIcon } from "@iconify/react";
import { Button } from "@/components/custom_ui/Button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";
import { TEventQAQuestion } from "@/types";
import { UserDetail } from "../attendee/EventQaAttendeeView";
import toast from "react-hot-toast";
import { usePostRequest } from "@/hooks/services/request";
import { HiDotsHorizontal } from "react-icons/hi";
import { generateAlias } from "@/utils";
import { EmptyQaState } from "./EmptyQaState";

export function AllQuestions({
  isAttendee,
  userDetail,
  eventQAQuestions,
  refetch,
}: {
  userDetail: UserDetail;
  isAttendee?: boolean;
  eventQAQuestions: TEventQAQuestion[];
  refetch: () => Promise<any>;
}) {
  const [replyQuestion, setReplyQuestion] = useState<TEventQAQuestion | null>(
    null
  );
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { postData } = usePostRequest("/engagements/qa/qaQuestion");

  function initiateReply(question: TEventQAQuestion) {
    setReplyQuestion(question);
  }

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
    const payload: Partial<TEventQAQuestion> = {
      ...replyQuestion,
      Responses: Array.isArray(replyQuestion?.Responses)
        ? [
            ...replyQuestion?.Responses,
            {
              ...restData,
              ...userDetail,
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
              ...userDetail,
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
    // refetch()
    setIsSubmitting(false);
  }

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
        replyQuestion !== null && "bg-white p-4"
      )}
    >
      {!replyQuestion ? (
        <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
          {Array.isArray(eventQAQuestions) &&
            eventQAQuestions.map((qa, index) => (
              <AskandReplyCard
                key={qa.questionAlias}
                eventQa={qa}
                className="bg-white border"
                showReply={initiateReply}
                isAttendee={isAttendee}
                refetch={refetch}
                userDetail={userDetail}
              />
            ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-start justify-start gap-4 ">
          <button
            onClick={() => setReplyQuestion(null)}
            className="flex items-center gap-x-1 text-mobile sm:text-sm"
          >
            <InlineIcon
              fontSize={20}
              icon="material-symbols-light:arrow-back"
            />
            <p>Replying</p>
          </button>
          <AskandReplyCard eventQa={replyQuestion} isReply />
          <form
            onSubmit={submitReply}
            className="w-full flex items-center justify-center gap-3 flex-col"
          >
            <div className="w-full flex items-end gap-x-2">
              {(replyQuestion?.userImage as string).includes("/") && (
                <Image
                  src={(replyQuestion?.userImage as string) || "/zikoro.png"}
                  alt=""
                  className="rounded-full h-12 object-contain border w-12"
                  width={100}
                  height={100}
                />
              )}
              <div className="w-[80%]">
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
                  <HiDotsHorizontal size={20} className="animate-pulse" />
                ) : (
                  <InlineIcon icon="prime:send" color="#ffffff" fontSize={30} />
                )}
              </Button>
            </div>
            <label htmlFor="isAnonymous" className="flex items-center gap-x-2">
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
          </form>

          <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
            {Array.isArray(replyQuestion?.Responses) &&
              replyQuestion?.Responses.map((qa, index) => (
                <AskandReplyCard
                  key={index}
                  className="border bg-[#F9FAFF]"
                  isReply
                  eventQa={qa}
                  refetch={refetch}
                  responseId={qa?.questionAlias}
                  originalQuestion={replyQuestion}
                  userDetail={userDetail}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
