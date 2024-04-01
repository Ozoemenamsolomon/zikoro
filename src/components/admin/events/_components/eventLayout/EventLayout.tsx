import { RouteHeader } from "@/components/admin/_components";
import { EventTopNav } from "..";
import React from "react";

export function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <RouteHeader
        header="Events"
        description="See all events, review, new and publish"
      />
      <EventTopNav />
      {children}
    </div>
  );
}
