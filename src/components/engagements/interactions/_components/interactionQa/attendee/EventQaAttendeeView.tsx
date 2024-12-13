"use client";

import { useEffect, useState } from "react";
import { JoinQA } from "./_components";
import {
  AllQuestions,
  AskandReplyModal,
  MyQuestions,
  TopSection,
} from "../_components";
import { Plus } from "styled-icons/bootstrap";
import { Button } from "@/components/custom_ui/Button";
import {
  useGetQAQuestions,
  useQARealtimePresence,
} from "@/hooks/services/eventQa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TEventQAQuestion } from "@/types";
import { AvatarFullConfig } from "react-nice-avatar";
import { useMemo } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";

export type UserDetail = {
  userId: string;
  userImage: Required<AvatarFullConfig> | string;
  userNickName: string;
};
const supabase = createClientComponentClient();
export default function EventQaAttendeeView({
  qaId,
  eventId,
}: {
  qaId: string;
  eventId: string;
}) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [active, setActive] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("Recent");
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [replyQuestion, setReplyQuestion] = useState<TEventQAQuestion | null>(
    null
  );
  const { eventQAQuestions, setEventQAQuestions, isLoading, getQAQUestions } =
    useGetQAQuestions({ qaId });
  useQARealtimePresence();
  function toggleJoin() {
    setIsSignedIn((p) => !p);
  }

  function setActiveState(n: number) {
    setActive(n);
  }

  function onShowQuestionModal() {
    setIsOpen((p) => !p);
  }

  function addUser(user: UserDetail) {
    setUserDetail(user);
  }

  const filteredEventQaQuestions = useMemo(() => {
    if (Array.isArray(eventQAQuestions)) {
      if (filterValue === "Recent") {
        return eventQAQuestions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (filterValue === "Top Liked") {
        return eventQAQuestions.sort((a, b) => b.vote - a.vote);
      }
    } else return [];
  }, [eventQAQuestions, filterValue]);

  const myQuestions = useMemo(() => {
    if (Array.isArray(filteredEventQaQuestions) && userDetail) {
      return filteredEventQaQuestions?.filter(
        (qa) => qa?.userId === userDetail?.userId
      );
    } else {
      return [];
    }
  }, [eventQAQuestions]);

  // subscribe to qa
  useEffect(() => {
    // function subscribeToUpdate() {
    console.log("in it");
    const channel = supabase
      .channel("live-quiz")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "QandAQuestions",
          filter: `QandAAlias=eq.${qaId}`,
        },
        (payload) => {
        // console.log("payload from live", payload);
          const updated = payload.new as TEventQAQuestion;
          if (eventQAQuestions) {
            const updatedQuestions = eventQAQuestions?.map((item) => {
              if (item.id === updated.id) {
                return {
                  ...updated,
                };
              }
              return item;
            });
            setEventQAQuestions(updatedQuestions);
           //  console.log("payload from live", payload.new, {replyQuestion});
            if (replyQuestion !== null && replyQuestion?.id === updated.id) {

           //   console.log("yes")
              setReplyQuestion(updated)
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status); 
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, eventQAQuestions]);

  useEffect(() => {
    // function subscribeToUpdate() {
    console.log("in it Insert");
    const channel = supabase
      .channel("live-quiz")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Q&AQuestions",
          filter: `QandAAlias=eq.${qaId}`,
        },
        (payload) => {
          console.log("payload from live INSERT", payload);
          // setEventQAQuestions(payload.new as TEventQAQuestion[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  console.log("qas ", eventQAQuestions);

  function initiateReply(question: TEventQAQuestion) {
    setReplyQuestion(question);
  }

  function replyToNull()  {
    setReplyQuestion(null)
  }

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      {!isSignedIn && <JoinQA joined={toggleJoin} addUser={addUser} />}

      <div className="w-full h-full">
        <TopSection
          isAttendee={true}
          allQuestionsCount={filteredEventQaQuestions?.length || 0}
          myQuestionsCount={myQuestions?.length || 0}
          setActiveState={setActiveState}
          activeState={active}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />

        <div className="w-full h-[95vh] rounded-lg pt-5 sm:pt-6 bg-[#F9FAFF]">
          {active === 1 && userDetail && (
            <AllQuestions
              refetch={getQAQUestions}
              isAttendee
              eventQAQuestions={eventQAQuestions || []}
              userDetail={userDetail}
              initiateReply={initiateReply}
              replyQuestion={replyQuestion}
              replyToNull={replyToNull}
            />
          )}
          {active === 2 && (
            <MyQuestions
              refetch={getQAQUestions}
              isAttendee
              myQuestions={myQuestions}
            />
          )}
          {/*** floating button */}
          <Button
            onClick={onShowQuestionModal}
            className="h-14 w-14 fixed z-50 right-8 px-0 bottom-16 sm:right-10 sm:bottom-20 rounded-full bg-basePrimary"
          >
            <Plus size={40} className="text-white" />
          </Button>
        </div>
      </div>

      {isOpen && userDetail && (
        <AskandReplyModal
          userDetail={userDetail}
          QandAAlias={qaId}
          isAttendee
          close={onShowQuestionModal}
          refetch={getQAQUestions}
        />
      )}
    </>
  );
}
