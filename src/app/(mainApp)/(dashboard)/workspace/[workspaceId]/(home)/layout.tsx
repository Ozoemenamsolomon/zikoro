"use client";

import { useParams } from "next/navigation";
import MainTopBar from "@/components/MainTopBar";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { workspaceId }: { workspaceId: string } = useParams();

  return (
    <div className="w-full h-full">
      <div className="w-full  lg:w-[calc(100%-180px)] h-full float-right p">
        <WorkspaceSidebar workspaceId={workspaceId} />
        {children}
      </div>
    </div>
  );
}
