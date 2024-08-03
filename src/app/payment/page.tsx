"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { convertCurrencyCodeToSymbol } from "@/utils/currencyConverterToSymbol";
import { ArrowBack } from "styled-icons/ionicons-outline";
import { useRouter } from "next/navigation";
import { paymentConfig } from "@/hooks/common/usePayStackPayment";
import { Button } from "@/components";
import { Lock } from "styled-icons/fa-solid";
import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";
import { useCreateOrganisation } from "@/hooks";
import { useCreateOrgSubscription } from "@/hooks/services/subscription";

//type annotation for the data being fetched
type DBDiscountsType = {
  id: number;
  created_at: string;
  discountCode: string;
  validUntil: string | null;
  discountAmount: number;
  discountPercentage: number | null;
};

export default function PaymentPage() {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const params = useSearchParams();
  const name = params.get("name");
  const id = params.get("id") ?? "";
  const orgId = params.get("orgId") ?? "";
  const email = params.get("email");
  const plan = params.get("plan") ?? "";
  const total = params.get("total");
  const currentCoupon = params.get("coupon");
  const monthly = params.get("isMonthly");
  const currency = params.get("currency") ?? "";
  const orgName = params.get("organizationName");
  const orgType = params.get("organizationType");
  const subPlan = params.get("subscriptionPlan");
  const redirectUrl = params.get("redirectUrl");
  const [coupons, setCoupons] = useState<DBDiscountsType[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const isCreate = params.get("isCreate");
  const router = useRouter();
  const isMonthly = monthly?.toString() ?? "";
  const { organisation, loading } = useCreateOrganisation();
  const { createOrgSubscription } = useCreateOrgSubscription(
    id,
    totalPrice,
    currency,
    plan,
    isMonthly,
    total,
    currentCoupon,
    discount,
    orgId
  );

  async function handleSuccess(reference: any) {
    const isCreating = decodeURIComponent(isCreate!);
    await createOrgSubscription().then(async () => {
      toast.success("Payment Successfull");

      if (isCreating === "true") {
        const organizationName = decodeURIComponent(orgName!);
        const organizationType = decodeURIComponent(orgType!);
        const subscriptionPlan = decodeURIComponent(subPlan!);
        await organisation({
          organizationName,
          organizationType,
          subscriptionPlan,
        });
      }
      const redirect = decodeURIComponent(redirectUrl!);
      router.push(redirect || "/workspace/general");
    });
  }

  async function submit() {
    const isCreating = decodeURIComponent(isCreate!);
    await createOrgSubscription().then(async () => {
      if (isCreating === "true") {
        const organizationName = decodeURIComponent(orgName!);
        const organizationType = decodeURIComponent(orgType!);
        const subscriptionPlan = decodeURIComponent(subPlan!);
        await organisation({
          organizationName,
          organizationType,
          subscriptionPlan,
        });
      }
      const redirect = decodeURIComponent(redirectUrl!);
      router.push(redirect || "/workspace/general");
    });
  }

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
        <span>{`Pay ${currency ?? "USD"} ${totalPrice}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };

  useEffect(() => {
    async function fetchAllCouponCodes() {
      try {
        const response = await fetch("/api/discounts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setCoupons(data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchAllCouponCodes();
  }, []);

  // useEffect(() => {
  //   const updateTotalPrice = () => {
  //     let calculatedTotalPrice = Number(total);

  //     if (coupons && currentCoupon) {
  //       const trimmedCoupon = currentCoupon.trim();
  //       const coupon = coupons.find((c) => c.discountCode === trimmedCoupon);

  //       if (coupon) {
  //         if (checkDateEqualToday(coupon.validUntil) || coupon.validUntil === null) {
  //           if (coupon.discountAmount !== null) {
  //             const discountAmount = Number(coupon.discountAmount);
  //             setDiscount(discountAmount);
  //             calculatedTotalPrice = Math.max(calculatedTotalPrice - discountAmount, 0);
  //           } else if (coupon.discountPercentage !== null) {
  //             const discountPercentage = Number(coupon.discountPercentage);
  //             const discountValue = (calculatedTotalPrice * discountPercentage) / 100;
  //             setDiscount(discountValue);
  //             calculatedTotalPrice -= discountValue;
  //           }
  //         } else{
  //           calculatedTotalPrice = 0
  //         }
  //       }
  //     }

  //     setTotalPrice(calculatedTotalPrice);
  //   };

  //   updateTotalPrice();
  // }, [coupons, currentCoupon, total]);

  useEffect(() => {
    const updateTotalPrice = () => {
      let calculatedTotalPrice = Number(total);
      let discountValue = 0;

      if (coupons && currentCoupon) {
        const trimmedCoupon = currentCoupon.trim();
        const coupon = coupons.find((c) => c.discountCode === trimmedCoupon);

        if (coupon) {
          // Check if the coupon is valid (validUntil is today or earlier)
          const today = new Date();
          const validUntilDate = coupon.validUntil
            ? new Date(coupon.validUntil)
            : null;

          if (!validUntilDate || validUntilDate >= today) {
            if (coupon.discountAmount !== null) {
              discountValue = Number(coupon.discountAmount);
              calculatedTotalPrice = Math.max(
                calculatedTotalPrice - discountValue,
                0
              );
            } else if (coupon.discountPercentage !== null) {
              const discountPercentage = Number(coupon.discountPercentage);
              discountValue = (calculatedTotalPrice * discountPercentage) / 100;
              calculatedTotalPrice = Math.max(
                calculatedTotalPrice - discountValue,
                0
              );
            }
          }
        }
      }

      setDiscount(discountValue);
      setTotalPrice(calculatedTotalPrice);
    };

    updateTotalPrice();
  }, [coupons, currentCoupon, total]);

  return (
    <div className="bg-[#F9FAFF] h-screen flex flex-col justify-center items-center px-3">
      <div
        className="w-full flex justify-start  max-w-[489px]"
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
                {Number(total)}
              </p>
            </div>
            <div className="flex justify-between text-base">
              <p className="">Discount</p>
              <p>
                - {convertCurrencyCodeToSymbol(currency || "")}
                {discount}
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
