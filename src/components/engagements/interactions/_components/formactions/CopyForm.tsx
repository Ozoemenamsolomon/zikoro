"use client";

import { Button } from "@/components";
import { TEngagementFormQuestion } from "@/types/engagements";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { usePostRequest } from "@/hooks/services/request";
import { generateAlias } from "@/utils";
export function CopyForm({
  form,
  refetch,
}: {
  form: TEngagementFormQuestion;
  refetch: () => Promise<any>;
}) {
    const { postData, isLoading } = usePostRequest("/engagements/form");

  async function coppied() {
    const {id, ...restData} = form
    const newAlias = generateAlias();

    const payload = {
      ...restData,
      formAlias: newAlias,
    };

    await postData({ payload });
    refetch();
  }
  return (
    <>
      <Button
      disabled={isLoading}
        onClick={coppied}
        className={
          "items-center h-10 gap-x-2 hover:bg-gray-100 justify-start w-full  text-xs"
        }
      >
        {isLoading && <LoaderAlt size={12} className="animate-spin" />}
        <span>Make a Copy</span>
      </Button>
    </>
  );
}
