"use client";

import { Button } from "@/components/custom_ui/Button";
import {
  AllQuestions,
  MyQuestions,
  TopSection,
  AskandReplyModal,
} from "../_components";
import { useState, useEffect, useMemo } from "react";
import { Plus } from "styled-icons/bootstrap";
import { Minimize2 } from "styled-icons/feather";
import { AwaitingReview, EventQaAdvert } from "./_components";
import { cn } from "@/lib";
import {
  useGetQAQuestions,
  useQARealtimePresence,
} from "@/hooks/services/eventQa";
import { generateAlias } from "@/utils";
import { useFetchSingleEvent, useVerifyUserAccess } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TEventQa, TEventQAQuestion } from "@/types";
import { useGetData } from "@/hooks/services/request";
import useUserStore from "@/store/globalUserStore";

const supabase = createClientComponentClient();
export default function EventQaOrganizerView({
  eventId,
  qaId,
}: {
  eventId: string;
  qaId: string;
}) {
  const [active, setActive] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isRightBox, setIsRightBox] = useState(true);
  const { data, loading } = useFetchSingleEvent(eventId);
  const [isLeftBox, setIsLeftBox] = useState(true);
  const { user } = useUserStore();
  const [filterValue, setFilterValue] = useState("Recent");
  const { data: qa } = useGetData<TEventQa>(`/engagements/qa/${qaId}`);
  const [replyQuestion, setReplyQuestion] = useState<TEventQAQuestion | null>(
    null
  );
  const { eventQAQuestions, setEventQAQuestions, isLoading, getQAQUestions } =
    useGetQAQuestions({ qaId });
  useQARealtimePresence();

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
        console.log("payload from live UPDATE", payload);
        const updated = payload.new as TEventQAQuestion;
        if (eventQAQuestions) {
          const updatedQuestions = eventQAQuestions.map((item) => {
            if (item.id === updated.id) {
              return { ...updated };
            }
            return item;
          });
          setEventQAQuestions(updatedQuestions);
  
          if (replyQuestion !== null && replyQuestion?.id === updated.id) {
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
    if (Array.isArray(filteredEventQaQuestions) && user) {
      return filteredEventQaQuestions?.filter(
        (qa) => qa?.userId === String(user?.id)
      );
    } else {
      return [];
    }
  }, [filteredEventQaQuestions, user]);

  const awaitingReview = useMemo(() => {
    if (Array.isArray(eventQAQuestions)) {
      return eventQAQuestions?.filter(
        (qa) => qa?.questionStatus === "pending"
      );
    } else {
      return [];
    }
  }, [eventQAQuestions]);

  function initiateReply(question: TEventQAQuestion | null) {
    setReplyQuestion(question);
  }
  function replyToNull() {
    setReplyQuestion(null);
  }

  if (!data && isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="w-full h-full">
      
        <div
          className={cn(
            "w-full rounded-lg h-[100vh] relative bg-white gap-6 grid grid-cols-8"
          )}
        >
          <EventQaAdvert
            eventName={data?.eventTitle ?? ""}
            close={() => {
              setIsRightBox(!isRightBox);
              // setIsLeftBox(true)
            }}
            closeMobile={() => {
              setIsRightBox(true);
               setIsLeftBox(false)
            }}
            isLeftBox={isLeftBox}
            isRightBox={isRightBox}
            qa={qa}
          />
          <div
            className={cn(
              "w-full h-[100vh] col-span-full md:col-span-6 relative rounded-lg bg-[#F9FAFF]",
              !isLeftBox && isRightBox && "col-span-full block",
              !isRightBox && "hidden"
            )}
          >
              <TopSection
          setActiveState={setActiveState}
          activeState={active}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          allQuestionsCount={filteredEventQaQuestions?.length || 0}
          myQuestionsCount={myQuestions?.length || 0}
          awaitingReviewCount={awaitingReview?.length || 0}
          qa={qa}
          eventAlias={eventId}
        />
          <div className="w-full pt-6 px-4">
          {active === 1 && (
              <AllQuestions
                initiateReply={initiateReply}
                replyQuestion={replyQuestion}
                replyToNull={replyToNull}
                refetch={
                  qa?.accessibility?.live ? async () => {} : getQAQUestions
                }
                eventQAQuestions={filteredEventQaQuestions || []}
                userDetail={{
                  userId: String(user?.id),
                  userNickName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
                  userImage: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
                }}
                qa={qa}
              />
            )}
            {active === 2 && (
              <MyQuestions
                refetch={
                  qa?.accessibility?.live ? async () => {} : getQAQUestions
                }
                qa={qa}
                myQuestions={myQuestions}
                userDetail={{
                  userId: String(user?.id),
                  userNickName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
                  userImage: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
                }}
              />
            )}
            {active === 3 && (
              <AwaitingReview
                refetch={
                  qa?.accessibility?.live ? async () => {} : getQAQUestions
                }
                awaitingReview={awaitingReview}
                qa={qa}
                
              />
            )}
          </div>
               {/*** floating left button mobile*/}
               <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsLeftBox(true);
                setIsRightBox(false)
              }}
              className="px-0 block md:hidden absolute z-50 left-8  bottom-16 sm:left-10 sm:bottom-20 h-fit w-fit"
            >
              <Minimize2 size={20} />
            </Button>
            {/*** floating left button desktop */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsLeftBox(!isLeftBox);
              }}
              className="px-0 hidden md:block absolute z-50 left-8  bottom-16 sm:left-10 sm:bottom-20 h-fit w-fit"
            >
              <Minimize2 size={20} />
            </Button>
           {active === 1 && <Button
              onClick={onShowQuestionModal}
              className="h-14 w-14 fixed z-50 right-8 px-0 bottom-16 sm:right-10 sm:bottom-20 rounded-full bg-basePrimary"
            >
              <Plus size={40} className="text-white" />
            </Button>}
          </div>
        </div>
      </div>
      {isOpen && data && (
        <AskandReplyModal
          userDetail={{
            userId: String(user?.id),
            userNickName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
            userImage: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
          }}
          qa={qa}
          QandAAlias={qaId}
          refetch={qa?.accessibility?.live ? async () => {} : getQAQUestions}
          close={onShowQuestionModal}
        />
      )}
    </>
  );
}
