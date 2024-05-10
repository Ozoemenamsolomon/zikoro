"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Email, SMS, Whatsapp } from "./_tabs";
import { useRef, useLayoutEffect } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type TMarketingTabs = {
  label: string;
  value: string;
  component: React.ReactNode;
  disabled?: boolean;
};

const marketingTabs: TMarketingTabs[] = [
  {
    label: "Email",
    value: "email",
    component: <Email />,
  },
  {
    label: "SMS",
    value: "sms",
    component: <SMS />,
    disabled: true,
  },
  {
    label: "Whatsapp",
    value: "whatsapp",
    component: <Whatsapp />,
    disabled: true,
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

  function updateSearchParam(
    searchParams: ReadonlyURLSearchParams,
    param: string,
    value: string
  ): URLSearchParams {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentSearchParams.set(param, value);

    return currentSearchParams;
  }

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname() || "/";

  function handleTabChange(currentTab: string) {
    if (searchParams?.entries()) {
      const updatedSearchParams = updateSearchParam(
        searchParams,
        "tab1",
        currentTab
      );
      router.push(`${pathName}?${updatedSearchParams.toString()}`, {
        shallow: true,
      });
    }
  }

  return (
    <section className="bg-white space-y-6" ref={divRef || null}>
      <Tabs
        onValueChange={(value) => handleTabChange(value)}
        defaultValue={searchParams.get("tab1") || "email"}
      >
        <TabsList className="bg-transparent border-b px-4 pt-4 w-full hidden">
          {marketingTabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {marketingTabs.map((tab) => (
          <TabsContent value={tab.value} key={tab.label}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default page;
