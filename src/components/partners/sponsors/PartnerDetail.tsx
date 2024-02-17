"use client";

import { SideBarLayout } from "@/components";
import { AboutPartner, PartnerBanners, PromotionalOffer } from "./_components";
import { HeaderTab } from "../_components";
// import { TPartner } from "@/types";
import { useFetchSinglePartner } from "@/hooks";

export function PartnerDetails({ partnerId }: { partnerId: string }) {
  const { data, refetch } = useFetchSinglePartner(partnerId);
  return (
    <SideBarLayout hasTopBar className="px-0 sm:px-0">
     
      <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start">
        <AboutPartner partner={data} partnerId={partnerId} refetch={refetch} />
        <div className="lg:col-span-3  flex flex-col gap-y-2 items-start justify-start w-full">
        <PartnerBanners
          partner={data}
          refetch={refetch}
          partnerId={partnerId}
        />
        <PromotionalOffer 
          partner={data}
          refetch={refetch}
          partnerId={partnerId}
        />
        </div>
     
      </div>
    </SideBarLayout>
  );
}
