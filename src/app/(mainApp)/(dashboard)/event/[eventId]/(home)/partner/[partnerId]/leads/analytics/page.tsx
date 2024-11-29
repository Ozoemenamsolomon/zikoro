"use client";
import { useFetchSinglePartner } from "@/hooks";
import { useGetData } from "@/hooks/services/request";
import { ILead } from "@/types";
import React from "react";
import ThirdColumn from "../_columns/ThirdColumn";
import useEventStore from "@/store/globalEventStore";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

const page = ({
  params: { partnerId, eventId },
}: {
  params: { partnerId: string; eventId: string };
}) => {
  const { event } = useEventStore();
  const { data: partner, loading: partnerIsLoading } =
    useFetchSinglePartner(partnerId);
  const {
    data: leads,
    isLoading,
    getData: getLeads,
  } = useGetData<ILead[]>(
    `/leads?eventAlias=${event.eventAlias}&partnerId=${partnerId}`
  );

  const router = useRouter();

  return (
    <section>
      <div className="border-b-[1px] border-[#F3F3F3] py-4 px-2 flex gap-4">
        <button onClick={() => router.back()} className="flex items-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="font-semibold leading-normal text-greyBlack text-lg pl-14 md:pl-0 text-ellipsis">
          {partner?.companyName ?? "Loading..."}
        </h1>
      </div>
      {!isLoading ? (
        <section className="flex flex-col md:col-span-3 h-fit">
          <ThirdColumn leads={leads ?? []} partnerId={partnerId} />
        </section>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

export default page;
