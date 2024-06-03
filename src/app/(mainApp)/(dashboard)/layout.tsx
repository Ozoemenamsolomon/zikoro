"use client";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";
import { SideBarLayout } from "@/components/SideBarLayout";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TUser } from "@/types";
import { getCookie } from "@/hooks";
import useOrganizationStore from "@/store/globalOrganizationStore";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname().split("/");

  console.log(user);

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

  console.log(user);

  if (!user) {
    return <div>You are not logged in, redirecting to login...</div>;
  }

  return (
    <>
      <main className="relative w-full h-full bg-white" ref={divRef}>
        <SideBarLayout
          eventId={eventId}
          children={
            // (organization && isEventOwner) || !isEventOwner ? (
            //   children
            // ) : (
            //   <div className="mt-24 px-4 text-xl font-medium text-gray-800">
            //     Please select an organization from the topbar to continue
            //   </div>
            // )
            children
          }
        />
      </main>
      <Toaster />
    </>
  );
}
