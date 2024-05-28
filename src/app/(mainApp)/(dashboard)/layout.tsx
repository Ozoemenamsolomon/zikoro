"use client";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";
import { SideBarLayout } from "@/components/SideBarLayout";
import MainTopBar from "@/components/MainTopBar";
import { useParams, useRouter } from "next/navigation";
import { TUser } from "@/types";
import { getCookie } from "@/hooks";
import useOrganizationStore from "@/store/globalOrganizationStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCookie<TUser>("user");
  const router = useRouter();
  console.log(user);
  if (!user) return router.push("login");

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

  return (
    <>
      <main className="relative w-full h-full bg-white" ref={divRef}>
        <SideBarLayout
          eventId={eventId}
          children={
            organization ? (
              children
            ) : (
              <div className="mt-24 px-4 text-xl font-medium text-gray-800">
                Please select an organization from the topbar to continue
              </div>
            )
          }
        />
      </main>
      <Toaster />
    </>
  );
}
