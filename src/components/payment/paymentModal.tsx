"use client";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import React, { useEffect, useState } from "react";
import { PaymentPlus, PaymentTick } from "@/constants";
import { PlusCircleFill } from "styled-icons/bootstrap";
import { MinusCircle } from "styled-icons/evaicons-solid";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/globalUserStore";
import { convertCurrencyCodeToSymbol } from "@/utils/currencyConverterToSymbol";

type Props = {
  updateModalState: () => void;
  setChosenPlan: (plan: string | null) => void;
  setChosenPrice: (price: number) => void;
  setChosenCurrency: (currency: string) => void;
  chosenPlan: string | null;
  chosenCurrency: string;
  chosenPrice: number | null;
};

export function PaymentModal({
  updateModalState,
  chosenPlan,
  chosenCurrency,
  chosenPrice,
}: Props) {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [haveCoupon, setHaveCoupon] = useState<boolean>(false);
  const [isDiscount, setIsDiscount] = useState<boolean>(false);
  const router = useRouter();

  const plans = ["Lite", "Professional", "Business", "Enterprise"];

  //currencies list
  const currencies = ["USD", "NGN", "GHC", "ZAR", "KES"];

  //toggler functions
  const handlePlanToogle = () => {
    setIsMonthly(!isMonthly);
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    router.push("/payment");
  };

  if (!user) {
    router.push("/login");
  }

  console.log(user);

  return (
    <div className="w-full h-full fixed z-[100] inset-0 bg-black/50 overflow-y-auto ">
      <div className="w-full lg:w-[80%] box-animation h-fit flex flex-col lg:flex-row gap-y-3 rounded-lg  mx-auto justify-center absolute inset-0 px-3 sm:px-6 my-2 lg:my-auto">
        {/* left */}
        <div className="w-full bg-gray-200 px-[40px] lg:px-[80px] pb-[40px] lg:pb-[50px] pt-[50px]">
          <button className=" h-fit w-fit" onClick={() => updateModalState()}>
            <ArrowBackOutline size={22} />
          </button>

          {/* first section */}
          <div className="mt-4 border-b-[1px] border-gray-400 pb-8">
            <p className="text-xl font-medium">Selected Plan</p>
            <div className="mt-8 flex gap-x-1 items-center">
              <p className="text-2xl font-semibold ">{chosenPlan}</p>{" "}
              {isDiscount && (
                <p className="rounded-[37px] text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end uppercase text-[10px] py-1 px-[10px] ">
                  Discount
                </p>
              )}
            </div>

            <div className="mt-1 flex gap-x-2 items-center">
              {isDiscount && (
                <p className="line-through text-2xl font-normal ">
                  {convertCurrencyCodeToSymbol(chosenCurrency)}2000
                </p>
              )}
              <p className="text-2xl font-normal whitespace-nowrap ">
                {convertCurrencyCodeToSymbol(chosenCurrency)}{chosenPrice} per month
              </p>
            </div>

            <div className="mt-5">
              <p className="text-base font-medium">Plan Features</p>
              <ul className="mt-4  gap-y-2">
                <li className="flex gap-x-2 text-[14px] font-normal items-center ">
                  <PaymentTick /> Unlimited events
                </li>
                <li className="flex gap-x-2 text-[14px] font-normal items-center ">
                  <PaymentTick /> Multiple sponsors
                </li>
                <li className="flex gap-x-2 text-[14px] font-normal items-center ">
                  <PaymentTick /> Unlimited custom certificates
                </li>
              </ul>
              <p className="text-zikoroBlue flex gap-x-2 text-[14px] font-normal items-center mt-4">
                {" "}
                <PaymentPlus /> Show more features{" "}
              </p>
            </div>
          </div>

          {/* second section */}
          <div className="pt-8 text-base font-normal border-b-[1px] border-gray-400 pb-8">
            <p>Summary</p>
            <div>
              {/* Individual Product */}
              <div className="mt-5">
                <div className=" flex justify-between ">
                  <p className="text-xl font-medium">{chosenPlan}</p>
                  <p className="text-xl font-normal">
                    {convertCurrencyCodeToSymbol(chosenCurrency)}{chosenPrice}
                  </p>
                </div>
                <p className="text-base font-normal mt-2">
                  {convertCurrencyCodeToSymbol(chosenCurrency)}
                  {chosenPrice} per month x 12{" "}
                </p>
              </div>

              {/* Individual Product */}
              {/* <div className="mt-5">
                <div className=" flex justify-between ">
                  <p className="text-xl font-medium">Certificate</p>
                  <p className="text-xl font-normal">₦ 24000</p>
                </div>
                <p className="text-base font-normal mt-2">xx credits </p>
              </div> */}
            </div>
          </div>

          {/* footer */}
          <div className="py-3 px-2 flex items-center justify-between bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg mt-9">
            <p className="text-xl font-medium">Total Cost</p>
            <p className="text-xl font-normal">
              {convertCurrencyCodeToSymbol(chosenCurrency)}{chosenPrice}
            </p>
          </div>
        </div>

        {/* right */}

        <div className="w-full bg-white px-[40px] lg:pr-[100px] pb-[40px] lg:pb-[50px] pt-[60px] ">
          <p className=" whitespace-nowrap text-xl font-medium ">
            Personal Information
          </p>

          <form action="" className="mt-6">
            <input
              type="text"
              name="fullname"
              value={user?.firstName}
              className="px-4 py-[10px] text-base rounded-lg bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 outline-none w-full border-[1px] border-indigo-400"
              placeholder="Full Name"
            />

            <input
              type="email"
              name="email"
              value={user?.userEmail}
              className="mt-4 px-4 py-[10px] text-base rounded-lg bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 outline-none w-full border-[1px] border-indigo-400"
              placeholder="Full Name"
            />
            <input
              type="text"
              name="workspace"
              value={user?.organization}
              className=" mt-4 px-4 py-[10px] text-base rounded-lg bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 outline-none w-full border-[1px] border-indigo-400"
              placeholder="Workspace"
            />

            <select
              name="currency"
              id=""
              className="border-[1px] border-indigo-600 rounded-lg h-[45px] outline-none mt-10 px-3 w-full"
            >
              {plans.map((plan, index) => (
                <option value={plan} key={index}>
                  {plan}
                </option>
              ))}
            </select>

            {/* Currency section */}
            <div className=" mt-3 lg:mt-6 lg:px-0 mx-auto justify-between  flex flex-col gap-y-4 ">
              <select
                name="currency"
                id=""
                className="border-[1px] border-indigo-600 rounded-lg h-[45px] px-3 outline-none"
              >
                {currencies.map((currency, index) => (
                  <option value={currency} key={index}>
                    {currency}
                  </option>
                ))}
              </select>

              <div className="flex items-center  gap-x-3 mt-2 ">
                <p className="text-xl font-medium ">Monthly</p>
                <Switch
                  className="data-[state=checked]:bg-zikoroBlue"
                  checked={isMonthly}
                  onCheckedChange={(e) => handlePlanToogle()}
                />
                <p className="text-xl font-medium">Yearly</p>
              </div>
            </div>

            {/* Add Ons section */}
            <div className="mt-6 ">
              <p className="text-xl font-medium">Add-Ons</p>
              <div className="flex flex-row justify-between mt-4 ">
                <p className="texx-base font-normal">Certificate</p>
                <div className="flex items-center gap-x-2">
                  <MinusCircle size={24} fill="#EAEAEA" />
                  <p className="text-xl font-medium">0</p>
                  <PlusCircleFill size={24} fill="#001FCC" />
                </div>
              </div>

              <div className="flex flex-row justify-between mt-4 ">
                <p className="texx-base font-normal">Badges</p>
                <div className="flex items-center gap-x-2">
                  <MinusCircle size={24} fill="#EAEAEA" />
                  <p className="text-xl font-medium">0</p>
                  <PlusCircleFill size={24} fill="#001FCC" />
                </div>
              </div>
            </div>

            {!haveCoupon ? (
              <p
                className=" text-[14px] text-zikoroBlue cursor-pointer mt-7"
                onClick={() => setHaveCoupon(true)}
              >
                Have a discount code? click here to enter code{" "}
              </p>
            ) : (
              <div className="h-[50px] mt-5">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter a valid discount code"
                  className="h-full p-2 text-[12px] w-8/12 placeholder-gray-500 outline-none border-[1px] border-gray-200"
                />
                <button className="text-base text-white bg-zikoroBlue  h-full px-3 lg:px-8 w-4/12 ">
                  Redeem
                </button>
              </div>
            )}

            <button
              className="text-base mt-3 w-full text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end  rounded-lg py-3 font-medium"
              onClick={submitForm}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
