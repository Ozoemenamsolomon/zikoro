"use client";

import { Button } from "@/components";
import {  TEventQa } from "@/types/engagements";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { usePostRequest } from "@/hooks/services/request";
import { generateAlias } from "@/utils";
export function CopyQA({
  eventQa,
  refetch,
}: {
  eventQa: TEventQa;
  refetch: () => Promise<any>;
}) {
    const { postData, isLoading } = usePostRequest("/engagements/qa");

  async function coppied() {
    const {id, ...restData} = eventQa
    const newAlias = generateAlias();

    const payload = {
      ...restData,
      QandAAlias: newAlias,
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
