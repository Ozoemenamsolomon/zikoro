"use client";

import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import { InlineIcon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

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

        <div className="w-full flex font-semibold items-center justify-between">
          <Button className={cn("h-11 rounded-lg text-white ", buttonColor)}>
            {buttonText}
          </Button>
          <Button onClick={close} className="w-fit h-fit px-0">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function AwaitingReviewCard() {
  const [isDelete, setIsDelete] = useState(false);
  const [isApprove, setIsApprove] = useState(false);

  function onToggleDelete() {
    setIsDelete((p) => !p);
  }

  function onToggleApprove() {
    setIsApprove((p) => !p);
  }

  return (
    <>
      <div className="w-full p-3 bg-white rounded-lg border h-fit flex gap-y-3 sm:gap-y-4 flex-col items-start justify-start">
        <div className="w-full flex items-start justify-between ">
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

        <p className="text-start">
          The question you asked will appear here, can you see it?
        </p>
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
          iconName=""
        />
      )}
      {isApprove && (
        <ActionModal
          buttonColor="bg-[#001fcc]"
          buttonText="Approve Question"
          close={onToggleApprove}
          description="Deleted question will not be visible to others"
          title="You are about to delete this question"
          transparentColor="bg-[#001fcc]/10"
          iconName="codicon:check-all"
          iconColor="#001fcc"
          mainColor="text-[#001fcc]"
        />
      )}
    </>
  );
}

export function AwaitingReview() {
  return (
    <div className="w-full max-w-2xl overflow-y-auto  no-scrollbar h-full mx-auto">
      <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((_) => (
          <AwaitingReviewCard key={_} />
        ))}
      </div>
    </div>
  );
}
