"use client";

import { Switch } from "@/components/ui/switch";

import { usePostRequest } from "@/hooks/services/request";
import {  TEventQa } from "@/types/engagements";

export function ActivateQA({
  eventQa,
  refetch,
}: {
  refetch: () => Promise<any>;
  eventQa: TEventQa;
}) {
  const { postData, isLoading } = usePostRequest("/engagements/qa");
  async function updateStatus() {
    const payload: Partial<TEventQa> = {
      ...eventQa,
      accessibility: {
        ...eventQa?.accessibility,
        disable: !eventQa.accessibility?.disable,
      },
    };

    await postData({ payload });
    refetch();
  }
  return (
    <>
      <div className="w-full px-4 text-xs flex items-center justify-between ">
        <p>Disabled</p>
        <Switch
          onClick={updateStatus}
          checked={eventQa.accessibility?.disable}
          disabled={isLoading}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>
    </>
  );
}
