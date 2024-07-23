"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "styled-icons/ionicons-outline";
import { ArrowRight } from "styled-icons/typicons";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { convertCurrencyCodeToSymbol } from "@/utils/currencyConverterToSymbol";

type Props = {
  updateModalState: () => void;
  setChosenPlan: (plan: string | null) => void;
  setChosenPrice: (price: number | null) => void;
  setChosenCurrency: (currency: string) => void;
  setChosenMonthly: (isMontly: boolean) => void;
};

//type annotation for the data being fetched
type DBDefaultPriceType = {
  id: number;
  created_at: string;
  currency: string;
  plan: string | null;
  monthPrice: number | null;
  yearPrice: number | null;
  productType: string;
  amount: number | null;
};

type DBOtherCurrienciesType = {
  id: number;
  created_at: string;
  currency: string;
  amount: number;
};

export default function PricingTable({
  updateModalState,
  setChosenCurrency,
  setChosenPlan,
  setChosenPrice,
  setChosenMonthly,
}: Props) {
  const [freeFeatures, setFreeFeatures] = useState<boolean>(false);
  const [liteFeatures, setLiteFeatures] = useState<boolean>(false);
  const [profFeatures, setProfFeatures] = useState<boolean>(false);
  const [busFeatures, setBusFeatures] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [defaultPriceData, setDefaultPriceData] = useState<
    DBDefaultPriceType[] | undefined
  >(undefined);
  const [otherCurrenciesData, setOtherCurrenciesData] = useState<
    DBOtherCurrienciesType[] | undefined
  >(undefined);

  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const router = useRouter();

  //currencies list
  const currencies = ["USD", "NGN", "GHC", "ZAR", "KES"];

  //toggler functions
  const handlePlanToogle = () => {
    setIsMonthly(!isMonthly);
  };

  useEffect(() => {
    async function fetchPricingData() {
      try {
        const response = await fetch("/api/pricing", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setDefaultPriceData(data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async function fetchOtherCurrenciesPricing() {
      try {
        const response = await fetch("/api/currenciesPricing", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setOtherCurrenciesData(data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchPricingData();
    fetchOtherCurrenciesPricing();
  }, []);

  //get plan price
  const getPlanPrice = (
    plan: string,
    selectedCurrency: string,
    otherCurrenciesData: DBOtherCurrienciesType[] | undefined
  ): number | null => {
    if (!defaultPriceData) return null;
    const planData = defaultPriceData.find(
      (data) => data.plan === plan && data.currency === "USD" // Assuming default price data is in USD
    );
    if (!planData) return null;

    let planPrice = isMonthly ? planData.monthPrice : planData.yearPrice;

    if (selectedCurrency !== "USD" && otherCurrenciesData) {
      const currencyData = otherCurrenciesData.find(
        (data) => data.currency === selectedCurrency
      );
      if (currencyData && planPrice) {
        planPrice *= currencyData.amount;
      }
    }

    return planPrice;
  };

  const handleSelectPlan = (plan: string) => {
    const price = getPlanPrice(plan, selectedCurrency, otherCurrenciesData);
    setChosenPrice(price);
    setChosenPlan(plan);
    setChosenMonthly(isMonthly);
    updateModalState();
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setChosenCurrency(currency);
  };

  return (
    <div className=" my-[75px] lg:my-[75px] px-5 lg:px-0 max-w-full lg:max-w-7xl mx-auto">
      <div className=" my-12 lg:mt-20 px-5 lg:px-0 max-w-full lg:max-w-7xl mx-auto justify-between items-center flex flex-col md:flex-row gap-y-6 ">
        <div className="px-3 rounded-lg border-[1px]  border-indigo-600 ">
          <select
            name="currency"
            value={selectedCurrency}
            className="bg-transparent  h-[45px] outline-none cursor-pointer "
            onChange={(e) => handleCurrencyChange(e.target.value)}
          >
            {currencies.map((currency, index) => (
              <option value={currency} key={index}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center md:flex-row gap-y-2 gap-x-6 ">
          <p className="text-xl font-medium ">Monthly</p>
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={(e) => handlePlanToogle()}
          />
          <p className="text-xl font-medium">Yearly</p>

          {isMonthly && (
            <div className="relative text-[11px] lg:text-[14px] bg-zikoroBlue py-2 px-2 lg:px-2 text-white ml-2">
              save up to 15%
              <div className="absolute left-0 top-0 bottom-0 w-[16px] bg-zikoroBlue transform -translate-x-full clip-triangle"></div>
            </div>
          )}
        </div>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Free Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg">
          <div>
            {/* title */}
            <p className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-2xl font-bold ">
              Free
            </p>
            <p className="text-[14px] h-[68px] ">
              New to hosting events? Whether you're an individual or part of a
              small team, we've got you covered
            </p>
            <p className="text-2xl font-bold text-zikoroBlue mt-6">
              {" "}
              {convertCurrencyCodeToSymbol(selectedCurrency)} 0{" "}
              <span className="text-[14px] text-gray-400">/month</span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-white rounded-[47px] text-base font-bold text-white py-2 cursor-pointe opacity-50"
                onClick={() => updateModalState()}
                disabled
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-zikoroBlue mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>
            {/* 
            {!freeFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setFreeFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setFreeFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Lite Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg">
          <div>
            {/* title */}
            <p className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-2xl font-bold ">
              Lite
            </p>

            {/* description */}
            <p className="text-[14px] h-[68px]">
              For individuals and teams who want to boost audience engagement at
              their events
            </p>

            <p className="text-2xl font-bold text-zikoroBlue mt-6">
              {" "}
              {convertCurrencyCodeToSymbol(selectedCurrency)}{" "}
              {getPlanPrice("Lite", selectedCurrency, otherCurrenciesData) ??
                "N/A"}{" "}
              <span className="text-[14px] text-gray-400">/month</span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[47px] text-base font-bold text-white py-2 cursor-pointer"
                onClick={() => handleSelectPlan("Lite")}
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-zikoroBlue mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>

            {/* {!liteFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setLiteFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setLiteFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Professional Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-white">
          <div>
            {/* title */}
            <p className=" text-2xl font-bold ">Professional</p>

            {/* description */}
            <p className="text-[14px] h-[68px] ">
              For teams and organisations seeking flexibility and control over
              audience engagement at their events.
            </p>

            <p className="text-2xl font-bold mt-6">
              {convertCurrencyCodeToSymbol(selectedCurrency)}{" "}
              {getPlanPrice(
                "Professional",
                selectedCurrency,
                otherCurrenciesData
              ) ?? "N/A"}{" "}
              <span className="text-[14px] text-gray-400 ">/month</span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-white rounded-[47px] text-base font-bold text-zikoroBlue py-2 cursor-pointer"
                onClick={() => handleSelectPlan("Professional")}
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-white mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>

            {/* {!profFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setProfFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setProfFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Business Section */}
        <div className="py-10 px-2 border-[.5px] border-indigo-600 rounded-lg">
          <div>
            {/* title */}
            <p className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-2xl font-bold ">
              Enterprise
            </p>

            {/* description */}
            <p className="text-[14px] h-[68px] ">
              For large-scale events and organisations requiring absolute
              control and tailored experiences.
            </p>

            <p className="text-2xl font-bold text-zikoroBlue mt-6">
              {" "}
              {convertCurrencyCodeToSymbol(selectedCurrency)}{" "}
              {getPlanPrice(
                "Enterprise",
                selectedCurrency,
                otherCurrenciesData
              ) ?? "N/A"}{" "}
              <span className="text-[14px] text-gray-400">/month</span>{" "}
            </p>
            <div className="px-1 my-6">
              {/* buttons */}
              <button
                className="w-full bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[47px] text-base font-bold text-white py-2 cursor-pointer"
                onClick={() => handleSelectPlan("Enterprise")}
              >
                Buy
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-[47px] text-base font-bold w-full text-zikoroBlue mt-1 py-2 cursor-pointer"
              >
                Try it
              </button>
            </div>

            {/* {!busFeatures ? (
              <div
                className="flex gap-x-2 items-center justify-center text-base cursor-pointer"
                onClick={() => setBusFeatures(true)}
              >
                <p className="font-medium">Show Features </p>
                <ChevronDown size={16} className="text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-base font-normal">Features</p>
                <div
                  className="flex gap-x-2 items-center justify-center text-base cursor-pointer mt-4"
                  onClick={() => setBusFeatures(false)}
                >
                  <p className="font-medium">Hide Features </p>
                  <ChevronUp size={16} className="text-sm" />
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* <p className="py-[87px] text-center text-zikoroBlue cursor-pointer">
        See our complete feature comparison{" "}
        <ArrowRight size={16} className="text-zikoroBlue" />
      </p> */}
    </div>
  );
}
