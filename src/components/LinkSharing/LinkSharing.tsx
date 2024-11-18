"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useOrganizationStore from "@/store/globalOrganizationStore";
import toast from "react-hot-toast";

export default function LinkSharing() {
  const { organization, setOrganization } = useOrganizationStore();
  const [showCategory, setShowCategory] = useState<boolean>(true);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showOrgLogo, setShowOrgLogo] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [showZikoroLogo, setShowZikoroLogo] = useState<boolean>(false);

  const orgName = organization?.organizationName;

  //handles category toggle
  const handleCategoryToggle = () => {
    setShowCategory(!showCategory);
  };

  //handles filter feature toggle
  const handleCategorySelect = () => {
    setShowFilter(!showFilter);
  };

  //handles show organization toggle
  const handleHeaderToggle = () => {
    setShowOrgLogo(!showHeader);
  };

  //handles show search toggle
  const handleSearchToggle = () => {
    setShowOrgLogo(!showSearch);
  };

  //handles show organization logo toggle
  const handleOrgLogoToggle = () => {
    setShowOrgLogo(!showOrgLogo);
  };

  //handles show feature toggle
  const handleZikoroToggle = () => {
    setShowZikoroLogo(!showZikoroLogo);
  };

  const webLink = `https://www.zikoro.com/workspaces?name=${orgName}&orgLogo=${showOrgLogo}&zikoroLogo=${showZikoroLogo}&logo=${organization?.organizationLogo}&showCategories=${showCategory}&showFilter=${showFilter}&showSearch=${showSearch}&showHeader=${showHeader}`; //add showCategory, showFeaturedEvent, showFilter as a query

  const iframeCode = `<iframe
  src=${webLink}
  style={{ width: '90%', height: '80%' }}
  title="Organization Page Preview"
></iframe>`;

  const copyCodeToClipboard = () => {
    navigator.clipboard
      .writeText(iframeCode)
      .then(() => {
        toast.success("Code copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy code");
      });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(webLink)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <div className="w-full">
      <div className="">
        <p className="text-xl font-semibold"> Your workspace’s events </p>
        <p className="text-base font-normmal mt-4">
          All your events in one view. You can share a link of all your
          workspace events, or embed it on your website.
        </p>
      </div>

      <div className="mt-[60px]">
        <p className="text-lg font-medium">Workspace events page settings </p>

        {/* Show Category */}
        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={showCategory}
            onCheckedChange={handleCategoryToggle}
          />

          <p className="text-base font-normal ">Turn Off Categories</p>
        </div>

        {/* Show Filters */}
        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={showFilter}
            onCheckedChange={handleCategorySelect}
          />
          <p className="text-base font-normal ">Turn off filters</p>
        </div>

        {/* Show Search */}
        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={showFilter}
            onCheckedChange={handleSearchToggle}
          />
          <p className="text-base font-normal ">Turn off SearchBox</p>
        </div>

        {/* Show Header Text */}
        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={showHeader}
            onCheckedChange={handleHeaderToggle}
          />
          <p className="text-base font-normal ">Turn off Header Text</p>
        </div>

        {/* Show Organization Logo */}
        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={showOrgLogo}
            onCheckedChange={handleOrgLogoToggle}
          />

          <p className="text-base font-normal ">Turn Off Organization Logo</p>
        </div>

        {/* Show Zikoro Logo */}
        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={showZikoroLogo}
            onCheckedChange={handleZikoroToggle}
          />

          <p className="text-base font-normal ">Show Zikoro Logo</p>
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
              <p className="font-semibold uppercase">
                {organization?.organizationName}
              </p>
              <p className="text-[11px] lg:text-[13px] py-2 px-3 text-black bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-md mt-6 break-all">
                {webLink}
              </p>
              <button
                className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white text-base rounded-md font-medium py-2 px-4 mt-6"
                onClick={copyLinkToClipboard}
              >
                Copy Link
              </button>
            </div>
          </TabsContent>
          <TabsContent value="embed">
            <div className="mt-4 ">
              <div className="p-3 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg">
                <p className="font-semibold uppercase">
                  {organization?.organizationName}
                </p>

                <pre className="text-[11px] lg:text-[13px] py-2 px-3 text-black bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-md mt-6 break-all overflow-auto">
                  <code className="">{iframeCode}</code>
                </pre>

                <button
                  className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white text-base rounded-md font-medium py-2 px-4 mt-6"
                  onClick={copyCodeToClipboard}
                >
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
