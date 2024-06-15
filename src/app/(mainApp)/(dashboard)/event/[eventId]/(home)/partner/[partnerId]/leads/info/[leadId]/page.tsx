"use client";
import { useGetData } from "@/hooks/services/request";
import React from "react";
import { ILead } from "@/types/leads";
import useUserStore from "@/store/globalUserStore";
import { useGetContactRequests } from "@/hooks/services/contacts";
import useEventStore from "@/store/globalEventStore";
import SecondColumn from "../../_columns/SecondColumn";
import ThirdColumn from "../../_columns/ThirdColumn";

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
      {!leadIsLoading && !leadsIsLoading && lead ? (
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
            <ThirdColumn leads={leads ?? []} />
          </section>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

export default page;
