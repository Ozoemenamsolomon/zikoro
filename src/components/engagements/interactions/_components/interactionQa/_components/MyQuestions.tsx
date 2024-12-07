import { useState } from "react";
import { AskandReplyCard } from "./AskandReplyCard";
import { InlineIcon } from "@iconify/react";

export function MyQuestions({ isAttendee }: { isAttendee?: boolean }) {
  const [replyQuestion, setReplyQuestion] = useState<any | null>(null);

  function initiateReply(question: any) {
    setReplyQuestion(question);
  }

  async function submitReply(e: any) {
    e.preventDefault();
  }
  return (
    <div className="w-full max-w-2xl overflow-y-auto bg-white no-scrollbar h-full mx-auto">
      {!replyQuestion ? (
        <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((_) => (
            <AskandReplyCard
              key={_}
              className="bg-white border"
              showReply={initiateReply}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-start justify-start gap-4 ">
          <button
            //onClick={() => router.back()}
            className="flex items-center gap-x-1 text-mobile sm:text-sm"
          >
            <InlineIcon
              fontSize={20}
              icon="material-symbols-light:arrow-back"
            />
            <p>Back</p>
          </button>
          <AskandReplyCard isReply />

          <h2 className="font-semibold text-desktop sm:text-lg">Replies</h2>

          <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((_) => (
              <AskandReplyCard
                key={_}
                className="border bg-[#F9FAFF]"
                isReply
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
