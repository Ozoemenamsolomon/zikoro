"use client";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";
import { SideBarLayout } from "@/components/SideBarLayout";
import { useParams } from "next/navigation";
import useOrganizationStore from "@/store/globalOrganizationStore";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";
import { useAttendee } from "@/hooks";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {user, loading} = useAttendee();
  
 



 // console.log(user);

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

  if (!user) {
    return <div>Validating User...</div>;
  }

  return (
    <>
      <main className="relative w-full h-full bg-white" ref={divRef}>
        <SideBarLayout eventId={eventId} children={children} />
      </main>
      <Toaster />
    </>
  );
}
