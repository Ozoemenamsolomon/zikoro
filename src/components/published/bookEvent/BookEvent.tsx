"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import Image from "next/image";
import { useMemo, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { PlusCircleFill } from "styled-icons/bootstrap";
import { CircleMinus } from "styled-icons/fa-solid";
import { Payment } from "@/components/published";
import { useFieldArray } from "react-hook-form";
import { Form, FormField, Input, InputOffsetLabel } from "@/components";
import { eventBookingValidationSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useBookingEvent, useTransactionDetail } from "@/hooks";
import toast from "react-hot-toast";

export function BookEvent({
  close,
  price,
  eventId,
  organization,
  eventDate,
  endDate,
  minimumAttendees,
  startDate,
  discountAmount,
  currency,
  discountPercentage,
  priceCategory,
  eventTitle,
  eventLocation,
  discountCode,
}: {
  eventId?: number;
  discountCode?: string;
  eventDate?: string;
  priceCategory?: string;
  endDate?: string;
  startDate?: string;
  eventTitle?: string;
  minimumAttendees?: number;
  organization?: string | null;
  price?: number;
  discountAmount: number;
  discountPercentage: number;
  close: () => void;
  eventLocation?: string;
  currency: string | undefined;
}) {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isPaymentModal, setOpenPaymentModal] = useState(false);
  const { sendTransactionDetail } = useTransactionDetail();
  const form = useForm<z.infer<typeof eventBookingValidationSchema>>({
    resolver: zodResolver(eventBookingValidationSchema),
    defaultValues: {
      attendeeApplication: [
        {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          whatsappNumber: "",
        },
      ],
    },
  });
  const { registerAttendees, isRegistered } = useBookingEvent();

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "attendeeApplication",
  });

  const computedPrice = useMemo(() => {
    if (price) return price * fields.length;
  }, [price, fields]);

  function appendAttendees() {
    append({
      firstName: "",
      lastName: "",
      email: "",
      whatsappNumber: "",
      phoneNumber: "",
    });
  }

  function allowPayment(bool: boolean) {
    setOpenPaymentModal(bool);
  }

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

  // calculating  the discount
  const discount = useMemo(() => {
    return discountAmount !== null
      ? Number(discountAmount) * fields?.length
      : ((Number(price) * Number(discountPercentage)) / 100) * fields?.length;
  }, [fields]);

  // calculating the processing Fee
  const processingFee = useMemo(() => {
    if (price) return ((Number(price - discount) * 5) / 100) * fields?.length;
  }, [fields]);

  // calculating total
  const total = useMemo(() => {
    if (computedPrice && processingFee)
      return computedPrice - discount + processingFee;
    else {
      return 0;
    }
  }, [computedPrice, processingFee, discount]);

  async function onSubmit(
    values: z.infer<typeof eventBookingValidationSchema>
  ) {
    // maually checking for "others"
    if (values.aboutUs === "others" && !values.others) {
      form.setError("others", {
        type: "manual",
        message: 'Please provide a value for "Others"',
      });

      return; /// stop submission
    }

    // checking if the attendees number satisfy the minimum attendees required to use the event discount code
    if (minimumAttendees !== undefined && minimumAttendees !== fields?.length) {
      toast.error(
        `Discount code is valid for minimum of ${minimumAttendees} attendees`
      );
      return;
    }
    setAttendees(values.attendeeApplication);
    await registerAttendees(eventReference, values, eventId, "attendee");

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
      eventId,
      eventRegistrationRef: eventReference,
      paymentDate: today,
      expiredAt: formattedNextSevenDays,
      amountPaid: total,
      attendees: fields?.length,
      discountValue: discount,
      referralSource: social,
      discountCode,
      currency,
      registrationCompleted: false,
      ticketCategory: priceCategory,
      eventDate,
      event: eventTitle,
      eventPrice: price,
      attendeesDetails: values.attendeeApplication,
    };

    //
    await sendTransactionDetail(allowPayment, payload);
  }
  return (
    <>
      <div
        role="button"
        onClick={close}
        className="w-full h-full inset-0 bg-black/50 z-[80] fixed"
      >
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-[95%] sm:w-[65%] lg:w-[90%] m-auto  shadow-lg overflow-hidden xl:w-[70%] overflow-y-auto lg:overflow-hidden bg-white grid absolute inset-0  grid-cols-1 gap-2 lg:grid-cols-2 items-start h-[85%]  lg:h-[41rem] rounded-xl sm:rounded-2xl "
        >
          <div className="absolute right-3 z-20 top-3 ">
            <Button
              onClick={close}
              className="h-10 w-10 px-1 rounded-full bg-gray-50/80 "
            >
              <CloseOutline size={28} />
            </Button>
          </div>
          <div className="w-full flex flex-col gap-y-3 p-4 sm:p-6 h-full px-3 bg-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold">
              {`${eventTitle}`}
            </h2>
            <h2 className="text-sm sm:text-base  text-gray-500">
              {`${startDate} - ${endDate}`}
            </h2>

            <Image
              className="w-full h-64 mt-3 rounded-lg object-cover"
              src="/images/rect.png"
              alt="eventimage"
              width={700}
              height={700}
            />

            <div className="w-full border mt-3 border-gray-300 rounded-lg py-4 px-3">
              <h2 className="text-base sm:text-lg mb-3 font-semibold ">
                Order Summary
              </h2>

              <div className=" flex items-center  justify-between w-full">
                <p>{`${fields.length}x People Attending:`}</p>
                <p> {`₦${computedPrice?.toLocaleString()}`}</p>
              </div>
              <div className=" flex items-center justify-between w-full">
                <p>{`${fields.length}x Discount:`}</p>
                <p> {`- ₦${discount?.toLocaleString()}`}</p>
              </div>
              <div className=" flex items-center justify-between w-full">
                <p>{`${fields.length}x Processing fee:`}</p>
                <p> {`₦${processingFee?.toLocaleString()}`}</p>
              </div>

              <div className="border-t border-gray-300 font-semibold py-2 mt-3 w-full flex items-center justify-between">
                <p className="">Total</p>
                {computedPrice && <p>{` ₦${total?.toLocaleString()}`}</p>}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 p-4 sm:p-6">
            <div className="w-full flex items-center justify-center py-3 border-b">
              <p className="text-base sm:text-xl font-semibold">Checkout</p>
            </div>
            <div className="w-full lg:h-[510px] pb-24 no-scrollbar lg:overflow-y-auto">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" w-full flex flex-col items-start justify-start gap-y-3"
                >
                  <div className="w-full flex flex-col items-start justify-start gap-y-2">
                    <div className="flex items-center gap-x-10">
                      <p className="font-medium">People Attending</p>
                      <div className="flex items-center gap-x-3">
                        <Button
                          disabled={fields.length === 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            remove(fields.length - 1);
                          }}
                          className={cn(
                            "px-1 h-fit w-fit text-gray-400",
                            fields.length > 1 && "text-zikoro"
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
                            appendAttendees();
                          }}
                          className={cn("px-1 h-fit w-fit text-zikoro")}
                        >
                          <PlusCircleFill size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col mb-4 items-start justify-start">
                      <p className="text-xs">Fee:</p>
                      <h2 className="text-base sm:text-xl font-semibold">
                        {`₦${computedPrice?.toLocaleString()}`}
                      </h2>
                    </div>
                    {fields.map((attendee, index) => (
                      <div
                        key={attendee.id}
                        className="w-full flex flex-col gap-y-3"
                      >
                        <div className="w-full flex flex-col gap-y-2 items-start justify-start">
                          <h2>{`Attendee ${index + 1}`}</h2>
                          <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                            <FormField
                              control={form.control}
                              name={
                                `attendeeApplication.${index}.firstName` as const
                              }
                              render={({ field }) => (
                                <InputOffsetLabel label={"First Name"}>
                                  <Input
                                    placeholder="emeka"
                                    {...field}
                                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                  />
                                </InputOffsetLabel>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={
                                `attendeeApplication.${index}.lastName` as const
                              }
                              render={({ field }) => (
                                <InputOffsetLabel label={"Last Name"}>
                                  <Input
                                    placeholder="john"
                                    {...field}
                                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                  />
                                </InputOffsetLabel>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={
                                `attendeeApplication.${index}.phoneNumber` as const
                              }
                              render={({ field }) => (
                                <InputOffsetLabel label={"Phone Number"}>
                                  <Input
                                    placeholder="+22323342"
                                    type="tel"
                                    {...field}
                                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                  />
                                </InputOffsetLabel>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={
                                `attendeeApplication.${index}.email` as const
                              }
                              render={({ field }) => (
                                <InputOffsetLabel label={"Email"}>
                                  <Input
                                    placeholder="emeka@gmail.com"
                                    type="email"
                                    {...field}
                                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                  />
                                </InputOffsetLabel>
                              )}
                            />
                          </div>
                          <div className="w-full grid grid-cols-1 items-center gap-4">
                            <FormField
                              control={form.control}
                              name={
                                `attendeeApplication.${index}.whatsappNumber` as const
                              }
                              render={({ field }) => (
                                <InputOffsetLabel label={"Whatsapp Number"}>
                                  <Input
                                    placeholder="+2345656432"
                                    type="tel"
                                    {...field}
                                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                  />
                                </InputOffsetLabel>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex flex-col items-start justify-start gap-y-2">
                    <p className="mb-4">How do you hear about us?</p>

                    {["instagram", "facebook", "x", "linkedIn", "others"].map(
                      (value) => (
                        <FormField
                          control={form.control}
                          name="aboutUs"
                          render={({ field }) => (
                            <label className="flex items-center">
                              <input
                                type="radio"
                                {...field}
                                value={value}
                                className="h-[20px] pt-3 w-[20px] mr-4"
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
                  <Button
                    type="submit"
                    className="h-12 w-[130px] px-8 gap-x-2 bg-zikoro hover:bg-opacity-90 transition-all duration-300 ease-in-out transform text-white font-medium"
                  >
                    {form.formState.isSubmitting && (
                      <LoaderAlt
                        className="animate-spin text-white"
                        size={22}
                      />
                    )}
                    <span>Continue</span>
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      {isPaymentModal && (
        <Payment
          eventDate={eventDate}
          allowPayment={allowPayment}
          priceCategory={priceCategory}
          eventTitle={eventTitle}
          startDate={startDate}
          eventReference={eventReference}
          endDate={endDate}
          attendeesDetails={attendees}
          eventId={eventId}
          currency={currency}
          referralSource={social}
          discountCode={discountCode}
          count={fields?.length}
          eventLocation={eventLocation}
          discount={discount}
          total={total}
          eventPrice={price}
        />
      )}
    </>
  );
}
