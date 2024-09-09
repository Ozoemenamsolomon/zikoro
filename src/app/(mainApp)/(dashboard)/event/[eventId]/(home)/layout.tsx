"use client";
import { Topbar } from "@/components";
import { useParams } from "next/navigation";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId }: { eventId: string } = useParams();

  return (
    <div className="w-full h-full ">
      <div className="w-full bg-[#F9FAFF] lg:w-[calc(100%-180px)] h-full float-right ">
        <Topbar eventId={eventId} />
        {children}
      </div>
    </div>
  );
}
