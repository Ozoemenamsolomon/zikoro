"use client";

import { Button } from "@/components";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import Image from "next/image";
import { QUser, QUsers } from "@/constants";
export function QuizCard() {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <div className="w-full h-full bg-gray-100 rounded-md py-4 px-3">
      <p className="text-xs text-gray-700 sm:text-mobile mb-3">No. 1</p>
      <div className="w-full text-mobile sm:text-sm bg-white rounded-md flex flex-col items-start justify-start gap-y-3">
        <div className="border-b p-3 border-gray-600 gap-3 pb-2 w-full flex items-center justify-between">
          <p className="italic w-full text-gray-500 line-clamp-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled
          </p>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose()
            }}
            className="px-0 w-fit relative h-fit"
          >
            <ThreeDotsVertical size={20} />
            {isOpen && <ActionModal close={onClose} />}
          </Button>
        </div>
        <div className="w-full px-3">
          <Image
            className="w-full rounded-md h-36 object-cover"
            alt="quiz"
            src="/quizimage.png"
            width={400}
            height={400}
          />
        </div>
        <p className="font-medium px-3 w-full line-clamp-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled
        </p>
        <div className="text-gray-500 px-3 text-xs ms:text-mobile flex items-center justify-between w-full">
          <p className="flex items-center gap-x-2">
            <span className="border-r pr-2 border-gray-500">50 Questions</span>
            <span>1000 points</span>
          </p>
          <p className="flex items-center gap-x-1">
            <QUsers />
            <span>15</span>
          </p>
        </div>
        <p className="flex p-3 text-xs ms:text-mobile items-center gap-x-1">
          <QUser />
          <span>Ibrahim Rasheed</span>
        </p>
      </div>
    </div>
  );
}

function ActionModal({ close }: { close: () => void }) {
  return (
    <>
      <div className="absolute right-0 top-8  w-[140px]">
        <Button className="fixed inset-0 bg-none h-full w-full z-[100"></Button>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex relative z-[50]  flex-col  py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
        >
          <Button
            // onClick={duplicate}
            className={
              "items-center h-10 gap-x-2 hover:bg-gray-100 justify-start w-full  text-xs"
            }
          >
            {"" && <LoaderAlt size={12} className="animate-spin" />}
            <span>Make a Copy</span>
          </Button>
          <div className="w-full px-4 text-xs flex items-center justify-between ">
            <p>Activate</p>
            <Switch className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"/>
          </div>

          <Button
            onClick={() => {
              //   onClose();
            }}
            className="items-center h-10 w-full text-red-600 hover:bg-gray-100 justify-start text-xs"
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
