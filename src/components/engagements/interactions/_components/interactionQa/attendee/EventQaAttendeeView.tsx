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
import { InlineIcon } from "@iconify/react";

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
  const { data: qa, isLoading: qaLoading } = useGetData<TEventQa>(
    `/engagements/qa/${qaId}`
  );
  const { userAccess, setUserAccess } = useAccessStore();

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
        const filtered = eventQAQuestions
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .filter((v) => v?.questionStatus !== "pending");

        const pinnedQuestion = filtered.filter((q) => q?.isPinned);
        const unpinnedQuestion = filtered?.filter((q) => !q?.isPinned);

        return [...pinnedQuestion, ...unpinnedQuestion];
      } else if (filterValue === "Top Liked") {
        const filtered = eventQAQuestions
          .sort((a, b) => b.vote - a.vote)
          .filter((v) => v?.questionStatus !== "pending");

        const pinnedQuestion = filtered.filter((q) => q?.isPinned);
        const unpinnedQuestion = filtered?.filter((q) => !q?.isPinned);

        return [...pinnedQuestion, ...unpinnedQuestion];
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
          .filter(
            (qa) =>
              qa?.userId === (attendee?.attendeeAlias || userAccess?.userId)
          );
      } else if (filterValue === "Top Liked") {
        return eventQAQuestions
          .sort((a, b) => b.vote - a.vote)
          .filter(
            (qa) =>
              qa?.userId === (attendee?.attendeeAlias || userAccess?.userId)
          );
      } else return [];
    } else return [];
  }, [eventQAQuestions, userAccess, attendee, filterValue]);

  useEffect(() => {
    if (!qa?.accessibility?.live) return;

    // Create a single channel for the "live-quiz"
    const channel = supabase.channel("live-quiz");

    // Listen for UPDATE events
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "QandAQuestions",
        filter: `QandAAlias=eq.${qaId}`,
      },
      (payload) => {
        //  console.log("payload from live UPDATE", payload);
        const updated = payload.new as TEventQAQuestion;
        if (eventQAQuestions) {
          const updatedQuestions = eventQAQuestions.map((item) => {
            if (item.questionAlias === updated.questionAlias) {
              return { ...updated };
            }
            return item;
          });
          setEventQAQuestions(updatedQuestions);

          if (replyQuestion !== null && replyQuestion?.questionAlias === updated.questionAlias) {
            setReplyQuestion(updated);
          }
        }
      }
    );

    // Listen for INSERT events
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "QandAQuestions",
        filter: `QandAAlias=eq.${qaId}`,
      },
      (payload) => {
        console.log("payload from live INSERT", payload);
        if (eventQAQuestions) {
          setEventQAQuestions([
            ...eventQAQuestions,
            payload.new as TEventQAQuestion,
          ]);
        }
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log("Subscription status:", status);
    });

    return () => {
      // Cleanup the channel on unmount
      supabase.removeChannel(channel);
    };
  }, [supabase, eventQAQuestions, qa]);

  console.log("qas ", eventQAQuestions);

  function initiateReply(question: TEventQAQuestion | null) {
    setReplyQuestion(question);
  }

  function replyToNull() {
    setReplyQuestion(null);
  }

  if (isLoading || loading || qaLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* {!isSignedIn && <JoinQA joined={toggleJoin} addUser={addUser} />} */}
      {!loading &&
        typeof attendee !== "object" &&
        !qa?.accessibility?.visible && (
          <div className="w-full h-full inset-0 fixed z-[100] bg-white">
            <div className="w-[95%] max-w-xl border rounded-lg bg-gradient-to-b gap-y-6 from-white  to-basePrimary/20  h-[400px] flex flex-col items-center justify-center shadow absolute inset-0 m-auto">
              <InlineIcon
                icon="fluent:emoji-sad-20-regular"
                fontSize={60}
                color="#001fcc"
              />
              <div className="w-fit flex flex-col items-center justify-center gap-y-3">
                <p>You are not a registered attendee for this event</p>

                <Button
                  onClick={() => {
                    window.open(
                      `${window.location.origin}/live-events/${eventId}`
                    );
                  }}
                  className="bg-basePrimary h-12 text-white font-medium"
                >
                  Register for the event
                </Button>
              </div>
            </div>
          </div>
        )}

      <div className="w-full h-full pt-6 px-4">
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
              userDetail={userAccess}
            />
          )}
          {/*** floating button */}
          {active === 1 && (
            <Button
              onClick={onShowQuestionModal}
              className="h-14 w-14 fixed z-50 right-8 px-0 bottom-16 sm:right-10 sm:bottom-20 rounded-full bg-basePrimary"
            >
              <Plus size={40} className="text-white" />
            </Button>
          )}
        </div>
      </div>

      {isOpen && !qa?.accessibility?.cannotAskQuestion && (
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
          qa={qa}
          setUserAccess={setUserAccess}
          refetch={qa?.accessibility?.live ? async () => {} : getQAQUestions}
        />
      )}
    </>
  );
}
