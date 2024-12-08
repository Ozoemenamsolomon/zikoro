"use client";

import { Button } from "@/components/custom_ui/Button";
import {
  AllQuestions,
  MyQuestions,
  TopSection,
  AskandReplyModal,
} from "../_components";
import { useState } from "react";
import { Plus } from "styled-icons/bootstrap";
import { Minimize2 } from "styled-icons/feather";
import { AwaitingReview, EventQaAdvert } from "./_components";
import { cn } from "@/lib";

export default function EventQaOrganizerView({eventId, qaId}:{eventId:string; qaId:string}) {
  const [active, setActive] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isRightBox, setIsRightBox] = useState(true);
  const [isLeftBox, setIsLeftBox] = useState(true);

  function setActiveState(n: number) {
    setActive(n);
  }

  function onShowQuestionModal() {
    setIsOpen((p) => !p);
  }
  return (
    <>
      <div className="w-full h-full">
        <TopSection
          setActiveState={setActiveState}
          activeState={active}
          allQuestionsCount={0}
          myQuestionsCount={0}
          awaitingReviewCount={0}
        />
        <div
          className={cn(
            "w-full rounded-lg h-[95vh] relative bg-white gap-6 grid grid-cols-8"
          )}
        >
          <EventQaAdvert
            eventName="Event Name"
            close={() => {
                setIsRightBox(!isRightBox)
               // setIsLeftBox(true)
            }}
            isLeftBox={isLeftBox}
            isRightBox={isRightBox}
          />
          <div
            className={cn(
              "w-full h-[95vh] col-span-6 pt-6 relative rounded-lg bg-[#F9FAFF]",
              !isLeftBox && isRightBox && "col-span-full",
              !isRightBox && "hidden"
            )}
          >
            {active === 1 && <AllQuestions />}
            {active === 2 && <MyQuestions />}
            {active === 3 && <AwaitingReview />}
            {/*** floating button */}
            <Button onClick={(e) => {
          e.stopPropagation()
          setIsLeftBox(!isLeftBox)
        }} className="px-0 absolute z-50 left-8  bottom-16 sm:left-10 sm:bottom-20 h-fit w-fit">
          <Minimize2 size={20} />
        </Button>
            <Button
            onClick={onShowQuestionModal}
            className="h-14 w-14 fixed z-50 right-8 px-0 bottom-16 sm:right-10 sm:bottom-20 rounded-full bg-basePrimary">
              <Plus size={40} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
      {isOpen && <AskandReplyModal close={onShowQuestionModal} />}
    </>
  );
}
