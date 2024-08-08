"use client";

import { InteractionTabs } from ".";
import { useVerifyUserAccess, useCheckTeamMember } from "@/hooks";

export function InteractionLayout({
  eventId,
  children,
}: {
  children: React.ReactNode;
  eventId: string;
}) {
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });

  return (
    <div className="w-full pb-32">
      <InteractionTabs eventId={eventId} isAttendee={!isOrganizer && !isIdPresent} />
      <div className="w-full ">{children}</div>
    </div>
  );
}
