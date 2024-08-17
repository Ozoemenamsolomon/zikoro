"use client";

import { Button } from "@/components";
import { paymentConfig, useAddPartners } from "@/hooks";
import { TPartner } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Lock } from "styled-icons/fa-solid";
import { ArrowBack } from "styled-icons/boxicons-regular";
import { PaystackButton } from "react-paystack";
import { BsPatchCheck } from "react-icons/bs";

export default function PartnerPayment() {
  const router = useRouter();
  const params = useSearchParams();
  const data = params.get("p");
  const { addPartners, loading } = useAddPartners();

  const partnerData: Partial<TPartner> = useMemo(() => {
    if (data) {
      const dataString = decodeURIComponent(data);
      const decodedData = JSON.parse(dataString);
      return decodedData;
    } else {
      return null;
    }
  }, [data]);

  const config = paymentConfig({
    reference: partnerData?.paymentReference!,
    email: partnerData?.email!,
    amount: partnerData?.amountPaid,
    currency: partnerData?.currency,
  });

  async function handleSuccess(reference: any) {
    const payload = {
      ...partnerData,
    };

    await addPartners(payload);
  }

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full sm:w-[405px] gap-x-2 bg-basePrimary text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ${partnerData?.currency}${Number(
          partnerData?.amountPaid
        )?.toLocaleString()}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };

  return (
    <div className="w-full bg-[#F9FAFF] fixed inset-0 h-full">
      <div className="max-w-md m-auto flex flex-col items-start justify-start gap-y-3 p-4 w-[95%] inset-0 absolute h-fit">
        <Button
          onClick={() => router.back()}
          className="px-0 h-fit w-fit  bg-none  "
        >
          <ArrowBack className="px-0 w-fit h-fit" size={20} />
        </Button>

        <div className="w-full bg-white h-fit flex items-center justify-center flex-col gap-y-5 rounded-lg p-4">
          <p className="font-semibold text-lg sm:text-xl">Order Summary</p>

          <div className="w-full border rounded-lg py-6 px-4">
            <p className="w-full border-b pb-2">Orders</p>

            <div className="w-full mt-6 mb-2 flex items-center justify-between">
              <p>1X SubTotal</p>
              <p className="font-medium">
                {partnerData?.currency}{" "}
                {partnerData?.amountPaid?.toLocaleString()}
              </p>
            </div>
            <div className="w-full  flex items-center justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">
                {partnerData?.currency}{" "}
                {partnerData?.amountPaid?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <PaystackButton {...componentProps} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccessModal() {
  return (
    <div className="w-full bg-[#F9FAFF]  h-full inset-0 z-[200]">
      <div className="w-[95%] px-4 py-6 grid grid-cols-1 items-center justify-center gap-y-4 bg-white max-w-lg absolute m-auto h-fit inset-0">
        <div className="w-20 h-20 flex items-center justify-center bg-green-200 rounded-full">
          <BsPatchCheck className="text-green-500" size={50} />
        </div>
        <h2 className="text-green-500 font-medium text-lg sm:text-2xl">
          Payment Successful
        </h2>
        <p className="text-center">
          You have successfully made payment to be a{" "}
          <span className="font-medium">partner</span> for this event;
        </p>

        <div className="w-full flex flex-col items-center justify-center gap-y-2">
          <p className="font-semibold">Event Name</p>
        </div>
      </div>
    </div>
  );
}
