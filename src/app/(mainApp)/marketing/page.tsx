"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Email, SMS, Whatsapp, Affiliate } from "./_tabs";

type TMarketingTabs = {
  label: string;
  value: string;
  component: React.ReactNode;
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
  },
  {
    label: "Whatsapp",
    value: "whatsapp",
    component: <Whatsapp />,
  },
  {
    label: "Affiliate",
    value: "affiliate",
    component: <Affiliate />,
  },
];

const page = () => {
  return (
    <section className="bg-white space-y-6">
      <Tabs defaultValue="email">
        <TabsList className="bg-transparent border-b px-4 pt-4 w-full flex justify-start">
          {marketingTabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              className="data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-basePrimary data-[state=active]:text-basePrimary rounded-none"
              value={tab.value}
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
