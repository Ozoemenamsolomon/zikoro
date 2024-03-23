"use client";

import { SideBarLayout } from "@/components";
import { InteractionTabs } from ".";

export function InteractionLayout({
  eventId,
  children,
}: {
  children: React.ReactNode;
  eventId: string;
}) {
  return (
    <div className="w-full ">
      <InteractionTabs eventId={eventId} />
      <div className="w-full ">{children}</div>
    </div>
  );
}
