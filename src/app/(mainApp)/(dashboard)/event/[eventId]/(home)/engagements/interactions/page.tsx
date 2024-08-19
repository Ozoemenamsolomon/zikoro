"use client";
import Interactions from "@/components/engagements/interactions/Interactions";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <Interactions eventId={eventId} />;
}
