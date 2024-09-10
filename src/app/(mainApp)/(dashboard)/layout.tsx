"use client";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";
import { SideBarLayout } from "@/components/SideBarLayout";
import useEventStore from "@/store/globalEventStore";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useAttendee } from "@/hooks";

export default function RootLayout({
  children,
  
}: {
  children: React.ReactNode;
 
}) {
  const { userData, user } = useAttendee();
  const divRef = useRef<HTMLDivElement>(null);
  
  const { event } = useEventStore();

  useLayoutEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const updateHeight = () => {
      const distanceToBottom = window.innerHeight - div.offsetTop;
      div.style.minHeight = `${distanceToBottom}px`;
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  if (!userData && !user) {
    return (
      <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-2xl">
        <div className="flex flex-col items-center gap-y-2">
          <LoaderAlt size={40} className="animate-spin text-basePrimary" />
          <p className="text-sm sm:text-base">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative w-full h-full bg-[#F9FAFF]" ref={divRef}>
        <SideBarLayout >{children}</SideBarLayout>
      </main>
      <Toaster />
    </>
  );
}