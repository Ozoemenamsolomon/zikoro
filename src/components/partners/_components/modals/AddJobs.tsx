"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  Textarea,
} from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "styled-icons/bootstrap";
import { jobSchema } from "@/schemas";
import { useUpdatePartnersOpportunities } from "@/hooks";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  flexibiltiy,
  employemntType,
  duration,
  qualification,
  workExperience,
} from "@/constants";
import { useEffect, useState } from "react";
import { PartnerJobType } from "@/types";
import { cn } from "@/lib";
import { generateAlias } from "@/utils";

export function AddJob({
  close,
  partnerId,
  refetch,
  jobs,
  companyName,
}: {
  partnerId: string;
  refetch: () => Promise<null | undefined>;
  close: () => void;
  jobs?: PartnerJobType;
  companyName: string;
}) {
  const [currencyCode, setcurrencyCode] = useState(jobs?.currencyCode || "NGN");
  const { update } = useUpdatePartnersOpportunities<PartnerJobType>();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
  });

  // console.log("partnerId", partnerId);

  async function onSubmit(values: z.infer<typeof jobSchema>) {
    setLoading(true);
    // maually checking
    if (values.applicationMode === "url" && !values.applicationLink) {
      form.setError("applicationLink", {
        type: "manual",
        message: "Please Provide a Url",
      });

      return; /// stop submission
    }
    if (values.applicationMode === "whatsapp" && !values.whatsApp) {
      form.setError("whatsApp", {
        type: "manual",
        message: "Please Provide a whatsApp Number",
      });

      return; /// stop submission
    }
    if (values.applicationMode === "email" && !values.email) {
      form.setError("email", {
        type: "manual",
        message: "Please Provide an Email Address",
      });

      return; /// stop submission
    }

    const id = generateAlias();
    const payload: Partial<PartnerJobType> = jobs?.id
      ? {
          ...jobs,
          ...values,
          currencyCode,
          companyName,
          partnerId,
        }
      : {
          ...values,
          id,
          partnerId,
          currencyCode,
          companyName,
        
        };
    await update(payload, "job");
    setLoading(false);
    refetch();
    close();
  }

  useEffect(() => {
    if (jobs) {
      form.reset({
        jobTitle: jobs?.jobTitle,
        employmentType: jobs?.employmentType,
        qualification: jobs?.qualification,
        applicationMode: jobs?.applicationMode as any,
        applicationLink: jobs?.applicationLink,
        whatsApp: jobs?.whatsApp,
        email: jobs?.email,
        description: jobs?.description,
        minSalary: jobs?.minSalary,
        maxSalary: jobs?.maxSalary,
        salaryDuration: jobs?.salaryDuration,
        flexibility: jobs?.flexibility,
        country: jobs?.country,
        city: jobs?.city,
        experienceLevel: jobs?.experienceLevel,
      });
    }
  }, [jobs]);
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[999999]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] max-w-xl box-animation h-[90vh] overflow-auto flex flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4"
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
                    className=" placeholder:text-sm h-11 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <div className="w-full grid grid-cols-3 items-center gap-3">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <InputOffsetLabel label="Min. Salary">
                    <div className="w-full relative h-11">
                      <CurrencyDropDown
                        currencyCode={currencyCode}
                        setcurrencyCode={setcurrencyCode}
                      />

                      <Input
                        className="h-11 placeholder:text-sm  text-gray-700 pl-16"
                        placeholder="min"
                        {...field}
                        type="number"
                      />
                    </div>
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="maxSalary"
                render={({ field }) => (
                  <InputOffsetLabel label="Max. Salary">
                    <div className="w-full relative h-11">
                      <CurrencyDropDown
                        currencyCode={currencyCode}
                        setcurrencyCode={setcurrencyCode}
                      />

                      <Input
                        className="h-11 placeholder:text-sm  text-gray-700 pl-16"
                        placeholder="max"
                        {...field}
                        type="number"
                      />
                    </div>
                  </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="salaryDuration"
                render={({ field }) => (
                  <InputOffsetLabel label="Salary Duration">
                    <ReactSelect
                      {...field}
                      defaultValue={
                        jobs
                          ? {
                              value: jobs?.salaryDuration,
                              label: jobs?.salaryDuration,
                            }
                          : ""
                      }
                      placeHolder="Select Duration"
                      label="SalaryDuration"
                      options={duration}
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="flexibility"
              render={({ field }) => (
                <InputOffsetLabel label="Flexibility">
                  <ReactSelect
                    {...field}
                    defaultValue={
                      jobs
                        ? {
                            value: jobs?.flexibility,
                            label: jobs?.flexibility,
                          }
                        : ""
                    }
                    placeHolder="Select the Flexibility Type"
                    label="Flexibility"
                    options={flexibiltiy}
                  />
                </InputOffsetLabel>
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
                    className=" placeholder:text-sm h-12  placeholder:text-gray-400 text-gray-700"
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
                      className=" placeholder:text-sm h-11 text-gray-700"
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
                      className=" placeholder:text-sm h-11 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <InputOffsetLabel label="Employment Type">
                  <ReactSelect
                    {...field}
                    defaultValue={
                      jobs
                        ? {
                            value: jobs?.employmentType?.toLowerCase(),
                            label: jobs?.employmentType,
                          }
                        : ""
                    }
                    placeHolder="Enter the Employment Type"
                    label="Employment Type"
                    options={employemntType}
                  />
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <InputOffsetLabel label="Experience Level">
                  <ReactSelect
                    {...field}
                    defaultValue={
                      jobs
                        ? {
                            value: jobs?.experienceLevel,
                            label: jobs?.experienceLevel,
                          }
                        : ""
                    }
                    placeHolder="Enter the Experience Level"
                    label="Experience Level"
                    options={workExperience}
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <InputOffsetLabel label="Qualification">
                  <ReactSelect
                    {...field}
                    defaultValue={
                      jobs
                        ? {
                            value: jobs?.qualification,
                            label: jobs?.qualification,
                          }
                        : ""
                    }
                    placeHolder="Enter the Qualification"
                    label="Qualification"
                    options={qualification}
                  />
                </InputOffsetLabel>
              )}
            />

            <div className="w-full flex text-mobile sm:text-sm flex-col items-start justify-start gap-y-2">
              <p className="mb-4">
                How do you want applicants to apply for this job?
              </p>

              <div className="flex items-center gap-x-4">
                {["whatsapp", "email", "url"].map((value) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="applicationMode"
                    render={({ field }) => (
                      <label className="flex items-center">
                        <input
                          type="radio"
                          {...field}
                          defaultChecked={jobs?.applicationMode === value}
                          value={value}
                          className="accent-basePrimary h-[20px] pt-3 w-[20px] mr-4"
                        />
                        <span className="capitalize">{value}</span>
                      </label>
                    )}
                  />
                ))}
              </div>

              {form.watch("applicationMode") === "url" && (
                <FormField
                  control={form.control}
                  name="applicationLink"
                  render={({ field }) => (
                    <InputOffsetLabel label="URL">
                      <Input
                        placeholder="Enter Product Url"
                        {...field}
                        className="placeholder:text-sm h-11 w-full text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />
              )}
              {form.watch("applicationMode") === "whatsapp" && (
                <FormField
                  control={form.control}
                  name="whatsApp"
                  render={({ field }) => (
                    <InputOffsetLabel label="whatsApp">
                      <Input
                        placeholder="Enter Whatsapp Number"
                        type="tel"
                        {...field}
                        className="placeholder:text-sm h-11 w-full  text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />
              )}
              {form.watch("applicationMode") === "email" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputOffsetLabel label="Email Address">
                      <Input
                        placeholder="Enter Email Address"
                        type="email"
                        {...field}
                        className="placeholder:text-sm h-11 w-full  text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />
              )}
            </div>
            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
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
      className="absolute left-2 top-[0.7rem] bg-transparent text-mobile flex items-center gap-x-1"
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
