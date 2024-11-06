"use client";

import { Button } from "@/components";
import { Lock } from "styled-icons/fa-solid";
import { PaystackButton } from "react-paystack";
import { useState } from "react";
// import { OrganizerContact, TPayment } from "@/types";
import { paymentConfig } from "@/hooks/common/usePayStackPayment";
import { BsPatchCheck } from "react-icons/bs";
import {
  useGetEventTransactionDetail,
  useUpdateTransactionDetail,
} from "@/hooks";
import { CheckCircleFill } from "styled-icons/bootstrap";
import { useRouter } from "next/navigation";
import { ArrowBack } from "styled-icons/material-outlined";
import { TbLoader3 } from "react-icons/tb";
import { CiCalendar, CiLocationOn, CiShare2 } from "react-icons/ci";
import Link from "next/link";
import { ShareModal } from "@/components/partners/PartnerPayment";

type QueryData = {
  eventImage: string;
  address: string;
  startDate: string;
  endDate: string;
  organization: string;
  eventLocation: string;
  organizerContact: string;
  amountPayable: string;
  total: string;
  processingFee: string;
  trackingId?: string | null;
  affiliateCode?: string | null;
  role?: string | null;
  eventEndDate: string;
};
export function Payment({
  eventRegistrationRef,
  searchParams: { eventData }
}: {
  eventRegistrationRef: string;
  searchParams: any
}) {
  const { sendTransactionDetail, loading } = useUpdateTransactionDetail();
  const [isSuccessModal, setSuccessModal] = useState(false);
  const { data } = useGetEventTransactionDetail(eventRegistrationRef);
  const router = useRouter();
  const parsedData: QueryData = JSON.parse(eventData);
  //

  // const user = getCookie("user");
  const config = paymentConfig({
    reference: data?.eventRegistrationRef,
    email: Array.isArray(data?.attendeesDetails)
      ? data?.attendeesDetails[0]?.email
      : "",
    amount: Number(parsedData?.total),
    currency: data?.currency,
  });

  function toggleSuccessModal(bool: boolean) {
    setSuccessModal(bool);
  }

  async function handleSuccess(reference: any) {
    //

    const payload = {
      eventId: data?.eventId,
      eventAlias: data?.eventAlias,
      eventImage: parsedData?.eventImage,
      eventRegistrationRef: data?.eventRegistrationRef,
      paymentDate: new Date(),
      expiredAt: null,
      amountPaid: Number(parsedData?.total),
      trackingId: parsedData?.trackingId,
      affiliateCode: parsedData?.affiliateCode,
      role: parsedData?.role,
      attendees: data?.attendees,
      discountValue: data?.discountValue,
      referralSource: data?.referralSource,
      discountCode: data?.discountCode,
      amountPayable: data?.amountPayable,
      processingFee: Number(parsedData?.processingFee),
      address: parsedData?.address,
      count: data?.attendees,
      currency: data?.currency,
      organizerContact: JSON.parse(parsedData?.organizerContact),
      organization: parsedData?.organization,
      startDate: parsedData?.startDate,
      endDate: parsedData?.endDate,
      registrationCompleted: reference.status === "success",
      eventDate: data?.eventDate,
      eventEndDate: parsedData?.eventEndDate,
      payOutStatus: "new",
      ticketCategory: data?.ticketCategory,
      event: data?.event,
      attendeesDetails: data?.attendeesDetails,
      eventPrice: data?.eventPrice,
    };

    //

    /// change to priceCategory after validity date has been adjusted
    await sendTransactionDetail(toggleSuccessModal, payload);
  }

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full sm:w-[405px] gap-x-2 bg-basePrimary text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ${data?.currency ?? "NGN"}${Number(
          parsedData?.total
        )?.toLocaleString()}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };
  async function submit() {
    const payload = {
      eventId: data?.eventId,
      eventAlias: data?.eventAlias,
      eventImage: parsedData?.eventImage,
      eventRegistrationRef: data?.eventRegistrationRef,
      paymentDate: new Date(),
      expiredAt: null,
      amountPaid: parsedData?.total,
      trackingId: parsedData?.trackingId,
      affiliateCode: parsedData?.affiliateCode,
      role: parsedData?.role,
      attendees: data?.attendees,
      discountValue: data?.discountValue,
      referralSource: data?.referralSource,
      discountCode: data?.discountCode,
      amountPayable: data?.amountPayable,
      processingFee: parsedData?.processingFee,
      address: parsedData?.address,
      count: data?.attendees,
      currency: data?.currency,
      organizerContact: JSON.parse(parsedData?.organizerContact),
      organization: parsedData?.organization,
      startDate: parsedData?.startDate,
      endDate: parsedData?.endDate,
      registrationCompleted: true,
      eventDate: data?.eventDate,
      eventEndDate: parsedData?.eventEndDate,
      ticketCategory: data?.ticketCategory,
      event: data?.event,
      attendeesDetails: data?.attendeesDetails,
      eventPrice: data?.eventPrice,
    };

    //

    /// change to priceCategory after validity date has been adjusted
    await sendTransactionDetail(toggleSuccessModal, payload);
  }

  return (
    <>
      <div className="w-full h-full z-[200] bg-[#F9FAFF] fixed inset-0">
        <div className="w-[95%] m-auto box-animation sm:w-[439px] rounded-sm shadow inset-0 h-fit absolute gap-y-4 bg-white flex flex-col py-6 px-3 sm:px-4 items-start justify-start">
          <div className="absolute left-1 z-20 -top-8 ">
            <Button onClick={() => router.back()} className="px-0 w-fit h-fit ">
              <ArrowBack className="" size={20} />
            </Button>
          </div>
          <h3 className="text-base sm:text-xl font-medium mb-6">
            Order Summary
          </h3>

          <div className="w-full rounded-md border p-3 flex flex-col items-start justify-start gap-y-2">
            <h3>Orders</h3>

            <div className="flex items-center justify-between w-full">
              <p>{`${data?.attendees ?? "0"}x SubTotal`}</p>
              {parsedData?.total && (
                <p>{`${data?.currency ?? "NGN"}${
                  (
                    Number(parsedData?.total) + data?.discountValue
                  )?.toLocaleString() ?? 0
                }`}</p>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <p>{`${data?.attendees ?? "0"}x Discount`}</p>
              <p>{`-${data?.currency ?? "NGN"}${
                data?.discountValue?.toLocaleString() ?? 0
              }`}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p>Total</p>
              <p>{`${data?.currency ?? "NGN"}${
                Number(parsedData?.total || 0)?.toLocaleString() ?? 0
              }`}</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            {Number(parsedData?.total) && Number(parsedData?.total) > 0 ? (
              <PaystackButton {...componentProps} />
            ) : (
              <Button
                onClick={submit}
                className="w-full gap-x-2 bg-basePrimary text-gray-50 font-medium"
              >
                <Lock size={22} />
                <span>{`Confirm`}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="w-full h-full inset-0 fixed z-[300]">
          <div className="absolute inset-0 m-auto w-[95%] sm:w-[400px] gap-y-2 h-[300px]  rounded-lg flex flex-col items-center justify-center">
            <TbLoader3 size={30} className="text-basePrimary animate-spin" />
            <p>Processing...</p>
          </div>
        </div>
      )}

      {isSuccessModal && (
        <PaymentSuccess
          location={parsedData?.eventLocation}
          startDate={parsedData?.startDate}
          endDate={parsedData?.endDate}
          count={data?.attendees}
          toggleSuccessModal={toggleSuccessModal}
          reference={data?.eventRegistrationRef}
          eventTitle={data?.event}
          eventId={data?.eventAlias}
        />
      )}
    </>
  );
}

function PaymentSuccess({
  reference,
  eventTitle,
  toggleSuccessModal,
  count,
  location,
  startDate,
  endDate,
  eventId,
}: {
  reference: string;
  eventTitle?: string;
  toggleSuccessModal: (bool: boolean) => void;
  location?: string;
  startDate?: string;
  endDate?: string;
  count: number;
  eventId: string;
}) {
  const [isShare, setShowIsShare] = useState(false);

  function onToggleShare() {
    setShowIsShare((p) => !p);
  }
  return (
    <div
      role="button"
      //  onClick={() => toggleSuccessModal(false)}
      className="w-full bg-[#F9FAFF] fixed  h-full inset-0 z-[300]"
    >
      <div
        role="button"
        onClick={(e) => e.stopPropagation()}
        className="w-[95%]  pt-6 grid grid-cols-1 items-center justify-center gap-y-10 bg-white max-w-lg absolute m-auto h-fit inset-0"
      >
        <div className="w-full px-4 flex items-center gap-y-5 flex-col">
          <div className="w-20 h-20 flex items-center justify-center bg-green-200 rounded-full">
            <BsPatchCheck className="text-green-500" size={50} />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-1">
            <h2 className="text-green-500 font-medium text-lg sm:text-2xl">
              Payment Successful
            </h2>
            <p className="text-xs sm:text-mobile">
              Reference:{" "}
              <span className="text-basePrimary">{reference ?? ""}</span>
            </p>
          </div>
          <p className="text-center max-w-sm">
            You have successfully registered for this event.
          </p>
        </div>

        <div className="w-full px-4 flex flex-col items-center justify-center gap-y-2">
          <p className="font-semibold">{eventTitle ?? ""}</p>
          <div className="flex items-center gap-x-2">
            <CiCalendar size={18} />
            <p>
              {startDate ?? ""} - {endDate ?? ""}
            </p>
          </div>
          <p className="flex items-center gap-x-2">
            <CiLocationOn size={18} />
            <p>{location ?? ""}</p>
          </p>
        </div>

        <div className="w-full px-4 flex flex-col gap-y-2 items-center justify-center">
          <p className="font-medium text-center max-w-sm">
          Check your mailbox <span className="text-red-500">(or your spam)</span> for confirmation mail and  for further information from the event organiser
           
          </p>
          <button
            onClick={onToggleShare}
            className="w-fit border-b max-w-md text-gray-500 flex border-gray-500"
          >
            <p className=" text-xs text-start sm:text-mobile">
              Inform your network that you are attending this event
            </p>
            <CiShare2 size={16} />
          </button>
        </div>

        <div className="w-full bg-[#001ffc]/10 p-1">
          <p className="text-center text-tiny sm:text-xs">
            Create your own event with
            <Link href="https://zikoro.com/create" className="ml-1 text-basePrimary">
              Zikoro
            </Link>
          </p>
        </div>
      </div>
      {isShare && (
        <ShareModal
          eventId={eventId}
          close={onToggleShare}
          text={`https://zikoro.com/live-events/${eventId}`}
        />
      )}
    </div>
  );
}
