"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  Textarea,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import { ArrowBack } from "styled-icons/boxicons-regular";
import { COUNTRY_CODE, uploadFile, generateAlias, formatDate } from "@/utils";
import { AddSponsorLevel } from "@/components/contents/partners/_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useEffect, useState, useMemo } from "react";
import { PlusCircle } from "styled-icons/bootstrap";
import { cn } from "@/lib";
import { AddIndustry } from "..";
import {
  useAddPartners,
  useFetchSingleEvent,
  useGetEventAttendees,
  useUpdatePartners,
} from "@/hooks";
import { BoothStaffWidget } from "../../sponsors/_components";
import { PartnerIndustry, TAttendee, TPartner } from "@/types";
import { getCookie } from "@/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";

type TSIngleTier = {
  validity: string;
  partnerType: string;
  tierName: string;
  quantity: string;
  price: string;
  currency: string;
  color: string;
  description: string;
};
export function AddPartners({
  close,
  eventId,
  partnerTier,
}: {
  eventId: string;
  partnerTier: TSIngleTier;
  close: () => void;
}) {
  const router = useRouter();
  const [active, setActive] = useState(1);
  const currentEvent = getCookie("currentEvent");
  const { data: eventData, refetch } = useFetchSingleEvent(eventId);
  const org = getCookie("currentOrganization");
  const { addPartners } = useAddPartners();
  const { attendees } = useGetEventAttendees(eventId);
  const { update } = useUpdatePartners();
  const [loading, setLoading] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState<string | undefined>(
    "+234"
  );
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);
  const [whatsappCountryCode, setWhatsAppCountryCode] = useState<
    string | undefined
  >("+234");

  // <z.infer<typeof partnerSchema>>
  const form = useForm<any>({
    // resolver: zodResolver(partnerSchema),
    defaultValues: {
      eventAlias: eventId,
      eventName: currentEvent?.eventName,
    },
  });

  //
  const country = form.watch("country");
  const selectedBoothStaff = form.watch("boothStaff");
  const companyImage = form.watch("companyLogo");
  const companyVideo = form.watch("media");

  // adding boothStaff
  useEffect(() => {
    if (selectedBoothStaff) {
      // check if boothStaff has been selected
      const isBoothStaffPresent = selectedAttendees?.some(
        ({ email }) => email === selectedBoothStaff
      );

      // return if the staff is present
      if (isBoothStaffPresent) return;

      // get a boothstaff from the attendees array
      const presentAttendee = attendees.filter(
        ({ email }) => email === selectedBoothStaff
      );

      setSelectedAttendees((prev) => [...prev, ...presentAttendee]);
    }
  }, [selectedBoothStaff]);

  // delete a  selected attendees
  function remove(email: string) {
    setSelectedAttendees(selectedAttendees.filter((v) => v.email !== email));
  }

  // refetch industries
  useEffect(() => {
    refetch();
  }, [active]);

  useEffect(() => {
    if (country) {
      const currentCountryCode = COUNTRY_CODE.find(
        (v) => v.name === country
      )?.dial_code;

      setWhatsAppCountryCode(currentCountryCode);
      setPhoneCountryCode(currentCountryCode);
    }
  }, [country]);

  // calculating the processing Fee
  const processingFee = useMemo(() => {
    return (Number(partnerTier?.price) * 5) / 100;
  }, [partnerTier]);

  const total = useMemo(() => {
    if (eventData?.attendeePayProcessingFee) {

      return Number(partnerTier?.price) + processingFee;
    } else {
      return Number(partnerTier?.price)
    }
  }, [processingFee, partnerTier, eventData]);

