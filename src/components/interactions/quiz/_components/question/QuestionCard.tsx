"use client";

import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { FeedStar } from "@styled-icons/octicons/FeedStar";
import { Button } from "@/components";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
export function QuestionCard() {
  return (
    <div className="w-full p-3 rounded-lg gap-2 grid grid-cols-6">
      <Image
        src="/quizimage.png"
        alt="question-image"
        width={600}
        height={400}
        className="w-full h-[250px] rounded-lg col-span-3"
      />
      <div className="text-mobile sm:text-sm w-full flex flex-col items-start justify-start col-span-4 gap-y-2">
        <p className="text-gray-400">Question 1</p>
        <p className="w-full line-clamp-3 font-medium leading-3">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using.
        </p>
        <div className="flex items-center gap-x-2">
          <div className="flex bg-basePrimary/10 items-center font-medium text-xs text-basePrimary gap-x-2">
            <p> 10pts</p>
            <FeedStar size={20} />
          </div>
          <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-2">
            <p>00:00:40</p>
            <Time size={20} />
          </div>
          <Button className="px-0 w-fit text-red-500 h-fit">
            <DeleteOutline size={20} />
          </Button>
          <Button className="px-0 w-fit h-fit">
            <Copy size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
