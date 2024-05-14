"use client";

import { QUsers } from "@/constants";
import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { FeedStar } from "@styled-icons/octicons/FeedStar";
import { Button } from "@/components";
import { Option } from "..";
import { useRef, useEffect, useMemo } from "react";
import { TQuestion } from "@/types";
import { millisecondsToTime } from "@/utils";

export function ActiveQuestion({
  setHeight,
  activeQuestion,
  questions
}: {
  setHeight: (n: number) => void;
  activeQuestion: TQuestion | null;
  questions: TQuestion[]
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

  const duration = useMemo(() => {
    return millisecondsToTime(Number(activeQuestion?.duration || 0));
  }, [activeQuestion?.duration]);

  const points = useMemo(() => {
    // MAP AND SOME ALL POINTS    
    const allPoints = questions?.map(({points}) => Number(points))
    const sumOfPoints = allPoints.reduce((sum, point) => sum + point, 0)
    return sumOfPoints || 0
  },[questions])

  return (
    <div ref={divRef} className="w-full h-fit bg-gray-100 rounded-md py-4 px-3">
      {activeQuestion ? (
        <>
          <div className="text-gray-500 mb-3 text-xs ms:text-mobile flex items-center justify-between w-full">
            <p className="flex items-center gap-x-2">
              <span className="border-r pr-2 border-gray-500">
                {`${questions?.length} Questions`}
              </span>
              <span>{`${points} points`}</span>
            </p>
            <p className="flex items-center gap-x-1">
              <QUsers />
              <span>15</span>
            </p>
          </div>
          <div className="w-full text-mobile sm:text-sm py-3 bg-white rounded-md flex flex-col items-start justify-start gap-y-3">
            <div className="border-b text-gray-500 px-3 border-gray-600 gap-3 pb-2 w-full flex items-center justify-between">
            <div className="flex w-full items-center px-3 justify-between">
              <div className="flex bg-basePrimary/10 px-2 py-1 items-center font-medium text-xs text-basePrimary gap-x-1">
                <p>{`${activeQuestion?.points ?? "0"}pts`}</p>
                <FeedStar size={15} />
              </div>
              <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
              <p>{duration ?? 0}</p>
                <Time size={15} />
              </div>
            </div>
            </div>
          
            <div className="w-full px-3">
              {activeQuestion?.questionImage ? (
                <Image
                  className="w-full rounded-md h-36 object-cover"
                  alt="quiz"
                  src={activeQuestion?.questionImage}
                  width={400}
                  height={400}
                />
              ) : (
                <div className="w-full rounded-md h-36 bg-gray-200 animate-pulse"></div>
              )}
            </div>
            <p className="font-medium w-full px-3">
              {activeQuestion?.question ?? ""}
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
        </>
      ) : (
        <div className="w-full h-[600px] flex items-center justify-center">
          <p className="font-medium text-sm">No Question Selected</p>
        </div>
      )}
    </div>
  );
}
