"use client";

import { SideBarLayout } from "@/components";
import { AboutSponsor, SponsorBanners } from "./_components";
import { HeaderTab } from "../_components";

export function SponsorDetails() {
  return (
    <SideBarLayout className="px-0 sm:px-0">
      <HeaderTab eventId="" />
      <div className="w-full grid lg:grid-cols-7 items-start">
        <AboutSponsor />
        <SponsorBanners />
      </div>
    </SideBarLayout>
  );
}
