"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingTable from "@/components/pricing/PricingTable";
import PricingCurrency from "@/components/pricing/PricingCurrency";
import { PaymentModal } from "@/components/payment/paymentModal";

export default function Contact() {
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);

  return (
    <div className="">
      <Navbar />
      <div>
        <PricingHeader />
        <PricingCurrency />
        <PricingTable
          updateModalState={() => setPaymentModalOpen(!paymentModalOpen)}
        />
        {paymentModalOpen && (
          <PaymentModal
            updateModalState={() => setPaymentModalOpen(!paymentModalOpen)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
