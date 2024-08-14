"use client";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";
import { SideBarLayout } from "@/components/SideBarLayout";
import { useParams } from "next/navigation";
import useOrganizationStore from "@/store/globalOrganizationStore";
import useEventStore from "@/store/globalEventStore";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useAttendee } from "@/hooks";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, user, loading } = useAttendee();

  const divRef = useRef<HTMLDivElement>(null);
  const { eventId }: { eventId: string } = useParams();



  useLayoutEffect(() => {
    const div = divRef.current;

    if (!div) return;

    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    if (!div) return;
    // Set the maximum height of the div
    div.style.minHeight = `${distanceToBottom}px`;
  }, []);

  //  <MainTopBar />

  const { organization } = useOrganizationStore();

  const { event } = useEventStore();

  const isEventOwner =
    user && event && String(event?.createdBy) === String(user.id);

  console.log("layout", user);


  if (!userData && !user) {
    return (
      <div className="w-full h-full inset-0 backdrop-blur-2xl fixed z-[5000]">
        <div className="flex items-center p-4 m-auto absolute inset-0 justify-center flex-col gap-y-1">
          <LoaderAlt size={30} className="animate-spin text-basePrimary" />
          <p className="text-[13px] sm:text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative w-full h-full " ref={divRef}>
        <SideBarLayout eventId={eventId} children={children} />
      </main>
      <Toaster />
    </>
  );
}
