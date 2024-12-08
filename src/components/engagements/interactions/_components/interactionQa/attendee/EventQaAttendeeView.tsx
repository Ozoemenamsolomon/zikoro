"use client";

import { useState } from "react";
import { JoinQA } from "./_components";
import { AllQuestions, AskandReplyModal, MyQuestions, TopSection } from "../_components";
import { Plus } from "styled-icons/bootstrap";
import { Button } from "@/components/custom_ui/Button";

export default function EventQaAttendeeView({
  qaId,
  eventId,
}: {
  qaId: string;
  eventId: string;
}) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [active, setActive] = useState(1);
  const [isOpen, setIsOpen] = useState(false)

  function toggleJoin() {
    setIsSignedIn((p) => !p);
  }

  function setActiveState(n: number) {
    setActive(n);
  }

  function onShowQuestionModal() {
    setIsOpen((p) => !p)
  }
  return (
    <>
      {!isSignedIn && <JoinQA joined={toggleJoin} />}

      <div className="w-full h-full">
        <TopSection
          isAttendee={true}
          allQuestionsCount={0}
          myQuestionsCount={0}
          setActiveState={setActiveState}
          activeState={active}
        />

        <div className="w-full h-[95vh] rounded-lg pt-5 sm:pt-6 bg-[#F9FAFF]">
          {active === 1 && <AllQuestions isAttendee />}
          {active === 2 && <MyQuestions isAttendee />}
          {/*** floating button */}
          <Button 
          onClick={onShowQuestionModal}
          className="h-14 w-14 fixed z-50 right-8 px-0 bottom-16 sm:right-10 sm:bottom-20 rounded-full bg-basePrimary">
            <Plus size={40} className="text-white" />
          </Button>
        </div>
      </div>

      {isOpen && <AskandReplyModal close={onShowQuestionModal}/>}
    </>
  );
}