"use client";

import { Payment } from "@/components/published";

export default function Page({
  params: { eventRegistrationRef },
  searchParams
}: {
  params: { eventRegistrationRef: string };
  searchParams:any
}) {
  return <Payment eventRegistrationRef={eventRegistrationRef} searchParams={searchParams} />;
}
