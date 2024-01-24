"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  Input,
  InputOffsetLabel,
  Button,
  FormControl,
  FormItem,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  FormLabel,
  FormMessage,
} from "@/components";
import { registrationSchema } from "@/validations";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Eye } from "@styled-icons/feather/Eye";
import { EyeOff } from "@styled-icons/feather/EyeOff";
import { COUNTRY_CODE } from "@/utils";
import { useRegister } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+234");
  const [whatsappCountryCode, setWhatsAppCountryCode] =
    useState<string>("+234");
  const { loading, registration } = useRegister();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
  });

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    const payload: z.infer<typeof registrationSchema> = {
      ...values,
      whatsappNumber: whatsappCountryCode + values.whatsappNumber,
      phoneNumber: phoneCountryCode + values.phoneNumber,
    };
    await registration(payload);
  }

  return (
    <>
      <h2 className="font-medium text-lg sm:text-xl mb-6">Create an account</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start w-full flex-col gap-y-3"
        >
          <div className="w-full grid grid-cols-2 items-center gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <InputOffsetLabel label="First Name">
                  <Input
                    type="text"
                    placeholder="Enter first name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
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
                    placeholder="Enter last name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <InputOffsetLabel label="Email">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                />
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <InputOffsetLabel label="Password">
                <div className="relative h-12 w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-3 inset-y-1/4"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </InputOffsetLabel>
            )}
          />
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
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-12"
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
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-12"
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

          <div className="flex items-center flex-wrap gap-x-2 text-[11px] sm:text-[13px] leading-5 w-full">
            {` By clicking on 'create account', you agree to`}{" "}
            <span className="text-zikoro underline">{`Zikoro's Privacy Policy`}</span>{" "}
            and <span className="text-zikoro underline">Terms of Use.</span>
          </div>

          <Button
            disabled={loading}
            className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <span>Sigup</span>
          </Button>

          <div className="w-full flex items-center gap-x-1 justify-center">
            <p>Already have an account?</p>
            <Link href="/login" className="text-zikoro font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
}
