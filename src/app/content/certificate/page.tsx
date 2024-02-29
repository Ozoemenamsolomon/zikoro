"use client";
import { CustomInput } from "@/components/content/CustomInput";
import { CustomSelect } from "@/components/content/CustomSelect";
import { Switch } from "@/components/ui/switch";
import { Check } from "styled-icons/material";
import { AddToQueue } from "@styled-icons/boxicons-regular/AddToQueue";
import { Trash } from "@styled-icons/boxicons-regular/Trash";
import { Cog } from "@styled-icons/boxicons-regular/Cog";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
import { Certificate as CertificateIcon } from "@styled-icons/fluentui-system-regular/Certificate";
import { CustomTextBox } from "@/components/content/CustomTextBox";
import { useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { MinusCircle } from "@styled-icons/boxicons-regular/MinusCircle";
import { manrope } from "@/utils/fonts";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { addCertificate } from "@/app/server-actions/addCertificate";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const certifcates = [
  {
    img: "/certificates/cert0.jpg",
    label: "/certificates/zikoro_small.svg",
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
  const [isCPD, setIsCPD] = useState<boolean>(false);
  const [isZikoroLogo, setIsZikoroLogo] = useState(false);
  const [dataState, setDataState] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [logoPosition, setLogoPosition] = useState("right");

  const [attendanceRate, setAttendanceRate] = useState(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isTrackOpen, setIsTrackOpen] = useState<boolean>(false);
  const [isSessionopen, setIsSessionOpen] = useState<boolean>(false);
  const [attendance, setAttendance] = useState("");
  const [criteria, setCriteria] = useState("");
  const [attendanceType, setAttendanceType] = useState("");

  return (
    <div className="p-4">
      <form id="form" action={addCertificate}>
        <div className="flex items-center justify-between mb-8">
          <h6 className="font-medium">Certificate</h6>
          <div className="flex justify-between items-center space-x-6">
            <button className="text-center">
              <span className="pr-[2px]">
                {isSaved ? "Saved" : "Save"}{" "}
                <Check size={15} className="text-bluebg" />
              </span>
            </button>
            <Trash size={20} className="text-red-500" />
            {/* DialogDemo  */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Cog size={20} />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    <p className="text-[24px] font-medium">
                      Certificate Settings
                    </p>
                  </DialogTitle>
                </DialogHeader>
                <div className="grid tems-center mt-10 gap-4 border rounded-[4px] relative p-4 h-14">
                  <span className="absolute right-2 -top-[0.7rem] bg-white text-[12px]">
                    Attendance
                  </span>
                  <RadioGroup
                    className="flex space-x-6 data-[state=checked]:border-bluebg text-[#717171]"
                    defaultValue="event"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="event"
                        className="fill-current text-bluebg"
                        onClick={() => {
                          setAttendance("event");
                          setIsSessionOpen(false);
                          setIsTrackOpen(false);
                        }}
                      />
                      <label className="text-sm">Event</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="track"
                        className="fill-current text-bluebg"
                        onClick={() => {
                          setAttendance("track");
                          setIsSessionOpen(false);
                          setIsTrackOpen(!isTrackOpen);
                        }}
                      />
                      <label className="text-sm">Track</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="session"
                        className="fill-current text-bluebg"
                        onClick={() => {
                          setAttendance("session");
                          setIsSessionOpen(!isSessionopen);
                          setIsTrackOpen(false);
                        }}
                      />
                      <label className="text-sm">Session</label>
                    </div>
                  </RadioGroup>
                </div>
                <span className="description-text pt-2">
                  To be eligible for a certificate an attendee must have been
                  checked in for any of the selected option
                </span>
                {isTrackOpen && (
                  <>
                    <CustomSelect
                      label="Track"
                      name="track"
                      id="track"
                      containerClassName="mb-2 mt-8"
                      placeholder="Select track"
                      onValueChange={(value) => setAttendanceType(value)}
                    />
                  </>
                )}
                {isSessionopen && (
                  <CustomSelect
                    label="Session"
                    name="session"
                    id="session"
                    containerClassName="mb-2 mt-8"
                    placeholder="Select session"
                    onValueChange={(value) => setAttendanceType(value)}
                  />
                )}

                <div className="flex justify-between items-center mb-4 mt-8">
                  <p>Attendance rate</p>
                  <div className="flex items-center">
                    <MinusCircle
                      size={25}
                      color="gray"
                      role="button"
                      onClick={() => {
                        if (attendanceRate > 5) {
                          setAttendanceRate(attendanceRate - 5);
                        }
                      }}
                    />
                    <input
                      value={attendanceRate}
                      type="number"
                      readOnly
                      className="w-10 text-end focus:outline-none"
                    />

                    <span className="mr-2">%</span>
                    <PlusCircle
                      size={25}
                      color="#001FCC"
                      role="button"
                      onClick={() => setAttendanceRate(attendanceRate + 5)}
                    />
                  </div>
                </div>
                <div className="grid tems-center mt-5 gap-4 border rounded-[4px] relative p-4 h-14">
                  <span className="absolute right-2 -top-[0.7rem] bg-white text-[12px]">
                    Criteria
                  </span>
                  <RadioGroup className="flex space-x-6 data-[state=checked]:border-bluebg text-[#717171] text-sm">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="1dayAttendance"
                        id="1dayAttendance"
                        className="fill-current text-bluebg"
                        onClick={() => setCriteria("1dayAttendance")}
                      />
                      <label className="text-sm">1-day Attendance</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="completeDaysOfEvent"
                        value="completeDaysOfEvent"
                        className="fill-current text-bluebg"
                        onClick={() => setCriteria("completeDaysOfEvent")}
                      />
                      <label className="text-sm">Complete days of event</label>
                    </div>
                  </RadioGroup>
                </div>
                <span className="description-text pt-2">
                  Please enable{" "}
                  <span className="text-bluebg underline">
                    multiple check-in
                  </span>{" "}
                  if you choose complete days of event as a criteria for issuing
                  certificate
                </span>
                <button
                  className="bg-bluebg text-white px-[12px] py-[8px] rounded-[5px] w-full mt-6"
                  type="button"
                  onClick={() => {
                    setDialogOpen(!dialogOpen);
                  }}
                >
                  Done
                </button>
              </DialogContent>
            </Dialog>
            <CertificateIcon size={20} />
          </div>
        </div>
        <div>
          <div className="flex space-x-10 items-center">
            <CustomInput
              label="Certificate name"
              id="certificateName"
              name="certificateName"
              placeholder="Please select"
              containerClassName="w-1/2"
            />
            <CustomSelect
              label="Certificate heading"
              name="certificateHeading"
              id="certificateHeading"
              placeholder="Please select training heading"
              containerClassName="w-1/2"
            />
          </div>
          <input
            hidden
            type="number"
            value={attendanceRate}
            name="attendanceRate"
            id="attendanceRate"
            readOnly
          />
          <input
            hidden
            value={attendance}
            name="attendance"
            id="attendance"
            readOnly
          />
          <input hidden value={attendanceType} name="attendanceType" readOnly />
          <input
            hidden
            value={criteria}
            name="criteria"
            id="criteria"
            readOnly
          />
          <span className="text-[11px] text-[#717171] description-text">
            Participants can download certificate at the end of the training
          </span>
          <div className="flex justify-center pl-[12rem] items-center space-x-2">
            <Switch
              value={isCPD.toString()}
              name="cpdRequired"
              onClick={() => setIsCPD(!isCPD)}
              className={`data-[state=checked]:bg-bluebg w-[32px] h-[22px]`}
            />
            <span className="text-md">CPD required</span>
          </div>
          <div className="flex mt-5 space-x-10 items-center">
            <CustomInput
              name="trainingDuration"
              label="Training duration(hours)"
              id="trainingDuration"
              placeholder="0"
              type="number"
              containerClassName="w-1/2"
            />

            <CustomInput
              name="cpdPoints"
              label="CPD Points"
              id="cpdPoints"
              placeholder="0"
              type="number"
              containerClassName="w-1/2"
              disabled={!isCPD}
            />
          </div>
        </div>
        <div className="flex mt-6">
          <div className="space-y-4 w-1/2 mr-8 text-[16px]">
            <p className="text-[#717171]">Logo position</p>
            <input
              hidden
              name="logoPosition"
              defaultValue={logoPosition}
              id="logoPosition"
            />
            <button
              type="button"
              onClick={() => setLogoPosition("left")}
              className=" focus:border-bluebg border border-basecolor bg-white focus:bg-[#EBEBEB] focus:text-bluebg rounded-[4px] py-[12px] px-[16px]"
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => setLogoPosition("middle")}
              className="mx-4 focus:border-bluebg border border-basecolor bg-white focus:bg-[#EBEBEB] focus:text-bluebg rounded-[4px] py-[12px] px-[16px]"
            >
              Middle
            </button>
            <button
              type="button"
              onClick={() => setLogoPosition("right")}
              className="focus:border-bluebg border border-basecolor bg-white focus:bg-[#EBEBEB] focus:text-bluebg rounded-[4px] py-[12px] px-[16px]"
            >
              Right
            </button>
          </div>

          <div className="w-1/2">
            <CustomTextBox
              label="Scope of training"
              id="trainingScope"
              name="trainingScope"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            onClick={() => setIsZikoroLogo(!isZikoroLogo)}
            value={isZikoroLogo.toString()}
            name="zikoroLogo"
            className={`data-[state=checked]:bg-bluebg w-[32px] h-[22px]`}
          />
          <span className="text-md">Include Zikoro Logo</span>
        </div>
        <div className="mt-12">
          <h3 className="font-medium">Certificate Template</h3>
          <div className="flex justify-between items-center mt-2">
            {certifcates.map((item, index) => (
              <div key={index} className="relative">
                <img
                  src={item.img}
                  width={200}
                  height={`auto`}
                  alt="certificate"
                  className={`${
                    item.label
                      ? `border border-bluebg p-0 h-[284px]`
                      : "h-[300px]"
                  }`}
                />
                {item.tag ? (
                  <span className="absolute top-20 translate-y-12 left-[30%] z-10 bg-black p-1 text-[12px] text-white rounded-md">
                    {item.tag}
                  </span>
                ) : (
                  isZikoroLogo && (
                    <img
                      className={`absolute top-3.5 ${logoPosition}-4 z-10 ${
                        logoPosition === "left"
                          ? "ml-10"
                          : logoPosition === "middle"
                          ? "ml-24"
                          : "mx-1"
                      }`}
                      src={item.label}
                      width={20}
                      height={20}
                      alt={item.label}
                    />
                  )
                )}
              </div>
            ))}
          </div>
          <div className="flex mt-8 space-x-4 items-center">
            <button
              className="border-2 border-bluebg w-[6rem] px-[12px] py-[8px] rounded-[5px] text-bluebg"
              onClick={() => {
                setIsSaved(!isSaved);
                if (isSaved) {
                  toast.success("Certificate saved!");
                } else {
                  toast.error("Certificate has already been saved");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
        <Toaster />
      </form>
    </div>
  );
}
