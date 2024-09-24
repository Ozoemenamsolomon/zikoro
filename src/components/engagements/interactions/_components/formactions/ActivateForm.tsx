"use client";

import { Switch } from "@/components/ui/switch";

import { usePostRequest } from "@/hooks/services/request";
import { TEngagementFormQuestion } from "@/types/engagements";

export function ActivateForm({
  form,
  refetch,
}: {
  refetch: () => Promise<any>;
  form: TEngagementFormQuestion;
}) {
  const { postData, isLoading } = usePostRequest("/engagements/form");
  async function updateStatus() {
    const payload: Partial<TEngagementFormQuestion> = {
      ...form,
      isActive: !form?.isActive,
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
          checked={form.isActive}
          disabled={isLoading}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>
    </>
  );
}
