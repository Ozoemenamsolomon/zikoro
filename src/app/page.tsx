"use client";

import { SideBarLayout } from "@/components";
import { EventCards, EmptyCard } from "../components/home";
import { useGetQueries } from "@/hooks"
export default function Page() {
  const { data: eventData, refetch } = useGetQueries("events")


  return (
    <main className="w-full h-full">
      <SideBarLayout
        isHomePage={true}
      >
        {eventData.length > 0 ? <EventCards refetch={refetch} events={eventData} />
          :
          <EmptyCard text={`You have not added any event. Start by creating an organization`} />}
      </SideBarLayout>
    </main>
  );
}
