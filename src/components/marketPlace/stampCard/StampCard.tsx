"use client";

import { useForm } from "react-hook-form";
import { Search } from "styled-icons/evil";
import { Form, FormControl, FormField, FormItem, Input } from "@/components";
import { ActiveStampCard, LightBulb } from "@/constants";
import { Stamp } from "styled-icons/fa-solid";
import Image from "next/image";
import { EmptyCard } from "@/components/composables";
import { useVerifyUserAccess } from "@/hooks";
import { useEffect, useState, useMemo } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { TExPartner, TLead, TAttendee } from "@/types";
import { cn } from "@/lib";
import { useGetData } from "@/hooks/services/request";
import { MarketPlaceLayout } from "../_components";

type FormValue = {
  search: string;
};

type TStampData = TExPartner & {
  leads: TLead[];
};
type PartnerStampWidgetProp = TExPartner & {
  leads: TLead[];
  isVisited: boolean;
};
function PartnerStampWidget({ partner }: { partner: PartnerStampWidgetProp }) {

  return (
    <div className="w-full h-64 overflow-hidden rounded-lg border p-3 flex flex-col gap-y-2">
      {partner?.companyLogo ? (
        <Image
          src={partner?.companyLogo}
          width={300}
          height={300}
          className="w-fit h-24 object-cover"
          alt="partner-logo"
        />
      ) : (
        <div className="w-full h-24 animate-pulse bg-gray-300"></div>
      )}
      <p className="font-semibold w-full text-ellipsis overflow-hidden whitespace-nowrap">
        {partner?.companyName ?? ""}
      </p>
      <p className="text-mobile text-gray-600">
        {partner?.exhibitionHall ? `${partner?.exhibitionHall}` : ""}{" "}
        {partner?.boothNumber
          ? `, Booth ${partner?.boothNumber?.toString()}`
          : ""}
      </p>

      {partner?.isVisited ? (
        <ActiveStampCard />
      ) : (
        <p className="w-[50px] h-[50px]"></p>
      )}
    </div>
  );
}
export default function StampCard({ eventId }: { eventId: string }) {
  const { attendee } = useVerifyUserAccess(eventId);
  const [active, setActive] = useState(false);
  const { data, isLoading: loading } = useGetData<TStampData[]>(
    `/partner/${eventId}/stamp`
  );
  const [filteredData, setFilteredData] = useState<
    PartnerStampWidgetProp[] | undefined
  >([]);

  const form = useForm<FormValue>({
    defaultValues: {
      search: "",
    },
  });

  // set to initial state when the search field is empty
  useEffect(() => {
    if (form.watch("search") === "") {
      setFilteredData(undefined);
    }
  }, [form.watch("search")]);

  const partnersData = useMemo(() => {
    if (Array.isArray(data) && attendee) {
      return data.map((partner) => {
        return {
          ...partner,
          isVisited: partner?.leads.some(
            (lead) =>
              lead.attendeeAlias === attendee?.attendeeAlias ||
              lead.attendeeId === attendee?.id
          ),
        };
      });
    } else {
      return [];
    }
  }, [data, attendee]);

  // exhibitionHall
  // filter by partner's name
  function onSubmit(value: FormValue) {
    //
    if (Array.isArray(partnersData)) {
      const filtered = partnersData.filter((partner) => {
        const isPresent =
          value.search.length === 0 ||
          partner.exhibitionHall
            .toLowerCase()
            .includes(value.search.toLowerCase());

        return isPresent;
      });

      setFilteredData(filtered);
    }
  }

  useEffect(() => {
    if (active && Array.isArray(partnersData)) {
      const filtered = partnersData.filter((partner) => {
        return partner?.isVisited;
      });

      setFilteredData(filtered);
    } else if (partnersData) {
      setFilteredData(partnersData);
    }
  }, [active, partnersData]);


  return (
    <MarketPlaceLayout eventId={eventId}>
      <div className="w-full flex flex-col sm:flex-row gap-2 items-start md:items-center justify-start md:justify-between py-3">
        <div className="p-2 rounded-md border w-full md:w-96 flex items-center gap-x-2">
          <LightBulb />
          <p className="text-xs text-gray-400">
            Visit the participating companies to collect stamps. You earn points
            and can enter a raffle for a gift prize.
          </p>
        </div>
        <div className="flex w-full sm:w-fit items-center gap-x-3">
          <button
            onClick={() => setActive((prev) => !prev)}
            className={cn(
              "flex text-gray-300 items-center gap-x-2",
              active && "text-basePrimary"
            )}
          >
            <Stamp size={22} />
            <p>Stamp</p>
          </button>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full md:w-80"
            >
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-full md:w-80 h-12">
                        <Search size={22} className="absolute top-3 left-2" />
                        <Input
                          type="search"
                          placeholder="search"
                          {...field}
                          className=" placeholder:text-sm h-12 pr-4 pl-10 w-80  focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="w-full grid mt-3 sm:mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[1300px]:grid-cols-3 gap-4 items-center">
        {loading && (
          <div className="w-full col-span-full h-[300px] flex items-center justify-center">
            <LoaderAlt size={30} className="animate-spin" />
          </div>
        )}
        {!loading && filteredData && filteredData.length === 0 && (
          <EmptyCard text="No available stamp card" />
        )}

        {!loading &&
          Array.isArray(filteredData) &&
          filteredData
            .filter((v) => v?.stampIt)
            .map((partner, index) => (
              <PartnerStampWidget partner={partner} key={index} />
            ))}
      </div>
    </MarketPlaceLayout>
  );
}
