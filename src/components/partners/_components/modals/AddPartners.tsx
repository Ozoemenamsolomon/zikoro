"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import { ArrowBack } from "styled-icons/boxicons-regular";
import { COUNTRY_CODE, uploadFile, generateAlias, formatDate } from "@/utils";
import { TPartner } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib";
import { useAddPartners, useFetchSingleEvent, useRedeemPartnerDiscountCode } from "@/hooks";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPartnerToTierSchema } from "@/schemas";
import { generateAlphanumericHash } from "@/utils/helpers";
import useOrganizationStore from "@/store/globalOrganizationStore";
import InputOffsetLabel from "@/components/InputOffsetLabel";

type TSIngleTier = {
  validity: string;
  partnerType: string;
  tierName: string;
  quantity: string;
  price: string;
  currency: string;
  color: string;
  description?: string;
};
export function AddPartners({
  close,
  eventId,
  partnerTier,
}: {
  eventId: string;
  partnerTier: TSIngleTier;
  close: () => void;
}) {
  const { data: eventData } = useFetchSingleEvent(eventId);
  const { organization } = useOrganizationStore();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("")
  const { addPartners } = useAddPartners();
const {verifyDiscountCode, loading: discountLoading,
  minAttendees,
  discountAmount,
  discountPercentage,} = useRedeemPartnerDiscountCode()

  // <z.infer<typeof partnerSchema>>
  const form = useForm<z.infer<typeof addPartnerToTierSchema>>({
    resolver: zodResolver(addPartnerToTierSchema),
  });

  //
  const country = form.watch("country");
  const companyImage = form.watch("companyLogo");

  // calculating  the discount
  const discount = useMemo(() => {
   
    return discountAmount !== null
      ? Number(discountAmount)
      : (Number(partnerTier?.price) * Number(discountPercentage)) / 100;
  }, [partnerTier, discountAmount, discountPercentage]);

  // calculating the processing Fee
  const processingFee = useMemo(() => {
    return ((Number(partnerTier?.price )- discount) * 5) / 100;
  }, [partnerTier, discount]);

  const computedPrice = useMemo(() => {
    if (eventData?.attendeePayProcessingFee) {
      return Number(partnerTier?.price);
    } else {
      return Number(partnerTier?.price) - processingFee;
    }
  }, [eventData, partnerTier, processingFee]);

// calculating total
const total = useMemo(() => {
  if (computedPrice && processingFee && eventData?.attendeePayProcessingFee) {
    return computedPrice - discount + processingFee;
  } else if (
    computedPrice &&
    processingFee &&
    !eventData?.attendeePayProcessingFee
  ) {
    return computedPrice - discount + processingFee;
  } else {
    return 0;
  }
}, [computedPrice, processingFee, discount, eventData?.attendeePayProcessingFee]);

  async function onSubmit(values: z.infer<typeof addPartnerToTierSchema>) {
    setLoading(true);
    //
    const promise = new Promise(async (resolve) => {
      if (typeof values?.companyLogo === "string") {
        resolve(values?.companyLogo);
      } else if (values?.companyLogo && values?.companyLogo?.length > 0) {
        const img = await uploadFile(values?.companyLogo[0], "image");

        resolve(img);
      } else {
        resolve(null);
      }
    });
    const image: any = await promise;

    const partnerAlias = generateAlias();
    const payload: Partial<TPartner> = {
      ...values,
      eventId: eventData?.id,
      eventName: eventData?.eventTitle,
      eventAlias: eventId,
      whatsApp: values.whatsApp || "",
      phoneNumber: values.phoneNumber,
      companyLogo: image,
      partnerAlias,
      partnerStatus: "active",
      amountPaid: total,
      currency: partnerTier?.currency,
      tierName: partnerTier?.tierName,
      partnerType: partnerTier?.partnerType,
      paymentReference: total === 0 ? "" : generateAlphanumericHash(10),
      organizerEmail: organization?.eventContactEmail,
    };

    const eventPayload = {
      eventName: eventData?.eventTitle!,
      eventStartDate: eventData?.startDateTime!,
      eventEndDate: eventData?.endDateTime!,
      location: `${eventData?.eventCity}, ${eventData?.eventCountry}`,
      eventPoster: eventData?.eventPoster!,
      address: eventData?.eventAddress!,
      organizerName: organization?.organizationName!,
      currency: partnerTier?.currency,
      organizerPhoneNumber: organization?.eventPhoneNumber!,
      organizerWhatsappNumber: organization?.eventWhatsApp!,
    };

    if (total === 0) {
      await addPartners(payload, eventPayload);
    } else {
      const encodedData = encodeURIComponent(JSON.stringify(payload));
      const encodedEventPayload = encodeURIComponent(
        JSON.stringify(eventPayload)
      );
      window.open(
        `/partner-payment?p=${encodedData}&e=${encodedEventPayload}&discountAmount=${discount}`,
        "_self"
      );
    }
    setLoading(false);
  }

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  const formatImage = useMemo(() => {
    if (typeof companyImage === "string") {
      return companyImage;
    } else if (companyImage && companyImage[0]) {
      return URL.createObjectURL(companyImage[0]);
    } else {
      return null;
    }
  }, [companyImage]);

    /// verifying and redeeming a discount code'
    async function redeem() {
      await verifyDiscountCode(code, String(eventData?.eventAlias));
      // setCode("")
    }
  return (
    <div
      role="button"
      className="w-full h-full fixed z-[200]  overflow-y-auto  inset-0 bg-[#F9FAFF]"
    >
      <div
        role="button"
        className={cn(
          "w-full box-animation max-w-6xl px-4 mx-auto grid grid-cols-1 md:grid-cols-9 mt-10 gap-4"
        )}
      >
        <div className="w-full max-h-[36rem] md:sticky top-8 grid grid-cols-1 gap-20 md:py-10 md:col-span-4">
          <div className="w-full flex flex-col items-start justify-start gap-y-2">
            <p className="font-semibold text-base sm:text-xl">
              {eventData?.eventTitle ?? ""}
            </p>
            <p>{formatDate(eventData?.startDateTime ?? "0")}</p>
            {eventData?.eventPoster ? (
              <Image
                className="w-full rounded-lg h-[16rem]"
                src={eventData?.eventPoster ?? ""}
                width={800}
                height={400}
                alt=""
              />
            ) : (
              <div className="w-full rounded-lg animate-pulse bg-gray-200 h-[16rem]"></div>
            )}
          </div>

          <div className="w-full rounded-lg border  p-3">
            <p className="font-semibold text-base sm:text-xl">Order Summary</p>
            <div className="w-full mt-4 mb-2 flex items-center justify-between">
              <p>1x Tier Name</p>
              <p>
                {partnerTier?.currency} {computedPrice.toLocaleString()}
              </p>
            </div>
            <div className="w-full mt-4 mb-2 flex items-center justify-between">
              <p>1x Discount</p>
              <p>
                - {partnerTier?.currency} {discount?.toLocaleString()}
              </p>
            </div>
            <div className="w-full  mb-2 flex items-center justify-between">
              <p>1x Processing Fee</p>
              <p>
                {partnerTier?.currency} {processingFee.toLocaleString()}
              </p>
            </div>
            <div className="border-t flex items-center justify-between pt-2">
              <p className="font-semibold">Total</p>
              <p className="font-semibold text-base sm:text-xl">
                {partnerTier?.currency} {total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-6 bg-white rounded-lg py-6 px-4 sm:px-8 md:col-span-5">
          <Button onClick={close} className="px-0 h-fit w-fit  bg-none  ">
            <ArrowBack className="px-0 w-fit h-fit" size={20} />
          </Button>
          <div className="space-y-2">
            <p className="text-gray-500 text-mobile sm:text-sm">
              {partnerTier?.tierName ?? ""}
            </p>
            <p className="font-semibold text-base sm:text-xl">
              {partnerTier?.currency} {total.toLocaleString()}
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start w-full flex-col gap-y-3"
            >
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <InputOffsetLabel label="Company Name">
                    <Input
                        type="text"
                        placeholder="Enter the Company Name"
                        {...form.register("companyName")}
                        className="placeholder:text-sm h-11 text-zinc-700"
                      />
                  </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <InputOffsetLabel label="Email Address">
                  <Input
                        type="text"
                        placeholder="Enter the Email Address"
                        {...form.register("email")}
                        className="placeholder:text-sm h-11 text-zinc-700"
                      />
                </InputOffsetLabel>
                )}
              />

              <div className="w-full flex flex-col items-start justify-start gap-y-1">
                <FormField
                  control={form.control}
                  name="companyLogo"
                  render={({ field }) => (
                    <InputOffsetLabel label="Logo">
                       <Input
                          type="file"
                          accept="image/*"
                          placeholder="File"
                          {...form.register("companyLogo")}
                          className="placeholder:text-sm h-11 text-zinc-700"
                        />
                    </InputOffsetLabel>
                  )}
                />

                <p className="text-xs text-[#717171]">
                  Selected file should not be bigger than 2MB
                </p>
              </div>

              {formatImage && (
                <div className="w-[100px] h-[100px]">
                  <img
                    src={formatImage}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              )}

              <div className="w-full grid-cols-1 grid  items-center gap-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <InputOffsetLabel label="City">
                      <Input
                          type="text"
                          placeholder="Enter City"
                          {...form.register("city")}
                          className="placeholder:text-sm h-11  text-zinc-700"
                        />
                    </InputOffsetLabel>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                   <InputOffsetLabel label="Country">
                     <ReactSelect
                          {...form.register("country")}
                          placeHolder="Select the Country"
                          borderColor="#001fcc"
                          bgColor="#001fcc1a"
                         
                        
                          options={countriesList}
                        />
                   </InputOffsetLabel>
                  )}
                />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                  <InputOffsetLabel label="Phone Number">
                         <Input
                          placeholder="Enter Phone Number"
                          {...form.register("phoneNumber")}
                          type="tel"
                          {...field}
                          className="placeholder:text-sm h-11 text-zinc-700"
                        />
                  </InputOffsetLabel>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsApp"
                  render={({ field }) => (
                   <InputOffsetLabel label="WhatsApp Number">
                     <Input
                          className="placeholder:text-sm h-11 text-zinc-700"
                          placeholder="Enter Whatsapp Number"
                          {...form.register("whatsApp")}
                          type="tel"
                        />
                   </InputOffsetLabel>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contactFirstName"
                render={({ field }) => (
                 <InputOffsetLabel label="Contact Person First Name">
                    <Input
                        type="text"
                        placeholder="Enter First Name"
                        {...form.register("contactFirstName")}
                        className="placeholder:text-sm h-11 text-zinc-700"
                      />
                 </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="contactLastName"
                render={({ field }) => (
                 <InputOffsetLabel label="Contact Person Last Name">
                   <Input
                        type="text"
                        placeholder="Enter Last Name"
                        {...form.register("contactLastName")}
                        className="placeholder:text-sm h-11 text-zinc-700"
                      />
                 </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <InputOffsetLabel label="Website URL">
                     <Input
                        type="text"
                        placeholder="Enter the Website"
                        {...form.register("website")}
                        className="placeholder:text-sm h-11 text-zinc-700"
                      />
                  </InputOffsetLabel>
                )}
              />

<div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="w-full my-2 flex flex-col gap-y-2 items-start justify-start"
                >
                  <div className="w-full space-y-1">
                    <div className="w-full flex items-center ">
                      
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter a valid discount code"
                        className="bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end h-12 rounded-l-md px-3 outline-none  border border-basePrimary w-[75%]"
                      />
                      <Button
                        disabled={code === "" || discountLoading}
                        onClick={redeem}
                        className="h-12 text-white rounded-r-md rounded-l-none bg-gray-500 font-medium px-0 w-[25%]"
                      >
                        {discountLoading ? "Verifying..." : "Redeem"}
                      </Button>
                    </div>
                    <p className="text-tiny text-gray-500">
                      Discount code is case sensitive
                    </p>
                  </div>
                </div>

              <Button
                disabled={loading}
                className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
              >
                {loading && <LoaderAlt size={22} className="animate-spin" />}
                <span>Save</span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
