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
import { useState } from "react";
import { Manrope } from "next/font/google";
import { PlusCircle } from "lucide-react";
import { MinusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const manrope = Manrope({ subsets: ["latin"], weight: "600" });
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
  const [isCPD, setIsCPD] = useState(false);
  const [dataState, setDataState] = useState(false);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h6 className="font-medium">Certificate</h6>
        <div className="flex justify-between items-center space-x-6">
          <button className="text-center">
            <span className="pr-[2px]">
              Saved <Check size={15} className="text-purplebg" />
            </span>
          </button>
          <Trash size={20} className="text-red-500" />
          <DialogDemo />
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

        <span className="text-[11px] text-[#717171] description-text">
          Participants can download certificate at the end of the training
        </span>
        <div className="flex justify-center pl-[12rem] items-center space-x-2">
          <Switch
            onClick={() => setIsCPD(!isCPD)}
            className={`data-[state=checked]:bg-purplebg `}
          />
          <span className="text-[16px]">CPD required</span>
        </div>
        <div className="flex mt-5 space-x-10 items-center">
          <CustomInput
            label="Training duration(hours)"
            id="trainingduration"
            placeholder="0"
            type="number"
            containerClassName="w-1/2"
          />

          <CustomInput
            label="CPD Points"
            id="cpdPoint"
            placeholder="0"
            type="number"
            containerClassName="w-1/2"
            disabled={!isCPD && true}
          />
        </div>
      </div>
      <div className="flex mt-6">
        <div className="space-y-4 w-1/2 mr-8 text-[16px]">
          <p className="text-[#717171]">Logo position</p>
          <button className="border-purplebg border mr-4 bg-[#EBEBEB] text-purplebg rounded-[4px] py-[12px] px-[16px]">
            Left
          </button>
          <button className="border bg-white border-[#717171] rounded-[4px] py-[12px] px-[16px] mr-4">
            Middle
          </button>
          <button className="border bg-white border-[#717171] rounded-[4px] py-[12px] px-[16px]">
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
        <Switch className={`data-[state=checked]:bg-purplebg `} />
        <span className="text-[16px]">Include Zikoro Logo</span>
      </div>
      <div className="mt-[3rem]">
        <h3 className="text-[18px] font-[500]">Certificate Template</h3>
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
          <button className="border-2 border-purplebg w-[6rem] px-[12px] py-[8px] rounded-[5px] text-purplebg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const DialogDemo = () => {
  const [color, setColor] = useState("#D6D6D6");

  const initialValue = 0;

  const [disabled, setDisabled] = useState(initialValue >= 100 ? true : false);

  const incrementer = (): void => {
    const newValue: number = initialValue + 20;
    console.log(newValue);
    if (newValue >= 100) {
      setColor("#D6D6D6");
      setDisabled(true);
    }
  };

  // const decrementer = (): void => {
  //   const initialValue: number = 0;
  //   const newValue: number = initialValue - 20;
  //   if (newValue >= 100) {
  //     setColor("#D6D6D6");
  //     setDisabled(true);
  //   }
  // };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Cog size={20} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <p className="text-[24px] font-medium">Certificate Settings</p>
          </DialogTitle>
        </DialogHeader>
        <div className="grid tems-center mt-10 gap-4 border rounded-[4px] relative p-2">
          <span className="absolute right-2 -top-[0.5rem] px-2  bg-white text-[12px]">
            Attendance
          </span>
          <div
            className={`flex items-center text-[14px] text-[#717171] ${manrope.className}`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="html"
                name="attendance"
                value="Event"
                className="w-[16px] h-[16px] mx-[8px]"
              />
              <label htmlFor="html">Event</label>
            </div>
            <div className="flex items-center mx-4">
              <input
                type="radio"
                id="track"
                name="attendance"
                value="Track"
                className="w-[16px] h-[16px] mx-[8px]"
              />
              <label htmlFor="html">Track</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="session"
                name="attendance"
                value="Session"
                className="w-[16px] h-[16px] mx-[8px]"
              />
              <label htmlFor="html">Session</label>
            </div>
          </div>
        </div>
        <span className="description-text pt-2">
          To be eligible for a certificate an attendee must have been checked in
          for any of the selected option
        </span>
        <div>
          <p>Attendance rate</p>
          <div>
            <PlusCircle size={20} />
            <MinusCircle
              onClick={() => incrementer}
              size={20}
              color={color}
              onBlur={() => {
                setColor("#001FCC");
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <button type="submit">Save changes</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
