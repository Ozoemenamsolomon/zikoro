"use client";
import React, { useState } from "react";
import { Eye } from "styled-icons/evil";
import { Cog } from "@styled-icons/boxicons-regular/Cog";
import { Check } from "styled-icons/material";
import { Colorize } from "@styled-icons/material-outlined/Colorize";
import { manrope } from "@/utils/fonts";
import { heebo } from "@/utils/fonts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const badges = [
  ["/badges/badge3.png", "/badges/badge2.png", "/badges/badge1.png"],
  ["/badges/badge4.png", "/badges/badge5.png", "/badges/badge6.png"],
];
export default function Badge() {
  const [headerColor, setHeaderColor] = useState("#055731");
  const [bodyColor, setBodyColor] = useState("#D6D6D6");
  const [footerColor, setFooterColor] = useState("#D6D6D6");
  const [initialValue, setInitialValue] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderColor(event.target.value);
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h6 className="font-medium">Badge</h6>
        <div className="flex justify-between items-center space-x-6">
          <button className="w-[109px] flex justify-center items-center bg-bluebg text-white p-[10px] rounded-[4px]">
            <span className="mr-2 text-[16px]">Preview</span>
            <Eye size={25} />
          </button>
          <button className="text-center">
            <span className="pr-[2px] text-[#3E404B]">
              {isSaved ? "Saved" : "Save"}{" "}
              <Check size={15} className="text-bluebg" />
            </span>
          </button>
          <span className="text-[#3E404B]">Color theme</span>
          <span className="flex items-center justify-center bg-green-900 text-white w-[40px]  h-[40px] rounded-[8px]">
            <Check size={15} />
          </span>
          <div>
            <input
              type="color"
              value={headerColor}
              onChange={handleColorChange}
            />
          </div>
          <BadgeDialog />
        </div>
      </div>
      <div className="flex justify-between my-6">
        {badges[0].map((badge, index) => {
          return (
            <img src={badge} key={index} width={300} height={150} alt="badge" />
          );
        })}
      </div>
      <div className="flex justify-between my-4 ">
        <div className="h-[419px] w-72">
          <div
            className={`h-24 rounded-t-md`}
            style={{
              // clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)'
              backgroundColor: headerColor,
            }}
          ></div>
          <div className="h-12 my-6 bg-green-200"></div>
          <div className="h-36 bg-white"></div>
          <div className={`h-12 bg-${footerColor} rounded-b-md`}></div>
        </div>
      </div>
      <div className="mt-6">
        <p>Custom badge</p>
        <div className="bg-gray-300 w-[350px] flex gap-2 my-4 py-6 px-4">
          <div className="bg-white p-2 w-20 rounded-full">
            <img
              src="/badges/idcard.svg"
              alt="id-card"
              width={100}
              height="auto"
            />
          </div>
          <div className="text-[12px]">
            <p>Upgrade your plan to use your own customized badge.</p>
            <div className="text-bluebg flex items-center space-x-2 mt-2">
              <span>Upgrade </span>
              <img
                src="/badges/icon-park_right.png"
                alt="right"
                width={20}
                height="auto"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-8 space-x-4 items-center">
        <button
          className="w-[132px] bg-bluebg text-white p-[10px] rounded-[4px]"
          onClick={() => {
            setIsSaved(!isSaved);
            if (isSaved) {
              toast.success("Saved");
            } else {
              toast.error("Event has already been saved");
            }
          }}
        >
          Save
        </button>
        <button className="w-[132px] border border-bluebg p-[10px] rounded-[4px] text-bluebg">
          Preview
        </button>
      </div>
      <Toaster />
    </div>
  );
}

