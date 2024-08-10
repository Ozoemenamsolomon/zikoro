"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateSearchParam } from "@/utils";
import Registrations from "./_tabs/Registrations";
import Partners from "./_tabs/Partners";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname() || "/";

  function handleTabChange(currentTab: string) {
    console.log(currentTab);
    if (searchParams?.entries()) {
      const updatedSearchParams = updateSearchParam(
        searchParams,
        "tab",
        currentTab
      );
      console.log(updatedSearchParams.toString());
      router.push(`${pathName}?${updatedSearchParams.toString()}`, {
        shallow: true,
      });
    }
  }

  return (
    <Tabs
      onValueChange={(value) => handleTabChange(value)}
      defaultValue={searchParams.get("tab") || "registrations"}
    >
      <TabsList className="bg-transparent px-4 pb-3 pt-4 flex justify-start w-full">
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="registrations"
        >
          Registrations
        </TabsTrigger>
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="attendance"
        >
          Attendance
        </TabsTrigger>
        <TabsTrigger
          className="py-3 data-[state=active]:shadow-none px-4 data-[state=active]:bg-transparent data-[state=active]:text-basePrimary rounded-none"
          value="partners"
        >
          partners
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="registrations"
        className="pt-8 pb-20 px-2 md:px-6 lg:px-12 bg-basePrimary/5 space-y-12"
      >
        <Registrations />
      </TabsContent>
      <TabsContent
        value="partners"
        className="pt-8 pb-20 px-2 md:px-6 lg:px-12 bg-basePrimary/5 space-y-12"
      >
        <Partners />
      </TabsContent>
    </Tabs>
  );
};

export default page;
