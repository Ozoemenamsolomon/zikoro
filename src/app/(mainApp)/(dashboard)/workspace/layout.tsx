"use client";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full ">
      <div className="w-full bg-white lg:w-[calc(100%-180px)] h-full float-right ">
        <WorkspaceSidebar />
        {children}
      </div>
    </div>
  );
}
