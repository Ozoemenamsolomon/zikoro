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
import Link from "next/link";
import { cn } from "@/lib";

type TMarketingTabs = {
  label: string;
  value: string;
  disabled?: boolean;
};

const marketingTabs: TMarketingTabs[] = [
  {
    label: "Email",
    value: "email",
  },
  {
    label: "SMS",
    value: "sms",
    disabled: true,
  },
  {
    label: "Whatsapp",
    value: "whatsapp",
    disabled: true,
  },
];

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
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

  const router = useRouter();
  const pathName = usePathname() || "/";

  return (
    <section className="space-y-6" ref={divRef || null}>
      <div className="bg-transparent border-b pl-[60px] lg:pl-[30px] px-4 pt-4 w-full hidden">
        {marketingTabs.map((tab) => (
          <Link href={"/" + tab.value}>
            <button
              key={tab.label}
              className={cn(
                "px-4 rounded-none",
                pathName.includes(tab.value) &&
                  "shadow-none bg-transparent border-b-2 border-b-basePrimary text-basePrimary"
              )}
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default MarketingLayout;
