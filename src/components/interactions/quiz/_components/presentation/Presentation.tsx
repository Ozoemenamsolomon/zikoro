"use client";

import { Advert, LeaderBoard, Qusetion } from "..";
import { useState } from "react";
export default function Presentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const [isRightBox, setRightBox] = useState(true);
  const [isLeftBox, setLeftBox] = useState(true);

  function onClose() {
    setLeftBox((prev) => !prev);
  }

  function onToggle() {
    setRightBox((prev) => !prev);
  }
  return (
    <div className="w-full  p-4 sm:p-8">
      <div className="w-full grid md:grid-cols-11   h-full  items-start">
        <Advert isLeftBox={isLeftBox} close={onClose} />
        <Qusetion
          isLeftBox={isLeftBox}
          isRightBox={isRightBox}
          toggleRightBox={onToggle}
          toggleLeftBox={onClose}
        />
        <LeaderBoard isRightBox={isRightBox} close={onToggle} />
      </div>
    </div>
  );
}
