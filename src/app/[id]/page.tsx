"use client";

import { SideBarLayout } from "@/components";
import { EventCards } from "@/components/home";
import { useFetchOrganizationEvents } from "@/hooks";
export default function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data: eventData, refetch } = useFetchOrganizationEvents(id)

  return (
    <main className="w-full h-full">
      <SideBarLayout isHomePage={true}>
        <EventCards refetch={refetch} events={eventData} />
      </SideBarLayout>
    </main>
  );
}