const computedPrice = useMemo(() => {
  if (eventData?.attendeePayProcessingFee) {
    return Number(partnerTier?.price)
  }
  else {
    return Number(partnerTier?.price) - processingFee;
  }
},[eventData, partnerTier, processingFee]);

  async function onSubmit(values: any) {
    setLoading(true);
    //
    const promise = new Promise(async (resolve) => {
      if (typeof values?.companyLogo === "string") {
        resolve(values?.companyLogo);
      } else if (values?.companyLogo && values?.companyLogo?.length > 0) {
        const img = await uploadFile(values?.companyLogo[0], "image");

        resolve(img);
      } else {
        resolve(null);
      }
    });
    const image: any = await promise;

    const promiseVideo = new Promise(async (resolve) => {
      if (typeof values?.media === "string") {
        resolve(values?.media);
      } else if (values?.media && values?.media?.length > 0) {
        const vid = await uploadFile(values?.media[0], "video");
        resolve(vid);
      } else {
        resolve(null);
      }
    });

    const video: any = await promiseVideo;

    const partnerAlias = generateAlias();
    const payload: Partial<TPartner> = {
      ...values,

      eventAlias: eventId,
      whatsApp: values.whatsApp,
      phoneNumber: values.phoneNumber,
      boothStaff: selectedAttendees,
      companyLogo: image,
      partnerAlias,
      media: video,
      partnerStatus: false,
      amountPaid: Number(partnerTier?.price),
      currency: partnerTier?.currency,
      paymentReference: "",
      tierName: partnerTier?.tierName,
    };
    const asynQuery = update;
    await asynQuery(payload);
    setLoading(false);
    //  refetchPartners();
    close();
  }

  /**
   * addPartners;
   partner?.id
      ? {
          ...partner,
          ...values,
          organizerEmail: org?.email,
          eventId: String(eventData?.id),
          eventAlias: eventData?.eventAlias,
          whatsApp: values.whatsApp,
          phoneNumber: values.phoneNumber,
          boothStaff: selectedAttendees,
          companyLogo: image,
          media: video,
        }
      :
   */

  // convert attendees list to an array of object {value, label} pairs
  const attendeeOptions = useMemo(() => {
    return attendees.map(({ firstName, lastName, email }) => {
      return {
        label: `${firstName} ${lastName}`,
        value: email,
      };
    });
  }, [attendees]);

  ///
  const formattedIndustriesList = useMemo(() => {
    if (!eventData?.partnerIndustry) return;
    let partner: PartnerIndustry[] = eventData?.partnerIndustry;
    return (
      Array.isArray(partner) &&
      partner?.map(({ name }) => {
        return { label: name, value: name };
      })
    );
  }, [eventData?.partnerIndustry]);

  // format event list
  const formattedSponsorCategoryList = useMemo(() => {
    if (!eventData?.sponsorCategory) return;
    let category: { type: string; id: string }[] = eventData?.sponsorCategory;
    return (
      Array.isArray(category) &&
      category?.map(({ type }) => {
        return { label: type, value: type };
      })
    );
  }, [eventData?.sponsorCategory]);

  ///
  //
  // useEffect(() => {
  //   if (partner) {
  //     form.reset({
  //       partnerType: partner?.partnerType,
  //       sponsorCategory: partner?.sponsorCategory,
  //       companyName: partner?.companyName,
  //       phoneNumber: partner?.phoneNumber,
  //       whatsApp: partner?.whatsApp,
  //       email: partner?.email,
  //       companyLogo: partner?.companyLogo,
  //       media: partner?.media,
  //       description: partner?.description,
  //       city: partner?.city,
  //       country: partner?.country,
  //       industry: partner?.industry,
  //       website: partner?.website,
  //     });

  //     setSelectedAttendees(partner?.boothStaff);
  //   }
  // }, [partner]);

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  const formatImage = useMemo(() => {
    if (typeof companyImage === "string") {
      return companyImage;
    } else if (companyImage && companyImage[0]) {
      return URL.createObjectURL(companyImage[0]);
    } else {
      return null;
    }
  }, [companyImage]);

  const formatVideo = useMemo(() => {
    if (typeof companyVideo === "string") {
      return companyVideo;
    } else if (companyVideo && companyVideo[0]) {
      return URL.createObjectURL(companyVideo[0]);
    } else {
      return null;
    }
  }, [companyVideo]);

  return (
    <div
      role="button"
      className="w-full h-full fixed z-[200]  overflow-y-auto  inset-0 bg-[#F9FAFF]"
    >
      <div
        role="button"
        className={cn(
          "w-full box-animation max-w-6xl px-4 mx-auto grid grid-cols-1 md:grid-cols-9 mt-10 gap-4"
        )}
      >
        <div className="w-full max-h-[36rem] md:sticky top-8 grid grid-cols-1 gap-20 md:py-10 md:col-span-4">
          <div className="w-full flex flex-col items-start justify-start gap-y-2">
            <p className="font-semibold text-base sm:text-xl">
              {eventData?.eventTitle ?? ""}
            </p>
            <p>{formatDate(eventData?.startDateTime ?? "0")}</p>
            {eventData?.eventPoster ? (
              <Image
                className="w-full rounded-lg h-[16rem]"
                src={eventData?.eventPoster ?? ""}
                width={800}
                height={400}
                alt=""
              />
            ) : (
              <div className="w-full rounded-lg animate-pulse bg-gray-200 h-[16rem]"></div>
            )}
          </div>

          <div className="w-full rounded-lg border  p-3">
            <p className="font-semibold text-base sm:text-xl">Order Summary</p>
            <div className="w-full mt-4 mb-2 flex items-center justify-between">
              <p>1x Tier Name</p>
              <p>
                {partnerTier?.currency}{" "}
                {computedPrice.toLocaleString()}
              </p>
            </div>
            <div className="w-full  mb-2 flex items-center justify-between">
              <p>1x Processing Fee</p>
              <p> {partnerTier?.currency}{" "}
              {processingFee.toLocaleString()}</p>
            </div>
            <div className="border-t flex items-center justify-between pt-2">
              <p className="font-semibold">Total</p>
              <p className="font-semibold text-base sm:text-xl">
                {partnerTier?.currency}{" "}
                {total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-6 bg-white rounded-lg py-6 px-4 sm:px-8 md:col-span-5">
          <Button onClick={close} className="px-0 h-fit w-fit  bg-none  ">
            <ArrowBack className="px-0 w-fit h-fit" size={20} />
          </Button>
          <div className="space-y-2">
            <p className="text-gray-500 text-mobile sm:text-sm">
              {partnerTier?.tierName ?? ""}
            </p>
            <p className="font-semibold text-base sm:text-xl">
              {partnerTier?.currency}{" "}
              {total.toLocaleString()}
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start w-full flex-col gap-y-3"
            >
              {/* <FormField
                control={form.control}
                name="partnerType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Partner Type</FormLabel>
                    <FormControl>
                      <ReactSelect
                        {...form.register("partnerType")}
                        // defaultValue={
                        //   partner
                        //     ? {
                        //         value: partner?.partnerType,
                        //         label: partner?.partnerType,
                        //       }
                        //     : ""
                        // }

                        options={[
                          { label: "Sponsor", value: "Sponsor" },
                          { label: "Exhibitor", value: "Exhibitor" },
                        ]}
                        borderColor="#001fcc"
                        bgColor="#001fcc1a"
                        height="3rem"
                        placeHolderColor="#64748b"
                        placeHolder="Select Partner Type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* {form.watch("partnerType") === "Sponsor" && (
                <div className="w-full flex items-center gap-x-2">
                  <FormField
                    control={form.control}
                    name="sponsorCategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Sponsor Category</FormLabel>
                        <FormControl>
                          <ReactSelect
                            {...form.register("sponsorCategory")}
                            placeHolder="Select Sponsor Category"
                            // defaultValue={
                            //   partner
                            //     ? {
                            //         value: partner?.sponsorCategory,
                            //         label: partner?.sponsorCategory,
                            //       }
                            //     : ""
                            // }
                            borderColor="#001fcc"
                            bgColor="#001fcc1a"
                            height="3rem"
                            placeHolderColor="#64748b"
                            options={formattedSponsorCategoryList || []}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setActive(3);
                    }}
                    className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-11 sm:h-12 font-medium"
                  >
                    <PlusCircle size={22} />
                    <p>Category</p>
                  </Button>
                </div>
              )} */}

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="relative w-full h-fit">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the Company Name"
                        {...form.register("companyName")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="relative h-fit">
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Phone Number"
                          {...form.register("phoneNumber")}
                          type="tel"
                          {...field}
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsApp"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>WhatsApp number</FormLabel>

                      <FormControl>
                        <Input
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                          placeholder="Enter Whatsapp Number"
                          {...form.register("whatsApp")}
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
                  <FormItem className="w-full md:col-span-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the Email Address"
                        {...form.register("email")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-col items-start justify-start gap-y-1">
                <FormField
                  control={form.control}
                  name="companyLogo"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder="File"
                          {...form.register("companyLogo")}
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs text-[#717171]">
                  Selected file should not be bigger than 2MB
                </p>
              </div>

              {formatImage && (
                <div className="w-[100px] h-[100px]">
                  <img
                    src={formatImage}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              )}
              {/* <div className="w-full flex flex-col items-start justify-start gap-y-1">
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel>Media</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="video/*"
                          placeholder="File"
                          {...form.register("media")}
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs text-[#717171]">
                  Selected file should not be bigger than 2MB
                </p>
              </div> */}

              {formatVideo && (
                <div className="w-[150px] h-[150px]">
                  <video
                    src={formatVideo}
                    muted
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
{/* 
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the Description"
                        {...form.register("description")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={form.control}
                name="boothStaff"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Booth Staff</FormLabel>
                    <FormControl>
                      <ReactSelect
                        {...field}
                        placeHolder="Select the Booth Staff"
                        borderColor="#001fcc"
                        bgColor="#001fcc1a"
                        height="3rem"
                        placeHolderColor="#64748b"
                        options={attendeeOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
{/* 
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                {Array.isArray(selectedAttendees) &&
                  selectedAttendees.map(
                    ({
                      firstName,
                      lastName,
                      organization,
                      email,
                      jobTitle,
                      profilePicture,
                    }) => (
                      <BoothStaffWidget
                        key={email}
                        email={email}
                        remove={remove}
                        image={profilePicture}
                        name={`${firstName} ${lastName}`}
                        company={organization}
                        profession={jobTitle}
                        isAddingBoothStaff
                      />
                    )
                  )}
              </div> */}
              {/* <div className="w-full flex gap-x-2 items-end ">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem className="w-[70%]">
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...form.register("industry")}
                          // defaultValue={
                          //   partner
                          //     ? {
                          //         value: partner?.industry,
                          //         label: partner?.industry,
                          //       }
                          //     : ""
                          // }
                          placeHolder="Select Industry"
                          borderColor="#001fcc"
                          bgColor="#001fcc1a"
                          height="3rem"
                          placeHolderColor="#64748b"
                          options={formattedIndustriesList || []}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActive(2);
                  }}
                  className="hover:bg-basePrimary w-[30%] text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-11 sm:h-12 font-medium"
                >
                  <PlusCircle size={22} />
                  <p>Industry</p>
                </Button>
              </div> */}

              <div className="w-full grid-cols-1 grid  items-center gap-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter City"
                          {...form.register("city")}
                          className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...form.register("country")}
                          // defaultValue={
                          //   partner
                          //     ? {
                          //         value: partner?.country,
                          //         label: partner?.country,
                          //       }
                          //     : ""
                          // }
                          placeHolder="Select the Country"
                          borderColor="#001fcc"
                          bgColor="#001fcc1a"
                          height="3rem"
                          placeHolderColor="#64748b"
                          options={countriesList}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contactFirstName"
                render={({ field }) => (
                  <FormItem className="relative w-full h-fit">
                    <FormLabel>Contact Person First Name </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter First Name"
                        {...form.register("contactFirstName")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactLastName"
                render={({ field }) => (
                  <FormItem className="relative w-full h-fit">
                    <FormLabel>Contact Person Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Last Name"
                        {...form.register("contactLastName")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full md:col-span-2">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the Website"
                        {...form.register("website")}
                        className="placeholder:text-sm h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
              >
                {loading && <LoaderAlt size={22} className="animate-spin" />}
                <span>Save</span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
      {active === 2 && (
        <AddIndustry
          // handleSelected={handleSelected}
          eventId={eventId}
          // selectedIndustry={selectedIndustry}
          close={close}
          setActive={setActive}
        />
      )}
      {active === 3 && (
        <AddSponsorLevel
          eventId={eventId}
          sponsorLevels={eventData?.sponsorCategory}
          close={close}
          setActive={setActive}
          refetch={refetch}
        />
      )}
    </div>
  );
}
