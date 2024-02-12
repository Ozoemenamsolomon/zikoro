import { SideBarLayout } from "@/components";
import { ContentTabs } from "../_components/ContentTabs";
import { ExhibitionHall, PartnersList } from "./_components";

export function ContentPartners({eventId}:{eventId:string}) {
  return (
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-4 sm:pt-4"
      parentClassName="px-0 sm:px-0"
      eventId={eventId}
    >
      <ContentTabs />
      <div className="w-full grid grid-cols-8 items-center gap-4">
        <PartnersList />
        <ExhibitionHall />
      </div>
    </SideBarLayout>
  );
}
