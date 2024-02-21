"use client";

import { SideBarLayout } from "@/components";
import { AboutPartner, PartnerBanners, PromotionalOffer } from "./_components";
import { HeaderTab } from "../_components";
// import { TPartner } from "@/types";
import { useFetchSinglePartner } from "@/hooks";

export function PartnerDetails({ partnerId }: { partnerId: string }) {
  const { data, refetch } = useFetchSinglePartner(partnerId);
  return (
    <SideBarLayout
      hasTopBar
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      className="px-0 sm:px-0 pt-4 sm:pt-14"
    >
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
