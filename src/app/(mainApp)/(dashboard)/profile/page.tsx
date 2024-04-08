"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState, useLayoutEffect } from "react";
import Profile from "./_tabs/Profile";
import Security from "./_tabs/Security";
import Organization from "./_tabs/Organization";
import Notifications from "./_tabs/Notifications";

type TProfileTabs = {
  label: string;
  value: string;
  component: React.ReactNode;
};

const profileTabs: TProfileTabs[] = [
  {
    label: "Profile",
    value: "profile",
    component: <Profile />,
  },
  {
    label: "Security",
    value: "security",
    component: <Security />,
  },
  {
    label: "Organization",
    value: "organization",
    component: <Organization />,
  },
  {
    label: "Notifications",
    value: "notifications",
    component: <Notifications />,
  },
];

const page = () => {
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
    <section className="bg-white space-y-6" ref={divRef || null}>
      <Tabs defaultValue="profile" className="mt-0">
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-fit">
            <TabsList className="bg-transparent border-b px-4 pt-4 w-full flex justify-start gap-8 mt-0">
              {profileTabs.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  className="py-0 data-[state=active]:shadow-none text-xs md:text-sm lg:text-base px-0 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        {profileTabs.map((tab) => (
          <TabsContent value={tab.value} key={tab.label} className="mt-0">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default page;
