"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Performance from "./_tabs/performance";
import Affiliates from "./_tabs/affiliates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateSearchParam } from "@/utils";

export default function Affiliate({ searchParams: { currentTab } }) {
  const router = useRouter();
  const pathName = usePathname() || "/";

  function handleTabChange(updatedTab: string) {
    console.log(currentTab, updatedTab);
    router.push(`${pathName}?currentTab=${updatedTab}`, {
      shallow: true,
    });
  }

  return (
    <Tabs
      onValueChange={(value) => handleTabChange(value)}
      defaultValue={currentTab || "affiliates"}
    >
      <TabsList className="bg-transparent px-4 pb-3 pt-4 flex justify-start w-full">
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="affiliates"
        >
          Affiliates
        </TabsTrigger>
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="performance"
        >
          Performance
        </TabsTrigger>
      </TabsList>
      <TabsContent value="performance">
        <Performance />
      </TabsContent>
      <TabsContent value="affiliates">
        <Affiliates />
      </TabsContent>
    </Tabs>
  );
}
