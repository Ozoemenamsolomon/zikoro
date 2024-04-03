"use client";

import { Payment } from "@/components/published";

export default function Page({
  params: { eventRegistrationRef },
}: {
  params: { eventRegistrationRef: string };
}) {
  return <Payment eventRegistrationRef={eventRegistrationRef} />;
}
