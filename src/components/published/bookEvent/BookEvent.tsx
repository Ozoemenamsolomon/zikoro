"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { isDateGreaterThanToday } from "@/utils";
import { PlusCircleFill } from "styled-icons/bootstrap";
import { CircleMinus } from "styled-icons/fa-solid";
import { useFieldArray } from "react-hook-form";
import { RiLock2Line } from "react-icons/ri";
import {
  Form,
  FormField,
  Input,
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components";
import { eventBookingValidationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { OrganizerContact } from "@/types";
import {
  useBookingEvent,
  useTransactionDetail,
  useRedeemDiscountCode,
} from "@/hooks";
import { toast } from "@/components/ui/use-toast";
import { Event } from "@/types";
import { generateAlphanumericHash } from "@/utils/helpers";
import { usePathname, useRouter } from "next/navigation";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { ArrowBack } from "styled-icons/material-outlined";
import { formatTime, formatDate } from "@/utils";

type TChosenAttendee = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  ticketType: string;
  price: number;
  attendeeAlias: string;
  id: number;
};

type TChosenTicket = {
  ticketType: string;
  price: number;
  count: number;
};
export function BookEvent({
  close,
  event,
  eventId,
  organization,
  eventDate,
  endDate,
  startDate,
  eventImage,
  address,
  currency,
  organizerContact,
  availableSlot,
  eventTitle,
  eventLocation,
  trackingId,
  affiliateCode,
  role,
  eventEndDate,
}: {
  eventId?: string;
  eventDate?: string;
  endDate?: string;
  startDate?: string;
  eventImage?: string;
  organizerContact: OrganizerContact;
  eventTitle?: string;
  organization?: string | null;
  address?: string;
  availableSlot: number;
  event?: Event;
  close: () => void;
  eventLocation?: string;
  currency: string | undefined;
  trackingId?: string | null;
  affiliateCode?: string | null;
  eventEndDate?: string;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // const [chosenPrice, setChosenPrice] = useState<number | undefined>();
  const [code, setCode] = useState("");
  const [active, setActive] = useState(1);
  // const [priceCategory, setPriceCategory] = useState<string | undefined>("");
  const { sendTransactionDetail } = useTransactionDetail();
  const [chosenAttendee, setChosenAttendee] = useState<TChosenAttendee[]>([]);
  const [description, setDescription] = useState("");
  const form = useForm<z.infer<typeof eventBookingValidationSchema>>({
    resolver: zodResolver(eventBookingValidationSchema),
    defaultValues: {},
  });
  const { registerAttendees, isRegistered, loading: isSubmitting } = useBookingEvent();
  const {
    verifyDiscountCode,
    loading,
    minAttendees,
    discountAmount,
    discountPercentage,
  } = useRedeemDiscountCode();
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "attendeeApplication",
  });

  // memoized the reference to invoke once
  const eventReference = useMemo(() => {
    return nanoid();
  }, [nanoid]);

  const othersValue = form.watch("others");
  const aboutUsValue = form.watch("aboutUs");

  const socialMediaMapping: Record<string, string | any> = {
    instagram: "instagram",
    facebook: "facebook",
    whatsapp: "whatsapp",
    friends: "friends",
    others: othersValue,
  };
  let social: string | undefined;

  if (aboutUsValue === "others") {
    social = othersValue;
  } else if (socialMediaMapping[aboutUsValue]) {
    social = aboutUsValue;
  }

  const chosenAttendeesTicket = useMemo(() => {
    return formatTicketPrice(chosenAttendee);
  }, [chosenAttendee]);

  // calculating  the discount
  const discount = useMemo(() => {
    const totalTicketPrice = chosenAttendeesTicket?.reduce(
      (curr, { price }) => curr + price,
      0
    );
    return discountAmount !== null
      ? Number(discountAmount)
      : (Number(totalTicketPrice) * Number(discountPercentage)) / 100;
  }, [chosenAttendeesTicket, discountAmount, discountPercentage]);

  // calculating the processing Fee
  const processingFee = useMemo(() => {
    if (chosenAttendeesTicket?.length > 0) {
      const totalTicketPrice = chosenAttendeesTicket?.reduce(
        (curr, { price }) => curr + price,
        0
      );
      return (Number(totalTicketPrice - discount) * 5) / 100;
    }
  }, [chosenAttendeesTicket]);

  const computedPrice = useMemo(() => {
    const totalTicketPrice = chosenAttendeesTicket?.reduce(
      (curr, { price }) => curr + price,
      0
    );
    if (totalTicketPrice && event?.attendeePayProcessingFee) {
      return totalTicketPrice;
    } else if (totalTicketPrice && processingFee) {
      return totalTicketPrice - processingFee;
    }
  }, [chosenAttendeesTicket, processingFee, event?.attendeePayProcessingFee]);

  // calculating total
  const total = useMemo(() => {
    if (computedPrice && processingFee && event?.attendeePayProcessingFee) {
      return computedPrice - discount + processingFee;
    } else if (
      computedPrice &&
      processingFee &&
      !event?.attendeePayProcessingFee
    ) {
      return computedPrice - discount + processingFee;
    } else {
      return 0;
    }
  }, [computedPrice, processingFee, discount, event?.attendeePayProcessingFee]);

  /// restructure pricing array
  const pricingArray = useMemo(() => {
    if (Array.isArray(event?.pricing)) {
      return event?.pricing?.map(
        ({ price, validity, ticketQuantity, attendeeType, description, accessibility }) => {
          let discountPrice = 0;
          if (!price || Number(price) === 0) {
            discountPrice = 0;
          } else {
            discountPrice =
              discountAmount !== null
                ? Number(price) - Number(discountAmount)
                : Number(price) -
                  (Number(price) * Number(discountPercentage)) / 100;
          }

          return {
            validity,
            description,
            discountPrice,
            price: Number(price),
            ticketQuantity,
            discountPercentage:
              discountPrice > 0
                ? ((Number(price) - Number(discountPrice)) / Number(price)) *
                  100
                : 0,
            attendeeType,
            accessibility,
          };
        }
      );
    }
  }, [event?.pricing, discountAmount, discountPercentage]);

  //  console.log('dcdv d', pricingArray, 'refvedcvd', event?.pricing)
  /// verifying and redeeming a discount code'
  async function redeem() {
    await verifyDiscountCode(code, String(eventId));
    // setCode("")
  }

  function allowPayment(bool: boolean) {
    //  setOpenPaymentModal(bool);
    if (bool) {
      router.push(
        `/checkout/${eventReference}?eventData=${JSON.stringify({
          eventImage,
          address,
          startDate,
          role,
          trackingId,
          affiliateCode,
          endDate,
          organization,
          eventLocation,
          total,
          processingFee,
          eventEndDate,
          organizerContact: JSON.stringify(organizerContact),
          amountPayable: processingFee ? total - processingFee : total,
        })}`
      );
    }
  }

  async function onSubmit(
    values: z.infer<typeof eventBookingValidationSchema>
  ) {
    // maually checking
    if (!values.aboutUs) {
      form.setError("aboutUs", {
        type: "manual",
        message: "Please Select an Option",
      });

      return; /// stop submission
    }
    // maually checking for "others"
    if (values.aboutUs === "others" && !values.others) {
      form.setError("others", {
        type: "manual",
        message: 'Please provide a value for "Others"',
      });

      return; /// stop submission
    }

    // checking if the attendees number satisfy the minimum attendees required to use the event discount code
    if (minAttendees !== undefined && minAttendees !== fields?.length) {
      toast({
        variant: "destructive",
        description: `Discount code is valid for minimum of ${minAttendees} attendees`,
      });
      return;
    }

    const paymentLink = `${
      window.location.origin
    }/checkout/${eventReference}?eventData=${JSON.stringify({
      eventImage,
      address,
      startDate,
      endDate,
      organization,
      eventLocation,
      total,
      processingFee,
      organizerContact: JSON.stringify(organizerContact),
      amountPayable: processingFee ? total - processingFee : total,
    })}`;

    await registerAttendees(
      eventReference,
      values,
      event?.id,
      eventId,
      "attendee",
      paymentLink
    );

    // return if user is registered -- attendees data will not be sent to the eventTransaction table
    if (isRegistered) return;

    // todays date
    const today = new Date();

    // Calculate the date for the next 7 days
    const nextSevenDays = new Date(today);
    nextSevenDays.setDate(today.getDate() + 7);

    // Format the result as a string in the specified format
    const formattedNextSevenDays = nextSevenDays.toISOString();

    const payload = {
      eventId: event?.id,
      eventAlias: eventId,
      eventRegistrationRef: eventReference,
      paymentDate: today,
      expiredAt: formattedNextSevenDays,
      amountPaid: total,
      attendees: fields?.length,
      discountValue: discount,
      referralSource: social,
      discountCode: code || "none",
      currency,
      registrationCompleted: false,
      eventDate,
      event: eventTitle,
      eventPrice: chosenAttendeesTicket?.reduce(
        (curr, { price }) => curr + price,
        0
      ),
      attendeesDetails: values.attendeeApplication,
    };

    //
    await sendTransactionDetail(allowPayment, payload);
  }

  function addChosenAttendee(ticketType: string, price: number, id: number) {
    const update = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      attendeeAlias: generateAlphanumericHash(7),
      ticketType,
      price,
      id,
    };
    setChosenAttendee((prev) => [...prev, update]);
  }
  function removeChosenAttendee(id: number) {
    setChosenAttendee((prev) => prev.filter((attendee) => attendee?.id !== id));
  }

  useEffect(() => {
    if (chosenAttendee?.length > 0) {
      const attendee = chosenAttendee.map(
        ({
          firstName,
          lastName,
          phoneNumber,
          email,
          ticketType,
          attendeeAlias,
        }) => {
          return {
            firstName,
            lastName,
            phoneNumber,
            ticketType,
            email,
            attendeeAlias,
          };
        }
      );
      form.reset({
        attendeeApplication: attendee,
      });
    }
  }, [chosenAttendee]);

  function selectedAttendeesLength(id: number) {
    const result = chosenAttendee?.filter(
      (attendee) => attendee?.id === id
    )?.length;

    return result;
  }

  //

  function formatTicketPrice(attendees: TChosenAttendee[]): TChosenTicket[] {
    // init a Map to hold the sum of prices for each ticketType
    const ticketPriceMap = new Map<string, { count: number; price: number }>();

    attendees.forEach((attendee) => {
      const ticketType = attendee.ticketType;
      const price = attendee.price;

      if (ticketPriceMap.has(ticketType)) {
        const data = ticketPriceMap.get(ticketType)!;

        ticketPriceMap.set(ticketType, {
          price: (data.price += price),
          count: (data.count += 1),
        }); // If ticketType is already in the map, add the price to the sum
      } else {
        ticketPriceMap.set(ticketType, { price, count: 1 }); // If ticketType is not in the map, initialize a new price
      }
    });

    const result: TChosenTicket[] = [];
    // iterate through the [ticketType , {count price}] pair
    const iterator = ticketPriceMap.entries();
    let entry = iterator.next();

    // Process each entry from the map
    while (!entry.done) {
      const [ticketType, data] = entry.value;
      result.push({ ticketType, price: data.price, count: data.count });
      entry = iterator.next(); // Move to the next entry
    }

    return result;
  }

  return (
    <>
      <div
        role="button"
       // onClick={close}
        className="w-full h-full inset-0 bg-[#F9FAFF] z-[80] fixed"
      >
        <div className="absolute left-3 z-20 top-4 ">
          <Button onClick={close} className="px-0 w-fit h-fit ">
            <ArrowBack className="" size={20} />
          </Button>
        </div>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-[95%] sm:w-[65%] lg:w-[90%] m-auto   overflow-hidden xl:w-[80%] overflow-y-auto lg:overflow-hidden  grid absolute inset-0  grid-cols-1 gap-2 lg:grid-cols-7 items-start h-[85%]  lg:h-[40rem] r "
        >
          <div className="w-full lg:h-[40rem]  no-scrollbar lg:overflow-y-auto  flex flex-col gap-y-3 lg:col-span-3 px-4 sm:px-6 h-full py-6 sm:py-10">
            <h2 className="text-lg sm:text-xl font-semibold">
              {`${eventTitle}`}
            </h2>
            <h2 className="text-sm sm:text-base  text-gray-500">
              {`${startDate} - ${endDate}`}
            </h2>

            {eventImage ? (
              <Image
                className="w-full h-64 mt-3 rounded-lg object-cover"
                src={eventImage}
                alt="eventimage"
                width={700}
                height={700}
              />
            ) : (
              <div className="w-full mt-3 h-64 rounded-lg animate-pulse">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
            )}
            <div className="w-full border mt-3 border-gray-300 rounded-lg py-4 px-3">
              <h2 className="text-base sm:text-lg mb-3 font-semibold ">
                Order Summary
              </h2>

              {Array.isArray(chosenAttendeesTicket) &&
                chosenAttendeesTicket?.map((item, index) => (
                  <div
                    key={index}
                    className=" flex items-center text-sm capitalize justify-between w-full"
                  >
                    <p>{`${item?.count}x ${item?.ticketType}:`}</p>
                    {item?.price > 0 ? (
                      <p>
                        {" "}
                        {` ${
                          currency ?? "NGN"
                        }${item?.price?.toLocaleString()}`}
                      </p>
                    ) : (
                      <p>---</p>
                    )}
                  </div>
                ))}

              <div className=" flex items-center text-sm justify-between w-full">
                <p>{`${fields.length}x Discount:`}</p>
                {discount > 0 ? (
                  <p>
                    {" "}
                    {`-  ${currency ?? "NGN"}${discount?.toLocaleString()}`}
                  </p>
                ) : (
                  <p>---</p>
                )}
              </div>
              <div className=" flex items-center text-sm justify-between w-full">
                <p>{`${fields.length}x Processing fee:`}</p>
                {processingFee ? (
                  <p>
                    {" "}
                    {` ${currency ?? "NGN"}${processingFee?.toLocaleString()}`}
                  </p>
                ) : (
                  <p>---</p>
                )}
              </div>

              <div className="border-t border-gray-300 font-semibold py-2 mt-3 w-full flex items-center justify-between">
                <p className="">Total</p>
                {computedPrice && (
                  <p>{` ${currency ?? "NGN"}${total?.toLocaleString()}`}</p>
                )}
              </div>
            </div>
          </div>
          {/*** */}
          {active === 1 && (
            <div className="w-full relative rounded-lg bg-white lg:col-span-4 flex flex-col gap-y-4 p-4 sm:p-6">
              <div className=" flex w-full items-end justify-between py-3 border-b">
                <div className="flex flex-col items-start justify-start">
                  <p className="text-base sm:text-xl font-semibold">
                    Ticket Price
                  </p>
                  <p className="text-[11px] sm:text-[13px]">
                    Select your preferred ticket type
                  </p>
                </div>
                {availableSlot > 0 && (
                  <p className="text-red-600 bg-red-100 text-xs p-2 rounded-md">
                    {` ${availableSlot} slots left`}
                  </p>
                )}
              </div>

              <div className="w-full lg:h-[510px] pb-32 space-y-5 no-scrollbar lg:overflow-y-auto">
                <div className="grid grid-cols-1 gap-6  items-center w-full">
                  {Array.isArray(pricingArray) &&
                    pricingArray &&
                    pricingArray?.map((v, index) => {
                      if (v) {
                        return (
                          <Button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              // selectedPrice(v?.price);
                              // selectedPriceCategory(v?.attendeeType);
                            }}
                            disabled={isDateGreaterThanToday(v?.validity) || !v?.accessibility}
                            className={cn(
                              "flex flex-col group relative rounded-lg mt-3 items-start justify-between  border p-4 h-[7.5rem] w-full",
                              isDateGreaterThanToday(v?.validity) 
                                ? ""
                                : "hover:border-basePrimary border-gray-300"
                            )}
                          >
                             {(isDateGreaterThanToday(v?.validity) || !v?.accessibility) && (
                              <div className="w-full h-full absolute rounded-lg z-40 flex items-center justify-center inset-0 bg-white/50">
                                <p className="flex items-center gap-x-2 text-red-300 transform rotate-[30deg]">
                                  <RiLock2Line size={24}/>
                                  <span className="text-base sm:text-xl font-medium">Locked</span></p>
                              </div>
                            )}
                            {v?.discountPercentage &&
                            v?.discountPercentage > 0 ? (
                              <p
                                className={cn(
                                  "w-9 absolute right-4 top-[-14px] h-7 rounded-[40%] px-2 flex items-center justify-center bg-gray-200 text-xs sm:text-mobile"
                                )}
                              >{`${v?.discountPercentage.toFixed(0)}%`}</p>
                            ) : null}

                           
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col items-start justify-start">
                                <p className="font-medium text-base">
                                  {v?.attendeeType}
                                </p>
                                {v?.description && (
                                  <div className="flex items-center gap-x-1">
                                    <p className="text-xs text-start sm:text-sm w-fit max-w-[100px] text-ellipsis whitespace-nowrap overflow-hidden">
                                      {v?.description}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setDescription(v?.description);
                                      }}
                                      className="text-xs sm:text-sm font-medium text-basePrimary"
                                    >
                                      view
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end justify-end">
                                <p className="font-medium text-base">{`${
                                  currency ? currency : "NGN"
                                }${(
                                  Number(v?.price) ?? 0
                                )?.toLocaleString()}`}</p>
                                {v?.discountPrice < v?.price && (
                                  <p className="font-medium text-gray-500">{`${
                                    currency ? currency : "NGN"
                                  }${(
                                    Number(v?.discountPrice) ?? 0
                                  )?.toLocaleString()}`}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-end mt-2 justify-between w-full">
                              <div
                                className={cn(
                                  "  flex flex-col justify-start rounded-md items-start",
                                  isDateGreaterThanToday(v?.validity)
                                    ? "text-gray-500"
                                    : "text-black"
                                )}
                              >
                                {v?.validity ? (
                                  <p className="text-xs sm:text-mobile">{`Valid till ${formatDate(
                                    v?.validity || "0"
                                  )} ${formatTime(v?.validity || "0")}`}</p>
                                ) : (
                                  <p className="w-1 h-1"></p>
                                )}
                              </div>
                              <div className="flex flex-col items-end justify-end gap-y-2">
                                <div className="flex items-center gap-x-3">
                                  <Button
                                    disabled={
                                      selectedAttendeesLength(index) === 0
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      removeChosenAttendee(index);
                                    }}
                                    className={cn(
                                      "px-0 h-fit w-fit text-gray-400",
                                      selectedAttendeesLength(index) > 0 &&
                                        "text-basePrimary"
                                    )}
                                  >
                                    <CircleMinus size={22} />
                                  </Button>
                                  <span className="text-xs font-medium">
                                    {selectedAttendeesLength(index)}
                                  </span>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      addChosenAttendee(
                                        v?.attendeeType,
                                        v?.price,
                                        index
                                      );
                                    }}
                                    className={cn(
                                      "px-0 h-fit w-fit text-basePrimary"
                                    )}
                                  >
                                    <PlusCircleFill size={22} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Button>
                        );
                      }
                      return null;
                    })}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-full flex flex-col gap-y-2 items-start justify-start"
                >
                {  <div className="w-full space-y-1">
                    <div className="w-full flex items-center ">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter a valid discount code (optional)"
                        className="bg-transparent h-14 rounded-l-md px-3 outline-none placeholder:text-gray-300 border border-gray-300 w-[75%]"
                      />
                      <Button
                        disabled={code === ""}
                        onClick={redeem}
                        className="h-14 text-white rounded-r-md rounded-l-none bg-gray-500 font-medium px-0 w-[25%]"
                      >
                        {loading ? "Verifying..." : "Redeem"}
                      </Button>
                    </div>
                    <p className="text-tiny text-gray-500">
                      Discount code is case sensitive
                    </p>
                  </div>}
                </div>
           <div className="w-full inset-x-0 md:bg-white md:p-2 md:absolute bottom-0 md:h-32">
           <Button
                  disabled={
                    chosenAttendee?.length === 0 || pathname.includes("preview")
                  }
                  type="submit"
                  onClick={() => setActive(2)}
                  className={cn(
                    "h-14 w-full gap-x-2 bg-basePrimary hover:bg-opacity-90 transition-all duration-300 ease-in-out transform text-white font-medium",
                    (chosenAttendee?.length === 0 ||
                      pathname.includes("preview")) &&
                      "bg-gray-200 text-black"
                  )}
                >
                  <span>Continue</span>
                </Button>
           </div>
              </div>
            </div>
          )}
          {/** */}
          {active === 2 && (
            <div className="w-full rounded-lg relative lg:col-span-4 bg-white flex-col gap-y-4 p-4 sm:p-6">
              <div className="w-full flex items-center justify-between py-3 border-b">
                <Button
                  onClick={() => setActive(1)}
                  className="px-0 w-fit h-fit"
                >
                  <ArrowBack size={20} />
                </Button>
                <p className="text-base sm:text-xl font-semibold">Checkout</p>
                <p className="w-1 h-1"></p>
              </div>
              <div className="w-full lg:h-[510px] pb-32 pt-4 no-scrollbar lg:overflow-y-auto">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" w-full  space-y-3"
                  >
                    <div className="w-full flex flex-col items-start justify-start gap-y-2">
                      <div className="hidden items-center gap-x-10">
                        <p className="font-medium">People Attending</p>
                        <div className="flex items-center gap-x-3">
                          <Button
                            disabled={fields.length === 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // remove(fields.length - 1);
                            }}
                            className={cn(
                              "px-1 h-fit w-fit text-gray-400",
                              fields.length > 1 && "text-basePrimary"
                            )}
                          >
                            <CircleMinus size={18} />
                          </Button>
                          <span className="text-xs font-medium">
                            {fields.length}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              //  appendAttendees();
                            }}
                            className={cn("px-1 h-fit w-fit text-basePrimary")}
                          >
                            <PlusCircleFill size={18} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col mb-4 items-start justify-start">
                        <p className="text-xs">Fee:</p>
                        <h2 className="text-base sm:text-xl font-semibold">
                          {Number(total) > 0
                            ? ` ${currency ?? "NGN"}${total?.toLocaleString()}`
                            : "Free"}
                        </h2>
                      </div>
                      {fields.map((attendee, index) => (
                        <div
                          key={attendee.id}
                          className="w-full flex mb-3 flex-col gap-y-3"
                        >
                          <div className="w-full flex flex-col gap-y-2 items-start justify-start">
                            <h2>{`Attendee ${index + 1}: ${
                              attendee?.ticketType
                            }`}</h2>
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                              <FormField
                                control={form.control}
                                name={
                                  `attendeeApplication.${index}.firstName` as const
                                }
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="emeka"
                                        {...field}
                                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={
                                  `attendeeApplication.${index}.lastName` as const
                                }
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="john"
                                        {...field}
                                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={
                                  `attendeeApplication.${index}.phoneNumber` as const
                                }
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="+22323342"
                                        type="tel"
                                        {...field}
                                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={
                                  `attendeeApplication.${index}.email` as const
                                }
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="emeka@gmail.com"
                                        type="email"
                                        {...field}
                                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full flex flex-col items-start justify-start gap-y-2">
                      <p className="mb-4">How do you hear about us?</p>
                      {form.formState?.errors?.aboutUs?.message && (
                        <p className="text-sm  text-red-500">
                          {form.formState.errors.aboutUs?.message}
                        </p>
                      )}
                      {["instagram", "facebook", "x", "linkedIn", "others"].map(
                        (value) => (
                          <FormField
                            key={value}
                            control={form.control}
                            name="aboutUs"
                            render={({ field }) => (
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  {...field}
                                  value={value}
                                  className="h-[20px] pt-3 w-[20px] mr-4 accent-basePrimary"
                                />
                                <span className="capitalize">{value}</span>
                              </label>
                            )}
                          />
                        )
                      )}
                    </div>
                    {form.watch("aboutUs") === "others" && (
                      <FormField
                        control={form.control}
                        name="others"
                        render={({ field }) => (
                          <InputOffsetLabel label={"Others"}>
                            <Input
                              placeholder="others"
                              {...field}
                              className="placeholder:text-sm h-12 w-full focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                            />
                          </InputOffsetLabel>
                        )}
                      />
                    )}

<div className="w-full inset-x-0 md:bg-white md:p-2 md:absolute bottom-0 md:h-32">
<Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 w-full mt-3  gap-x-2 bg-basePrimary hover:bg-opacity-90 transition-all duration-300 ease-in-out transform text-white font-medium"
                    >
                      {isSubmitting && (
                        <LoaderAlt
                          className="animate-spin text-white"
                          size={22}
                        />
                      )}
                      <span>Continue</span>
                    </Button>
  </div>
                   
                  </form>
                </Form>
              </div>
            </div>
          )}
          {/*** */}
        </div>
      </div>

      {description !== "" && (
        <DescriptionModal
          description={description}
          setDescription={setDescription}
        />
      )}
    </>
  );
}

function DescriptionModal({
  description,
  setDescription,
}: {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div
      role="button"
      onClick={() => setDescription("")}
      className="w-full h-full fixed z-[999999]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[450px] box-animation h-fit max-h-[85%] overflow-y-auto flex  flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-end justify-end">
          <Button
            onClick={() => setDescription("")}
            className="px-1 h-fit w-fit"
          >
            <CloseOutline size={22} />
          </Button>
        </div>
        <p className="font-semibold">Description</p>
        <div className="w-full flex-wrap flex items-start justify-start leading-7">
          {description}
        </div>
      </div>
    </div>
  );
}
