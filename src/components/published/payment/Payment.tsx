"use client";

import { Button } from "@/components";
import { Lock } from "@styled-icons/fa-solid/Lock";
import { PaystackButton } from "react-paystack";
import { useState } from "react";
import { OrganizerContact, TPayment } from "@/types";
import { paymentConfig } from "@/hooks/common/usePayStackPayment";
import {
  getCookie,
  useGetEventTransactionDetail,
  useUpdateTransactionDetail,
} from "@/hooks";
import { CheckCircleFill } from "@styled-icons/bootstrap/CheckCircleFill";
import { useSearchParams } from "next/navigation";

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
};
export function Payment({
  eventRegistrationRef,
}: {
  eventRegistrationRef: string;
}) {
  const { sendTransactionDetail, loading } = useUpdateTransactionDetail();
  const [isSuccessModal, setSuccessModal] = useState(false);
  const { data } = useGetEventTransactionDetail(eventRegistrationRef);
  const query = useSearchParams();

  const eventData: any = query.get("eventData");
  const parsedData: QueryData = JSON.parse(eventData);
 // console.log({ parsedData });

  const user = getCookie("user");
  const config = paymentConfig({
    reference: data?.eventRegistrationRef,
    email: user?.userEmail!,
    amount: Number(parsedData?.total),
  });

  function toggleSuccessModal(bool: boolean) {
    setSuccessModal(bool);
  }

  async function handleSuccess(reference: any) {
    // console.log(reference);

    const payload = {
      eventId: data?.eventId,
      eventAlias: data?.eventAlias,
      eventImage: parsedData?.eventImage,
      eventRegistrationRef: data?.eventRegistrationRef,
      paymentDate: new Date(),
      expiredAt: null,
      amountPaid: Number(parsedData?.total),
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
      payOutStatus: "new",
      ticketCategory: data?.ticketCategory,
      event: data?.event,
      attendeesDetails: data?.attendeesDetails,
      eventPrice: data?.eventPrice,
    };

    //  console.log({ payload });

    /// change to priceCategory after validity date has been adjusted
    await sendTransactionDetail(toggleSuccessModal, payload);
  }

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full sm:w-[405px] gap-x-2 bg-basePrimary text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ₦${Number(parsedData?.total)?.toLocaleString()}`}</span>
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
      ticketCategory: data?.ticketCategory,
      event: data?.event,
      attendeesDetails: data?.attendeesDetails,
      eventPrice: data?.eventPrice,
    };

    //  console.log({ payload });

    /// change to priceCategory after validity date has been adjusted
    await sendTransactionDetail(toggleSuccessModal, payload);
  }

  return (
    <>
      <div className="w-full h-full z-[200] bg-[#FAFAFA] fixed inset-0">
        <div className="w-[95%] m-auto box-animation sm:w-[439px] rounded-sm shadow inset-0 h-fit absolute gap-y-4 bg-white flex flex-col py-6 px-3 sm:px-4 items-start justify-start">
          <h3 className="text-base sm:text-xl font-medium mb-6">
            Order Summary
          </h3>

          <div className="w-full rounded-md border p-3 flex flex-col items-start justify-start gap-y-2">
            <h3>Orders</h3>

            <div className="flex items-center justify-between w-full">
              <p>{`${data?.attendees}x SubTotal`}</p>
              {parsedData?.total && (
                <p>{`₦${(
                  Number(parsedData?.total) + data?.discountValue
                )?.toLocaleString()}`}</p>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <p>{`${data?.attendees}x Discount`}</p>
              <p>{`-₦${data?.discountValue?.toLocaleString()}`}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p>Total</p>
              <p>{`₦${Number(parsedData?.total || 0)?.toLocaleString()}`}</p>
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
        <div className="w-full h-full inset-0 fixed bg-white/50 z-[300]">
          <div className="absolute inset-0 m-auto w-[95%] sm:w-[400px] gap-y-2 h-[300px]  rounded-lg flex flex-col items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full border-l border-b border-gray-400 animate-spin"></div>
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
          userEmail={user?.userEmail}
        />
      )}
    </>
  );
}

function PaymentSuccess({
  reference,
  eventTitle,
  userEmail,
  toggleSuccessModal,
  count,
  location,
  startDate,
  endDate,
}: {
  reference: string;
  eventTitle?: string;
  toggleSuccessModal: (bool: boolean) => void;
  userEmail?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  count: number;
}) {
  return (
    <div
      role="button"
      onClick={() => toggleSuccessModal(false)}
      className="w-full h-full inset-0 fixed z-[300]"
    >
      <div
        role="button"
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] sm:w-[70%] h-fit flex flex-col gap-y-14 items-start justify-start max-w-[700px]  rounded-sm absolute bg-white shadow py-6 sm:py-8 px-3 sm:px-10 m-auto inset-0"
      >
        <div className="flex items-start gap-x-6">
          <CheckCircleFill className="text-[#00D685]" size={48} />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-[28px]">
              Thanks for your registration!
            </h1>
            <p>
              Reference <span className="text-basePrimary">{reference}</span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="uppercase text-base sm:text-lg">You are attending</h2>
          <h1 className="text-lg font-bold sm:text-3xl">{eventTitle}</h1>
        </div>

        <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-3 md:gap-6 md:items-center w-full">
          <div className="flex flex-col gap-y-2 items-start justify-start">
            <p className="font-semibold text-lg uppercase">Payment Info</p>
            <p>{userEmail}</p>
          </div>
          <div className="flex flex-col gap-y-2 items-start justify-start">
            <p className="font-semibold text-lg uppercase">
              Number of Participants
            </p>
            <p>{count}</p>
          </div>
          <div className="flex flex-col gap-y-2 items-start justify-start">
            <p className="font-semibold text-lg uppercase">Date:</p>
            <p>{`${startDate} - ${endDate}`}</p>
          </div>
          <div className="flex flex-col gap-y-2 items-start justify-start">
            <p className="font-semibold text-lg uppercase">Location</p>
            <p>{location}</p>
          </div>
        </div>

        <p>Attendees will receive a confirmation email with details of the event.</p>
      </div>
    </div>
  );
}

/**
         <Button
          onClick={submit}
          className="w-full gap-x-2 bg-basePrimary text-gray-50 font-medium"
        >
          <Lock size={22} />
          <span>{`Pay ₦${total?.toLocaleString()}`}</span>
        </Button>
         */
