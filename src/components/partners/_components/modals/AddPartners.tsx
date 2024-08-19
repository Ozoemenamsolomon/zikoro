"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  Textarea,
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
import { useAddPartners, useFetchSingleEvent } from "@/hooks";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPartnerToTierSchema } from "@/schemas";
import { generateAlphanumericHash } from "@/utils/helpers";


type TSIngleTier = {
  validity: string;
  partnerType: string;
  tierName: string;
  quantity: string;
  price: string;
  currency: string;
  color: string;
  description: string;
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
  const [loading, setLoading] = useState(false);
  const {addPartners} = useAddPartners()
  const [phoneCountryCode, setPhoneCountryCode] = useState<string | undefined>(
    "+234"
  );

  const [whatsappCountryCode, setWhatsAppCountryCode] = useState<
    string | undefined
  >("+234");

  // <z.infer<typeof partnerSchema>>
  const form = useForm<z.infer<typeof addPartnerToTierSchema>>({
    resolver: zodResolver(addPartnerToTierSchema),
  });

  //
  const country = form.watch("country");
  const companyImage = form.watch("companyLogo");

  useEffect(() => {
    if (country) {
      const currentCountryCode = COUNTRY_CODE.find(
        (v) => v.name === country
      )?.dial_code;

      setWhatsAppCountryCode(currentCountryCode);
      setPhoneCountryCode(currentCountryCode);
    }
  }, [country]);

  // calculating the processing Fee
  const processingFee = useMemo(() => {
    return (Number(partnerTier?.price) * 5) / 100;
  }, [partnerTier]);

  const total = useMemo(() => {
    if (eventData?.attendeePayProcessingFee) {
      return Number(partnerTier?.price) + processingFee;
    } else {
      return Number(partnerTier?.price);
    }
  }, [processingFee, partnerTier, eventData]);

  const computedPrice = useMemo(() => {
    if (eventData?.attendeePayProcessingFee) {
      return Number(partnerTier?.price);
    } else {
      return Number(partnerTier?.price) - processingFee;
    }
  }, [eventData, partnerTier, processingFee]);

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
      phoneNumber:  values.phoneNumber,
      companyLogo: image,
      partnerAlias,
      partnerStatus: "pending",
      amountPaid: total,
      currency: partnerTier?.currency,
      tierName: partnerTier?.tierName,
      partnerType: partnerTier?.partnerType,
      paymentReference: total === 0 ? "" :generateAlphanumericHash(10),
    };

    if (total === 0) {
      await addPartners(payload);
    }else {
      const encodedData = encodeURIComponent(JSON.stringify(payload));
      window.open(
        `/partner-payment?p=${encodedData}&eventName=${
          eventData?.eventTitle
        }&startDate=${eventData?.startDateTime}&endDate=${
          eventData?.endDateTime
        }&location=${`${eventData?.eventCity}, ${eventData?.eventCountry}`}`,
        "_self"
      );
    }
    setLoading(false);
    

   
    // await addPartners(payload)
    // close();
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
            <div className="w-full  mb-2 flex items-center justify-between">
              <p>1x Processing Fee</p>
              <p>
                {" "}
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
                  <FormItem className="relative w-full h-fit">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the Company Name"
                        {...form.register("companyName")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full md:col-span-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the Email Address"
                        {...form.register("email")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-col items-start justify-start gap-y-1">
                <FormField
                  control={form.control}
                  name="companyLogo"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder="File"
                          {...form.register("companyLogo")}
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter City"
                          {...form.register("city")}
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...form.register("country")}
                          placeHolder="Select the Country"
                          borderColor="#001fcc"
                          bgColor="#001fcc1a"
                          height="3rem"
                          placeHolderColor="#64748b"
                          options={countriesList}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full relative h-fit">
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <div className="w-full relative h-12">
                          <input
                            type="text"
                            className=" text-sm absolute top-[30%]  left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none bg-[#001fcc]/10"
                            value={phoneCountryCode}
                            onChange={(e) =>
                              setPhoneCountryCode(e.target.value)
                            }
                          />
                          <Input
                            placeholder="Enter Phone Number"
                            {...form.register("phoneNumber")}
                            type="tel"
                            {...field}
                            className="placeholder:text-sm h-12 pl-12 pr-4 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsApp"
                  render={({ field }) => (
                    <FormItem className="w-full relative">
                      <FormLabel>WhatsApp number</FormLabel>

                      <FormControl>
                        <div className="w-full relative h-12">
                          <input
                            type="text"
                            className=" text-sm absolute top-[30%]  left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none bg-[#001fcc]/10"
                            value={whatsappCountryCode}
                            onChange={(e) =>
                              setWhatsAppCountryCode(e.target.value)
                            }
                          />
                          <Input
                            className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10 pl-12 pr-4  placeholder:text-zinc-500 text-zinc-700"
                            placeholder="Enter Whatsapp Number"
                            {...form.register("whatsApp")}
                            type="tel"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contactFirstName"
                render={({ field }) => (
                  <FormItem className="relative w-full h-fit">
                    <FormLabel>Contact Person First Name </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter First Name"
                        {...form.register("contactFirstName")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactLastName"
                render={({ field }) => (
                  <FormItem className="relative w-full h-fit">
                    <FormLabel>Contact Person Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Last Name"
                        {...form.register("contactLastName")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full md:col-span-2">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the Website"
                        {...form.register("website")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
