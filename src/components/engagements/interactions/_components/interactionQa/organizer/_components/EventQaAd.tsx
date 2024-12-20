"use client"

import { Link45deg } from "styled-icons/bootstrap";
import { Minimize2 } from "styled-icons/feather";
import { Button } from "@/components";
import QRCode from "react-qr-code";
import { cn } from "@/lib";
import { useState } from "react";
import copy from "copy-to-clipboard";
import { TEventQa } from "@/types";
export function EventQaAdvert({
  isRightBox,
  close,
  isLeftBox,
  eventName,
  qa,
  closeMobile
}: {

  isLeftBox: boolean;
  close: () => void;
  isRightBox: boolean;
  eventName: string;
  qa: TEventQa
  closeMobile:() => void;
}) {
 // console.log("ileft", isLeftBox, isRightBox);
  const qaLink = `${window.location.origin}/engagements/${qa?.eventAlias}/qaa/${qa?.QandAAlias}`
  const [isCopy, setCopy] = useState(false)
  return (
    <div
      className={cn(
        "w-full flex-col  rounded-l-xl h-[100vh] md:flex  items-start justify-between hidden  col-span-2 ",
        isLeftBox && !isRightBox &&  "col-span-full mx-auto max-w-xl flex",
        !isLeftBox && "hidden"
      )}
    >
      {qa?.branding?.eventName ? (
        <h2 className="font-semibold w-full border-b p-4 text-base sm:text-xl">
          {eventName}
        </h2>
      ) : (
        <div className="w-1 h-1"></div>
      )}
      <div className="w-full p-2 flex flex-col gap-y-3 items-center justify-center ">
        <div className="w-fit h-fit  bg-white p-2">
          <QRCode size={150} value={qaLink} />
        </div>

        <div className="w-full flex items-center">
          <Button className="bg-white w-[10%] px-0 rounded-r-none rounded-l-lg border-y-0 border-l border-r-0 h-11">
            <Link45deg size={22} />
          </Button>
          <input
            value={qaLink}
            type="text"
            readOnly
            className="w-[70%] text-mobile h-11 border bg-white pl-4"
          />
          <Button
            onClick={() => {
              copy(qaLink);
              setCopy(true)
              setTimeout(() => {
                setCopy(false)
              },1000)
            }}
            className="w-[20%] rounded-r-lg rounded-l-none bg-basePrimary text-white text-mobile"
          >
            <span className="text-white"> { isCopy ? "Copied" : "Copy"}</span>
          </Button>
        </div>

        <div className="w-full flex mt-8 flex-col items-center justify-center gap-y-3">
          <p>Or join at</p>
          <div className="gap-2 grid grid-cols-10">
            <p className="w-full col-span-9 text-ellipsis whitespace-nowrap overflow-hidden text-xl">
              www.zikoro.com/interaction/qa
            </p>
          </div>
          <p className="font-semibold text-lg sm:text-3xl">{qa?.QandAAlias}</p>
        </div>
      </div>

      <div className="p-4 w-full flex items-end justify-end">
        <Button onClick={(e) => {
          e.stopPropagation()
          close()
        }} className="px-0 h-fit w-fit hidden md:flex">
          <Minimize2 size={20} />
        </Button>
        <Button onClick={(e) => {
          e.stopPropagation()
          closeMobile()
        }} className="px-0 h-fit w-fit flex md:hidden">
          <Minimize2 size={20} />
        </Button>
      </div>
    </div>
  );
}
