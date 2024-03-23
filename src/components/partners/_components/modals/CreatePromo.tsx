"use client";

import {
  Form,
  FormField,
  Input,
  InputOffsetLabel,
  Button,
  ReactSelect,
  Textarea,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "@styled-icons/bootstrap/ChevronDown";
import { offerCreationSchema } from "@/schemas";
import { useAddPartnerPromo } from "@/hooks";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useState } from "react";
import { TPartner } from "@/types";
import { cn } from "@/lib";

export function CreatePromo({
  close,
  partnerId,
  refetch,
  partner,
}: {
  partnerId: string;
  partner: TPartner | null;
  refetch: () => Promise<null | undefined>;
  close: () => void;
}) {
  const { loading, addPromo } = useAddPartnerPromo();
  const [currencyCode, setcurrencyCode] = useState("NGN");
  const form = useForm<z.infer<typeof offerCreationSchema>>({
    resolver: zodResolver(offerCreationSchema),
  });

  async function onSubmit(values: z.infer<typeof offerCreationSchema>) {
    // maually checking
    if (values.redeem === "url" && !values.url) {
      form.setError("url", {
        type: "manual",
        message: "Please Provide a Url",
      });

      return; /// stop submission
    }
    if (values.redeem === "whatsapp" && !values.whatsApp) {
      form.setError("whatsApp", {
        type: "manual",
        message: "Please Provide a whatsApp Number",
      });

      return; /// stop submission
    }
    if (values.redeem === "email" && !values.email) {
      form.setError("email", {
        type: "manual",
        message: "Please Provide an Email Address",
      });

      return; /// stop submission
    }
    const payload = {
      ...values,
      partnerId,
      currencyCode,
      companyName: partner ? partner?.companyName : "",
    };
    await addPromo(partnerId, payload, partner);
    refetch();
    close();
  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[999999]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-[90vh] overflow-auto flex flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">Create Promo</h2>
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <div className="w-full flex flex-col items-start justify-start gap-y-1">
              <InputOffsetLabel label="Product/Service Image">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="File"
                  {...form.register("productImage")}
                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                />
              </InputOffsetLabel>
            </div>
            <FormField
              control={form.control}
              name="serviceTitle"
              render={({ field }) => (
                <InputOffsetLabel label="Product/Service Title">
                  <Input
                    type="text"
                    placeholder="Enter the Product Title"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <InputOffsetLabel label="Promo End Date">
                  <Input
                    type="date"
                    placeholder="Enter the Job Title"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem className="relative w-full h-fit">
                  <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                    Product Price
                  </FormLabel>
                  <CurrencyDropDown
                    currencyCode={currencyCode}
                    setcurrencyCode={setcurrencyCode}
                  />
                  <FormControl>
                    <Input
                      className="h-12 placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-16"
                      placeholder="min"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productPromo"
              render={({ field }) => (
                <FormItem className="relative w-full h-fit">
                  <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                    Product Promo
                  </FormLabel>
                  <CurrencyDropDown
                    currencyCode={currencyCode}
                    setcurrencyCode={setcurrencyCode}
                  />
                  <FormControl>
                    <Input
                      className="h-12 placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-16"
                      placeholder="max"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offerDetails"
              render={({ field }) => (
                <InputOffsetLabel label="Offer Details">
                  <Textarea
                    placeholder="Enter the Description"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="voucherCode"
              render={({ field }) => (
                <InputOffsetLabel label="Voucher Code">
                  <Input
                    type="text"
                    placeholder="Enter the Application Link"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div className="w-full flex flex-col items-start justify-start gap-y-2">
              <p className="mb-4">How do you want to redeem this offer?</p>

              <div className="flex items-center gap-x-4">
                {["whatsapp", "email", "url"].map((value) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="redeem"
                    render={({ field }) => (
                      <label className="flex items-center">
                        <input
                          type="radio"
                          {...field}
                          value={value}
                          className="h-[20px] pt-3 w-[20px] mr-4"
                        />
                        <span className="capitalize">{value}</span>
                      </label>
                    )}
                  />
                ))}
              </div>
            </div>

            {form.watch("redeem") === "url" && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <InputOffsetLabel label="URL">
                    <Input
                      placeholder="Enter Product Url"
                      {...field}
                      className="placeholder:text-sm h-12 w-full focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            )}
            {form.watch("redeem") === "whatsapp" && (
              <FormField
                control={form.control}
                name="whatsApp"
                render={({ field }) => (
                  <InputOffsetLabel label="whatsApp">
                    <Input
                      placeholder="Enter Whatsapp Number"
                      type="tel"
                      {...field}
                      className="placeholder:text-sm h-12 w-full focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            )}
            {form.watch("redeem") === "email" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <InputOffsetLabel label="Email Address">
                    <Input
                      placeholder="Enter Email Address"
                      type="email"
                      {...field}
                      className="placeholder:text-sm h-12 w-full focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            )}
            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Promo</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function CurrencyDropDown({
  currencyCode,
  setcurrencyCode,
}: {
  currencyCode: string;
  setcurrencyCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const currency = ["USD", "GHC", "NGN"];
  const [isOpen, setOpen] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen((prev) => !prev);
      }}
      className="absolute left-2 top-[0.8rem] text-mobile flex items-center gap-x-1"
    >
      <p>{currencyCode}</p>

      <ChevronDown size={16} />
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
            {currency.map((item, index) => (
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
                  currencyCode === item && "bg-gray-100"
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
