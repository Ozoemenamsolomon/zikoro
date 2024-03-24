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
import { partnerSchema } from "@/schemas";
import { AddSponsorLevel } from "@/components/contents/partners/_components";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useEffect, useState, useMemo } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { cn } from "@/lib";
import { AddIndustry } from "..";
import {
  useAddPartners,
  useFetchAttendees,
  useFetchCreatedEventIndustries,
  useFetchSingleEvent,
} from "@/hooks";
import { BoothStaffWidget } from "../../sponsors/_components";
import { PartnerIndustry } from "@/types";

export function AddPartners({
  close,
  eventId,
  refetchPartners,
}: {
  eventId: string;
  refetchPartners: () => Promise<null | undefined>;
  close: () => void;
}) {
  const [active, setActive] = useState(1);
  const { loading, addPartners } = useAddPartners();
  const { attendees } = useFetchAttendees(eventId);
  const { data } = useFetchSingleEvent(eventId);
  const { data: eventData, refetch } = useFetchCreatedEventIndustries(eventId);

  const [phoneCountryCode, setPhoneCountryCode] = useState<string | undefined>(
    "+234"
  );
  const [selectedAttendees, setSelectedAttendees] = useState<any[]>([]);
  const [whatsappCountryCode, setWhatsAppCountryCode] = useState<
    string | undefined
  >("+234");

  // <z.infer<typeof partnerSchema>>
  const form = useForm<any>({
    // resolver: zodResolver(partnerSchema),
    defaultValues: {
      eventId,
      eventName: data?.eventTitle,
    },
  });

  //
  const country = form.watch("country");
  const selectedBoothStaff = form.watch("boothStaff");

  // memoized to minimize re-rendering
  const attendeesEmail = useMemo(() => {
    return selectedAttendees.map(({ email }) => email);
  }, [selectedBoothStaff]);

  // adding boothStaff
  useEffect(() => {
    if (selectedBoothStaff) {
      // check if boothStaff has been selected
      const isBoothStaffPresent = attendeesEmail.includes(selectedBoothStaff);

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

  /**
   useEffect(() => {
    if (selectedIndustry !== null) {
      form.setValue("industry", selectedIndustry.name);
    }
  }, [selectedIndustry]);
  // FN to select an industry
  function handleSelected(name: string, color: string) {
    setSelectedIndustry({ name, color });
  }

 */
  //  const industryValue = form.watch("industry");
  // console.log({ industryValue });
  //  z.infer<typeof partnerSchema>
  async function onSubmit(values: any) {
    const selectedIndustry = eventData?.partnerIndustry.find(
      ({ name }) => name.toLowerCase() === values.industry
    );

    const payload: any = {
      ...values,
      whatsApp: whatsappCountryCode + values.whatsApp,
      phoneNumber: phoneCountryCode + values.phoneNumber,
      boothStaff: selectedAttendees,
      industry: selectedIndustry,
    };

    await addPartners(payload);
    refetchPartners();
    close();
  }

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

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[99999999]    inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className={cn(
          "w-[95%] sm:w-[500px] box-animation h-[90vh] overflow-auto flex flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4",
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
                <ReactSelect
                  {...field}
                  placeHolder="Enter the Employment Type"
                  label="Partner Type"
                  options={[
                    { label: "Sponsor", value: "Sponsor" },
                    { label: "Exhibitor", value: "Exhibitor" },
                  ]}
                />
              )}
            />
            {form.watch("partnerType") === "Sponsor" && (
              <div className="w-full flex items-center gap-x-2">
                <FormField
                  control={form.control}
                  name="sponsorCategory"
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      placeHolder="Select Sponsor Category"
                      label="Sponsor Category"
                      options={formattedSponsorCategoryList || []}
                    />
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
            )}

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
                      className="!mt-0 text-sm absolute top-[1.4rem]  left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                    />
                    <FormControl>
                      <Input
                        className="placeholder:text-sm h-12 placeholder:text-gray-200 text-gray-700 pl-12"
                        placeholder="Enter Phone Number"
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
                name="whatsApp"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-[10px] px-1">
                      WhatsApp number
                    </FormLabel>
                    <input
                      type="text"
                      className="!mt-0 text-sm absolute top-[1.4rem] left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                      value={whatsappCountryCode}
                      onChange={(e) => setWhatsAppCountryCode(e.target.value)}
                    />
                    <FormControl>
                      <Input
                        className="placeholder:text-sm h-12 placeholder:text-gray-200 text-gray-700 pl-12"
                        placeholder="Enter Whatsapp Number"
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
                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                />
              </InputOffsetLabel>

              <p className="text-xs text-[#717171]">
                Selected file should not be bigger than 2MB
              </p>
            </div>
            <div className="w-full flex flex-col items-start justify-start gap-y-1">
              <InputOffsetLabel label="Media">
                <Input
                  type="file"
                  accept="video/*"
                  placeholder="File"
                  {...form.register("media")}
                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                />
              </InputOffsetLabel>

              <p className="text-xs text-[#717171]">
                Selected file should not be bigger than 2MB
              </p>
            </div>

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
                <ReactSelect
                  {...field}
                  placeHolder="Select the Booth Staff"
                  label="Booth Staff"
                  options={attendeeOptions}
                />
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
            <div className="w-full flex items-center gap-x-2">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    placeHolder="Select Industry"
                    label="Industry"
                    options={formattedIndustriesList || []}
                  />
                )}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActive(2);
                }}
                className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-11 sm:h-12 font-medium"
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
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
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
        />
      )}
    </div>
  );
}
