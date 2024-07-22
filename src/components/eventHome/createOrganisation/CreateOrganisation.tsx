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
import * as z from "zod";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "@/schemas";
import { Switch } from "@/components/ui/switch";
import { useCreateOrganisation, useGetUserOrganizations } from "@/hooks";
import { PaymentPlus, PaymentTick } from "@/constants";
import { useGetData } from "@/hooks/services/request";
import useUserStore from "@/store/globalUserStore";
import { useEffect, useState } from "react";
import { Plus } from "styled-icons/bootstrap";
import { Minus } from "styled-icons/feather";
import { cn } from "@/lib";
import { useRouter } from "next/navigation";

const orgType = ["Private", "Business"];
const pricingPlan = ["Free", "Lite", "Professional", "Enterprise"];

type TPricingPlan = {
  amount: number | null;
  created_at: string;
  currency: string;
  id: number;
  monthPrice: string | null;
  plan: string | null;
  productType: string;
  yearPrice: string | null;
};
export function CreateOrganization({
  close,
  refetch,
}: {
  refetch?: () => Promise<any>;
  close: () => void;
}) {
  const { data: pricing } = useGetData<TPricingPlan[]>("/pricing");
  const { user } = useUserStore();
  const router = useRouter()
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedPricing, setSelectedPricing] = useState<TPricingPlan | null>(
    null
  );
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
  });
  const [isDiscount, setDiscount] = useState(false);
  async function onSubmit(values: z.infer<typeof organizationSchema>) {
    // getOrganizations();
    // if (refetch) refetch();
    // close();

    const url = `/payment?name=${encodeURIComponent(
      values?.firstName || ""
    )}&id=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(
      values?.userEmail || ""
    )}&plan=${encodeURIComponent(
      selectedPricing?.plan || "Free"
    )}&isMonthly=${encodeURIComponent(isMonthly)}&total=${encodeURIComponent(
      isMonthly
        ? selectedPricing?.monthPrice || 0
        : selectedPricing?.yearPrice || 0
    )}&currency=${encodeURIComponent(
      "NGN"
    )}&organizationName=${encodeURIComponent(
      values.organizationName
    )}&organizationType=${encodeURIComponent(
      values.organizationType
    )}&subscriptionPlan=${encodeURIComponent(
      values.subscriptionPlan
    )}&redirectUrl=${encodeURIComponent(window.location.href)}&isCreate=${encodeURIComponent(true)}`;

    router.push(url);
  }

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

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] max-w-5xl grid grid-cols-1 md:grid-cols-9 box-animation h-fit  bg-white m-auto absolute inset-0 "
      >
        <div className="w-full grid grid-cols-1 items-start justify-start bg-[#001fcc]/10 py-8 sm:py-10 px-4 sm:px-8 lg:px-10 md:col-span-4">
          <Button className="w-fit h-fit px-0">
            <ArrowBackOutline size={22} />
          </Button>

          <h2 className="font-medium text-base sm:text-xl mb-3">
            Selected Plan
          </h2>
          <div className="flex items-center flex-row g gap-x-3 ">
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
                <p className="bg-basePrimary hidden text-white rounded-3xl text-sm h-6  items-center justify-center px-4">
                  Discount
                </p>
              </div>
              <p className="text-sm sm:text-lg">
                {selectedPricing
                  ? `₦${Number(
                      isMonthly
                        ? selectedPricing?.monthPrice
                        : selectedPricing?.yearPrice
                    ).toLocaleString()}`
                  : `₦0`}{" "}
                per {isMonthly ? "month" : "year"}
              </p>
            </div>

            <div className="w-full pb-3 flex items-start justify-start  flex-col gap-y-1">
              <p className="font-medium mb-2">Plan Features</p>

              <div className="w-full text-mobile sm:text-sm gap-x-2 flex items-center">
                <PaymentTick />
                <p>Unlimited events</p>
              </div>
              <div className="w-full text-mobile  sm:text-sm gap-x-2 flex items-center">
                <PaymentTick />
                <p>Multiple sponsors</p>
              </div>
              <div className="w-full text-mobile  sm:text-sm gap-x-2 flex items-center">
                <PaymentTick />
                <p>Unlimited custom certificates</p>
              </div>
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
                    ? `₦${Number(
                        isMonthly
                          ? selectedPricing?.monthPrice
                          : selectedPricing?.yearPrice
                      ).toLocaleString()}`
                    : `₦0`}
                </p>
              </div>
              <p className="text-xs sm:text-mobile">
                {selectedPricing
                  ? `₦${Number(
                      isMonthly
                        ? selectedPricing?.monthPrice
                        : selectedPricing?.yearPrice
                    ).toLocaleString()}`
                  : `₦0`}{" "}
                per {isMonthly ? "month" : "year"}
              </p>
            </div>
          </div>
          {/**btn */}
          <div className="py-3 px-2 flex items-center w-full justify-between bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg ">
            <p className="text-xl font-medium">Total Cost</p>
            <p className="text-xl font-medium">
              {selectedPricing
                ? `₦${Number(
                    isMonthly
                      ? selectedPricing?.monthPrice
                      : selectedPricing?.yearPrice
                  ).toLocaleString()}`
                : `₦0`}
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
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter First Name"
                        {...field}
                        readOnly
                        className="placeholder:text-sm h-10 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinv-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Last Name"
                        {...field}
                        readOnly
                        className="placeholder:text-sm h-10 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinv-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Email Address"
                        {...field}
                        readOnly
                        className="placeholder:text-sm h-10 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinv-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Workspace Name"
                        {...field}
                        className="placeholder:text-sm h-10  border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinv-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex flex-col items-start justify-start gap-y-2">
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
                  setDiscount(true);
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
                  //value={code}
                  // onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter a valid discount code"
                  className="bg-transparent h-10 rounded-l-md px-3 outline-none placeholder:text-gray-300 border border-gray-300 w-[75%]"
                />
                <Button
                  // disabled={code === ""}
                  //onClick={redeem}
                  className="h-10 text-white rounded-r-md rounded-l-none bg-gray-500 font-medium px-0 w-[25%]"
                >
                  {"" ? "Verifying..." : "Redeem"}
                </Button>
              </div>

              <Button className="w-full h-11 bg-basePrimary text-white font-medium">
                <p>Continue</p>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

/**
  <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">
            Create a Workspace
          </h2>
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <InputOffsetLabel label="Name">
                  <Input
                    type="text"
                    placeholder="Enter Workspace Name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="organizationType"
              render={({ field }) => (
                <ReactSelect
                  {...form.register("organizationType")}
                  label="Workspace Type"
                  options={orgType.map((value) => {
                    return { value, label: value };
                  })}
                  placeHolder="Select Workspace"
                />
              )}
            />
            <FormField
              control={form.control}
              name="subscriptionPlan"
              render={({ field }) => (
                <ReactSelect
                  {...form.register("subscriptionPlan")}
                  label="Pricing Plan"
                  options={pricingPlan.map((value) => {
                    return { value, label: value };
                  })}
                  placeHolder="Select Subscription Plan"
                />
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Workspace</span>
            </Button>
          </form>
        </Form>
 */
