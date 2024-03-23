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
import { jobSchema } from "@/schemas";
import { useAddPartnerJob } from "@/hooks";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import {
  flexibiltiy,
  employemntType,
  duration,
  qualification,
  workExperience,
} from "@/constants";
import { useState } from "react";
import { TPartner } from "@/types";
import { cn } from "@/lib";

export function AddJob({
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
  const { loading, addPartnerJob } = useAddPartnerJob();
  const [currencyCode, setcurrencyCode] = useState("NGN");
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
  });

  async function onSubmit(values: z.infer<typeof jobSchema>) {
    const payload = {
      ...values,
      partnerId,
      currencyCode,
      companyName: partner ? partner?.companyName : "",
    };
    await addPartnerJob(partnerId, payload, partner);
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
          <h2 className="font-medium text-lg sm:text-xl">Add Job</h2>
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
              name="jobTitle"
              render={({ field }) => (
                <InputOffsetLabel label="Job Title">
                  <Input
                    type="text"
                    placeholder="Enter the Job Title"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <div className="w-full grid grid-cols-3 items-center gap-3">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem className="relative h-fit">
                    <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                      Min. Salary
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
                name="maxSalary"
                render={({ field }) => (
                  <FormItem className="relative h-fit">
                    <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                      Max. Salary
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
                name="salaryDuration"
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    placeHolder=""
                    label="SalaryDuration"
                    options={duration}
                  />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="flexibility"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Enter the Flexibility Type"
                  label="Flexibility"
                  options={flexibiltiy}
                />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <InputOffsetLabel label="Description">
                  <Textarea
                    placeholder="Enter the Description"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />
            <div className="grid grid-cols-2 w-full items-center gap-x-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <InputOffsetLabel label="City">
                    <Input
                      type="text"
                      placeholder="Enter the City"
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <InputOffsetLabel label="Country">
                    <Input
                      type="text"
                      placeholder="Enter the Country"
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Enter the Employment Type"
                  label="Employment Type"
                  options={employemntType}
                />
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Enter the Experience Level"
                  label="Experience Level"
                  options={workExperience}
                />
              )}
            />
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Enter the Qualification"
                  label="Qualification"
                  options={qualification}
                />
              )}
            />
            <FormField
              control={form.control}
              name="applicationLink"
              render={({ field }) => (
                <InputOffsetLabel label="Application Link">
                  <Input
                    type="text"
                    placeholder="Enter the Application Link"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Job</span>
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
