"use client";

import { Minimize2 } from "@styled-icons/feather/Minimize2";
import Image from "next/image";
import { Button } from "@/components";
import { cn } from "@/lib";
import { useMemo } from "react";
import { TAnswer } from "@/types";
import { QUser } from "@/constants";

type TLeaderBoard = {
  quizParticipantId: string;
  attendeeName: string;
  image?: string;
  totalScore: number;
};

export function LeaderBoard({
  isRightBox,
  isLeftBox,
  close,
  answers,
}: {
  isLeftBox: boolean;
  isRightBox: boolean;
  close: () => void;
  answers: TAnswer[];
}) {
  //console.log(answers);
  const board = useMemo(() => {
    const participantGroup: { [key: string]: TLeaderBoard } = {};
    if (Array.isArray(answers) && answers.length > 0) {
      answers?.forEach((ans) => {
        const key = ans?.quizParticipantId;
        if (!participantGroup[key]) {
          participantGroup[key] = {
            quizParticipantId: ans?.quizParticipantId,
            attendeeName: ans?.attendeeName,
            totalScore: 0,
          };
        }
        participantGroup[key].totalScore += Number(ans?.attendeePoints);
      });

      const result = Object.values(participantGroup);

      const data = result.sort((a, b) => {
        return b?.totalScore - a?.totalScore;
      });

      return data;
    } else {
      return [];
    }
  }, [answers]);

  // console.log(board);
  const ranksImage = [
    "/firstPosition.png",
    "/secondPosition.png",
    "/thirdPosition.png",
  ];

  return (
    <div
      className={cn(
        "w-full col-span-3 bg-white h-[90vh] rounded-r-xl hidden  md:hidden",
        isRightBox && "block md:block ",
        !isLeftBox && "col-span-4"
      )}
    >
      <div className="flex items-center p-4 justify-between w-full border-b">
        <h2 className="font-semibold  text-base sm:text-xl">LeaderBoard</h2>
        <div className="flex items-center gap-x-2">
          <div className="text-xs flex items-center gap-x-1">
            <QUser />
            <p>{board?.length || 0}</p>
          </div>
          <Button onClick={close} className="px-0 h-fit w-fit">
            <Minimize2 size={20} />
          </Button>
        </div>
      </div>
      <div className="font-semibold text-sm w-full grid grid-cols-2 gap-2 bg-gray-200 px-4 py-3">
        <p>Name</p>
        <p>Total</p>
      </div>
      <div className="w-full overflow-y-auto h-full space-y-2">
        {board?.map((attendee, index) => (
          <div
            key={attendee?.quizParticipantId}
            className="grid grid-cols-2  tranform transition-all duration-300 ease-in-out gap-2 px-3 py-3"
          >
            <div className="flex items-center gap-x-2">
              {index <= 2 ? (
                <Image
                  src={ranksImage[index]}
                  alt="ranks"
                  width={20}
                  height={20}
                  className="w-[25px] h-[25px]"
                />
              ) : (
                <p>{`${index + 1}.`}</p>
              )}
              <p>{attendee?.attendeeName ?? ""}</p>
            </div>
            <p>{(attendee?.totalScore ?? 0)?.toFixed(0)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
