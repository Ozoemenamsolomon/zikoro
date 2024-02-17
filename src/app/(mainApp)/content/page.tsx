"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState, useLayoutEffect } from "react";

interface TTabs {
  label: string;
  value: string;
  component: React.ReactNode;
}

const contentTabs: TTabs[] = [
  {
    label: "Event",
    value: "event",
    component: <div>here</div>,
  },
  {
    label: "Contact",
    value: "contact",
    component: <div>here</div>,
  },
  {
    label: "Content",
    value: "content",
    component: <div>here</div>,
  },
  {
    label: "Badge",
    value: "badge",
    component: <div>here</div>,
  },
  {
    label: "Discount",
    value: "discount",
    component: <div>here</div>,
  },
];

export default function Layout() {
  const divRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const div = divRef.current;

    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    if (!div) return;
    // Set the maximum height of the div
    div.style.minHeight = `${distanceToBottom}px`;
  }, []);

  return (
    <section className="bg-white space-y-6" ref={divRef || null}>
      <Tabs defaultValue="event">
        <TabsList className="bg-transparent border-b px-4 pt-4 w-full flex justify-start">
          {contentTabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {contentTabs.map((tab) => (
          <TabsContent value={tab.value} key={tab.label}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
