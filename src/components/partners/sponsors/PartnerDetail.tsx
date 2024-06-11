"use client";

import { useSearchParams } from "next/navigation";
import { AboutPartner, PartnerBanners, PromotionalOffer } from "./_components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
// import { TPartner } from "@/types";
import {
  getCookie,
  useFetchSinglePartner,
  useVerifyUserAccess,
  useGetEventAttendees,
} from "@/hooks";
import { useMemo } from "react";
import useUserStore from "@/store/globalUserStore";

export function PartnerDetails({ partnerId, eventId }: { eventId:string; partnerId: string }) {
  const { data, refetch, loading } = useFetchSinglePartner(partnerId);
  const {attendee, isOrganizer} = useVerifyUserAccess(eventId)
  const {user} = useUserStore()
  const search = useSearchParams();
  const id: any = search.get("event");
  const owner = search.get("email");
  const { attendeeId } = useVerifyUserAccess(id);
  const { attendees: eventAttendees, isLoading } = useGetEventAttendees(id);

  const isHaveAccess = useMemo(() => {
    if (data?.email === user?.userEmail) {
      return true;
    } else if (Array.isArray(eventAttendees)) {
      const filteredStaffsId = Array.isArray(data?.boothStaff)
        ? data?.boothStaff?.map(({ id }) => id)
        : [];
      const filteredAttendee = eventAttendees?.filter((value) =>
        filteredStaffsId.includes(Number(value?.id))
      );

      return filteredAttendee?.some(({ id }) => id === Number(attendeeId));
    } else {
      return false;
    }
  }, [eventAttendees, owner, isLoading, data, loading]);
  
  return (
    <>
      {loading || isLoading ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt className="animate-spin" size={30} />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start pb-20">
          <AboutPartner
            isHaveAccess={isHaveAccess}
            partner={data}
            partnerId={partnerId}
            isOrganizer={isOrganizer}
            attendee={attendee}
            refetch={refetch}
          />
          <div className="lg:col-span-3  flex flex-col gap-y-2 items-start justify-start w-full">
            <PartnerBanners
              isHaveAccess={isHaveAccess}
              partner={data}
              refetch={refetch}
              partnerId={partnerId}
            />
            <PromotionalOffer
              isHaveAccess={isHaveAccess}
              partner={data}
              refetch={refetch}
              partnerId={partnerId}
            />
          </div>
        </div>
      )}
    </>
  );
}
