"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useOrganizationStore from "@/store/globalOrganizationStore";

export default function LinkSharing() {
  const [isMonthly, setIsMonthly] = useState("");
  const { organization, setOrganization } = useOrganizationStore();
  const iframeCode = `<iframe
    src="www.zikoro.com/workspaces?query=${organization?.organizationName}"
    style={{ width: '90%', height: '80%' }}
    title="Organization Page Preview"
  ></iframe>`;

  const handleToggle = () => {};

  return (
    <div className="mt-[60px] ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px]">
      <div className="">
        <p className="text-xl font-semibold"> Your workspace’s events </p>
        <p className="text-base font-normmal mt-4">
          All your events in one view. You can share a link of all your
          workspace events, or embed it on your website.
        </p>
      </div>

      <div className="mt-[60px]">
        <p className="text-lg font-medium">Workspace events page settings </p>

        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />

          <p className="text-base font-normal ">Show Categories</p>
        </div>

        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />

          <p className="text-base font-normal ">Turn off featured events</p>
        </div>

        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />

          <p className="text-base font-normal ">Turn off filters</p>
        </div>
      </div>

      <div className="mt-10 w-full lg:w-[460px] lg:mx-auto overflow-x-hidden">
        <Tabs defaultValue="link" className="px-6 py-8  w-full lg:w-[460px]">
          <TabsList className="gap-x-20 px-16 border-b-[1px] border-gray-200 bg-white w-full lg:w-[380px] mx-auto">
            <TabsTrigger value="link" className="w-full">
              Link
            </TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="bg-white">
            <div className="mt-4">
              <p>Workspace name</p>
              <p className="text-[11px] lg:text-[13px] py-2 px-3 text-black bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-md mt-6">
                https://www.zikoro.com/workspaces?query=
                {organization?.organizationName}
              </p>
              <button className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white text-base rounded-md font-medium py-2 px-4 mt-6">
                Copy Link
              </button>
            </div>
          </TabsContent>
          <TabsContent value="embed">
            <div className="mt-4 ">
              <div className="p-3 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg">
                <p className="font-semibold">{organization?.organizationName}</p>
                <p className="text-[11px] lg:text-[13px] py-2 px-3 text-black bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-md mt-6">
                  <pre>
                    <code>{iframeCode}</code>
                  </pre>
                </p>
                <button className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white text-base rounded-md font-medium py-2 px-4 mt-6">
                  Copy Embed Code
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
