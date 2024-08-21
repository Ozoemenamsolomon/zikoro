"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateSearchParam } from "@/utils";
import Registrations from "./_tabs/Registrations";
import Partners from "./_tabs/Partners";
import Attendance from "./_tabs/Attendance";

export const AnalyticsInfoCard = ({
  label,
  Icon,
  value,
  mutedText,
  description,
}: {
  Icon: (props: any) => React.JSX.Element;
  label: string;
  value: string | number;
  mutedText?: ReactNode;
  description?: string;
}) => {
  return (
    <div className="p-4 rounded-md bg-white border flex items-center">
      <div className="flex items-center justify-center flex-[30%]">
        <div className="bg-basePrimary/20 p-4 rounded-full h-fit w-fit">
          <Icon className="h-10 w-10 text-basePrimary" />
        </div>
      </div>
      <div className="flex-[70%] flex flex-col gap-2">
        <div className="flex flex-col">
          <h3 className="font-medium text-gray-600 capitalize">{label}</h3>
          {description && (
            <span className="text-xs text-gray-600 font-medium">
              {description}
            </span>
          )}
        </div>
        <div className="flex items-end gap-2">
          <h4 className="text-4xl font-medium text-gray-800">{value}</h4>
          {mutedText && (
            <span className="font-medium text-gray-500 capitalize">
              {mutedText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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
        value="attendance"
        className="pt-8 pb-20 px-2 md:px-6 lg:px-12 bg-basePrimary/5 space-y-12"
      >
        <Attendance />
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
