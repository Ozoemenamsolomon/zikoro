"use client";
import { Download } from "@styled-icons/bootstrap/Download";
import { addContact } from "@/app/server-actions/addContact";
import { useEffect, useState, useMemo } from "react";
import { COUNTRY_CODE } from "@/utils";
import { ContentTopNav } from "@/components/content/topNav";
import { SideBarLayout } from "@/components";
import {
  Form,
  FormField,
  Input,
  InputOffsetLabel,
  Button,
  FormControl,
  FormItem,
  ReactSelect,
  FormLabel,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";

function Contact({ eventId }: { eventId: string }) {
  const [dialCode, setDialCode] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+234");
  const [whatsappCountryCode, setWhatsAppCountryCode] = useState<
    string | undefined
  >("+234");
  const form = useForm({});

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, [COUNTRY_CODE]);

  return (
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-14 sm:pt-14"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
    >
      <ContentTopNav eventId={eventId} />
     
      <Form {...form}>
      <form className="w-full"  id="form">
      <div className="w-full p-4 flex items-center justify-between">
        <h6 className="font-medium">Contact information</h6>
        <Button
                  type="submit"
                  className="text-zikoro border border-zikoro gap-x-2"
                >
                  <p>Publish</p>
                  <Download size={22} />
                </Button>
      </div>
        {/* <button>Click</button> */}
        <div className="grid grid-cols-2 mb-10 gap-6 px-4">
          <div className="py-4 space-y-10">
            <FormField
              control={form.control}
              name="eventCountry"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Select the Country"
                  label="Event Country"
                  options={countriesList}
                />
              )}
            />

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
                        {...form.register("phoneNumber")}
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
                        {...form.register("whatsappNumber")}
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
                <InputOffsetLabel label="Email Address">
                  <Input
                    type="text"
                    placeholder="Enter email address"
                    {...form.register("email")}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="p-4 mt-[1rem] space-y-10 border rounded-md ">
            <h6 className="text-bold">Social media profile</h6>

            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <InputOffsetLabel className="relative" label="Twitter">
                  <div className="w-full relative h-12">
                    <Input
                      type="text"
                      placeholder="https://www.x.com/"
                      {...form.register("twitterUrl")}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                    <img
                      src="/twitter.svg"
                      className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
                    />
                  </div>
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <InputOffsetLabel className="relative" label="LinkedIn">
                  <div className="w-full relative h-12">
                    <Input
                      type="text"
                      placeholder="https://www.linkedin.com/"
                      {...form.register("linkedinUrl")}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                    <img
                      src="/linkedin.svg"
                      className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
                    />
                  </div>
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <InputOffsetLabel className="relative" label="Facebook">
                  <div className="w-full relative h-12">
                    <Input
                      type="text"
                      placeholder="https://www.facebook.com/"
                      {...form.register("facebookUrl")}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                    <img
                      src="/twitter.svg"
                      className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
                    />
                  </div>
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <InputOffsetLabel className="relative" label="Instagram">
                  <div className="w-full relative h-12">
                    <Input
                      type="text"
                      placeholder="https://www.instagram.com/"
                      {...form.register("instagramUrl")}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                    <img
                      src="/instagram.svg"
                      className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
                    />
                  </div>
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
      </form>
      </Form>
    </SideBarLayout>
  );
}

export default Contact;
