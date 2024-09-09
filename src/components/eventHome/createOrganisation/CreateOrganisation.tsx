"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components";
import { useForm } from "react-hook-form";
import { ArrowBackOutline } from "styled-icons/evaicons-outline/";
import { ChevronDown } from "styled-icons/bootstrap";
import * as z from "zod";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "@/schemas";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Switch } from "@/components/ui/switch";
import { useCreateOrganisation, useGetUserOrganizations } from "@/hooks";
import { PaymentPlus, PaymentTick } from "@/constants";
import { useGetData } from "@/hooks/services/request";
import useUserStore from "@/store/globalUserStore";
import { useEffect, useState, useMemo } from "react";
import { Plus } from "styled-icons/bootstrap";
import { Minus } from "styled-icons/feather";
import { cn } from "@/lib";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { plansData } from "./_plansData";
import { generateAlias } from "@/utils";
const orgType = ["Private", "Business"];
const pricingPlan = ["Free", "Lite", "Professional", "Enterprise"];

type TPricingPlan = {
  amount: number | null;
  created_at: string;
  currency: string;
  id: number;
  monthPrice: number | null;
  plan: string | null;
  productType: string;
  yearPrice: number | null;
};

type TCurrencyConverter = {
  id: number;
  created_at: string;
  currency: string;
  amount: number;
};

type TZikoroDiscount = {
  id: number;
  created_at: string;
  discountCode: string;
  validUntil: string;
  discountAmount: number;
  discountPercentage: string;
};

const currencies = ["ZAR", "GHC", "NGN", "KES", "USD"];

