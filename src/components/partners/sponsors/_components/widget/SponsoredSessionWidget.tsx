"use client"

import { Button } from "@/components";
import { EditBox } from "@styled-icons/remix-line/EditBox";

export function SponsoredSessionWidget({
    title,
    date,
    time,
  }: {
    date: string;
    time: string;
    title: string;
  }) {
    return (
      <div className="w-full flex items-center px-3 py-4 border-b justify-between">
        <div className="flex items-center gap-x-3">
          <p className="capitalize">{title}</p>
          <Button className="w-fit h-fit px-1">
            <EditBox size={22} />
          </Button>
        </div>
        <div className="flex flex-col items-start justify-start">
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </div>
    );
  }