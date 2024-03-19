"use client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Toaster } from "@/components/ui/toaster";
import { useLayoutEffect, useRef } from "react";

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
        <div className="fixed w-1/6 h-full top-0 left-0 border-r-2 hidden md:block">
          <Sidebar />
        </div>
        <section className="md:ml-[16.666667%] ml-0 h-full">{children}</section>
      </main>
      <Toaster />
    </>
  );
}
