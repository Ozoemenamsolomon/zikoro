"use client";

import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { Option } from "..";
import { Button } from "@/components";
import {Maximize2} from "@styled-icons/feather/Maximize2"
import { useState } from "react";
import { cn } from "@/lib";
export function Qusetion({isRightBox, isLeftBox, toggleRightBox,toggleLeftBox}:{isRightBox: boolean; isLeftBox:boolean; toggleLeftBox:() => void; toggleRightBox:() => void}) {

  return (
    <div className="w-full h-full bg-white relative col-span-5 px-6 py-12 border-x  flex flex-col items-start justify-between gap-3">
        <Button
        onClick={toggleRightBox}
        className={cn("absolute right-2 top-2", isRightBox && "hidden")}>
            <Maximize2 size={20}/>
        </Button>
        <Button 
        onClick={toggleLeftBox}
        className={cn("absolute bottom-1 left-1", isLeftBox && "hidden")}>
            <Maximize2 size={20}/>
        </Button>
      <div className="border-b border-gray-500 gap-3 pb-2 w-full flex items-end justify-between">
        <p className="italic w-full text-gray-500">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
          <p>0:40</p>
          <Time size={15} />
        </div>
      </div>

      <div className="flex items-center flex-col justify-center w-full gap-3">
        <p className="font-medium w-full">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled
        </p>
        <Image
          className="w-52 sm:w-72 rounded-md h-48 sm:h-52 object-cover"
          alt="quiz"
          src="/quizimage.png"
          width={400}
          height={400}
        />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[true, false, false, false].map((_, index) => (
          <Option key={index} isCorrect={_} />
        ))}
      </div>

      <div className="w-full mt-3 flex items-end justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            //  onClick={onClose}
            className="text-basePrimary  hover:text-gray-50 border border-basePrimary bg-white hover:bg-basePrimary gap-x-2 h-11 font-medium flex"
          >
            <p>Previous</p>
          </Button>
          <Button
            //  onClick={onClose}
            className="text-gray-50 bg-basePrimary gap-x-2 h-11 font-medium flex"
          >
            <p>Next</p>
          </Button>
        </div>
        <p className="text-xs sm:text-mobile text-gray-500">1/50</p>

        <p className="w-1 h-1"></p>
      </div>
    </div>
  );
}
