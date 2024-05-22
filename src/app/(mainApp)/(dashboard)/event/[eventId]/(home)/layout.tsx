
"use client";

import { Topbar } from "@/components";
import { useParams } from "next/navigation";
import MainTopBar from "@/components/MainTopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId }:{eventId:string} = useParams();

  return (
    <div className="w-full h-full">
      <div className="w-[calc(100%-60px)]  bg-white float-right right-0 z-[43] fixed flex justify-between items-center ">
       <MainTopBar eventId={eventId}/>
      </div>

      <div className="w-full  lg:w-[calc(100%-180px)] h-full float-right pt-[4.5rem]">
      <Topbar eventId={eventId} />
        {children}
        </div>
    </div>
  );
}
