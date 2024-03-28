"use client";

import { Topbar } from "@/components";
import { useParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId } = useParams();

  return (
    <div className="w-full h-full">
      <div className="w-full lg:w-[calc(100%-250px)] pt-4 bg-white min-[1024px]:float-right right-0 z-50 fixed flex justify-between items-center ">
        <Topbar eventId={eventId} />
      </div>

    <div className="w-full h-full pt-12">  {children}</div>
    </div>
  );
}
