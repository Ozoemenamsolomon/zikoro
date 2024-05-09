"use client";

import { InteractionLayout } from "../_components";
import { Button } from "@/components";
import { useVerifyUserAccess, useCheckTeamMember } from "@/hooks";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
export default function Quiz({ eventId }: { eventId: string }) {
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });

  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full">
        <div className="flex items-end w-full justify-end px-4">
          <Button
            //  onClick={onClose}
            className={cn(
              "text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium hidden",
              (isIdPresent || isOrganizer) && "flex"
            )}
          >
            <PlusCircle size={22} />
            <p>Quiz</p>
          </Button>
        </div>

        
      </div>
    </InteractionLayout>
  );
}
