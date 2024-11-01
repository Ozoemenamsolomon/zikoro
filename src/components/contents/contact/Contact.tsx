"use client";
import { Download } from "styled-icons/bootstrap";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useEffect, useState, useMemo } from "react";
import { COUNTRY_CODE, uploadFile } from "@/utils";
import { CloseCircle } from "styled-icons/ionicons-outline";
import { Camera } from "styled-icons/feather";
import { Eye } from "styled-icons/feather";
import { Check2 } from "styled-icons/bootstrap";
import Image from "next/image";
import {
  Form,
  FormField,
  Input,
  Button,
  FormControl,
  FormItem,
  ReactSelect,
  FormLabel,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import {
  useFetchSingleOrganization,
  useUpdateEvent,
  useFetchSingleEvent,
} from "@/hooks";
import InputOffsetLabel from "@/components/InputOffsetLabel";

function Contact({ eventId }: { eventId: string }) {
  const { data: event, loading: fetching } = useFetchSingleEvent(eventId);
  const { data, refetch } = useFetchSingleOrganization(event?.organization?.id);
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
  }, []);

  async function onSubmit(values: any) {
    //

    let logoUrl: any = "";

    if (values?.organizationLogo) {
      const promise = new Promise(async (resolve) => {
        if (typeof values.organizationLogo === "string") {
          resolve(values.organizationLogo);
        } else {
          const img = await uploadFile(values.organizationLogo[0], "image");
          resolve(img);
        }
      });
      logoUrl = await promise;
    }

    const payload = {
      ...values,
      organizationLogo: logoUrl,
      organizationName: event?.organization?.organizationName,
      eventPhoneNumber: phoneCountryCode + values.eventPhoneNumber,
      eventWhatsApp: whatsappCountryCode + values.eventWhatsApp,
    };
    //

    await updateOrg(payload, String(event?.organization?.id!));
    refetch();
  }

  const country = form.watch("country");

  useEffect(() => {
    if (event) {
      // get the added country code
      const previousCode = COUNTRY_CODE?.find(
        ({ name }) =>
          name.toLowerCase() === event?.organization?.country?.toLowerCase()
      )?.dial_code;

      // remove country code from the prev phone or whatsapp Number
      let updatedPhoneNumber = "";
      let updatedWhatsappNumber = "";

      if (
        previousCode &&
        event?.organization?.eventPhoneNumber?.startsWith(previousCode)
      ) {
        updatedPhoneNumber = event?.organization?.eventPhoneNumber.slice(
          previousCode?.length
        );
      }

      if (
        previousCode &&
        event?.organization?.eventWhatsApp?.startsWith(previousCode)
      ) {
        updatedWhatsappNumber = event?.organization?.eventWhatsApp.slice(
          previousCode?.length
        );
      }
      form.reset({
        country: event?.organization?.country,
        eventPhoneNumber: updatedPhoneNumber,
        eventWhatsApp: updatedWhatsappNumber,
        eventContactEmail: event?.organization?.eventContactEmail,
        organizationLogo: event?.organization?.organizationLogo,
        x: event?.organization?.x,
        linkedIn: event?.organization?.linkedIn,
        facebook: event?.organization?.facebook,
        instagram: event?.organization?.instagram,
      });

      // set phone and whatsapp code
      if (previousCode) {
        setWhatsAppCountryCode(previousCode);
        setPhoneCountryCode(previousCode);
      }
    }
  }, [event]);

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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10"
          id="form"
        >
          <div className="w-full p-4 flex items-center sm:items-end justify-start sm:justify-end">
            <div className="flex items-center gap-x-2">
              <Button className="gap-x-2">
                {loading && <LoaderAlt size={22} className="animate-spin" />}
                <Check2 size={22} className="text-basePrimary" />
                <p>Save</p>
              </Button>
            </div>
          </div>
          {/* <button>Click</button> */}
          <div className="grid grid-cols-1 md:grid-cols-2 mb-10 gap-6 px-4">
            <div className="py-4 space-y-10">
              {event && (
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <InputOffsetLabel label="Country">
                      <ReactSelect
                        {...form.register("country")}
                        defaultValue={{
                          value: event?.organization?.country,
                          label: event?.organization?.country,
                        }}
                        placeHolder="Select the Country"
                        label=""
                        options={countriesList}
                      />
                    </InputOffsetLabel>
                  )}
                />
              )}

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <FormField
                  control={form.control}
                  name="eventPhoneNumber"
                  render={({ field }) => (
                    <InputOffsetLabel
                      className="relative w-full"
                      label="Phone Number"
                    >
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="!mt-0 text-sm absolute top-[28%] bg-transparent left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                          value={phoneCountryCode}
                          onChange={(e) => setPhoneCountryCode(e.target.value)}
                        />

                        <Input
                          className="placeholder:text-sm h-11 pl-12"
                          placeholder="Enter phone number"
                          {...form.register("eventPhoneNumber")}
                          type="tel"
                        />
                      </div>
                    </InputOffsetLabel>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventWhatsApp"
                  render={({ field }) => (
                    <InputOffsetLabel
                      className="relative w-full"
                      label="WhatsApp Number"
                    >
                      <div className="w-full relative">
                        <input
                          type="text"
                          className="!mt-0 text-sm absolute bg-transparent top-[28%] left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                          value={whatsappCountryCode}
                          onChange={(e) =>
                            setWhatsAppCountryCode(e.target.value)
                          }
                        />

                        <Input
                          className="placeholder:text-sm h-11  text-gray-700 pl-12"
                          placeholder="Enter whatsapp number"
                          {...form.register("eventWhatsApp")}
                          type="tel"
                        />
                      </div>
                    </InputOffsetLabel>
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
                      className=" placeholder:text-sm h-11  placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="organizationLogo"
                  render={({ field }) => (
                   <InputOffsetLabel label="Organization Logo">
                     <label
                      htmlFor="add-logo"
                      className="w-full  relative rounded-lg flex items-center justify-start h-11"
                    >
                     
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
                   </InputOffsetLabel>
                  )}
                />

                <span className="description-text text-xs">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        form.setValue("organizationLogo", null);
                      }}
                      className="absolute top-2 right-2 bg-black rounded-full text-white w-6 h-6 flex items-center justify-center"
                    >
                      <CloseCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 mt-[1rem] bg-white space-y-10 border rounded-md ">
              <h6 className="text-bold">Social media profile</h6>

              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <InputOffsetLabel label="Twitter">
                    <div className="w-full relative">
                      <img
                        src="/twitter.svg"
                        className="text-sm text-black absolute top-1 ml-2 right-4 p-1 "
                      />
                      <Input
                        type="text"
                        placeholder="https://www.x.com/"
                        {...form.register("x")}
                        className=" placeholder:text-sm  text-gray-700"
                      />
                    </div>
                  </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <InputOffsetLabel label="LinkedIn">
                    <div className="relative">
                      <img
                        src="/linkedin.svg"
                        className="text-sm text-black absolute top-2 ml-2 right-4 p-1 "
                      />
                      <Input
                        type="text"
                        placeholder="https://www.linkedin.com/"
                        {...form.register("linkedIn")}
                        className=" placeholder:text-sm  text-gray-700"
                      />
                    </div>
                  </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <InputOffsetLabel label="Facebook">
                    <div className="relative w-full">
                      <img
                        src="/facebook.svg"
                        className="text-sm text-black absolute top-2 ml-2 right-4 p-1 "
                      />
                      <Input
                        type="text"
                        placeholder="https://www.facebook.com/"
                        {...form.register("facebook")}
                        className=" placeholder:text-sm  text-gray-700"
                      />
                    </div>
                  </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <InputOffsetLabel label="Instagram">
                    <div className="w-full relative">
                      <img
                        src="/instagram.svg"
                        className="text-sm text-black absolute top-2 ml-2 right-4 p-1 "
                      />
                      <Input
                        type="text"
                        placeholder="https://www.instagram.com/"
                        {...form.register("instagram")}
                        className=" placeholder:text-sm  text-gray-700"
                      />
                    </div>
                  </InputOffsetLabel>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export default Contact;
