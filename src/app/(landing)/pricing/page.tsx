"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingTable from "@/components/pricing/PricingTable";
import { PaymentModal } from "@/components/payment/paymentModal";

export default function Pricing() {
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [chosenPlan, setChosenPlan] = useState<string | null>(null);
  const [chosenPrice, setChosenPrice] = useState<number | null>(0);
  const [isChosenMonthly, setChosenMonthly] = useState<boolean>(false)
  const [chosenCurrency, setChosenCurrency] = useState<string>("NGN");

  return (
    <div className="">
      <Navbar />
      <div>
        <PricingHeader />
        <PricingTable
          updateModalState={() => setPaymentModalOpen(!paymentModalOpen)}
          setChosenPlan={setChosenPlan}
          setChosenPrice={setChosenPrice}
          setChosenCurrency={setChosenCurrency}
          setChosenMonthly ={setChosenMonthly}
        />
        {paymentModalOpen && (
          <PaymentModal
            updateModalState={() => setPaymentModalOpen(!paymentModalOpen)}
            setChosenPlan={setChosenPlan}
            setChosenPrice={setChosenPrice}
            setChosenCurrency={setChosenCurrency}
            chosenPlan={chosenPlan}
            chosenPrice={chosenPrice}
            chosenCurrency={chosenCurrency}
            isChosenMonthly={isChosenMonthly}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