const BadgeDialog = () => {
  const [badgeColor, setBadgeColor] = useState("#055731");
  return (
    <Dialog>
      <DialogTrigger>
        <Cog size={20} />
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[478px] py-8 px-5 max-h-[95vh] ${manrope.className}`}
      >
        <DialogHeader>
          <DialogTitle>
            <p className={`text-[24px] font-medium ${heebo.className}`}>
              Badge Settings
            </p>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full">
          <form id="form" action={""}>
            <div
              className={`h-14 relative py-2 mt-10 px-4 border border-[#f3f3f3] rounded-md flex items-center justify-between text-basecolor text-sm font-semibold`}
            >
              <span className="font-medium block text-xs bg-white text-gray-700 absolute right-3 -top-2">
                Attendance
              </span>
              <div className="flex items-center">
                <RadioGroup className="flex space-x-5 data-[state=checked]:border-bluebg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="withOrglogo"
                      id="withOrglogo"
                      className="fill-current text-bluebg"
                    />
                    <span>With organisation logo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="withoutOrglogo"
                      value="withoutOrglogo"
                      className="fill-current text-bluebg"
                    />
                    <span className="break-keep">
                      Without organisation logo
                    </span>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div
              className={`h-14 relative py-2 mt-10 px-4 border border-[#f3f3f3] rounded-md flex items-center justify-between text-basecolor text-sm font-semibold`}
            >
              <span className="font-medium block text-xs bg-white text-gray-700 absolute right-3 -top-2">
                Avatar
              </span>
              <div className="flex items-center">
                <RadioGroup className="flex space-x-4 data-[state=checked]:border-bluebg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="noAvatar"
                      id="noAvatar"
                      className="fill-current text-bluebg"
                    />
                    <span>No avatar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="orgLogo"
                      value="orgLogo"
                      className="fill-current text-bluebg"
                    />
                    <span className="break-keep">Organisation Logo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="profilePic"
                      id="profilePic"
                      className="fill-current text-bluebg"
                    />
                    <span>Profile picture</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div
              className={`h-14 relative py-2 mt-10 px-4 border border-[#f3f3f3] rounded-md flex items-center justify-between text-basecolor text-sm font-semibold`}
            >
              <span className="font-medium block text-xs bg-white text-gray-700 absolute right-3 -top-2">
                Name
              </span>
              <div className="flex items-center">
                <RadioGroup className="flex space-x-2 data-[state=checked]:border-bluebg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="fullname"
                      id="fullname"
                      className="fill-current text-bluebg"
                    />
                    <span>First name & last name</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="lastname"
                      value="lastname"
                      className="fill-current text-bluebg"
                    />
                    <span className="break-keep">Last name</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="firstname"
                      id="firstname"
                      className="fill-current text-bluebg"
                    />
                    <span>First name</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div
              className={`h-14 relative py-2 mt-10 px-4 border border-[#f3f3f3] rounded-md flex items-center justify-between text-basecolor text-sm font-semibold`}
            >
              <span className="font-medium block text-xs bg-white text-gray-700 absolute right-3 -top-2">
                Job title
              </span>
              <div className="flex items-center">
                <RadioGroup className="flex space-x-6 data-[state=checked]:border-bluebg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="showJobTitle"
                      id="showJobTitle"
                      className="fill-current text-bluebg"
                    />
                    <span>Show</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="hideJobTitle"
                      value="hideJobTitle"
                      className="fill-current text-bluebg"
                    />
                    <span>Hide</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div
              className={`h-14 relative py-2 mt-10 px-4 border border-[#f3f3f3] rounded-md flex items-center justify-between text-basecolor text-sm font-semibold`}
            >
              <span className="font-medium block text-xs bg-white text-gray-700 absolute right-3 -top-2">
                Organisation name
              </span>
              <div className="flex items-center">
                <RadioGroup className="flex space-x-6 data-[state=checked]:border-bluebg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="showOrgName"
                      id="showOrgName"
                      className="fill-current text-bluebg"
                    />
                    <span>Show</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="hideOrgName"
                      value="hideOrgName"
                      className="fill-current text-bluebg"
                    />
                    <span>Hide</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div
              className={`h-14 relative py-2 my-10 px-4 border border-[#f3f3f3] rounded-md flex items-center justify-between text-basecolor text-sm font-semibold`}
            >
              <span className="font-medium block text-xs bg-white text-gray-700 absolute right-3 -top-2">
                Attendee type
              </span>
              <div className="flex items-center">
                <RadioGroup className="flex space-x-6 data-[state=checked]:border-bluebg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="showAttendeeType"
                      id="showAttendeeType"
                      className="fill-current text-bluebg"
                    />
                    <span>Show</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="hideAttendeeType"
                      value="hideAttendeeType"
                      className="fill-current text-bluebg"
                    />
                    <span>Hide</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <p>Badge Color</p>
            <div className="flex items-center space-x-2 my-2">
              <input
                type="color"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value)}
              />

              <p
                className={`w-8 h-8 rounded-md`}
                style={{
                  backgroundColor: badgeColor,
                }}
              ></p>
            </div>
            <button
              className="bg-bluebg text-white px-[12px] py-[8px] rounded-[5px] w-full"
              type="submit"
            >
              Done
            </button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
