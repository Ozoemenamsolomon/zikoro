"use client";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";
import { SideBarLayout } from "../../components/SideBarLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const div = divRef.current;

    if (!div) return;

    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    if (!div) return;
    // Set the maximum height of the div
    div.style.minHeight = `${distanceToBottom}px`;
  }, []);

  return (
    <>
      <main className="relative h-full bg-white" ref={divRef}>
        <SideBarLayout />

        <div className="lg:w-[calc(100%-250px)]  min-[1024px]:float-right  pb-12  ">
          {children}
        </div>
      </main>
      <Toaster />
    </>
  );
}
