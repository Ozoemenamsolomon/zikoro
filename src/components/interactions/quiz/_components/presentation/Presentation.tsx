"use client";

import { Advert, LeaderBoard, Qusetion } from "..";
import { useState } from "react";
import {useGetQuiz} from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
export default function Presentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, isLoading, getQuiz } = useGetQuiz({ quizId });
  const [isRightBox, setRightBox] = useState(true);
  const [isLeftBox, setLeftBox] = useState(true);

  function onClose() {
    setLeftBox((prev) => !prev);
  }

  function onToggle() {
    setRightBox((prev) => !prev);
  }
  return (
    <div className="w-full">
     {quiz ?
     
     <div className="w-full grid md:grid-cols-11 h-full items-start">
     <Advert quiz={quiz} isRightBox={isRightBox} isLeftBox={isLeftBox} close={onClose} />
     <Qusetion
       isLeftBox={isLeftBox}
       quiz={quiz}
       isRightBox={isRightBox}
       toggleRightBox={onToggle}
       toggleLeftBox={onClose}
     />
     <LeaderBoard isRightBox={isRightBox} isLeftBox={isLeftBox} close={onToggle} />
   </div>
     :
     <div className="w-full h-[40vh] flex items-center justify-center">
     <LoaderAlt size={30} className="animate-spin"/>
    </div>
   
     }
    </div>
  );
}
