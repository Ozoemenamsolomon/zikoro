"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useFetchSingleEvent, useUpdateEvent } from "@/hooks";
import { Event } from "@/types";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

const eventWebsiteSettings = [
  { title: "Logo", status: false },
  { title: "Banner", status: true },
  { title: "Agenda", status: true },
  { title: "Speakers", status: true },
  { title: "Partners", status: true },
  { title: "Reviews", status: true },
];
type FormValue = {
  attendeePayProcessingFee: boolean;
  explore: boolean;
  eventAppAccess: string;
};
export function ContentSetting({
  onClose,
  eventId,
}: {
  eventId: string | any;
  onClose: () => void;
}) {
  const { update, loading } = useUpdateEvent();
  const [settings, setSettings] =
    useState<{ title: string; status: boolean }[]>(eventWebsiteSettings);
  const { data }: { data: Event | null; loading: boolean } =
    useFetchSingleEvent(eventId);
  const form = useForm<FormValue>({});
  
  function formatDate(date: Date): string {
    return date.toISOString();
  }

  const eventAppAccessList = useMemo(() => {
    if (data?.startDateTime) {
      const eventDate = new Date(data?.startDateTime);
      return [
        { title: "Upon registration", date: "now" },
        {
          title: "1 day before the event",
          date: formatDate(new Date(eventDate.getTime() - 24 * 60 * 60 * 1000)),
        },
        {
          title: "7 days before the event",
          date: formatDate(
            new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000)
          ),
        },
        {
          title: "14 days before the event",
          date: formatDate(
            new Date(eventDate.getTime() - 14 * 24 * 60 * 60 * 1000)
          ),
        },
        {
          title: "30 days before the event",
          date: formatDate(
            new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000)
          ),
        },
      ];
    }
  }, [data?.startDateTime, data]);

  const processingFeeStatus = form.watch("attendeePayProcessingFee");
  const exploreStatus = form.watch("explore");
  const appAccess = form.watch("eventAppAccess");

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
        eventAppAccess: data?.eventAppAccess
          ? data?.eventAppAccess
          : eventAppAccessList
          ? eventAppAccessList[0]?.date
          : "",
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
      className="w-full h-full inset-0 z-[200] bg-white/50 fixed"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-h-[85%] overflow-y-auto max-w-2xl m-auto inset-0 absolute rounded-lg bg-white py-6 px-4 sm:px-6 shadow"
      >
        <div className="w-full flex items-center mb-6 justify-between">
          <h2 className="text-base sm:text-xl">Content Settings</h2>
          <Button onClick={onClose}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-start justify-start gap-y-6 sm:gap-y-10"
        >
          <div className="grid w-full grid-cols-12 gap-3 items-start">
            <Switch
              onClick={() =>
                form.setValue("attendeePayProcessingFee", !processingFeeStatus)
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
                When active, a 5% service charge is added to attendee payments.
                Disable to pay it from your event revenue.
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
                Your event will be visible to the public on Zikoro explore page.
                Anyone can see and register for your event from this page.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full items-start justify-start">
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
          </div>

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

          <Button
            type="submit"
            className="w-full gap-x-2 h-11 sm:h-12 text-gray-50 font-medium mt-4 bg-basePrimary"
          >
            {loading && <LoaderAlt size={20} />}
            <p>Save Changes</p>
          </Button>
        </form>
      </div>
    </div>
  );
}
