import { useState } from "react";
import { AskandReplyCard } from "./AskandReplyCard";
import { InlineIcon } from "@iconify/react";
import { Button } from "@/components/custom_ui/Button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export function AllQuestions({ isAttendee }: { isAttendee?: boolean }) {
  const [replyQuestion, setReplyQuestion] = useState<any | null>(null);
  const [reply, setReply] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

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
            <p>Replying</p>
          </button>
          <AskandReplyCard isReply />
          <form
            onSubmit={submitReply}
            className="w-full flex items-center justify-center gap-3 flex-col"
          >
            <div className="w-full items-end gap-x-2">
              <Image
                src="/zikoro.png"
                alt=""
                className="rounded-full h-10 w-10"
                width={100}
                height={100}
              />
              <div className="w-[65%]">
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
                type="submit"
                className="h-10 w-10 bg-basePrimary rounded-full px-0 "
              >
                <InlineIcon icon="prime:send" color="#ffffff" fontSize={22} />
              </Button>
            </div>
            <label htmlFor="isAnonymous" className="flex items-center gap-x-2">
              <input
                id="isAnonymous"
                name="isAnonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(!isAnonymous)}
                className="accent-basePrimary h-5 w-5 rounded-lg"
              />
              <p>Reply as anyonymous</p>
            </label>
          </form>

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