function CurrencyDropDown({
  currencyCode,
  setcurrencyCode,
}: {
  currencyCode: string;
  setcurrencyCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setOpen] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen((prev) => !prev);
      }}
      className=" text-mobile relative sm:text-desktop"
    >
      <div className="flex items-center gap-x-1 p-2 rounded-sm  border">
        <p>{currencyCode}</p>

        <ChevronDown size={16} />
      </div>
      <div className="absolute left-0 top-10 w-full">
        {isOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(false);
            }}
            className="w-full z-[400] h-full fixed inset-0"
          ></button>
        )}
        {isOpen && (
          <ul className="relative shadow z-[600] w-[80px] bg-white py-2 rounded-md">
            {currencies.map((item, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setcurrencyCode(item);
                  setOpen(false);
                }}
                className={cn(
                  "py-2 px-1",
                  currencyCode === item && "bg-[#001fcc]/10"
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </button>
  );
}

export function CreateOrganization({
  close,
  refetch,
}: {
  refetch?: () => Promise<any>;
  close: () => void;
}) {
  const { data: pricing } = useGetData<TPricingPlan[]>("/pricing");
  const { data: zikoroDiscounts } =
    useGetData<TZikoroDiscount[]>("/pricing/discount");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [code, setCode] = useState("");
  const { data: currencyConverter } =
    useGetData<TCurrencyConverter[]>(`/pricing/currency`);
  const { user } = useUserStore();
  const router = useRouter();
  const [isMonthly, setIsMonthly] = useState(true);
  const [discount, setDiscount] = useState<TZikoroDiscount | null>(null);
  const { organisation, loading } = useCreateOrganisation();
  const [selectedPricing, setSelectedPricing] = useState<TPricingPlan | null>(
    null
  );
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationAlias: generateAlias(),
    },
  });
  const [isDiscount, setIsDiscount] = useState(false);

  useEffect(() => {
    if (user) {
      form.setValue("userEmail", user.userEmail);
      form.setValue("lastName", user.lastName);
      form.setValue("firstName", user.firstName);
    }
  }, [user]);

  const watchedSubSelection = form.watch("subscriptionPlan");
  useEffect(() => {
    if (pricing && watchedSubSelection) {
      const chosenPlan = pricing?.find(
        ({ plan }) => plan === watchedSubSelection
      );
      setSelectedPricing(chosenPlan || null);
    }
  }, [pricing, watchedSubSelection]);

  const subPlanPrice = useMemo(() => {
    if (selectedPricing && currencyConverter) {
      const amount = currencyConverter?.find(
        (v) => v?.currency === selectedCurrency
      )?.amount;
      return isMonthly
        ? Number(selectedPricing?.monthPrice || 0) * (amount || 0)
        : Number(selectedPricing?.yearPrice || 0) * (amount || 0) * 12;
    } else {
      return 0;
    }
  }, [selectedPricing, isMonthly, currencyConverter, selectedCurrency]);

  const total = useMemo(() => {
    if (subPlanPrice) {
      return isDiscount
        ? subPlanPrice -
            ((Number(discount?.discountPercentage) || 0) / 100) * subPlanPrice
        : subPlanPrice;
    } else {
      return 0;
    }
  }, [subPlanPrice, discount]);

  const appliedDiscount = useMemo(() => {
    if (discount) {
      return ((Number(discount?.discountPercentage) || 0) / 100) * subPlanPrice;
    } else return 0;
  }, [subPlanPrice, discount]);

  async function onSubmit(values: z.infer<typeof organizationSchema>) {
    if (values.subscriptionPlan === "Free") {
      await organisation(values);
      if (refetch) refetch();
      close();
    } else {
      const data = {
        paymentReference: "",
        email: values?.userEmail,
        total: total,
        currency: selectedCurrency,
        discount: appliedDiscount,
        discountCode: discount?.discountCode || "",
        organizationAlias: values?.organizationAlias,
        redirectUrl: window.location.href,
        isMonthly: isMonthly,
        plan: values?.subscriptionPlan,
        organizationName: values?.organizationName,
        organizationType: values?.organizationType,
        subscriptionPlan: values?.subscriptionPlan,
      };
      const url = `/payment/create?data=${encodeURIComponent(
        JSON.stringify(data)
      )}`;

      router.push(url);
    }
  }

  function applyDiscount() {
    if (!zikoroDiscounts) return;

    const percent = zikoroDiscounts?.find((v) => v?.discountCode === code);
    if (percent) {
      if (percent.validUntil && new Date(percent.validUntil) < new Date()) {
        toast.error("Oops! Discount code has expired. Try another one");
        return;
      }
      setDiscount(percent);
      toast.success("Greate move!. Discount has been applied");
      setIsDiscount(true);
      return;
    } else {
      setDiscount(null);
      toast.error("Oops! Discount code is incorrect. Try again");
      return;
    }
  }

  const selectedPlandData = useMemo(() => {
    if (selectedPricing) {
      const data = plansData.find(
        (i) => i.plan === selectedPricing?.plan
      )?.data;

      return data;
    } else {
      const data = plansData.find((i) => i.plan === "Free")?.data;
      return data;
    }
  }, [selectedPricing]);

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed  overflow-y-auto no-scrollbar z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] max-w-5xl grid grid-cols-1 md:grid-cols-9 box-animation h-fit  bg-white mx-auto my-12  md:my-auto absolute inset-x-0 md:inset-y-0 "
      >
        <div className="w-full grid grid-cols-1 items-start justify-start bg-[#001fcc]/10 py-8 sm:py-10 px-4 sm:px-8 lg:px-10 md:col-span-4">
          <Button onClick={close} className="w-fit h-fit px-0">
            <ArrowBackOutline size={22} />
          </Button>

          <div className="w-full flex items-center mb-3 gap-x-2">
            <h2 className="font-medium text-base sm:text-xl ">Selected Plan</h2>
            <CurrencyDropDown
              currencyCode={selectedCurrency}
              setcurrencyCode={setSelectedCurrency}
            />
          </div>
          <div className="flex items-center flex-row gap-x-3 ">
            <p className="text-mobile sm:text-desktop font-medium ">Monthly</p>
            <Switch
              className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-zikoroBlue"
              checked={!isMonthly}
              onClick={() => setIsMonthly((monthly) => !monthly)}
            />
            <p className="text-mobile sm:text-desktop font-medium">Yearly</p>

            {isMonthly && (
              <div className="relative text-[11px] lg:text-[14px] bg-zikoroBlue py-2 px-2 lg:px-2 text-white ml-2">
                save up to 15%
                <div className="absolute left-0 top-0 bottom-0 w-[16px] bg-zikoroBlue transform -translate-x-full clip-triangle"></div>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col  items-start justify-start gap-y-3">
            <div className="w-full space-y-1">
              <div className="gap-x-2 flex items-center">
                <h1 className="font-bold text-lg capitalize sm:text-2xl">
                  {selectedPricing ? selectedPricing?.plan : "Free"}
                </h1>
                {discount && (
                  <p className="bg-basePrimary flex text-white rounded-3xl text-sm h-6  items-center justify-center px-4">
                    Discount
                  </p>
                )}
              </div>
              <div className="flex items-center gap-x-2">
                {discount && (
                  <p className="text-sm text-zinc-600 line-through sm:text-lg">
                    {subPlanPrice.toLocaleString()}
                  </p>
                )}

                <p className="text-sm sm:text-lg">
                  {selectedPricing
                    ? `${selectedCurrency}${
                        isMonthly
                          ? total?.toLocaleString()
                          : (total / 12).toLocaleString()
                      }`
                    : `${selectedCurrency}0`}{" "}
                  per month
                </p>
              </div>
            </div>

            <div className="w-full pb-3 flex items-start justify-start  flex-col gap-y-1">
              <p className="font-medium mb-2">Plan Features</p>

              {selectedPlandData?.map((value, index) => (
                <div
                  key={index}
                  className="w-full text-mobile sm:text-sm gap-x-2 flex items-center"
                >
                  <PaymentTick />
                  <p>{value}</p>
                </div>
              ))}

              <div className="w-full text-mobile  sm:text-sm gap-x-3 flex items-center">
                <PaymentPlus />
                <p>Show more features</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-start gap-y-2 justify-start border-y border-gray-200 py-6">
            <p className="font-medium text-gray-500">Summary</p>
            <div className="w-full flex items-start justify-start gap-y-1 flex-col">
              <div className="w-full flex items-center justify-between">
                <p className="font-medium text-base sm:text-xl">
                  {selectedPricing ? selectedPricing?.plan : "Free"}
                </p>
                <p className="font-medium text-base sm:text-xl">
                  {selectedPricing
                    ? `${selectedCurrency}${total?.toLocaleString()}`
                    : `${selectedCurrency}0`}
                </p>
              </div>
              <p className="text-xs sm:text-mobile">
                {selectedPricing
                  ? `${selectedCurrency}${
                      isMonthly
                        ? total?.toLocaleString()
                        : (total / 12).toLocaleString()
                    }`
                  : `${selectedCurrency}0`}{" "}
                per {isMonthly ? "month" : "month x 12"}
              </p>
            </div>
          </div>
          {/**btn */}
          <div className="py-3 px-2 flex items-center w-full justify-between bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg ">
            <p className="text-xl font-medium">Total Cost</p>
            <p className="text-xl font-medium">
              {selectedPricing
                ? `${selectedCurrency}${total?.toLocaleString()}`
                : `${selectedCurrency}0`}
            </p>
          </div>
        </div>
        {/** personal info */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:col-span-5 grid grid-cols-1 py-8 sm:py-10 px-4 sm:px-8 lg:px-10 bg-white"
          >
            <h2 className="text-base sm:text-xl font-semibold">
              Personal Information
            </h2>

            <div className="w-full flex py-4 flex-col gap-y-3 items-start justify-start">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <InputOffsetLabel label="First Name">
                    <Input
                      type="text"
                      placeholder="Enter First Name"
                      {...field}
                      readOnly
                      className="h-11 placeholder:text-sm placeholder:text-zinc-500 text-zinv-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <InputOffsetLabel label="Last Name">
                  <Input
                    type="text"
                    placeholder="Enter Last Name"
                    {...field}
                    readOnly
                    className="h-11 placeholder:text-sm placeholder:text-zinc-500 text-zinv-700"
                  />
                </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                 <InputOffsetLabel label="Email Address">
                  <Input
                        type="text"
                        placeholder="Enter Email Address"
                        {...field}
                        readOnly
                        className="placeholder:text-sm h-11  text-zinv-700"
                      />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
               <InputOffsetLabel label="Workspace Name">
                 <Input
                        type="text"
                        placeholder="Enter Workspace Name"
                        {...field}
                        className="placeholder:text-sm h-11  text-zinv-700"
                      />
               </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <InputOffsetLabel label="Workspace Type">
                     <ReactSelect
                        {...form.register("organizationType")}
                        options={orgType.map((value) => {
                          return { value, label: value };
                        })}
                        borderColor="#001fcc"
                        bgColor="#001fcc1a"
                        height="2.5rem"
                        placeHolderColor="#64748b"
                        placeHolder="Select Workspace"
                      />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                 <InputOffsetLabel label="Subscription Plan">
                  <ReactSelect
                        {...form.register("subscriptionPlan")}
                        options={pricingPlan.map((value) => {
                          return { value, label: value };
                        })}
                        placeHolder="Select Subscription Plan"
                        borderColor="#001fcc"
                        bgColor="#001fcc1a"
                        height="2.5rem"
                        placeHolderColor="#64748b"
                      />
                 </InputOffsetLabel>
                )}
              />
            </div>

            <div className="w-full hidden flex-col items-start justify-start gap-y-2">
              <h2 className="font-semibold text-base sm:text-xl mb-2">
                Add-Ons
              </h2>

              <div className="w-full grid grid-cols-5">
                <p className="col-span-2">Certificate</p>
                <div className="col-span-3 flex items-center gap-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-gray-200"
                  >
                    <Minus size={15} />
                  </button>
                  <p className="font-medium text-mobile sm:text-sm">0</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-basePrimary text-white"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <div className="w-full grid grid-cols-5">
                <p className="col-span-2">Badges</p>
                <div className="col-span-3 flex items-center gap-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-gray-200"
                  >
                    <Minus size={15} />
                  </button>
                  <p className="font-medium text-mobile sm:text-sm">0</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-basePrimary text-white"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full pt-4 flex flex-col items-start justify-start gap-y-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDiscount(true);
                }}
                className={cn(
                  "text-xs sm:text-mobile text-basePrimary",
                  isDiscount && "hidden"
                )}
              >
                Have a discount code? Click here to enter the code.
              </button>
              <div
                className={cn(
                  "w-full flex items-center ",
                  !isDiscount && "hidden"
                )}
              >
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter a valid discount code"
                  className="bg-transparent h-10 rounded-l-md px-3 outline-none placeholder:text-gray-300 border border-gray-300 w-[75%]"
                />
                <Button
                  disabled={code === ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    applyDiscount();
                  }}
                  className="h-10 text-white rounded-r-md rounded-l-none bg-gray-500 font-medium px-0 w-[25%]"
                >
                  {"" ? "Verifying..." : "Redeem"}
                </Button>
              </div>

              <Button className="w-full h-12 gap-x-2 bg-basePrimary text-white font-medium">
                {loading && <LoaderAlt size={20} className="animate-spin" />}
                <p>Create</p>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
