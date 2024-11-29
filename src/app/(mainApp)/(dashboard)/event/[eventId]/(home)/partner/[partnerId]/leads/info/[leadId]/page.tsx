"use client";
import { useGetData } from "@/hooks/services/request";
import React from "react";
import { ILead } from "@/types/leads";
import useUserStore from "@/store/globalUserStore";
import { useGetContactRequests } from "@/hooks/services/contacts";
import useEventStore from "@/store/globalEventStore";
import SecondColumn from "../../_columns/SecondColumn";
import ThirdColumn from "../../_columns/ThirdColumn";
import { useFetchSinglePartner } from "@/hooks";

const page = ({
  params: { partnerId, eventId, leadId },
}: {
  params: { partnerId: string; eventId: string; leadId: string };
}) => {
  const {
    isLoading: leadIsLoading,
    getData: getLead,
    data: lead,
  } = useGetData<Partial<ILead>>(`/leads/${leadId}`);

  const { data: partner, loading: partnerIsLoading } =
    useFetchSinglePartner(partnerId);

  const { user, setUser } = useUserStore();
  const { event } = useEventStore();

  const {
    data: leads,
    isLoading: leadsIsLoading,
    getData: getLeads,
  } = useGetData<ILead[]>(
    `/leads?eventAlias=${event.eventAlias}&partnerId=${partnerId}`
  );

  const {
    userContactRequests,
    isLoading: contactRequestIsLoading,
    getContactRequests,
  } = useGetContactRequests({ userEmail: user.userEmail });

  return (
    <section className="pb-12">
      {!leadIsLoading && !leadsIsLoading && !partnerIsLoading && lead ? (
        <>
          <div className="border-b-[1px] border-[#F3F3F3] py-4 px-2">
            <h1 className="font-semibold leading-normal text-greyBlack text-lg pl-14 md:pl-0 text-ellipsis w-full px-2">
              {partner?.companyName}
            </h1>
          </div>
          <div className="space-y-6">
            <section className="md:col-span-4 space-y-4 border-r-[1px] overflow-auto no-scrollbar max-h-full">
              <SecondColumn
                lead={lead}
                getLeads={getLeads}
                userContactRequests={userContactRequests}
                isLoading={contactRequestIsLoading}
                getContactRequests={getContactRequests}
                setSelectedLead={() => {}}
              />
            </section>
            <section className="flex flex-col md:col-span-3 h-fit">
              <ThirdColumn leads={leads ?? []} partnerId={partnerId} />
            </section>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

export default page;
