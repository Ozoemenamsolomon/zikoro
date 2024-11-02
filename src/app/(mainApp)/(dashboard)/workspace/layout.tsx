"use client";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full ">
      <div className="w-full bg-white lg:w-[calc(100%-180px)] h-full float-right ">
        <WorkspaceSidebar />
        <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
        {children}
        </div>
       
      </div>
    </div>
  );
}
