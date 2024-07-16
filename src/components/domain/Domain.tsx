"use client";
import React, { useEffect, useState } from "react";
import { GlobeIcon, PencilIcon } from "@/constants";
import useOrganizationStore from "@/store/globalOrganizationStore";

interface SubDomainState {
  editDomain: string;
}

export default function Domain() {
  const { organization, setOrganization } = useOrganizationStore();
  const [subdomain, setSubDomain] = useState<string>("");
  const [editDomain, setEditDomain] = useState<any>("");
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleEditDomainChange = (e: any) => {
    setEditDomain((prevState: any) => ({
      ...prevState,
      editDomain: e.target.value,
    }));
  };

  useEffect(() => {
    setEditDomain(organization?.subDomain);
  }, []);

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
          <form
            className=" w-full h-[45px] mt-2 flex gap-x-4 lg:gap-x-8"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              type="text"
              value={subdomain}
              name="editDomain"
              onChange={(e) => setSubDomain(e.target.value)}
              placeholder="https://"
              className="w-full lg:w-[501px] h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
            />
            <button
              className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white h-full rounded-md px-8 font-medium"
              type="submit"
            >
              Save
            </button>
          </form>
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
              type="text"
              value={editDomain}
              readOnly={isReadOnly}
              onChange={handleEditDomainChange}
              placeholder="techies.zikoro.com"
              className="w-full lg:w-[841px] h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
            />

            <div
              className="flex items-center gap-x-3 cursor-pointer "
              onClick={() => setIsReadOnly(false)}
            >
              <PencilIcon />
              <p className="text-[12px] font-normal text-zikoroBlue">
                Edit Subdomain
              </p>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-[#1f1f1f]">
            {`${organization?.subDomain}.zikoro.com`}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Domain</p>
          <div className=" w-full h-[45px] mt-2 flex gap-x-4 lg:gap-x-8">
            <input
              readOnly
              type="text"
              value={`${organization?.subDomain}.zikoro.com`}
              name=""
              className="w-full  h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
