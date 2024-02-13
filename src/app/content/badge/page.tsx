"use client";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetServerSideProps } from "next";
import { containerClasses } from "@mui/material";

const badges = [
  ["/badges/badge3.png", "/badges/badge2.png", "/badges/badge1.png"],
];
export default function Badge() {
  const [headerColor, setHeaderColor] = useState("#055731");
  const [footerColor, setFooterColor] = useState("#D6D6D6");
  const [isSaved, setIsSaved] = useState(false);
  const [header, setHeader] = useState({
    orgLogo: false,
    eventTitle: false,
  });
  const [name, setName] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
  });
  const [jobTitle, setJobTitle] = useState(true);
  const [orgName, setOrgName] = useState(true);
  const [attendeeType, setAttendeeType] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [badgeTemplate, setBadgeTemplate] = useState({
    templateOne: {
      id: "",
      isName: false,
      isJobTitle: "",
      isOrgName: "",
      isAttendeeType: "",
      isHeaderColor: "",
      isFooterColor: "",
      header: {
        orgLogo: false,
        eventTitle: false,
      },
    },
  });

  const getId = (id: string) => {
    const elementID = document.getElementById(id);
    return elementID?.id;
  };

  const handleColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setColor: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setColor(event.target.value);
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h6 className="font-medium">Badge</h6>
        <div className="flex justify-between items-center space-x-6">
          <p className="text-center">
            <span className="pr-[2px] text-[#3E404B]">
              {isSaved ? "Saved" : "Save"}{" "}
              <Check size={15} className="text-bluebg" />
            </span>
          </p>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => handleColorChange(e, setHeaderColor)}
                    className="w-10 h-5 border-0"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change color theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <input
                    type="color"
                    value={footerColor}
                    onChange={(e) => handleColorChange(e, setFooterColor)}
                    className="w-10 h-5 border-0"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change footer color</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                      Header
                    </span>
                    <div className="flex items-center">
                      <RadioGroup className="flex space-x-5 data-[state=checked]:border-bluebg">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="withOrglogo"
                            id="withOrglogo"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setHeader({
                                eventTitle: false,
                                orgLogo: true,
                              });

                              console.log(header);
                            }}
                          />
                          <span>With organisation logo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            id="withEventTitle"
                            value="withEventTitle"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setHeader({
                                orgLogo: false,
                                eventTitle: true,
                              });
                              console.log(header);
                            }}
                          />
                          <span className="break-keep">With event title</span>
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
                            onClick={() => {
                              setName({ ...name, fullName: "full name" });
                            }}
                          />

                          <span>First name & last name</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            id="lastname"
                            value="lastname"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setName({ ...name, lastName: "lastname" });
                            }}
                          />
                          <span className="break-keep">Last name</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="firstname"
                            id="firstname"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setName({ ...name, firstName: "firstname" });
                            }}
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
                            onClick={() => {
                              setJobTitle(true);
                            }}
                          />
                          <span>Show</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            id="hideJobTitle"
                            value="hideJobTitle"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setJobTitle(false);
                            }}
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
                            onClick={() => {
                              setOrgName(true);
                            }}
                          />
                          <span>Show</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            id="hideOrgName"
                            value="hideOrgName"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setOrgName(false);
                            }}
                          />
                          <span>Hidden</span>
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
                            onClick={() => {
                              setAttendeeType(true);
                            }}
                          />
                          <span>Show</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            id="hideAttendeeType"
                            value="hideAttendeeType"
                            className="fill-current text-bluebg"
                            onClick={() => {
                              setAttendeeType(false);
                            }}
                          />
                          <span>Hide</span>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <button
                    className="bg-bluebg text-white px-[12px] py-[8px] rounded-[5px] w-full"
                    type="button"
                    onClick={() => {
                      setDialogOpen(!dialogOpen);
                    }}
                  >
                    Done
                  </button>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex space-x-10">
        {/* first badge */}
        <BadgeTemplate
          containerClassName={selected ? "border border-bluebg" : ""}
          id="1"
          name={
            name.firstName
              ? `${name.firstName}`
              : name.fullName
              ? `${name.fullName}`
              : name.lastName
              ? `${name.lastName}`
              : ""
          }
          jobTitle={selected && jobTitle ? "Frontend Developer" : ""}
          orgName={selected && orgName ? "OrthoEx" : ""}
          onClick={() => {
            setSelected(!selected);
            getId("1");
            setBadgeTemplate({
              ...badgeTemplate,
              templateOne: {
                ...badgeTemplate.templateOne,
                id: "1",
              },
            });
          }}
          attendeeType={selected && attendeeType ? "Attendee" : ""}
          style={{
            backgroundColor: selected && headerColor,
          }}
          headerContent={
            selected && header?.eventTitle ? (
              "Resin Art Workshop"
            ) : (
              <Image
                src="/certificates/custom-logo.png"
                alt="certificate"
                width={70}
                height={70}
              />
            )
          }
          imageClassName={selected && !hide ? "" : "hidden"}
          headerClassName={selected && header?.orgLogo ? "" : "top-12"}
        />

        {/* second badge */}

        <div
          className={`flex justify-between mt-4 mb-6 relative h-[420px] cursor-pointer`}
          id="2"
        >
          <div
            className={`w-80 bg-white relative rounded-lg ${
              !hide ? "border border-bluebg" : ""
            } `}
            onClick={() => {
              setHide(!hide);
              console.log(hide);
              getId("2");
            }}
          >
            <div
              className={`h-44 rounded-t-md flex items-center`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 70%)",
                backgroundColor: headerColor,
              }}
            >
              <Image
                src="/certificates/check-one.svg"
                alt="check-mark"
                width={20}
                height={20}
                className={`absolute top-3 right-5 ${!hide ? "" : "hidden"}`}
              />
              <p
                className={`text-white mx-4 font-medium absolute top-5 ${
                  header?.orgLogo ? "" : "top-14 "
                } tracking-wide uppercase `}
              >
                {header?.eventTitle ? (
                  "Resin Art Workshop"
                ) : (
                  <Image
                    src="/certificates/custom-logo.png"
                    alt="certificate"
                    width={70}
                    height={70}
                  />
                )}
              </p>
            </div>
            <div className="absolute w-80 top-14 mt-14">
              <div className="h-12 my-6"></div>
              <div className="h-36">
                <div className="relative">
                  <div className="flex flex-col mx-4 text-[#15161B]">
                    <p className="uppercase font-bold text-lg">
                      {name.firstName
                        ? `${name.firstName}`
                        : name.fullName
                        ? `${name.fullName}`
                        : name.lastName
                        ? `${name.lastName}`
                        : ""}
                    </p>
                    <Separator
                      className={`h-0.5 w-48`}
                      style={{
                        backgroundColor: "black",
                      }}
                    />
                    <p className="text-sm mt-2 mb-1 font-medium">
                      {jobTitle ? "Frontend Developer" : ""}
                    </p>
                    <p className="text-xs mb-3 font-medium">
                      {orgName ? "OrthoEx" : ""}
                    </p>
                  </div>

                  <div className="rounded-b-lg flex justify-center items-center">
                    <svg
                      width="100%"
                      height="120"
                      viewBox="0 0 330 113"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rounded-b-lg"
                    >
                      <path
                        d="M0 120H0V31.2405L330 0V120Z"
                        fill={footerColor}
                      />
                    </svg>

                    <Image
                      src="/badges/QRcode.svg"
                      alt="qrcode"
                      width={90}
                      height={80}
                      className="absolute right-8 translate-x-4 top-10"
                    />
                    <p className="text-xs text-white uppercase tracking-[5px] absolute bottom-4">
                      {attendeeType ? "Attendee" : ""}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* third badge */}
        <BadgeTemplate
          containerClassName={!hide ? "border border-bluebg rounded-lg" : ""}
          id="3"
          cardClassName={!hide ? "" : "hidden"}
          name={
            name.firstName
              ? `${name.firstName}`
              : name.fullName
              ? `${name.fullName}`
              : name.lastName
              ? `${name.lastName}`
              : ""
          }
          jobTitle={jobTitle ? "Frontend Developer" : ""}
          orgName={orgName ? "OrthoEx" : ""}
          onClick={() => {
            setHide(!hide);
            getId("3");
          }}
          attendeeType={attendeeType ? "Attendee" : ""}
          style={{
            backgroundColor: headerColor,
          }}
          headerContent={
            header?.eventTitle ? (
              "Resin Art Workshop"
            ) : (
              <Image
                src="/certificates/custom-logo.png"
                alt="certificate"
                width={70}
                height={70}
              />
            )
          }
          imageClassName={!hide ? "" : "hidden"}
          headerClassName={header?.orgLogo ? "" : "top-12"}
          footerColor={footerColor}
        />
      </div>
      <div className="mt-10">
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
      </div>
      <Toaster />
    </div>
  );
}

