"use client";
import { Download } from "@styled-icons/bootstrap/Download";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useEffect, useState, useMemo } from "react";
import { COUNTRY_CODE, uploadFile } from "@/utils";
import { ContentTopNav } from "../_components";
import { SideBarLayout } from "@/components";
import { CloseCircle } from "@styled-icons/ionicons-outline/CloseCircle";
import { Camera } from "@styled-icons/feather/Camera";
import { Eye } from "@styled-icons/feather/Eye";
import { Check2 } from "@styled-icons/bootstrap/Check2";
import Image from "next/image";
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
import { useFetchSingleOrganization, getCookie, useUpdateEvent } from "@/hooks";

function Contact({ eventId }: { eventId: string }) {
  const org = getCookie("currentOrganization");
  const { data, refetch } = useFetchSingleOrganization(org?.id);
  const { updateOrg, loading } = useUpdateEvent();
  const [phoneCountryCode, setPhoneCountryCode] = useState<string | undefined>(
    "+234"
  );
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

  async function onSubmit(values: any) {
    //  console.log({ values });
    let logoUrl = "";

    if (typeof values.organizationLogo === "string") {
      logoUrl = values.organizationLogo;
    } else {
      const img = await uploadFile(values.organizationLogo[0], "image");
      logoUrl = img;
    }
    const payload = {
      ...values,
      organizationLogo: logoUrl,
      organizationName: org?.name,
      eventPhoneNumber: phoneCountryCode + values.eventPhoneNumber,
      eventWhatsApp: whatsappCountryCode + values.eventWhatsApp,
    };
    // console.log({ payload });

    await updateOrg(values, org?.id);
    refetch();
  }

  const country = form.watch("country");

  useEffect(() => {
    if (data) {
      form.reset({
        country: data?.country,
        eventPhoneNumber: data?.eventPhoneNumber,
        eventWhatsApp: data?.eventWhatsApp,
        eventContactEmail: data?.eventContactEmail,
        x: data?.x,
        linkedIn: data?.linkedIn,
        facebook: data?.facebook,
        instagram: data?.instagram,
      });
    }
  }, [data]);

  useEffect(() => {
    if (country) {
      const currentCountryCode = COUNTRY_CODE.find(
        (v) => v.name === country
      )?.dial_code;

      setWhatsAppCountryCode(currentCountryCode);
      setPhoneCountryCode(currentCountryCode);
    }
  }, [country]);

  const logo = form.watch("organizationLogo");
  const formatLogo = useMemo(() => {
    if (typeof logo === "string") {
      return logo;
    } else if (logo && logo[0]) {
      return URL.createObjectURL(logo[0]);
    } else {
      return null;
    }
  }, [logo]);

  return (
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-14 sm:pt-14"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
    >
      <ContentTopNav eventId={eventId} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          id="form"
        >
          <div className="w-full p-4 flex items-end justify-end">
          <div className="flex items-center gap-x-2">
                  <Button className="gap-x-2">
                    {loading && (
                      <LoaderAlt size={22} className="animate-spin" />
                    )}
                    <Check2 size={22} className="text-zikoro" />
                    <p>Save</p>
                  </Button>
                  <Button
                    // type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                      e.stopPropagation();
                      window.open(`/events/content/${eventId}/preview`, '_blank')
                   
                    }}
                    className="text-gray-50 bg-zikoro gap-x-2"
                  >
                    <Eye size={22} />
                    <p>Preview</p>
                  </Button>
                  <Button
                    onClick={(e) => {
                      //   e.preventDefault();
                      e.stopPropagation();
                    }}
                    type="submit"
                    className="text-zikoro border border-zikoro gap-x-2"
                  >
                    <Download size={22} />
                    <p>Publish</p>
                  </Button>
                </div>
          
          </div>
          {/* <button>Click</button> */}
          <div className="grid grid-cols-1 md:grid-cols-2 mb-10 gap-6 px-4">
            <div className="py-4 space-y-10">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <ReactSelect
                    {...form.register("country")}
                    defaultValue={{
                      value: data?.country,
                      label: data?.country,
                    }}
                    placeHolder="Select the Country"
                    label="Event Country"
                    options={countriesList}
                  />
                )}
              />

              <div className="w-full grid grid-cols-2 items-center gap-4">
                <FormField
                  control={form.control}
                  name="eventPhoneNumber"
                  render={({ field }) => (
                    <FormItem className="relative h-fit">
                      <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                        Phone number
                      </FormLabel>
                      <input
                        type="text"
                        className="!mt-0 text-sm absolute top-[40%]  left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                      />
                      <FormControl>
                        <Input
                          className="placeholder:text-sm h-12 placeholder:text-gray-200 text-gray-700 pl-12"
                          placeholder="Enter phone number"
                          {...form.register("eventPhoneNumber")}
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventWhatsApp"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-[10px] px-1">
                        WhatsApp number
                      </FormLabel>
                      <input
                        type="text"
                        className="!mt-0 text-sm absolute top-[40%] left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                        value={whatsappCountryCode}
                        onChange={(e) => setWhatsAppCountryCode(e.target.value)}
                      />
                      <FormControl>
                        <Input
                          className="placeholder:text-sm h-12 placeholder:text-gray-200 text-gray-700 pl-12"
                          placeholder="Enter whatsapp number"
                          {...form.register("eventWhatsApp")}
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
                name="eventContactEmail"
                render={({ field }) => (
                  <InputOffsetLabel label="Email Address">
                    <Input
                      type="text"
                      placeholder="Enter email address"
                      {...form.register("eventContactEmail")}
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="organizationLogo"
                  render={({ field }) => (
                    <label
                      htmlFor="add-logo"
                      className="w-full border border-gray-200 relative rounded-lg flex items-center justify-start h-12"
                    >
                      <span className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1">
                        Organization Logo
                      </span>
                      <div className="flex px-4 items-center gap-x-3">
                        <Camera size={20} />
                        <p className="text-gray-400">Add Logo</p>
                      </div>
                      <input
                        type="file"
                        id="add-logo"
                        {...form.register("organizationLogo")}
                        className="w-full h-full absolute inset-0 z-10"
                        accept="image/*"
                        hidden
                      />
                    </label>
                  )}
                />

                <span className="description-text">
                  Image size should be 1080px by 1080px
                </span>
              </div>

              <div className="flex space-x-2 items-center">
                {formatLogo && (
                  <div className=" relative w-32 h-32">
                    <Image
                      className="w-32 h-32 rounded-md"
                      src={formatLogo ? formatLogo : ""}
                      width={300}
                      height={300}
                      alt="image"
                    />
                    <button
                      onClick={() => form.setValue("logo", null)}
                      className="absolute top-2 right-2 bg-black rounded-full text-white w-6 h-6 flex items-center justify-center"
                    >
                      <CloseCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 mt-[1rem] space-y-10 border rounded-md ">
              <h6 className="text-bold">Social media profile</h6>

              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute -top-[0.4rem]  right-4 bg-white text-gray-600 text-[10px] px-1">
                      Twitter
                    </FormLabel>
                    <img
                      src="/twitter.svg"
                      className="text-sm text-black absolute top-1 ml-2 right-4 p-1 "
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://www.x.com/"
                        {...form.register("x")}
                        className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute -top-[0.4rem]  right-4 bg-white text-gray-600 text-[10px] px-1">
                      LinkedIn
                    </FormLabel>
                    <img
                      src="/linkedin.svg"
                      className="text-sm text-black absolute top-1 ml-2 right-4 p-1 "
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://www.linkedin.com/"
                        {...form.register("linkedIn")}
                        className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute -top-[0.4rem]  right-4 bg-white text-gray-600 text-[10px] px-1">
                      Facebook
                    </FormLabel>
                    <img
                      src="/twitter.svg"
                      className="text-sm text-black absolute top-1 ml-2 right-4 p-1 "
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://www.facebook.com/"
                        {...form.register("facebook")}
                        className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute -top-[0.4rem]  right-4 bg-white text-gray-600 text-[10px] px-1">
                      Instagram
                    </FormLabel>
                    <img
                      src="/instagram.svg"
                      className="text-sm text-black absolute top-1 ml-2 right-4 p-1 "
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://www.instagram.com/"
                        {...form.register("instagram")}
                        className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
