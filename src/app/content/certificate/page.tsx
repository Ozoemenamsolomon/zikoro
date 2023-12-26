"use client";

import React from "react";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { Switch } from "@/components/ui/switch";
import { Check } from "styled-icons/material";
import { AddToQueue } from "@styled-icons/boxicons-regular/AddToQueue";
import { Trash } from "@styled-icons/boxicons-regular/Trash";
import { Cog } from "@styled-icons/boxicons-regular/Cog";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
import { Certificate as CertificateIcon } from "@styled-icons/fluentui-system-regular/Certificate";
import { CustomTextBox } from "@/components/CustomTextBox";
import { Eye } from "styled-icons/evil";

const certifcates = [
  {
    img: "/certificates/cert1.svg",
    label: "/certificates/group.svg",
  },
  {
    img: "/certificates/cert2.svg",
    tag: "coming soon",
  },
  {
    img: "/certificates/cert3.svg",
    tag: "coming soon",
  },
  {
    img: "/certificates/cert4.svg",
    tag: "coming soon",
  },
];

export default function Certificate() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h6 className="font-medium">Certificate</h6>
        <div className="flex justify-between items-center space-x-6">
          <button className="flex justify-between items-center bg-purplebg text-white px-[12px] py-[8px] rounded-[5px]">
            <span className="pr-[8px]">New</span>
            <AddCircle size={20} />
          </button>
          <button className="text-center">
            <span className="pr-[2px]">
              Saved <Check size={15} className="text-purplebg" />
            </span>
          </button>
          <AddToQueue size={20} className="text-purplebg" />
          <Trash size={20} className="text-red-500" />
          <Cog size={20} />
          <CertificateIcon size={20} />
        </div>
      </div>
      <div>
        <div className="flex space-x-10 items-center">
          <CustomSelect
            label="Certificate name"
            // id="eventTitle"
            placeholder="Please select"
            classname="w-1/2"
          />
          <CustomSelect
            label="Certificate heading"
            // id="eventTitle"
            placeholder="Please select training heading"
            // type="text"
            classname="w-1/2"
          />
        </div>

        <span className="text-[11px]">
          Participants can downlaod certificate at the end of the training
        </span>
        <div className="flex justify-center pl-[10rem] items-center space-x-2">
          <Switch />
          <span className="text-[12px]">CPD Points</span>
        </div>
        <div className="flex mt-5 space-x-10 items-center">
          <CustomInput
            label="Training duration(hours)"
            id="trainingduration"
            placeholder="Enter event title"
            type="number"
            containerClassName="w-1/2"
          />

          <CustomInput
            label="CPD Points"
            id="cpdPoint"
            placeholder="Enter event title"
            type="number"
            containerClassName="w-1/2"
          />
        </div>
      </div>
      <div className="flex mt-6">
        <div className="space-y-4 w-1/2 mr-8">
          <p>Logo position</p>
          <button className="border-purplebg border-2 mr-4 bg-[#EBEBEB] text-purplebg rounded-md py-2 px-4">
            Left
          </button>
          <button className="border-2 bg-white rounded-md py-2 px-4 mr-4">
            Middle
          </button>
          <button className="border-2 bg-white rounded-md py-2 px-4">
            Right
          </button>
        </div>

        <div className="w-1/2">
          <CustomTextBox
            label="Scope of training"
            id="scopeOfTraining"
            name="scopeOfTraining"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch />
        <span className="text-[12px]">Include Zikoro</span>
      </div>
      <div className="mt-[3rem]">
        <h3>Certificate Template</h3>
        <div className="flex justify-between mt-2">
          {certifcates.map((item, index) => (
            <div key={index} className="relative ">
              <img src={item.img} width={200} height={200} alt="certificate" />
              {item.tag ? (
                <span className="absolute top-20 translate-y-12 left-[30%] z-10 bg-black p-1 text-[12px] text-white rounded-md">
                  {item.tag}
                </span>
              ) : (
                <img
                  className="absolute top-0 mt-2 right-1 z-10"
                  src={item.label}
                  width={15}
                  height={15}
                  alt={item.label}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex mt-8 space-x-4 items-center">
          <button className="flex justify-between items-center bg-purplebg text-white px-[12px] py-[8px] rounded-[5px]">
            <span className="mr-2">Preview</span>
            <Eye size={25} />
          </button>
          <button className="border-2 border-purplebg w-[6rem] px-[12px] py-[8px] rounded-[5px] text-purplebg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
