"use client";

import { useEffect, useState } from "react";
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
import { TEventQa, TEventQAQuestion } from "@/types";
import { useMemo } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useGetData } from "@/hooks/services/request";
import { useVerifyUserAccess } from "@/hooks";
import useAccessStore from "@/store/globalAcessStore";


const supabase = createClientComponentClient();
export default function EventQaAttendeeView({
  qaId,
  eventId,
}: {
  qaId: string;
  eventId: string;
}) {
  const [active, setActive] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("Recent");
  const { data: qa } = useGetData<TEventQa>(`/engagements/qa/${qaId}`);
 const {userAccess, setUserAccess} = useAccessStore()

  const { attendee, loading } = useVerifyUserAccess(eventId);
  const [replyQuestion, setReplyQuestion] = useState<TEventQAQuestion | null>(
    null
  );
  const { eventQAQuestions, setEventQAQuestions, isLoading, getQAQUestions } =
    useGetQAQuestions({ qaId });
  useQARealtimePresence();
 

  function setActiveState(n: number) {
    setActive(n);
  }

  function onShowQuestionModal() {
    setIsOpen((p) => !p);
  }

  

  const filteredEventQaQuestions = useMemo(() => {
    if (Array.isArray(eventQAQuestions)) {
      if (filterValue === "Recent") {
        return eventQAQuestions
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .filter((v) => v?.questionStatus !== "pending");
      } else if (filterValue === "Top Liked") {
        return eventQAQuestions
          .sort((a, b) => b.vote - a.vote)
          .filter((v) => v?.questionStatus !== "pending");
      }
    } else return [];
  }, [eventQAQuestions, filterValue]);

  const myQuestions = useMemo(() => {
    if (Array.isArray(eventQAQuestions)) {
      if (filterValue === "Recent") {
        return eventQAQuestions
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .filter((qa) => qa?.userId === ( attendee?.attendeeAlias||userAccess?.userId));
      } else if (filterValue === "Top Liked") {
        return eventQAQuestions
          .sort((a, b) => b.vote - a.vote)
          .filter((qa) => qa?.userId === ( attendee?.attendeeAlias||userAccess?.userId));
      } else return [];
    } else return [];
  }, [eventQAQuestions, userAccess, attendee, filterValue]);

  // subscribe to qa
  useEffect(() => {
    // function subscribeToUpdate() {
    if (!qa?.accessibility?.live) return;
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
              setReplyQuestion(updated);
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
    if (!qa?.accessibility?.live) return;
    const channel = supabase
      .channel("live-quiz")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "QandAQuestions",
          filter: `QandAAlias=eq.${qaId}`,
        },
        (payload) => {
          //  console.log("payload from live INSERT", payload);
          if (eventQAQuestions)
            setEventQAQuestions([
              ...eventQAQuestions,
              payload.new as TEventQAQuestion,
            ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, eventQAQuestions]);

  console.log("qas ", eventQAQuestions);

  function initiateReply(question: TEventQAQuestion | null) {
    setReplyQuestion(question);
  }

  function replyToNull() {
    setReplyQuestion(null);
  }

  if (isLoading && loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* {!isSignedIn && <JoinQA joined={toggleJoin} addUser={addUser} />} */}

      <div className="w-full h-full">
        <TopSection
          isAttendee={true}
          allQuestionsCount={filteredEventQaQuestions?.length || 0}
          myQuestionsCount={myQuestions?.length || 0}
          setActiveState={setActiveState}
          activeState={active}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          eventAlias={eventId}
        />

        <div className="w-full h-[95vh] rounded-lg pt-5 sm:pt-6 bg-[#F9FAFF]">
          {active === 1 && (
            <AllQuestions
              refetch={
                qa?.accessibility?.live ? async () => {} : getQAQUestions
              }
              isAttendee
              eventQAQuestions={filteredEventQaQuestions || []}
              userDetail={userAccess}
              initiateReply={initiateReply}
              replyQuestion={replyQuestion}
              replyToNull={replyToNull}
              qa={qa}
            />
          )}
          {active === 2 && (
            <MyQuestions
              refetch={
                qa?.accessibility?.live ? async () => {} : getQAQUestions
              }
              isAttendee
              myQuestions={myQuestions}
              qa={qa}
            //  userDetail={userAccess}
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

      {isOpen && (
        <AskandReplyModal
          userDetail={{
            userId: attendee?.attendeeAlias || userAccess?.userId || "",
            userImage: attendee
              ? `${attendee?.firstName} ${attendee?.lastName}`
              : userAccess?.userImage || "",
            userNickName: attendee
              ? `${attendee?.firstName} ${attendee?.lastName}`
              : userAccess?.userNickName || "",
          }}
          QandAAlias={qaId}
          isAttendee
          close={onShowQuestionModal}
          setUserAccess={setUserAccess}
          refetch={qa?.accessibility?.live ? async () => {} : getQAQUestions}
          
        />
      )}
    </>
  );
}
