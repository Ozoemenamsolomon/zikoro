"use client";

import React, { Suspense } from "react";
import PaymentComponent from "@/components/payment/PaymentComponent";

export default function Payment() {
  return (
    <Suspense>
      <PaymentComponent />
    </Suspense>
  );
}
