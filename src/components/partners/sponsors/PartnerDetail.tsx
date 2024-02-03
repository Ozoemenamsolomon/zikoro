"use client";

import { SideBarLayout } from "@/components";
import { AboutPartner, PartnerBanners } from "./_components";
import { HeaderTab } from "../_components";
// import { TPartner } from "@/types";
import { useFetchSinglePartner } from "@/hooks";

export function PartnerDetails({ partnerId }: { partnerId: string }) {
  const { data, refetch } = useFetchSinglePartner(partnerId);
  return (
    <SideBarLayout className="px-0 sm:px-0">
      <HeaderTab eventId="" refetch={refetch} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start">
        <AboutPartner partner={data} partnerId={partnerId} refetch={refetch} />
        <PartnerBanners
          partner={data}
          refetch={refetch}
          partnerId={partnerId}
        />
      </div>
    </SideBarLayout>
  );
}
