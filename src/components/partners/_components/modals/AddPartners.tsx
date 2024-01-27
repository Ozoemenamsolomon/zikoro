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
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { COUNTRY_CODE } from "@/utils";
import { partnerSchema } from "@/validations";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useEffect, useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { cn } from "@/lib";
import { AddIndustry } from "..";
import { IndustryType } from "@/types";

export function AddPartners({ close }: { close: () => void }) {
  const [active, setActive] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(
    null
  );
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+234");
  const [whatsappCountryCode, setWhatsAppCountryCode] =
    useState<string>("+234");
  const form = useForm<z.infer<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      industry: selectedIndustry?.name,
    },
  });

  useEffect(() => {
    if (selectedIndustry !== null) {
      form.setValue("industry", selectedIndustry.name);
    }
  }, [selectedIndustry]);
  // FN to select an industry
  function handleSelected(name: string, color: string) {
    setSelectedIndustry({ name, color });
  }

  async function onSubmit(values: z.infer<typeof partnerSchema>) {

    const payload: z.infer<typeof partnerSchema> = {
      ...values,
      whatsappNumber: whatsappCountryCode + values.whatsappNumber,
      phoneNumber: phoneCountryCode + values.phoneNumber,

    }
  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] overflow-y-auto pt-14  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className={cn(
          "w-[95%] sm:w-[500px] box-animation h-fit flex mb-10 flex-col gap-y-6 rounded-lg bg-white  mx-auto absolute inset-x-0 py-6 px-3 sm:px-4",
          active === 2 && "hidden"
        )}
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">Partners</h2>
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
              name="partnersType"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Enter the Employment Type"
                  label="Employment Type"
                  options={[
                    { label: "Sponsor", value: "Sponsor" },
                    { label: "Exhibitor", value: "Exhibitor" },
                  ]}
                />
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <InputOffsetLabel label="Company Name">
                  <Input
                    type="text"
                    placeholder="Enter the Company Name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <div className="w-full flex flex-col items-start justify-start gap-y-1">
                  <InputOffsetLabel label="Logo">
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="File"
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                    />
                  </InputOffsetLabel>

                  <p className="text-xs text-[#717171]">
                    Selected file should not be bigger than 5mb
                  </p>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <div className="w-full flex flex-col items-start justify-start gap-y-1">
                  <InputOffsetLabel label="Media">
                    <Input
                      type="file"
                      accept="video/*"
                      placeholder="File"
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                    />
                  </InputOffsetLabel>

                  <p className="text-xs text-[#717171]">
                    Selected file should notn be bigger than 5mb
                  </p>
                </div>
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
            <FormField
              control={form.control}
              name="boothStaff"
              render={({ field }) => (
                <InputOffsetLabel label="Booth Staff">
                  <Input
                    type="text"
                    placeholder="Enter the staff name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div className="w-full flex items-center gap-x-2">
              <FormField

              
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <InputOffsetLabel className="w-10/12" label="Industry">
                    <Input
                      type="text"
                      placeholder="Enter the staff name"
                      {...field}
                      readOnly
                      className=" w-full placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActive(2);
                }}
                className="hover:bg-zikoro  text-zikoro  rounded-md border border-zikoro hover:text-gray-50 gap-x-2 h-11 sm:h-12 font-medium"
              >
                <PlusCircle size={22} />
                <p>Industry</p>
              </Button>
            </div>
            <div className="w-full grid grid-cols-2 items-center gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <InputOffsetLabel label="City">
                    <Input
                      type="text"
                      placeholder="Enter City"
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
                  <InputOffsetLabel label={"Country"}>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border focus:border-gray-500 h-12">
                        <SelectValue
                          placeholder="Enter country"
                          className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {COUNTRY_CODE.map(({ name }) => (
                          <SelectItem value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InputOffsetLabel>
                )}
              />
            </div>

            <div className="w-full grid grid-cols-2 items-center gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="relative h-fit">
                    <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                      Phone number
                    </FormLabel>
                    <input
                      type="text"
                      className="!mt-0 text-sm absolute top-[35%]  left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                    />
                    <FormControl>
                      <Input
                        className="placeholder:text-sm h-12 placeholder:text-gray-200 text-gray-700 pl-12"
                        placeholder="Enter phone number"
                        {...field}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-[10px] px-1">
                      WhatsApp number
                    </FormLabel>
                    <input
                      type="text"
                      className="!mt-0 text-sm absolute top-[35%] left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                      value={whatsappCountryCode}
                      onChange={(e) => setWhatsAppCountryCode(e.target.value)}
                    />
                    <FormControl>
                      <Input
                        className="placeholder:text-sm h-12 placeholder:text-gray-200 text-gray-700 pl-12"
                        placeholder="Enter whatsapp number"
                        {...field}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <InputOffsetLabel label="Email">
                  <Input
                    type="text"
                    placeholder="Enter the Email Address"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <InputOffsetLabel label="Website">
                  <Input
                    type="text"
                    placeholder="Enter the Website"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <div className="w-full grid grid-cols-2 items-center gap-4">
              <FormField
                control={form.control}
                name="exhibitionHall"
                render={({ field }) => (
                  <InputOffsetLabel label="Exhibition Hall">
                    <Input
                      type="text"
                      placeholder="hall"
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="boothNumber"
                render={({ field }) => (
                  <InputOffsetLabel label="Booth Number">
                    <Input
                      type="text"
                      placeholder="Enter the booth number"
                      {...field}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>

            <Button
              disabled={false}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
            >
              {"" && <LoaderAlt size={22} className="animate-spin" />}
              <span>Save</span>
            </Button>
          </form>
        </Form>
      </div>
      {active === 2 && (
        <AddIndustry
          handleSelected={handleSelected}
          selectedIndustry={selectedIndustry}
          close={close}
          setActive={setActive}
        />
      )}
    </div>
  );
}
