"use client";

import { Offers } from "@/components/partners/_components";
import { MarketPlaceLayout } from "../_components";
import { useCheckTeamMember, useFetchPartnersOffers, useVerifyUserAccess } from "@/hooks";
import { EmptyCard } from "@/components/composables";
import { Search } from "styled-icons/evil";
import { Loader2 } from "styled-icons/remix-fill";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, Input } from "@/components";
import { useState, useEffect } from "react";
import { PromotionalOfferType } from "@/types";

type FormValue = {
  search: string;
};

export function PartnerOffers({ eventId }: { eventId: string }) {
  const {attendee, isOrganizer} = useVerifyUserAccess(eventId)
  const {isIdPresent} = useCheckTeamMember({eventId})
  const { offers, loading, refetch } = useFetchPartnersOffers(eventId);
  const [offerData, setOfferData] = useState<
    PromotionalOfferType[] | undefined
  >([]);
  const form = useForm<FormValue>({
    defaultValues: {
      search: "",
    },
  });

  // filter by offer's name
  function onSubmit(value: FormValue) {
    // 
    if (offers) {
      const filtered = offers.filter((offer) => {
        const isPresent =
          value.search.length === 0 ||
          offer.serviceTitle.toLowerCase().includes(value.search.toLowerCase());

        return isPresent;
      });

      setOfferData(filtered);
    }
  }

  // set to initial state when the search field is empty
  useEffect(() => {
    if (form.watch("search") === "") {
      setOfferData(undefined);
    }
  }, [form.watch("search")]);

  return (
    <MarketPlaceLayout eventId={eventId}>
      <div className="flex items-end w-full justify-end">
        <div className="flex w-full sm:w-fit items-center px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-full sm:w-80 h-12">
                        <Search size={22} className="absolute top-3 left-2" />
                        <Input
                          type="search"
                          placeholder="search offer"
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
      {loading && (
        <div className="w-full col-span-full h-[60vh] flex items-center justify-center">
          <Loader2 size={30} className="animate-spin" />
        </div>
      )}
      {!loading &&
        (offerData || offers) &&
        (offerData || offers).length === 0 && (
          <EmptyCard height="80" width="82" text="No available Offer" />
        )}

      {!loading && (
        <Offers
          data={offerData || offers}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          attendee={attendee}
          eventId={eventId}
          refetch={refetch}
          isOrganizer={isOrganizer || isIdPresent}
        />
      )}
    </MarketPlaceLayout>
  );
}