const BadgeTemplate: React.FC<{
  containerClassName?: string;
  cardClassName?: string;
  imageClassName?: string;
  headerClassName?: string;
  headerContent?: any;
  name?: string;
  jobTitle?: string;
  orgName?: string;
  attendeeType?: string;
  onClick?: () => void;
  style?: any;
  footerColor?: string;
  id?: string;
}> = ({
  containerClassName,
  onClick,
  name,
  jobTitle,
  orgName,
  attendeeType,
  headerClassName,
  headerContent,
  imageClassName,
  style,
  footerColor,
  id,
}) => {
  return (
    <div className="flex justify-between mt-4 mb-6 cursor-pointer" id={id}>
      <div
        className={`w-80 bg-white relative rounded-md ${containerClassName}`}
        onClick={onClick}
      >
        <div
          className={`h-24 rounded-t-md relative flex justify-center items-center`}
          style={style}
        >
          <Image
            src="/certificates/check-one.svg"
            alt="check-mark"
            width={20}
            height={20}
            className={`absolute top-3 right-5 ${imageClassName}`}
          />
          <p
            className={`text-white font-medium absolute top-3 ${headerClassName} tracking-wide uppercase `}
          >
            {headerContent}
          </p>
        </div>
        <div className="h-9 my-6"></div>
        <div className="h-36">
          <div>
            <div className="my-1 flex flex-col justify-center items-center text-[#15161B]">
              <p className="uppercase font-bold text-lg">{name}</p>
              <Separator
                className={`h-0.5 w-48`}
                style={{
                  backgroundColor: "black",
                }}
              />
              <p className="text-sm mt-2 mb-1 font-medium">
                {jobTitle ? "Frontend Developer" : ""}
              </p>
              <p className="text-xs mb-3 font-medium">
                {orgName ? "OrthoEx" : ""}
              </p>
              <Image
                src="/badges/QRcode.svg"
                alt="qrcode"
                width={90}
                height={80}
              />
            </div>
            <div
              className="rounded-b-lg flex justify-center items-center"
              style={{
                backgroundColor: footerColor,
                height: "41px",
                marginTop: "1rem",
              }}
            >
              <p className="text-xs text-[#15161B] uppercase tracking-[5px]">
                {attendeeType ? "Attendee" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
