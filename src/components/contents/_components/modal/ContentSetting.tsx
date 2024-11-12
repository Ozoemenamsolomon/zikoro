"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useFetchSingleEvent, useUpdateEvent } from "@/hooks";
import { Event, TAffiliateLink } from "@/types";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useGetWorkspaceSubscriptionPlan } from "@/hooks/services/subscription";
import useUserStore from "@/store/globalUserStore";

const eventWebsiteSettings = [
  { title: "Logo", status: false },
  { title: "Banner", status: true },
  { title: "Agenda", status: true },
  { title: "Speakers", status: true },
  { title: "Partners", status: true },
  { title: "Reviews", status: true },
  { title: "Rewards", status: true },
  { title: "Partner Registration", status: true },
];
type FormValue = {
  attendeePayProcessingFee: boolean;
  explore: boolean;
  selfCheckInAllowed: boolean;
  affiliateSettings: Omit<TAffiliateLink, "affiliateId"> & { enabled: boolean };
  includeJoinEventLink: boolean;
};

export function ContentSetting({
  onClose,
  eventId,
  parentClassName,
  childClassName,
}: {
  eventId: string | any;
  onClose?: () => void;
  parentClassName?: string;
  childClassName?: string;
}) {
  const { update, loading } = useUpdateEvent();
  const [settings, setSettings] =
    useState<{ title: string; status: boolean }[]>(eventWebsiteSettings);
  const { data }: { data: Event | null; loading: boolean } =
    useFetchSingleEvent(eventId);
  const form = useForm<FormValue>({
    defaultValues: {
      affiliateSettings: {
        commissionType: "percentage",
        commissionValue: 5,
        
      },
      includeJoinEventLink: false,
    },
  });

  const { watch } = form;

  const { user, setUser } = useUserStore();
  const { organization, setOrganization } = useOrganizationStore();
  const {
    data: getWorkspaceSubscriptionPlanData,
    refetch: getWorkspaceSubscriptionPlan,
    isLoading: getWorkspaceSubscriptionIsLoading,
  } = useGetWorkspaceSubscriptionPlan(user?.id, organization?.id);
  const commissionType = watch("affiliateSettings.commissionType");
  const enableAffiliateSettings = watch("affiliateSettings.enabled");

  console.log(getWorkspaceSubscriptionPlanData, "subscription");

  function formatDate(date: Date): string {
    return date.toISOString();
  }

  // const eventAppAccessList = useMemo(() => {
  //   if (data?.startDateTime) {
  //     const eventDate = new Date(data?.startDateTime);
  //     return [
  //       { title: "Upon registration", date: "now" },
  //       {
  //         title: "1 day before the event",
  //         date: formatDate(new Date(eventDate.getTime() - 24 * 60 * 60 * 1000)),
  //       },
  //       {
  //         title: "7 days before the event",
  //         date: formatDate(
  //           new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  //         ),
  //       },
  //       {
  //         title: "14 days before the event",
  //         date: formatDate(
  //           new Date(eventDate.getTime() - 14 * 24 * 60 * 60 * 1000)
  //         ),
  //       },
  //       {
  //         title: "30 days before the event",
  //         date: formatDate(
  //           new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000)
  //         ),
  //       },
  //     ];
  //   }
  // }, [data?.startDateTime, data]);

  const includeJoinEventLink = form.watch("includeJoinEventLink");
  const processingFeeStatus = form.watch("attendeePayProcessingFee");
  const exploreStatus = form.watch("explore");
  // const appAccess = form.watch("eventAppAccess");
  const selfCheckInAllowed = form.watch("selfCheckInAllowed");

  function handleChange(title: string) {
    const updated = settings?.map((item) => {
      if (item?.title === title) {
        return {
          title: item?.title,
          status: !item?.status,
        };
      }

      return item;
    });
    setSettings(updated);
  }

  async function onSubmit(values: FormValue) {
    // console.log(values)
    //  return
    update({ ...values, eventWebsiteSettings: settings }, eventId);
  }

  useEffect(() => {
    if (data) {
      form.reset({
        attendeePayProcessingFee: data?.attendeePayProcessingFee
          ? data?.attendeePayProcessingFee
          : false,
        explore: data?.explore ? data?.explore : false,
        affiliateSettings: data.affiliateSettings,
        selfCheckInAllowed: data.selfCheckInAllowed,
      });

      if (data?.eventWebsiteSettings === null) {
        setSettings(eventWebsiteSettings);
      } else {
        setSettings(data?.eventWebsiteSettings);
      }
    }
  }, [data, form]);

  return (
    <div
      onClick={onClose}
      role="button"
      className={cn(
        "w-full h-full inset-0 z-[200] bg-white/50 fixed",
        parentClassName
      )}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          "w-[95%] max-h-[85%] overflow-y-auto max-w-2xl m-auto inset-0 absolute rounded-lg bg-white py-6 px-4 sm:px-6 shadow",
          childClassName
        )}
      >
        <div className="w-full flex items-center mb-6 justify-between">
          <h2 className="text-base sm:text-xl">Content Settings</h2>
          {!childClassName && (
            <Button onClick={onClose}>
              <CloseOutline size={22} />
            </Button>
          )}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-start justify-start gap-y-6 sm:gap-y-10"
          >
            <div className="grid w-full grid-cols-12 gap-3 items-start">
              <Switch
                onClick={() =>
                  form.setValue(
                    "attendeePayProcessingFee",
                    !processingFeeStatus
                  )
                }
                checked={processingFeeStatus}
                disabled={loading}
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary "
              />
              <div className="flex flex-col items-start w-full col-span-11 justify-start gap-y-1">
                <h2 className="text-base sm:text-xl">
                  Event attendees pay 5% processing fee?
                </h2>
                <p className="text-gray-500 text-start text-xs sm:text-sm">
                  When active, a 5% service charge is added to attendee
                  payments. Disable to pay it from your event revenue.
                </p>
              </div>
            </div>
            {/** */}
            <div className="grid w-full grid-cols-12 gap-3 items-start">
              <Switch
                onClick={() => form.setValue("explore", !exploreStatus)}
                checked={exploreStatus}
                disabled={loading}
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary "
              />
              <div className="flex flex-col col-span-11 w-full items-start justify-start gap-y-1">
                <h2 className="text-base sm:text-xl">
                  List my event on explore page
                </h2>
                <p className="text-gray-500 text-start text-xs sm:text-sm">
                  Your event will be visible to the public on Zikoro explore
                  page. Anyone can see and register for your event from this
                  page.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-12 gap-3 items-start">
              <Switch
                onClick={() =>
                  form.setValue("selfCheckInAllowed", !selfCheckInAllowed)
                }
                checked={selfCheckInAllowed}
                disabled={loading}
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary "
              />
              <div className="flex flex-col items-start w-full col-span-11 justify-start gap-y-1">
                <h2 className="text-base sm:text-xl">Enable Self Check-in</h2>
                <p className="text-gray-500 text-start text-xs sm:text-sm">
                  Allow attendees to check in by themselves everyday of the
                  event.
                </p>
              </div>
            </div>
            {/* <div className="flex flex-col w-full items-start justify-start">
              <h2 className="text-base mb-2 sm:text-xl">
                When should user access your event app
              </h2>
              {eventAppAccessList?.map(({ title, date }) => (
                <label key={title} className="flex mb-2 items-center gap-x-2">
                  <input
                    type="radio"
                    value={date}
                    {...form.register("eventAppAccess")}
                    checked={appAccess === date}
                    className="w-5 h-5 sm:w-6 sm:h-6 accent-basePrimary"
                  />
                  <span>{title}</span>
                </label>
              ))}
            </div> */}

            <div className="flex flex-col w-full items-start justify-start">
              <h2 className="text-base mb-2 sm:text-xl">
                Show on the event registration website
              </h2>

              {settings?.map(({ title, status }) => (
                <div key={title} className="flex mb-3 items-center gap-x-2">
                  <Switch
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleChange(title);
                    }}
                    className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
                    checked={status}
                  />
                  <p>{title}</p>
                </div>
              ))}
            </div>

            <section className="space-y-6 w-full">
              <div className="grid w-full grid-cols-12 gap-3 items-start">
                <Switch
                  onClick={() =>
                    form.setValue(
                      "affiliateSettings.enabled",
                      !enableAffiliateSettings
                    )
                  }
                  checked={enableAffiliateSettings}
                  disabled={loading}
                  className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary "
                />
                <div className="flex flex-col items-start w-full col-span-11 justify-start gap-y-1">
                  <h2 className="text-base sm:text-xl">
                    Enable Event Referrals
                  </h2>
                  <p className="text-gray-500 text-start text-xs sm:text-sm">
                    Allow attendees to themselves as affiliates.
                  </p>
                </div>
              </div>
              {enableAffiliateSettings && (
                <>
                  <FormField
                    control={form.control}
                    name="affiliateSettings.payoutSchedule"
                    render={({ field }) => (
                      <FormItem className="relative w-full space-y-0">
                        <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Payout Schedule
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Select schedule"
                                  className={cn(
                                    "placeholder:text-sm w-full py-4",
                                    !field.value
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[250px] hide-scrollbar overflow-auto">
                              {["self managed", "zikoro managed"].map(
                                (event) => (
                                  <SelectItem
                                    key={event}
                                    value={event}
                                    className="inline-flex gap-2"
                                  >
                                    {event}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="affiliateSettings.commissionType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 font-medium">
                          Select commission type
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center gap-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="percentage" />
                              </FormControl>
                              <FormLabel className="font-medium text-gray-500">
                                Percentage
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="fixed" />
                              </FormControl>
                              <FormLabel className="font-medium text-gray-500">
                                Fixed amount
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {commissionType === "percentage" ? (
                    <FormField
                      control={form.control}
                      name="affiliateSettings.commissionValue"
                      render={({ field }) => (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Value</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  field.value > 5 ? field.value - 5 : 0
                                )
                              }
                              disabled={field.value === 0}
                              className="text-basePrimary disabled:opacity-70"
                            >
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                viewBox="0 0 1024 1024"
                                height="1.5em"
                                width="1.5em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                              </svg>
                            </button>
                            <div className="inline-flex gap-1 justify-between">
                              <input
                                className="w-[40px] outline-[1px] px-2 py-0.5 flex justify-center items-center outline-gray-300 rounded"
                                defaultValue={5}
                                value={field.value}
                                type="number"
                                min={0}
                                max={100}
                              />
                              <span>%</span>
                            </div>
                            <button
                              onClick={() =>
                                field.onChange(
                                  field.value < 95 ? field.value + 5 : 100
                                )
                              }
                              disabled={field.value === 100}
                              type="button"
                              className="text-basePrimary disabled:opacity-70"
                            >
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                viewBox="0 0 1024 1024"
                                height="1.5em"
                                width="1.5em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="affiliateSettings.commissionValue"
                      render={({ field }) => (
                        <InputOffsetLabel isRequired label={"Amount"}>
                          <Input
                            type="number"
                            placeholder={"Enter amount"}
                            onInput={(e) =>
                              field.onChange(parseInt(e.currentTarget.value))
                            }
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 py-4"
                          />
                        </InputOffsetLabel>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="affiliateSettings.validity"
                    render={({ field }) => (
                      <FormItem className="relative w-full space-y-0">
                        <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Validity
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  
                                  className={cn(
                                    "flex gap-4 items-center w-full px-4 justify-start font-normal py-4",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="h-4 w-4 opacity-50" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="affiliateSettings.Goal"
                    render={({ field }) => (
                      <FormItem className="relative w-full space-y-0">
                        <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                          Goal
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Select goal"
                                  className={cn(
                                    "placeholder:text-sm w-full py-4",
                                    !field.value
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="h-64 hide-scrollbar overflow-auto">
                              {["Event purchase"].map((event) => (
                                <SelectItem
                                  key={event}
                                  value={event}
                                  className="inline-flex gap-2"
                                >
                                  {event}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-tiny">
                          Your affiliate earns their commission when the
                          selected goal is reached by the attendee
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </section>

            <div className="grid w-full grid-cols-12 gap-3 items-start">
              <Switch
                onClick={() =>
                  form.setValue("includeJoinEventLink", !includeJoinEventLink)
                }
                checked={includeJoinEventLink}
                disabled={
                  getWorkspaceSubscriptionIsLoading ||
                  organization?.subscriptionPlan === "free"
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary "
              />
              <div className="flex flex-col items-start w-full col-span-11 justify-start gap-y-1">
                <h2 className="text-base sm:text-xl">
                  Include Join Event Link
                  {organization?.subscriptionPlan === "free" &&
                    "(Not available for free plan)"}
                </h2>
                <p className="text-gray-500 text-start text-xs sm:text-sm">
                  When active, a link to join the event will be included in the
                  event registration email.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-x-2 h-11 sm:h-12 text-gray-50 font-medium mt-4 bg-basePrimary"
            >
              {loading && <LoaderAlt size={20} />}
              <p>Save Changes</p>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
