"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { convertCurrencyCodeToSymbol } from "@/utils/currencyConverterToSymbol";
import { ArrowBack } from "styled-icons/ionicons-outline";
import { useRouter } from "next/navigation";
import { paymentConfig } from "@/hooks/common/usePayStackPayment";
import { Button } from "@/components";
import { Lock } from "@styled-icons/fa-solid/Lock";
import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";
import { useCreateOrgSubscription } from "@/hooks/services/subscription";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const params = useSearchParams();
  const name = params.get("name");
  const id = params.get("id") ?? "";
  const email = params.get("email");
  const plan = params.get("plan") ?? "";
  const total = params.get("total");
  const monthly = params.get("isMonthly");
  const currency = params.get("currency") ?? "";
  const router = useRouter();
  const isMonthly = monthly?.toString() ?? "";

  const { createOrgSubscription } = useCreateOrgSubscription(
    id,
    totalPrice,
    currency,
    plan,
    isMonthly
  );

  async function handleSuccess(reference: any) {
    await createOrgSubscription().then(() => {
      toast("Payment Successfull");
      router.push("/events");
    });
  }

  async function submit() {}

  //paystack props
  const config = paymentConfig({
    reference: "",
    email: email ? email : "",
    amount: totalPrice,
    currency: currency ? currency : "",
  });

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full sm:w-[405px] gap-x-2 bg-basePrimary text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ${currency ?? "NGN"} ${totalPrice}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };

  useEffect(() => {
    setTotalPrice(Number(total));
  }, [total]);

  return (
    <div className="bg-[#F9FAFF] h-screen flex flex-col justify-center items-center px-3">
      <div
        className="w-full flex justify-start max-w-full lg:max-w-[489px]"
        onClick={() => router.back()}
      >
        <ArrowBack size={25} className="cursor-pointer" />
      </div>
      <div className="py-12 mt-4 lg:py-[60px] px-3 lg:px-6 shadow-sm rounded-[25px] bg-white max-w-full lg:max-w-[489px] w-full">
        <p className="text-center text-2xl font-medium">Order Summary</p>
        <div className="my-2 lg:my-5 p-8 border-[1px] border-indigo-500 rounded-lg">
          <p className="border-b-[1px] border-gray-300 pb-1 text-xl font-medium">
            Orders
          </p>
          {/* Quantities and prices */}
          <div className="mt-4 lg:mt-8 flex flex-col gap-y-4">
            <div className="flex justify-between text-base">
              <p className="">Subtotal</p>
              <p>
                {convertCurrencyCodeToSymbol(currency || "")}
                {total}
              </p>
            </div>
            <div className="flex justify-between text-base">
              <p className="">Discount</p>
              <p>
                - {convertCurrencyCodeToSymbol(currency || "")} {0}
              </p>
            </div>
            <div className="flex justify-between text-base">
              <p className="">Total</p>
              <p>
                {convertCurrencyCodeToSymbol(currency || "")} {totalPrice}
              </p>
            </div>
          </div>

          <div className="w-full flex items-center justify-center mt-6">
            {totalPrice && totalPrice > 0 ? (
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
    </div>
  );
}
