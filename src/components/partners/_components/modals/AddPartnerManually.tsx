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
import { COUNTRY_CODE, uploadFile, generateAlias } from "@/utils";
import { AddSponsorLevel } from "@/components/contents/partners/_components";
import { CloseOutline } from "styled-icons/evaicons-outline";
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
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { getCookie } from "@/hooks";

export function AddPartnerManually({
  close,
  eventId,
  partner,
  refetchPartners,
}: {
  eventId: string;
  refetchPartners: () => Promise<any>;
  partner?: TPartner;
  close: () => void;
}) {
  const [active, setActive] = useState(1);
  const currentEvent = getCookie("currentEvent");
  const org = getCookie("currentOrganization");
  const { addPartners } = useAddPartners();
  const { attendees } = useGetEventAttendees(eventId);
  const { data: eventData, refetch } = useFetchSingleEvent(eventId);
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

     if (selectedAttendees?.length > 0) {
      setSelectedAttendees((prev) => [...prev, ...presentAttendee]);
     }
     else {
      setSelectedAttendees([...presentAttendee]);
     }
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
    const payload: Partial<TPartner> = partner?.id
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
      : {
          ...values,
          eventId: String(eventData?.id),
          eventAlias: eventData?.eventAlias,
          whatsApp: values.whatsApp,
          phoneNumber: values.phoneNumber,
          boothStaff: selectedAttendees,
          companyLogo: image,
          partnerAlias,
          media: video,
          partnerStatus: "active",
        };
  //  const asynQuery = partner?.id ? update : addPartners;
   // await asynQuery(payload);
await update(payload)
    setLoading(false);
    refetchPartners();
    close();
  }

  // convert attendees list to an array of object {value, label} pairs
  const attendeeOptions = useMemo(() => {
    if (Array.isArray(attendees) && attendees.length > 0) {
     return attendees.map(({ firstName, lastName, email }) => {
        return {
          label: `${firstName} ${lastName}`,
          value: email,
        };
      });
    }
    else {
      return []
    }
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
  useEffect(() => {
    if (partner) {
      form.reset({
        partnerType: partner?.partnerType,
        sponsorCategory: partner?.sponsorCategory,
        companyName: partner?.companyName,
        phoneNumber: partner?.phoneNumber,
        whatsApp: partner?.whatsApp,
        email: partner?.email,
        companyLogo: partner?.companyLogo,
        media: partner?.media,
        description: partner?.description,
        city: partner?.city,
        country: partner?.country,
        industry: partner?.industry,
        website: partner?.website,
      });

      setSelectedAttendees(partner?.boothStaff);
    }
  }, [partner]);

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
    <div className="w-full h-full fixed z-[200]    inset-0 bg-black/50">
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className={cn(
          "w-[95%] max-w-xl box-animation h-[90vh] overflow-auto flex flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4",
          active === 2 && "hidden",
          active === 3 && "hidden"
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
              name="partnerType"
              render={({ field }) => (
               <InputOffsetLabel label="Partner Type">
                 <ReactSelect
                  {...form.register("partnerType")}
                  placeHolder="Enter the Employment Type"
                  defaultValue={
                    partner
                      ? {
                          value: partner?.partnerType,
                          label: partner?.partnerType,
                        }
                      : ""
                  }
                  label="Partner Type"
                  options={[
                    { label: "Sponsor", value: "Sponsor" },
                    { label: "Exhibitor", value: "Exhibitor" },
                  ]}
                />
               </InputOffsetLabel>
              )}
            />
            {form.watch("partnerType") === "Sponsor" && (
              <div className="w-full flex items-end gap-x-2">
                <FormField
                  control={form.control}
                  name="sponsorCategory"
                  render={({ field }) => (
                   <InputOffsetLabel label="Category">
                     <ReactSelect
                      {...form.register("sponsorCategory")}
                      placeHolder="Select Sponsor Category"
                      defaultValue={
                        partner
                          ? {
                              value: partner?.sponsorCategory,
                              label: partner?.sponsorCategory,
                            }
                          : ""
                      }
                      label="Sponsor Category"
                      options={formattedSponsorCategoryList || []}
                    />
                   </InputOffsetLabel>
                  )}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActive(3);
                  }}
                  className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-[3.2rem] font-medium"
                >
                  <PlusCircle size={22} />
                  <p>Category</p>
                </Button>
              </div>
            )}

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <InputOffsetLabel label="Company Name">
                  <Input
                    type="text"
                    placeholder="Enter the Company Name"
                    {...form.register("companyName")}
                    className=" placeholder:text-sm h-11 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div className="w-full grid grid-cols-2 items-center gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
              <InputOffsetLabel label="Phone Number">
                 <Input
                        className="placeholder:text-sm h-11 text-gray-700 px-4"
                        placeholder="Enter Phone Number"
                        {...form.register("phoneNumber")}
                        type="tel"
                      />
              </InputOffsetLabel>
                )}
              />

              <FormField
                control={form.control}
                name="whatsApp"
                render={({ field }) => (
                <InputOffsetLabel label="WhatsApp">
                   <Input
                        className="placeholder:text-sm h-11 text-gray-700 px-4"
                        placeholder="Enter Whatsapp Number"
                        {...form.register("whatsApp")}
                        type="tel"
                      />
                </InputOffsetLabel>
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
                    {...form.register("email")}
                    className=" placeholder:text-sm h-11 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div className="w-full mt-4 py-2 border-t border-gray-300 border-dashed">
              <p className="text-sm text-gray-400">
                The partner will be notified to fill up the rest of the field
              </p>
            </div>
            <div className="w-full flex flex-col items-start justify-start gap-y-1">
              <InputOffsetLabel label=" Logo">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="File"
                  {...form.register("companyLogo")}
                  className=" placeholder:text-sm h-11 text-gray-700"
                />
              </InputOffsetLabel>

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
            <div className="w-full flex flex-col items-start justify-start gap-y-1">
              <InputOffsetLabel label="Media">
                <Input
                  type="file"
                  accept="video/*"
                  placeholder="File"
                  {...form.register("media")}
                  className=" placeholder:text-sm h-11 text-gray-700"
                />
              </InputOffsetLabel>

              <p className="text-xs text-[#717171]">
                Selected file should not be bigger than 2MB
              </p>
            </div>

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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <InputOffsetLabel label="Description">
                  <Textarea
                    placeholder="Enter the Description"
                    {...form.register("description")}
                    className=" placeholder:text-sm  focus:border-gray-500 placeholder:text-gray-400 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="boothStaff"
              render={({ field }) => (
               <InputOffsetLabel label="Booth Staff">
                 <ReactSelect
                  {...field}
                  placeHolder="Select the Booth Staff"
                 
                  options={attendeeOptions}
                />
               </InputOffsetLabel>
              )}
            />

            <div className="w-full grid grid-cols-2 items-center gap-4">
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
            </div>
            <div className="w-full flex items-end gap-x-2">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
               <InputOffsetLabel label="Industry">
                   <ReactSelect
                    {...form.register("industry")}
                    defaultValue={
                      partner
                        ? {
                            value: partner?.industry,
                            label: partner?.industry,
                          }
                        : ""
                    }
                    placeHolder="Select Industry"
                  
                    options={formattedIndustriesList || []}
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
                className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-[3.2rem] font-medium"
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
                      {...form.register("city")}
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
                   <ReactSelect
                    {...form.register("country")}
                    defaultValue={
                      partner
                        ? {
                            value: partner?.country,
                            label: partner?.country,
                          }
                        : ""
                    }
                    placeHolder="Select the Country"
                  
                    options={countriesList}
                  />
                 </InputOffsetLabel>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <InputOffsetLabel label="Website">
                  <Input
                    type="text"
                    placeholder="Enter the Website"
                    {...form.register("website")}
                    className=" placeholder:text-sm h-11 text-gray-700"
                  />
                </InputOffsetLabel>
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
