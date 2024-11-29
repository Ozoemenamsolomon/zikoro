"use client";
import { useGetData } from "@/hooks/services/request";
import React, { useLayoutEffect, useRef, useState } from "react";
import FirstColumn from "./_columns/FirstColumn";
import { ILead, TLead, TLeadsInterest } from "@/types/leads";
import useUserStore from "@/store/globalUserStore";
import { useGetContactRequests } from "@/hooks/services/contacts";
import SecondColumn from "./_columns/SecondColumn";
import ThirdColumn from "./_columns/ThirdColumn";
import useEventStore from "@/store/globalEventStore";
import { useFetchSinglePartner } from "@/hooks";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { convertCamelToNormal } from "@/utils/helpers";
import { format } from "date-fns";

const page = ({
  params: { partnerId, eventId },
}: {
  params: { partnerId: string; eventId: string };
}) => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { data: partner, loading: partnerIsLoading } =
    useFetchSinglePartner(partnerId);
  const {
    userContactRequests,
    isLoading: contactRequestIsLoading,
    getContactRequests,
  } = useGetContactRequests({ userEmail: user.userEmail });
  const { event } = useEventStore();
  const {
    data: leads,
    isLoading,
    getData: getLeads,
  } = useGetData<ILead[]>(
    `/leads?eventAlias=${eventId}&partnerId=${partnerId}`
  );
  console.log(leads);
  const [selectedLead, onSelectLead] = useState<ILead | null>();

  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const div = divRef.current;

    if (!div) return;

    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    // Set the maximum height of the div
    div.style.height = `${distanceToBottom}px`;
  }, []);

  const exportLeads = () => {
    const omittedFields: (keyof ILead)[] = [
      "id",
      "eventId",
      "boothStaffId",
      "profilePicture",
      "eventAlias",
      "bio",
      "eventAlias",
      "eventPartnerAlias",
    ];

    const normalizedData = convertCamelToNormal<ILead>(
      leads.map((obj) =>
        Object.keys(obj).reduce((newObj, key) => {
          if (!omittedFields.includes(key as keyof ILead)) {
            (newObj as any)[key] =
              key === "created_at"
                ? format(new Date((obj as any)[key]), "MM/dd/yyyy")
                : key === "attendeeType"
                ? obj[key].join(", ")
                : (obj as any)[key];
          }
          return newObj;
        }, {} as Partial<ILead>)
      ) as ILead[],
      " "
    );

    const worksheet = XLSX.utils.json_to_sheet(normalizedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(
      workbook,
      `leads_${event.eventTitle}_${new Date().toISOString()}.xlsx`
    );
  };

  return (
    <section>
      <div className="border-b-[1px] border-[#F3F3F3] py-4 px-2 grid grid-cols-6 items-center pl-16 md:pl-0">
        <div className="col-span-5">
          <div className="max-w-full">
            <h1 className="font-semibold leading-normal text-greyBlack text-lg truncate">
              {partner?.companyName}
            </h1>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            className="bg-white border-[1px] border-basePrimary text-basePrimary flex gap-2 items-center w-fit px-2"
            onClick={() => router.push("leads/analytics")}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 1024 1024"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-600-80h56c4.4 0 8-3.6 8-8V560c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V384c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v320c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V462c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v242c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V304c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v400c0 4.4 3.6 8 8 8z" />
            </svg>
          </Button>
          <button onClick={exportLeads}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.25 10.5001V19.5001C20.25 19.8979 20.092 20.2795 19.8107 20.5608C19.5294 20.8421 19.1478 21.0001 18.75 21.0001H5.25C4.85218 21.0001 4.47064 20.8421 4.18934 20.5608C3.90804 20.2795 3.75 19.8979 3.75 19.5001V10.5001C3.75 10.1023 3.90804 9.72075 4.18934 9.43944C4.47064 9.15814 4.85218 9.0001 5.25 9.0001H7.5C7.69891 9.0001 7.88968 9.07912 8.03033 9.21977C8.17098 9.36042 8.25 9.55119 8.25 9.7501C8.25 9.94901 8.17098 10.1398 8.03033 10.2804C7.88968 10.4211 7.69891 10.5001 7.5 10.5001H5.25V19.5001H18.75V10.5001H16.5C16.3011 10.5001 16.1103 10.4211 15.9697 10.2804C15.829 10.1398 15.75 9.94901 15.75 9.7501C15.75 9.55119 15.829 9.36042 15.9697 9.21977C16.1103 9.07912 16.3011 9.0001 16.5 9.0001H18.75C19.1478 9.0001 19.5294 9.15814 19.8107 9.43944C20.092 9.72075 20.25 10.1023 20.25 10.5001ZM8.78063 6.53073L11.25 4.06041V12.7501C11.25 12.949 11.329 13.1398 11.4697 13.2804C11.6103 13.4211 11.8011 13.5001 12 13.5001C12.1989 13.5001 12.3897 13.4211 12.5303 13.2804C12.671 13.1398 12.75 12.949 12.75 12.7501V4.06041L15.2194 6.53073C15.3601 6.67146 15.551 6.75052 15.75 6.75052C15.949 6.75052 16.1399 6.67146 16.2806 6.53073C16.4214 6.39 16.5004 6.19912 16.5004 6.0001C16.5004 5.80108 16.4214 5.61021 16.2806 5.46948L12.5306 1.71948C12.461 1.64974 12.3783 1.59443 12.2872 1.55668C12.1962 1.51894 12.0986 1.49951 12 1.49951C11.9014 1.49951 11.8038 1.51894 11.7128 1.55668C11.6217 1.59443 11.539 1.64974 11.4694 1.71948L7.71937 5.46948C7.57864 5.61021 7.49958 5.80108 7.49958 6.0001C7.49958 6.19912 7.57864 6.39 7.71938 6.53073C7.86011 6.67146 8.05098 6.75052 8.25 6.75052C8.44902 6.75052 8.63989 6.67146 8.78063 6.53073Z"
                fill="#3E404B"
              />
            </svg>
          </button>
        </div>
      </div>
      <section
        className="relative h-fit md:border-t w-full grid md:grid-cols-10"
        ref={divRef}
      >
        <section className="md:col-span-3 border-r-[1px] border-[#F3F3F3] md:pt-2">
          <FirstColumn
            leads={leads ?? []}
            isLoading={isLoading && partnerIsLoading}
            getLeads={getLeads}
            onSelectLead={onSelectLead}
            selectedLead={selectedLead}
            partnerId={partnerId}
            partner={partner}
          />
        </section>
        <div className="hidden md:contents">
          {selectedLead ? (
            <>
              <section className="md:col-span-4 space-y-4 border-r-[1px] overflow-auto no-scrollbar max-h-full">
                <SecondColumn
                  lead={selectedLead}
                  getLeads={getLeads}
                  userContactRequests={userContactRequests}
                  isLoading={contactRequestIsLoading && partnerIsLoading}
                  getContactRequests={getContactRequests}
                  setSelectedLead={onSelectLead}
                />
              </section>
            </>
          ) : (
            <div className="flex flex-col h-96 w-full md:col-span-4 items-center justify-center gap-2 border-r-[1px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={50}
                height={50}
                viewBox="0 0 65 64"
                fill="none"
              >
                <g style={{ mixBlendMode: "luminosity" }}>
                  <path
                    d="M30.8479 50.5894L33.9895 63.8674L30.8479 50.5894Z"
                    fill="#9FC5FF"
                  />
                  <path
                    d="M17.3462 43.3887C8.62532 45.3968 2.12231 53.2085 2.12231 62.5392V63.9998H22.9356L29.6471 54.9752L28.9438 48.9955L17.3462 43.3887Z"
                    fill="#E6F8FC"
                  />
                  <path
                    d="M55.7655 62.5392C55.7655 53.2085 49.2626 45.3968 40.5416 43.3887L28.9438 48.9955L30.8478 56.9642L34.9522 63.9998H50.1626L55.7655 62.5392Z"
                    fill="#D0E8FF"
                  />
                  <path
                    d="M28.9439 48.9961H26.9978L22.9355 64.0002H28.9439L29.6472 55.2111L28.9439 48.9961Z"
                    fill="#6354B1"
                  />
                  <path
                    d="M28.9438 48.9961H30.89L34.9522 64.0002H28.9438V48.9961Z"
                    fill="#54469C"
                  />
                  <path
                    d="M21.7738 42.8882C20.2513 42.8882 18.7692 43.0614 17.3462 43.3892L20.5788 52.7139L28.9439 48.9961L29.6472 45.5707L28.9439 42.8882H21.7738Z"
                    fill="#D0E8FF"
                  />
                  <path
                    d="M36.114 42.8882H28.9438V48.9961L37.309 52.7139L40.5416 43.3892C39.1186 43.0614 37.6365 42.8882 36.114 42.8882Z"
                    fill="#9DCFFF"
                  />
                  <path
                    d="M23.3673 37.2207L21.7739 42.8882L28.9441 48.9961L29.4264 41.5967L28.9441 37.2207H23.3673Z"
                    fill="#FFDDCE"
                  />
                  <path
                    d="M34.5206 37.2207H28.9438V48.9961L36.114 42.8882L34.5206 37.2207Z"
                    fill="#FFBDA9"
                  />
                  <path
                    d="M24.6356 0C20.3417 0 16.8608 3.48088 16.8608 7.77475V16.5123H28.9438L30.5007 7.8475L28.9438 0L24.6356 0Z"
                    fill="#6354B1"
                  />
                  <path
                    d="M41.027 7.93525C41.027 5.97263 39.436 4.38175 37.4735 4.38175H35.4502V3.5535C35.4502 1.591 33.8592 0 31.8966 0H28.9438V16.5124H41.0268V7.93525H41.027Z"
                    fill="#54469C"
                  />
                  <path
                    d="M26.2884 14.7385L25.0299 13.3541C24.1402 12.3754 22.8788 11.8174 21.556 11.8174C18.9632 11.8174 16.8612 13.9194 16.8612 16.5123V20.4481H15.5334C13.3334 20.4481 11.55 22.2315 11.55 24.4315C11.55 26.6315 13.3334 28.4149 15.5334 28.4149H16.9845C17.8223 34.2704 22.8572 38.7718 28.9443 38.7718L30.5012 23.9004L28.9443 14.7385H26.2884Z"
                    fill="#FFF0E6"
                  />
                  <path
                    d="M42.3546 20.4481H41.0268V16.5123C41.0268 13.9194 38.9248 11.8174 36.332 11.8174C35.0092 11.8174 33.7478 12.3754 32.858 13.3541L31.5995 14.7385H28.9438V38.7718C35.031 38.7718 40.0658 34.2704 40.9036 28.4149H42.3547C44.5547 28.4149 46.3381 26.6315 46.3381 24.4315C46.338 22.2316 44.5546 20.4481 42.3546 20.4481Z"
                    fill="#FFDDCE"
                  />
                  <path
                    d="M26.782 26.9546H23.032C23.032 30.2145 25.6841 32.8666 28.944 32.8666L30.1784 30.8503L28.944 29.1166C27.7519 29.1166 26.782 28.1467 26.782 26.9546Z"
                    fill="#FFDDCE"
                  />
                  <path
                    d="M31.1058 26.9546C31.1058 28.1467 30.136 29.1166 28.9438 29.1166V32.8666C32.2037 32.8666 34.8558 30.2145 34.8558 26.9546H31.1058Z"
                    fill="#FFBDA9"
                  />
                  <path
                    d="M37.4478 51.2852C37.4478 58.3074 43.1404 64.0001 50.1626 64.0001L51.738 51.6282L50.1626 38.5703C43.1404 38.5703 37.4478 44.2629 37.4478 51.2852Z"
                    fill="#00DDC0"
                  />
                  <path
                    d="M50.1626 38.5703V64.0001C57.1848 64.0001 62.8775 58.3074 62.8775 51.2852C62.8775 44.2629 57.1848 38.5703 50.1626 38.5703Z"
                    fill="#00B5BD"
                  />
                  <path
                    d="M48.5765 51.736L46.3247 49.4844L43.6731 52.136L48.5765 57.0393L50.1627 55.453L50.9621 51.8498L50.1627 50.1497L48.5765 51.736Z"
                    fill="#E6F8FC"
                  />
                  <path
                    d="M54.0006 46.312L50.1626 50.15V55.4533L56.6522 48.9636L54.0006 46.312Z"
                    fill="#D0E8FF"
                  />
                </g>
              </svg>
              <p className="text-sm px-2 font-medium text-gray-700 text-center w-1/2">
                Select a lead from the list to view their profile information.
              </p>
            </div>
          )}
          <section className="flex flex-col md:col-span-3 h-fit">
            <ThirdColumn leads={leads ?? []} partnerId={partnerId} />
          </section>
        </div>
      </section>
    </section>
  );
};

export default page;
