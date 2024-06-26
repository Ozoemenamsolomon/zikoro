"use client";
import { Button } from "@/components";
import { cn } from "@/lib";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import Avatar, { AvatarFullConfig, genConfig } from "react-nice-avatar";
export function AvatarModal({
  close,
  chosenAvatar,
  setChosenAvatar,
}: {
  close: () => void;
  chosenAvatar: Required<AvatarFullConfig> | null;
  setChosenAvatar: React.Dispatch<
    React.SetStateAction<Required<AvatarFullConfig> | null>
  >;
}) {
 
  const [avatars, setAvatars] = useState<{avatar: Required<AvatarFullConfig>}[]>([])

  function generateAvatars() {
    const avatars = Array.from({ length: 10 }).map((_, index) => {
      return {
        avatar: genConfig(),
      };
    });

    setAvatars(avatars);
  }

  useEffect(() => {
    generateAvatars()
  },[])

 
  return (
    <div
      onClick={close}
      className="w-full h-full fixed inset-0 z-[100] bg-black/40"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-w-xl rounded-lg bg-white absolute m-auto inset-0 h-fit p-4"
      >
        <div className="w-full flex items-end justify-end mb-3">
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
          <h2 className="font-semibold text-base sm:text-xl">
            Select an Avatar
          </h2>
          <div className="w-full flex flex-wrap gap-3 items-center justify-center">
            {avatars?.map(({ avatar }, index) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChosenAvatar(avatar);
                }}
                key={index}
                className={cn(
                  "w-fit h-fit rounded-full",
                  chosenAvatar === avatar && "border-2 border-basePrimary"
                )}
              >
                <Avatar
                  className="w-[80px] h-[80px] rounded-full"
                  {...avatar}
                />
              </button>
            ))}
          </div>

          <Button
            onClick={generateAvatars}
            className="w-[80%] bg-gray-100 border rounded-lg h-11 "
          >
            Regenerate Avatar
          </Button>
        </div>
      </div>
    </div>
  );
}
