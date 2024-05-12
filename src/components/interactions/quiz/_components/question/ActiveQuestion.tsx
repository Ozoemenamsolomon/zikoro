"use client";

import { QUsers } from "@/constants";
import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { FeedStar } from "@styled-icons/octicons/FeedStar";
import { Button } from "@/components";
import { Option } from "..";
import { useRef, useEffect } from "react";
export function ActiveQuestion({
  setHeight,
}: {
  setHeight: (n: number) => void;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function updateHeight() {
      if (divRef?.current && window.innerWidth >= 1024) {
        const rect = divRef?.current?.getBoundingClientRect();
        setHeight(rect.height);
        // console.log("yup", rect);
      } else {
        setHeight(0);
      }
    }

    window.addEventListener("scroll", updateHeight);

    return () => {
      window.removeEventListener("scroll", updateHeight);
    };
  }, [window.innerWidth, divRef]);
  return (
    <div ref={divRef} className="w-full h-fit bg-gray-100 rounded-md py-4 px-3">
      <div className="text-gray-500 mb-3 text-xs ms:text-mobile flex items-center justify-between w-full">
        <p className="flex items-center gap-x-2">
          <span className="border-r pr-2 border-gray-500">50 Questions</span>
          <span>1000 points</span>
        </p>
        <p className="flex items-center gap-x-1">
          <QUsers />
          <span>15</span>
        </p>
      </div>
      <div className="w-full text-mobile sm:text-sm py-3 bg-white rounded-md flex flex-col items-start justify-start gap-y-3">
        <div className="border-b text-gray-500 px-3 border-gray-600 gap-3 pb-2 w-full flex items-center justify-between">
          <p className="italic w-full line-clamp-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled
          </p>
        </div>
        <div className="flex w-full items-center px-3 justify-between">
          <div className="flex bg-basePrimary/10 px-2 py-1 items-center font-medium text-xs text-basePrimary gap-x-1">
            <p> 10pts</p>
            <FeedStar size={15} />
          </div>
          <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
            <p>0:40</p>
            <Time size={15} />
          </div>
        </div>
        <div className="w-full px-3">
          <Image
            className="w-full rounded-md h-36 object-cover"
            alt="quiz"
            src="/quizimage.png"
            width={400}
            height={400}
          />
        </div>
        <p className="font-medium w-full px-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled
        </p>
        <div className="flex flex-col px-3 w-full items-start justify-start gap-y-2">
          {[true, false, false, false].map((_, index) => (
            <Option key={index} isCorrect={_} />
          ))}
        </div>

        <div className="w-full px-3 flex mt-3 items-end justify-between">
          <p className="text-xs sm:text-mobile text-gray-500">1/50</p>

          <div className="flex items-center gap-x-2">
            <Button
              //  onClick={onClose}
              className="text-basePrimary w-[95px] border border-basePrimary hover:text-gray-50 bg-white hover:bg-basePrimary gap-x-2 h-10 font-medium flex"
            >
              <p>Previous</p>
            </Button>
            <Button
              //  onClick={onClose}
              className="text-gray-50 w-[95px] bg-basePrimary gap-x-2 h-10 font-medium flex"
            >
              <p>Next</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
