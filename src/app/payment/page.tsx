import React, { Suspense } from "react";
import PaymentComponent from "@/components/payment/PaymentComponent";

// Define the type for searchParams
type SearchParams = {
  name: string;
  id: string;
  orgId: string;
  orgAlias: string;
  plan: string;
  total: string;
  coupon: string;
  monthly: string;
  currency: string;
  orgName: string;
  orgType: string;
  subPlan: string;
  redirectUrl: string;
  isCreate: string;
};

// Define props type for the Payment component
type PaymentProps = {
  searchParams: SearchParams;
};

export default function Payment({ searchParams }: PaymentProps) {
  return (
    <Suspense>
      <PaymentComponent searchParams={searchParams} />
    </Suspense>
  );
}
