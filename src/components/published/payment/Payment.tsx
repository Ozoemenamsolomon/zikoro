"use client";
import { Button } from "@/components";
import { Lock } from "@styled-icons/fa-solid/Lock";
import { PaystackButton } from "react-paystack";
import { useState } from "react";
import { paymentConfig } from "@/hooks/common/usePayStackPayment";
import { useTransactionDetail, getCookie } from "@/hooks";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { CheckCircleFill } from "@styled-icons/bootstrap/CheckCircleFill";

export function Payment({
  total,
  discount,
  count,
  priceCategory,
  eventDate,
  eventPrice,
  eventLocation,
  eventTitle,
  startDate,
  endDate,
  allowPayment,
  eventId,
  attendeesDetails,
}: {
  total?: number;
  allowPayment: (bool: boolean) => void;
  discount: number;
  count: number;
  attendeesDetails: any[];
  eventPrice?: number;
  startDate?: string;
  endDate?: string;
  eventId?: number;
  eventDate?: string;
  priceCategory?: string;
  eventTitle?: string;
  eventLocation?: string;
}) {
  const { sendTransactionDetail, loading } = useTransactionDetail();
  const [isSuccessModal, setSuccessModal] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const user = getCookie("user");
  const config = paymentConfig({
    email: user?.user?.email!,
    amount: total,
  });

  function toggleSuccessModal(bool: boolean) {
    setSuccessModal(bool);
  }

  async function handleSuccess(reference: any) {
    // console.log(reference);
    setRefNumber(reference.reference);
    const payload = {
      eventId,
      transactionReference: reference.reference,
      paymentDate: new Date(),
      amountPaid: total,
      attendees: count,
      currency: "NGN",
      paidStatus: reference.status === "success",
      eventDate,
      priceCategory,
      event: eventTitle,
      attendeesDetails,
      eventPrice,
    };
    await sendTransactionDetail(toggleSuccessModal, payload);
  }

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full sm:w-[405px] gap-x-2 bg-zikoro text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ₦${total?.toLocaleString()}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };

  return (
    <>
      <div className="w-full h-full z-[200] bg-[#FAFAFA] fixed inset-0">
        <Button
          onClick={() => allowPayment(false)}
          className="absolute top-4 left-4"
        >
          <CloseOutline size={24} />
        </Button>

        <div className="w-[95%] m-auto box-animation sm:w-[439px] rounded-sm shadow inset-0 h-fit absolute gap-y-4 bg-white flex flex-col py-6 px-3 sm:px-4 items-start justify-start">
          <h3 className="text-base sm:text-xl font-medium mb-6">
            Order Summary
          </h3>

          <div className="w-full rounded-md border p-3 flex flex-col items-start justify-start gap-y-2">
            <h3>Orders</h3>

            <div className="flex items-center justify-between w-full">
              <p>{`${count}x SubTotal`}</p>
              {total && <p>{`₦${(total + discount)?.toLocaleString()}`}</p>}
            </div>
            <div className="flex items-center justify-between w-full">
              <p>{`${count}x Discount`}</p>
              <p>{`-₦${discount?.toLocaleString()}`}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p>Total</p>
              <p>{`₦${total?.toLocaleString()}`}</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <PaystackButton {...componentProps} />
          </div>
          {/**
         <Button
          onClick={submit}
          className="w-full gap-x-2 bg-zikoro text-gray-50 font-medium"
        >
          <Lock size={22} />
          <span>{`Pay ₦${total?.toLocaleString()}`}</span>
        </Button>
         */}
        </div>
      </div>
      {loading && (
        <div className="w-full h-full inset-0 fixed bg-white/50 z-[300]">
          <div className="absolute inset-0 m-auto w-[95%] sm:w-[400px] gap-y-2 h-[300px] bg-white rounded-lg flex flex-col items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full border-l border-b border-gray-400 animate-spin"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}

      {isSuccessModal && (
        <PaymentSuccess
          location={eventLocation}
          startDate={startDate}
          endDate={endDate}
          count={count}
          toggleSuccessModal={toggleSuccessModal}
          reference={refNumber}
          eventTitle={eventTitle}
          userEmail={user?.user?.email}
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
  reference: string | undefined;
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
        className="w-[95%] sm:w-[70%] h-fit flex flex-col gap-y-8 items-start justify-start max-w-[700px]  rounded-sm absolute bg-white shadow py-6 sm:py-8 px-3 sm:px-10 m-auto inset-0"
      >
        <div className="flex items-center gap-x-2">
          <CheckCircleFill className="text-[#00D685]" size={48} />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-[28px]">
              Thanks for your registration!
            </h1>
            <p>
              Reference <span className="text-zikoro">{reference}</span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="uppercase text-base sm:text-lg">You are attending</h2>
          <h1 className="text-lg sm:text-3xl">{eventTitle}</h1>
        </div>

        <div className="grid grid-cols-2 gap-6 items-center w-full">
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

        <p>Your will receive a confirmation email with details of the event.</p>
      </div>
    </div>
  );
}
