"use client";
import React from "react";
import { GlobeIcon, PencilIcon } from "@/constants";
import useOrganizationStore from "@/store/globalOrganizationStore";

export default function Domain() {
  const { organization, setOrganization } = useOrganizationStore();
  const webLink = `https://www.zikoro.com/workspaces?query=${organization?.organizationName}`;

  return (
    <div>
      {/* Custom Domain sections */}
      <div className="mt-[60px] ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px] py-8 ">
        <div className="flex items-center gap-x-3">
          <GlobeIcon />
          <p className="text-xl font-semibold">Custom Domain</p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Add custom domain</p>
          <div className=" w-full h-[45px] mt-2 flex gap-x-4 lg:gap-x-8">
            <input
              required
              type="text"
              value=""
              name=""
              placeholder="https://"
              className="w-full lg:w-[501px] h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
            />
            <button className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white h-full rounded-md px-8 font-medium ">
              Save
            </button>
          </div>
          {/* <p className="mt-2 text-[12px] text-[#1f1f1f]">
            Events are created inside this workspace. Pick a name that best
            represents these events.
          </p> */}
        </div>
      </div>

      {/* SubDomain sections */}
      <div className="mt-8 ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px] py-8 ">
        <div className="flex items-center gap-x-3 ">
          <GlobeIcon />
          <p className="text-xl font-semibold">Subdomain Settings</p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Subdomain </p>
          <div className=" w-full h-[45px] mt-2 flex gap-x-4 lg:gap-x-8 items-center">
            <input
              required
              type="text"
              value={organization?.organizationName}
              name=""
              placeholder="https://"
              className="w-full lg:w-[841px] h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
            />

            <div className="flex items-center gap-x-3 ">
              <PencilIcon />
              <p className="text-[12px] font-normal text-zikoroBlue">
                Edit Subdomain
              </p>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-[#1f1f1f]">{webLink}</p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Domain</p>
          <div className=" w-full h-[45px] mt-2 flex gap-x-4 lg:gap-x-8">
            <input
              required
              type="text"
              value={webLink}
              name=""
              placeholder="https://"
              className="w-full  h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
