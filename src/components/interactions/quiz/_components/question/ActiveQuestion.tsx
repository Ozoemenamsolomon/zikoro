"use client";

import { QUsers } from "@/constants";
import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { FeedStar } from "@styled-icons/octicons/FeedStar";
import { Button } from "@/components";
import { Option } from "..";
export function ActiveQuestion() {
  return (
    <div className="w-full md:col-span-2 h-full bg-gray-200 rounded-md py-4 px-3">
      <div className="text-gray-500 text-xs ms:text-mobile flex items-center justify-between w-full">
        <p className="flex items-center gap-x-2">
          <span className="border-r pr-2 border-gray-500">50 Questions</span>
          <span>1000 points</span>
        </p>
        <p className="flex items-center gap-x-1">
          <QUsers />
          <span>15</span>
        </p>
      </div>
      <div className="w-full text-mobile sm:text-sm bg-white rounded-md flex flex-col items-start justify-start gap-y-3">
        <div className="border-b border-gray-600 gap-3 pb-2 w-full flex items-center justify-between">
          <p className="italic w-full line-clamp-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex bg-basePrimary/10 items-center font-medium text-xs text-basePrimary gap-x-2">
            <p> 10pts</p>
            <FeedStar size={20} />
          </div>
          <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-2">
            <p>0:40</p>
            <Time size={20} />
          </div>
        </div>
        <Image
          className="w-full rounded-md h-36 object-cover"
          alt="quiz"
          src="/quizimage.png"
          width={400}
          height={400}
        />
        <p className="font-medium w-full">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled
        </p>
        <div className="flex flex-col w-full items-start justify-start gap-y-2">
          {[true, false, false, false].map((_, index) => (
            <Option key={index} isCorrect={_} />
          ))}
        </div>

        <div className="w-full flex items-end justify-between">
          <p className="text-xs sm:text-mobile text-gray-500">1/50</p>

          <div className="flex items-center gap-x-2">
            <Button
              //  onClick={onClose}
              className="text-basPrimaray hover:text-gray-50 bg-white hover:bg-basePrimary gap-x-2 h-10 font-medium flex"
            >
              <p>Previous</p>
            </Button>
            <Button
              //  onClick={onClose}
              className="text-gray-50 bg-basePrimary gap-x-2 h-10 font-medium flex"
            >
              <p>Next</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
