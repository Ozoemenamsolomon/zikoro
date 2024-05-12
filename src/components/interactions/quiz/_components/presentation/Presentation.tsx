"use client";

import { Advert, LeaderBoard, Qusetion } from "..";
import { useState } from "react";
export default function Presentation({eventId, quizId}:{eventId:string; quizId:string;}) {
  const [isRightBox, setRightBox] = useState(true);
  const [isLeftBox, setLeftBox] = useState(true);

  function onClose() {
    setLeftBox((prev) => !prev);
  }
  return (
    <div className="w-full bg-basePrimary/10 p-4 sm:p-8">
      <div className="w-full grid grid-cols-10 bg-white rounded-xl h-full  items-start">
        <Advert isLeftBox={isLeftBox} close={onClose} />
        <Qusetion isLeftBox={isLeftBox} isRightBox={isRightBox} />
        <LeaderBoard />
      </div>
    </div>
  );
}
