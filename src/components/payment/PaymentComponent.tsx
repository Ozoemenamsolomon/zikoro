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

// type SearchParamsType = {
//   name: string;
//   id: string;
//   orgId: string;
//   orgAlias: string;
//   email: string;
//   plan: string;
//   total: string;
//   currentCoupon: string;
//   monthly: string;
//   currency: string;
//   orgName: string;
//   orgType: string;
//   subPlan: string;
//   redirectUrl: string;
//   isCreate: string;
// };

export default function PaymentComponent({
//   searchParams: {
//     name,
//     id,
//     orgId,
//     orgAlias,
//     email,
//     plan,
//     total,
//     currentCoupon,
//     monthly,
//     currency,
//     orgName,
//     orgType,
//     subPlan,
//     redirectUrl,
//     isCreate,
//   },
}) {

    const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const id = searchParams.get("id") ?? "";
  const orgId = searchParams.get("orgId");
  const orgAlias = searchParams.get("orgAlias");
  const email = searchParams.get("email");
  const plan = searchParams.get("plan") ?? "";
  const total = searchParams.get("total");
  const currentCoupon = searchParams.get("currentCoupon");
  const monthly = searchParams.get("monthly");
  const currency = searchParams.get("currency") ?? "";
  const orgName = searchParams.get("orgName");
  const orgType = searchParams.get("orgType");
  const subPlan = searchParams.get("subPlan");
  const redirectUrl = searchParams.get("redirectUrl");
  const isCreate = searchParams.get("isCreate");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [coupons, setCoupons] = useState<DBDiscountsType[]>([]);
  const [discount, setDiscount] = useState<number>(0);
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
    orgId,
    orgAlias
  );

  async function handleSuccess(reference: any) {
    const isCreating = decodeURIComponent(isCreate!);
    const redirect = decodeURIComponent(redirectUrl!);
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

      router.push(redirect);
    });
  }

  async function submit() {
    const isCreating = decodeURIComponent(isCreate!);
    const redirect = decodeURIComponent(redirectUrl!);
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

      router.push(redirect);
    });
  }

  //paystack props
  const config = paymentConfig({
    reference: "",
    email: email ? decodeURIComponent(email) : "",
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
    console.log("email", email);
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