"use client";
import { GeneralImageIcon, GeometryIcon, TrashIcon } from "@/constants";
import React, { useEffect } from "react";
import useUserStore from "@/store/globalUserStore";
import { useGetUserOrganization } from "@/hooks/services/userOrganization";

export default function General() {
  const { user, setUser } = useUserStore();
  const userId = user?.id ?? 0;

  const { data: organizationData, refetch: refetchOrganizationData } =
    useGetUserOrganization(user?.id ?? 0);

  useEffect(() => {
    console.log(user);
    console.log(organizationData)
  });
  return (
    <div className="">
      {/* Settings sections */}
      <div className="mt-[60px] mb-8 ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px] ">
        <div className="flex items-center gap-x-3 pt-[32px] ">
          <GeometryIcon />
          <p className="text-xl font-semibold">Basic Settings</p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Workspace Name</p>
          <div className="w-full h-[45px] mt-2 ">
            <input
              required
              type="text"
              value="Techies"
              name=""
              className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
            />
          </div>
          <p className="mt-2 text-[12px] text-[#1f1f1f]">
            Events are created inside this workspace. Pick a name that best
            represents these events.
          </p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Organization Name</p>
          <div className="w-full h-[45px] mt-2 ">
            <input
              required
              type="text"
              value="Organization Name"
              name=""
              className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col lg:flex-row gap-[22px] ">
            <div className=" w-full lg:w-1/2">
              <p className="text-[14px] text-[#1f1f1f]">Organization Type</p>
              <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                <select
                  name=""
                  value=""
                  className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end text-[14px] text-[#1f1f1f] outline-none px-[10px] py-[11px]"
                >
                  <option value="" className="">
                    Private
                  </option>
                </select>
              </div>
            </div>

            <div className=" w-full lg:w-1/2">
              <p className="text-[14px] text-[#1f1f1f]">Pricing Plan</p>
              <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                <select
                  name=""
                  value=""
                  className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end text-[14px] text-[#1f1f1f] outline-none px-[10px] py-[11px]"
                >
                  <option value="" className="">
                    Free
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row mt-8 px-0 lg:px-[206px] gap-[52px]  mb-8">
          <div>
            <p className="text-base font-medium">Logo</p>
            <p className="text-[14px] font-normal mt-2">
              The logo will be used on the event website, in emails, and as a
              thumbnail for sharing the event link.
            </p>
            <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end h-[321px] items-center justify-center flex flex-col border-[1px] border-indigo-600 rounded-lg mt-4 ">
              <div className="bg-white flex gap-x-2 border-[1px] border-white p-2 rounded-[32px] cursor-pointer ">
                <GeneralImageIcon />
                <p>Upload Logo</p>
              </div>
              <p className="text-[12px] mt-4">
                {" "}
                Image size should be 50px by 50px
              </p>
            </div>
          </div>
          <div>
            <p className="text-base font-medium">Logo</p>
            <p className="text-[14px] font-normal mt-2">
              The logo will be used on the event website, in emails, and as a
              thumbnail for sharing the event link.
            </p>
            <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end h-[321px] items-center justify-center flex flex-col border-[1px] border-indigo-600 rounded-lg mt-4  ">
              <div className="bg-white flex gap-x-2 border-[1px] border-white p-2 rounded-[32px] cursor-pointer ">
                <GeneralImageIcon />
                <p>Upload Logo</p>
              </div>
              <p className="text-[12px] mt-4">
                {" "}
                Image size should be 50px by 50px
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Section */}

      <div className="mt-8 ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-0 py-8 mb-16 lg:mb-2 ">
        <div className="flex gap-x-3">
          <TrashIcon size={20} />
          <p className="font-semibold ">Delete Workspace</p>
        </div>
        <p className="mt-[10px] text-base font-medium">
          Deleting a portal will remove all events in the portal and you will no
          longer be able to retrieve them.
        </p>
        <div className="flex justify-center lg:justify-end mt-8 ">
          <button className="py-2 px-4 text-white text-[15px] bg-[#e74c3c] rounded-md ">
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
