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
import { useFetchSingleEvent } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TEventQa, TEventQAQuestion } from "@/types";
import { useGetData } from "@/hooks/services/request";

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
  const [filterValue, setFilterValue] = useState("Recent");
  const {data: qa} = useGetData<TEventQa>(`/engagements/qa/${qaId}`)
  const [replyQuestion, setReplyQuestion] = useState<TEventQAQuestion | null>(
    null
  );
  const { eventQAQuestions, setEventQAQuestions, isLoading, getQAQUestions } =
    useGetQAQuestions({ qaId });
  useQARealtimePresence();

  // subscribe to qa
  useEffect(() => {
    // function subscribeToUpdate() {
    if (!qa?.accessibility?.live) return;
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
          //console.log("payload from live", payload);
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

            if (replyQuestion !== null && replyQuestion?.id === updated.id) {
              setReplyQuestion(updated);
            }
          }
        }
      )
      .subscribe();

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

  function setActiveState(n: number) {
    setActive(n);
  }

  function onShowQuestionModal() {
    setIsOpen((p) => !p);
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
    if (Array.isArray(filteredEventQaQuestions) && data) {
      return filteredEventQaQuestions?.filter(
        (qa) => qa?.userId === String(data?.organisationId)
      );
    } else {
      return [];
    }
  }, [filteredEventQaQuestions, data]);

  const awaitingReview = useMemo(() => {
    if (Array.isArray(filteredEventQaQuestions)) {
      return filteredEventQaQuestions?.filter(
        (qa) => qa?.questionStatus === "pending"
      );
    } else {
      return [];
    }
  }, [filteredEventQaQuestions]);

  function initiateReply(question: TEventQAQuestion) {
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
        <TopSection
          setActiveState={setActiveState}
          activeState={active}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          allQuestionsCount={filteredEventQaQuestions?.length || 0}
          myQuestionsCount={myQuestions?.length || 0}
          awaitingReviewCount={awaitingReview?.length || 0}
        />
        <div
          className={cn(
            "w-full rounded-lg h-[95vh] relative bg-white gap-6 grid grid-cols-8"
          )}
        >
          <EventQaAdvert
            eventName="Event Name"
            close={() => {
              setIsRightBox(!isRightBox);
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
            {active === 1 && (
              <AllQuestions
                initiateReply={initiateReply}
                replyQuestion={replyQuestion}
                replyToNull={replyToNull}
                refetch={qa?.accessibility?.live ?  async () => {}:getQAQUestions}
                
                eventQAQuestions={filteredEventQaQuestions || []}
                userDetail={{
                  userId: String(data?.organization?.id),
                  userNickName: data?.organization?.organizationName!,
                  userImage:
                    data?.organization?.organizationLogo || "/zikoro.png",
                }}
              />
            )}
            {active === 2 && (
              <MyQuestions refetch={qa?.accessibility?.live ?  async () => {}:getQAQUestions} myQuestions={myQuestions} />
            )}
            {active === 3 && (
              <AwaitingReview
                refetch={qa?.accessibility?.live ?  async () => {}:getQAQUestions}
                awaitingReview={awaitingReview}
              />
            )}
            {/*** floating button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsLeftBox(!isLeftBox);
              }}
              className="px-0 absolute z-50 left-8  bottom-16 sm:left-10 sm:bottom-20 h-fit w-fit"
            >
              <Minimize2 size={20} />
            </Button>
            <Button
              onClick={onShowQuestionModal}
              className="h-14 w-14 fixed z-50 right-8 px-0 bottom-16 sm:right-10 sm:bottom-20 rounded-full bg-basePrimary"
            >
              <Plus size={40} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
      {isOpen && data && (
        <AskandReplyModal
          userDetail={{
            userId: String(data?.organization?.id),
            userNickName: data?.organization?.organizationName,
            userImage: data?.organization?.organizationLogo || "/zikoro.png",
          }}
          QandAAlias={qaId}
          refetch={qa?.accessibility?.live ?  async () => {}:getQAQUestions}
          close={onShowQuestionModal}
        />
      )}
    </>
  );
}
