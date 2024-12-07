import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import { InlineIcon } from "@iconify/react";
import Image from "next/image";

export function AskandReplyCard({
  className,
  showReply,
  isReply
}: {
  className?: string;
  showReply?: (q: any) => void;
  isReply?:boolean;
}) {
  return (
    <div
      className={cn(
        "w-full flex h-fit flex-col items-start p-3 rounded-lg justify-start gap-y-3 sm:gap-y-4",
        className
      )}
    >
      <div className="flex items-center gap-x-2">
        <Image
          src="/zikoro.png"
          alt=""
          className="rounded-full h-11 w-11"
          width={100}
          height={100}
        />
        <div className="flex items-start flex-col justify-start gap-1">
          <p className="font-semibold text-sm sm:text-desktop">Anonymous</p>
          <p className="text-tiny sm:text-mobile text-gray-500">
            Today 11:00am
          </p>
        </div>
      </div>

      <p className="text-start">
        The question you asked will appear here, can you see it?
      </p>

      <div className="flex items-center justify-center w-full gap-x-3">
        <Button className="rounded-3xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end gap-x-2 px-2 py-1 h-fit">
          <span className="text-mobile">300</span>
          <InlineIcon fontSize={20} icon="iconamoon:like-thin" />
        </Button>

       {!isReply && <Button
          onClick={() => showReply?.("okay")}
          className="rounded-3xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end gap-x-2 px-2 py-1 h-fit"
        >
          <span className="text-mobile">30k</span>
          <InlineIcon fontSize={20} icon="mdi-light:message" />
        </Button>}
      </div>
    </div>
  );
}
