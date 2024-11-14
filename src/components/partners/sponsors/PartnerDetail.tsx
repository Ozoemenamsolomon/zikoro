"use client";

import { AboutPartner, PartnerBanners, PromotionalOffer } from "./_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";

import {
  useFetchSinglePartner,
  useVerifyUserAccess,
  useCheckTeamMember,
} from "@/hooks";
import { useMemo } from "react";
import useUserStore from "@/store/globalUserStore";

export function PartnerDetails({
  partnerId,
  eventId,
  searchParams: { event: id, email: owner },
}: {
  eventId: string;
  partnerId: string;
  searchParams: any;
}) {
  const { data, refetch, loading } = useFetchSinglePartner(partnerId);
  const { attendee, isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { user } = useUserStore();




  const isHaveAccess = useMemo(() => {
    if (data?.email === user?.userEmail) {
      return true;
    } else if (
      data &&
      Array.isArray(data?.boothStaff) &&
      data?.boothStaff?.length > 0
    ) {
      return data?.boothStaff?.some(
        ({ userEmail }) => userEmail === user?.userEmail
      );
    } else if (owner) {
      return owner == user?.userEmail;
    } else {
      return false;
    }
  }, [ owner,  data, loading]);

  return (
    <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
      {loading  ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt className="animate-spin" size={30} />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start pb-20">
          <AboutPartner
            isHaveAccess={isHaveAccess}
            partner={data}
            partnerId={partnerId}
            isOrganizer={isOrganizer || isIdPresent}
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
              isOrganizer={isOrganizer || isIdPresent}
              attendee={attendee}
            />
          </div>
        </div>
      )}
    </div>
  );
}
