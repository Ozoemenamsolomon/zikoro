"use client";

import { useForm } from "react-hook-form";
import { InteractionLayout } from "../_components";
import { Search } from "@styled-icons/evil/Search";
import { Form, FormControl, FormField, FormItem, Input } from "@/components";
import { ActiveStampCard, LightBulb } from "@/constants";
import { Stamp } from "@styled-icons/fa-solid/Stamp";
import Image from "next/image";
import { EmptyCard } from "@/components/composables";
import { useFetchPartners } from "@/hooks";
import { useEffect, useState } from "react";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { TPartner } from "@/types";
import { cn } from "@/lib";

type FormValue = {
  search: string;
};

export default function StampCard({ eventId }: { eventId: string }) {
  const { loading, data } = useFetchPartners(eventId);
  const [active, setActive] = useState(false);
  const [partnerData, setPartnerData] = useState<TPartner[] | undefined>([]);
  const form = useForm<FormValue>({
    defaultValues: {
      search: "",
    },
  });

  // set to initial state when the search field is empty
  useEffect(() => {
    if (form.watch("search") === "") {
      setPartnerData(undefined);
    }
  }, [form.watch("search")]);
  // exhibitionHall
  // filter by partner's name
  function onSubmit(value: FormValue) {
    // console.log(value);
    if (data) {
      const filtered = data.filter((partner) => {
        const isPresent =
          value.search.length === 0 ||
          partner.exhibtionHall
            .toLowerCase()
            .includes(value.search.toLowerCase());

        return isPresent;
      });

      setPartnerData(filtered);
    }
  }

  useEffect(() => {
    if (active) {
      const filtered = data.filter((partner) => {
        return partner?.stampIt;
      });

      setPartnerData(filtered);
    } else {
      setPartnerData(undefined);
    }
  }, [active]);
  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full px-4 flex flex-col sm:flex-row gap-2 items-start md:items-center justify-start md:justify-between py-3">
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
              active && "text-zikoro"
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

      <div className="w-full grid mt-3 px-4 sm:mt-6 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
        {loading && (
          <div className="w-full col-span-full h-[300px] flex items-center justify-center">
            <LoaderAlt size={50} className="animate-spin" />
          </div>
        )}
        {!loading && (partnerData || data).length === 0 && (
          <EmptyCard text="No available stamp card" />
        )}

        {Array.isArray(partnerData || data) &&
          (partnerData || data).map(
            ({ stampIt, exhibitionHall, boothNumber,companyLogo, eventId }) => (
              <div
                key={eventId}
                className="w-full h-52 rounded-lg border p-3 flex flex-col gap-y-2"
              >
                <Image
                  src={companyLogo}
                  width={300}
                  height={300}
                  className="w-full h-24 object-contain"
                  alt="partner-logo"
                />
                <p className="text-mobile text-gray-600">{`${
                  exhibitionHall ? `${exhibitionHall},` : ""
                } Booth ${boothNumber ? boothNumber?.toString() : ""}`}</p>

                {stampIt ? (
                  <ActiveStampCard />
                ) : (
                  <p className="w-[50px] h-[50px]"></p>
                )}
              </div>
            )
          )}
      </div>
    </InteractionLayout>
  );
}
