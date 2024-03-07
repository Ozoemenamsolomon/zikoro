"use client"

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
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-0 sm:pt-0"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
    >
      <div className="w-full pt-16">
        <InteractionTabs eventId={eventId} />
        <div className="w-full ">{children}</div>
      </div>
    </SideBarLayout>
  );
}
