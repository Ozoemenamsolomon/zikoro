"use client";
import { useState, useMemo, useEffect } from "react";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { Download } from "styled-icons/bootstrap";
import { Eye } from "styled-icons/feather";
import { Check2 } from "styled-icons/bootstrap";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { Camera } from "styled-icons/feather";
import { COUNTRY_CODE } from "@/utils";
import TextEditor from "@/components/TextEditor";
import { PlusCircle } from "styled-icons/bootstrap";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib";
import { uploadFile } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { updateEventSchema } from "@/schemas";
import { CloseCircle } from "styled-icons/ionicons-outline";
import { Form, FormField, Input, Button, ReactSelect } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { PublishCard } from "@/components/composables";
import DatePicker from "react-datepicker";
import { useFetchSingleEvent, useUpdateEvent } from "@/hooks";
import { toast } from "@/components/ui/use-toast";
import { TIME_ZONES } from "@/utils";
import { PreviewModal } from "../_components/modal/PreviewModal";
import { formateJSDate, parseFormattedDate } from "@/utils";
import { DateRange } from "styled-icons/material-outlined";
import {
  industryArray,
  categories,
  locationType,
  pricingCurrency,
} from "../_components/utils";
import { TOrgEvent } from "@/types";
import useUserStore from "@/store/globalUserStore";

interface ImageFile {
  url: string | undefined;
  file?: File;
  isValid: boolean;
}

export default function UpdateEvent({ eventId }: { eventId: string }) {
  const {
    data,
    loading,
    refetch,
  }: {
    data: TOrgEvent | null;
    loading: boolean;
    refetch: () => Promise<null | undefined>;
  } = useFetchSingleEvent(eventId);
  const [publishing, setIsPublishing] = useState(false);
  const { user: userData } = useUserStore();
  const [isStartDate, setStartDate] = useState(false);
  const [isEndDate, setEndDate] = useState(false);
  const { loading: updating, update } = useUpdateEvent();
  const [isShowPublishModal, setShowPublishModal] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const form = useForm<z.infer<typeof updateEventSchema>>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      pricing: [
        {
          attendeeType: "",
          ticketQuantity: "",
          price: "",
          validity: "",
          description: "",
        },
      ],
    },
  });

  function onClose() {
    setOpen((prev) => !prev);
  }
  function showPublishModal() {
    setShowPublishModal((prev) => !prev);
  }

  const start = form.watch("startDateTime");
  const end = form.watch("endDateTime");

  const startDate = useMemo(() => {
    if (start) {
      form.setValue("startDateTime", formateJSDate(start));
      return formateJSDate(start);
    } else {
      form.setValue("startDateTime", formateJSDate(new Date()));
      return formateJSDate(new Date());
    }
  }, [start]);

  const endDate = useMemo(() => {
    if (end) {
      form.setValue("endDateTime", formateJSDate(end));
      return formateJSDate(end);
    } else {
      form.setValue("endDateTime", formateJSDate(new Date()));
      return formateJSDate(new Date());
    }
  }, [end]);

  const minimumDate = useMemo(() => {
    if (start) {
      return parseFormattedDate(start)
    }
    else {
      return new Date()
    }
   
},[start])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricing",
  });

  function appendPricing() {
    append({
      attendeeType: "NIL",
      ticketQuantity: "0",
      price: "0",
      validity: formateJSDate(new Date()),
      description: "",
    });
  }
  useEffect(() => {
    if (data) {
      form.reset({
        eventTitle: data?.eventTitle,
        eventCity: data?.eventCity,
        eventAddress: data?.eventAddress,
        expectedParticipants: String(data?.expectedParticipants),
        description: data?.description,
        startDateTime: data?.startDateTime,
        endDateTime: data?.endDateTime,
        eventVisibility: data?.eventVisibility,
        industry: data?.industry,
        eventCategory: data?.eventCategory,
        locationType: data?.locationType,
        eventCountry: data?.eventCountry,
        eventPoster: data?.eventPoster,
        pricing: data?.pricing || [
          {
            attendeeType: "NIL",
            ticketQuantity: "0",
            price: "0",
            validity: formateJSDate(new Date()),
            description: "",
          },
        ],
        eventTimeZone: data?.eventTimeZone,
      });
    }
  }, [data]);

  //
  async function onSubmit(values: z.infer<typeof updateEventSchema>) {
    //
    if (values.pricing?.length > 0) {
      const totalTicketQuantity = values.pricing.reduce(
        (sum, { ticketQuantity }) => {
          return sum + Number(ticketQuantity);
        },
        0
      );

      if (totalTicketQuantity !== Number(values?.expectedParticipants)) {
        toast({
          variant: "destructive",
          description:
            "The sum of ticket quantities must equal the expected participants",
        });
        return;
      }
    }

    const promise = new Promise(async (resolve) => {
      if (values.eventPoster && values.eventPoster[0]) {
        const img = await uploadFile(values.eventPoster[0], "image");
        resolve(img);
      } else if (values.eventPoster && values.eventPoster?.startsWith("http")) {
        resolve(values.eventPoster);
      } else {
        resolve(null);
      }
    });

    const response = await promise;

    const payload: any = {
      ...values,
      eventPoster: response,
      expectedParticipants: Number(values?.expectedParticipants),
    };

    // return;

    await update(payload, eventId);
    refetch();

    //   console.log("postera", posters)

    //   return
  }

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  function handleChange(value: any) {
    form.setValue("description", value);
  }

  const poster = form.watch("eventPoster");

  const posterImage = useMemo(() => {
    if (typeof poster === "string") {
      return poster;
    } else if (poster && poster[0]) {
      return URL.createObjectURL(poster[0]);
    } else {
      return null;
    }
  }, [poster]);

  //

  const formatZone = useMemo(() => {
    return TIME_ZONES.flatMap(({ zones }) => {
      return zones.map(({ label, value }) => {
        return {
          label: `${label}  ${value}`,
          value,
        };
      });
    });
  }, [TIME_ZONES]);

  // update event
  async function publishEvent() {
    if (!data) return;
    setIsPublishing(true);

    // const userData = getCookie("user");
    if (data?.eventStatus === "review") {
      toast({
        variant: "destructive",
        description: "Event Already Published",
      });
      return;
    }
    const statusDetail = {
      createdAt: new Date().toISOString(),
      status: "review",
      user: userData?.userEmail!,
    };
    const { organization, ...restData } = data;
    await update(
      {
        ...restData,
        eventStatus: "review",
        eventStatusDetails:
          data?.eventStatusDetails && data?.eventStatusDetails !== null
            ? [...data?.eventStatusDetails, statusDetail]
            : [statusDetail],
      },
      eventId
    );
    setIsPublishing(false);
    showPublishModal();
  }
  return (
    <DateAndTimeAdapter>
      <>
        {!loading ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full px-4 pb-20 h-full "
              id="form"
            >
              <div className="w-full py-4 flex items-center sm:items-end justify-start sm:justify-end">
                <div className="flex items-center gap-x-2">
                  <Button
                    disabled={!publishing && updating}
                    className="gap-x-2"
                  >
                    {!publishing && updating && (
                      <LoaderAlt size={22} className="animate-spin" />
                    )}
                    <Check2 size={22} className="text-basePrimary" />
                    <p>Save</p>
                  </Button>
                  <Button
                    // type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                    }}
                    className="text-gray-50 bg-basePrimary gap-x-2 w-fit"
                  >
                    <Eye size={22} />
                    <p>Preview</p>
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      showPublishModal();
                    }}
                    type="submit"
                    className="text-basePrimary border border-basePrimary gap-x-2"
                  >
                    <Download size={22} />
                    <p>Publish</p>
                  </Button>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 items-center md:items-start md:grid-cols-2 gap-6">
                <div className="w-full h-full flex flex-col items-start justify-start p-1 gap-y-4">
                  <FormField
                    control={form.control}
                    name="eventTitle"
                    render={({ field }) => (
                      <InputOffsetLabel label="Event title">
                        <Input
                          placeholder="Enter event title"
                          type="text"
                          defaultValue={data?.eventTitle}
                          {...form.register("eventTitle")}
                          className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <div className=" gap-4 w-full grid grid-cols-1 sm:grid-cols-2 items-center relative">
                    <FormField
                      control={form.control}
                      name="startDateTime"
                      render={() => (
                        <InputOffsetLabel label="Start date and time">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setStartDate((prev) => !prev);
                            }}
                            role="button"
                            className="w-full relative h-12"
                          >
                            <button className="absolute left-3 top-[0.6rem]">
                              <DateRange size={22} className="text-gray-600" />
                            </button>
                            <Input
                              placeholder=" Start Date Time"
                              type="text"
                              {...form.register("startDateTime")}
                              className="placeholder:text-sm pl-10 pr-4 h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                            />
                            {isStartDate && (
                              <SelectDate
                                value={startDate}
                                className="sm:left-0 right-0"
                                name="startDateTime"
                                form={form}

                                close={() => setStartDate((prev) => !prev)}
                              />
                            )}
                          </div>
                        </InputOffsetLabel>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDateTime"
                      render={({ field }) => (
                        <InputOffsetLabel label="End date and time">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setEndDate((prev) => !prev);
                            }}
                            role="button"
                            className="w-full relative h-12"
                          >
                            <button className="absolute left-3 top-[0.6rem]">
                              <DateRange size={22} className="text-gray-600" />
                            </button>
                            <Input
                              placeholder="End Date Time"
                              type="text"
                              {...form.register("endDateTime")}
                              className="placeholder:text-sm pl-10 pr-4 h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                            />
                            {/** */}
                            {isEndDate && (
                              <SelectDate
                                value={endDate}
                                form={form}
                                name="endDateTime"
                                minimumDate={minimumDate}
                                close={() => setEndDate((prev) => !prev)}
                              />
                            )}
                          </div>
                        </InputOffsetLabel>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="eventTimeZone"
                    render={({ field }) => (
                      <InputOffsetLabel label={""}>
                        <ReactSelect
                          placeHolder="Enter event timezone"
                          defaultValue={{
                            label: data?.eventTimeZone,
                            value: data?.eventTimeZone,
                          }}
                          {...form.register("eventTimeZone")}
                          options={formatZone}
                          label="Event Timezone"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventVisibility"
                    render={({ field }) => (
                      <InputOffsetLabel label="">
                        <ReactSelect
                          label="Event visibilty"
                          defaultValue={{
                            value: data?.eventVisibility,
                            label: data?.eventVisibility,
                          }}
                          {...form.register("eventVisibility")}
                          options={[
                            { value: "Public", label: "Public" },
                            { value: "Private", label: "Private" },
                          ]}
                          placeHolder="Please select"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <InputOffsetLabel label="">
                        <ReactSelect
                          label="Industry"
                          defaultValue={{
                            value: data?.industry,
                            label: data?.industry,
                          }}
                          {...form.register("industry")}
                          options={industryArray}
                          placeHolder="Please select"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventCategory"
                    render={({ field }) => (
                      <InputOffsetLabel label="">
                        <ReactSelect
                          label="Event category"
                          defaultValue={{
                            value: data?.eventCategory,
                            label: data?.eventCategory,
                          }}
                          {...form.register("eventCategory")}
                          options={categories}
                          placeHolder="Please select"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedParticipants"
                    render={({ field }) => (
                      <InputOffsetLabel label="Number of Participants">
                        <Input
                          type="number"
                          placeholder="0"
                          defaultValue={data?.expectedParticipants}
                          {...form.register("expectedParticipants")}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationType"
                    render={({ field }) => (
                      <InputOffsetLabel label="">
                        <ReactSelect
                          label="Location type"
                          defaultValue={{
                            value: data?.locationType,
                            label: data?.locationType,
                          }}
                          {...form.register("locationType")}
                          options={locationType}
                          placeHolder="Please select"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventAddress"
                    render={({ field }) => (
                      <InputOffsetLabel label="Event Address">
                        <Input
                          type="text"
                          placeholder="Enter Event Address"
                          defaultValue={data?.eventAddress}
                          {...form.register("eventAddress")}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <div className="grid grid-cols-2   w-full items-center  gap-4">
                    <FormField
                      control={form.control}
                      name="eventCity"
                      render={({ field }) => (
                        <InputOffsetLabel label="Event City">
                          <Input
                            type="text"
                            placeholder="Enter Event City"
                            defaultValue={data?.eventCity}
                            {...form.register("eventCity")}
                            className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                          />
                        </InputOffsetLabel>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventCountry"
                      render={({ field }) => (
                        <InputOffsetLabel label="">
                          <ReactSelect
                            {...field}
                            placeHolder="Select the Country"
                            label="Event Country"
                            defaultValue={{
                              value: data?.eventCountry,
                              label: data?.eventCountry,
                            }}
                            options={countriesList}
                          />
                        </InputOffsetLabel>
                      )}
                    />
                  </div>
                </div>
                <div className="w-full h-full flex flex-col items-start justify-start gap-y-6">
                  {
                    <TextEditor
                      defaultValue={data?.description}
                      onChange={handleChange}
                    />
                  }

                  <FormField
                    control={form.control}
                    name="pricingCurrency"
                    render={({ field }) => (
                      <InputOffsetLabel label="">
                        <ReactSelect
                          label="Pricing currency"
                          defaultValue={{
                            value: data?.pricingCurrency,
                            label: data?.pricingCurrency,
                          }}
                          {...form.register("pricingCurrency")}
                          options={pricingCurrency}
                          placeHolder="Please select"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                </div>

                <div className="border col-span-full w-full border-[#f3f3f3] p-4 rounded-md space-y-5 pb-10">
                  <h5>Pricing</h5>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-10">
                    {fields.map((value, id) => (
                      <div
                        key={value.id}
                        className="w-full flex flex-col items-start gap-y-4 justify-start"
                      >
                        <div className="flex text-sm items-center gap-x-2">
                          <p>{`Price Category ${id + 1}`}</p>
                          <button
                            onClick={() => remove(id)}
                            className="text-red-600"
                          >
                            <CloseCircle size={20} />
                          </button>
                        </div>
                        <div className="w-full grid grid-cols-2 items-center gap-3">
                          <FormField
                            control={form.control}
                            name={`pricing.${id}.attendeeType` as const}
                            render={({ field }) => (
                              <InputOffsetLabel label="Attendee Type">
                                <Input
                                  type="text"
                                  placeholder="e.g Early Bird"
                                  {...form.register(
                                    `pricing.${id}.attendeeType` as const
                                  )}
                                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                />
                              </InputOffsetLabel>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`pricing.${id}.ticketQuantity` as const}
                            render={({ field }) => (
                              <InputOffsetLabel label="Ticket Quantity">
                                <Input
                                  type="number"
                                  placeholder="Enter the ticket quantity"
                                  {...form.register(
                                    `pricing.${id}.ticketQuantity` as const
                                  )}
                                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                />
                              </InputOffsetLabel>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`pricing.${id}.description` as const}
                          render={({ field }) => (
                            <InputOffsetLabel label="Description">
                              <Input
                                type="text"
                                placeholder="Enter the Ticket Description"
                                {...form.register(
                                  `pricing.${id}.description` as const
                                )}
                                className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                              />
                            </InputOffsetLabel>
                          )}
                        />
                        <div className="w-full grid grid-cols-2 items-center gap-3">
                          <FormField
                            control={form.control}
                            name={`pricing.${id}.price` as const}
                            render={({ field }) => (
                              <InputOffsetLabel label="Price">
                                <Input
                                  type="number"
                                  placeholder="Enter the Price"
                                  {...form.register(
                                    `pricing.${id}.price` as const
                                  )}
                                  className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                />
                              </InputOffsetLabel>
                            )}
                          />

                          <PriceValidityDate
                            id={id}
                            form={form}
                            value={value?.validity}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      appendPricing();
                    }}
                    className="text-sm text-basePrimary gap-x-2 h-fit w-fit"
                  >
                    <PlusCircle size={18} />
                    <p>Price Category</p>
                  </Button>
                  {/** */}
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="eventPoster"
                    render={({ field }) => (
                      <label
                        htmlFor="add-poster"
                        className="w-full border border-gray-200 relative rounded-lg flex items-center justify-start h-12"
                      >
                        <span className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1">
                          Event Poster
                        </span>
                        <div className="flex px-4 items-center gap-x-3">
                          <Camera size={20} />
                          <p className="text-gray-400">Add Poster</p>
                        </div>
                        <input
                          type="file"
                          id="add-poster"
                          {...form.register("eventPoster")}
                          className="w-full h-full absolute inset-0 z-10"
                          accept="image/*"
                          hidden
                        />
                      </label>
                    )}
                  />

                  <span className="description-text text-xs">
                    Image size should be 1080px by 1080px
                  </span>
                </div>

                <div className="flex gap-x-2 flex-wrap items-center">
                  {posterImage && (
                    <div className=" relative w-32 h-32">
                      <Image
                        className="w-32 h-32 rounded-md"
                        src={posterImage ? posterImage : ""}
                        width={300}
                        height={300}
                        alt="image"
                      />
                      <button
                        onClick={() => form.setValue("eventPoster", null)}
                        className="absolute top-2 right-2 bg-black rounded-full text-white w-6 h-6 flex items-center justify-center"
                      >
                        <CloseCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center ">
            <LoaderAlt size={30} className="animate-spin" />
          </div>
        )}
        {isShowPublishModal && (
          <PublishCard
            asyncPublish={publishEvent}
            close={showPublishModal}
            loading={publishing}
            message={` You are about to publish an event. You will be notified when the admin
            approves it.`}
          />
        )}
        {isOpen && <PreviewModal close={onClose} eventDetail={data} />}
      </>
    </DateAndTimeAdapter>
  );
}

function PriceValidityDate({
  id,
  value,
  form,
}: {
  id: any;
  value: string;
  form: UseFormReturn<z.infer<typeof updateEventSchema>, any, any>;
}) {
  const [isOpen, setOpen] = useState(false);

  const validity = useMemo(() => {
    if (value) {
      form.setValue(`pricing.${id}.validity` as const, formateJSDate(value));
      return formateJSDate(value);
    } else {
      form.setValue(
        `pricing.${id}.validity` as const,
        formateJSDate(new Date())
      );
      return formateJSDate(new Date());
    }
  }, [value]);
  return (
    <FormField
      control={form.control}
      name={`pricing.${id}.validity` as const}
      render={({ field }) => (
        <InputOffsetLabel label="Validity">
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            role="button"
            className="w-full relative h-12"
          >
            <button className="absolute left-3 top-[0.6rem]">
              <DateRange size={22} className="text-gray-600" />
            </button>
            <Input
              placeholder="End Date "
              type="text"
              {...form.register(`pricing.${id}.validity` as const)}
              className="placeholder:text-sm pl-10 pr-4 h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
            />
            {/** */}
            {isOpen && (
              <SelectDate
                value={validity}
                form={form}
                name={`pricing.${id}.validity` as const}
                close={() => setOpen((prev) => !prev)}
              />
            )}
          </div>
        </InputOffsetLabel>
      )}
    />
  );
}

function SelectDate({
  className,
  form,
  close,
  name,
  value,
  minimumDate
}: {
  form: UseFormReturn<z.infer<typeof updateEventSchema>, any, any>;
  close: () => void;
  className?: string;
  name: any;
  value: string;
  minimumDate?:Date
}) {
  const selectedDate = useMemo(() => {
    return parseFormattedDate(value);
  }, [value]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className={cn(
        "absolute left-0 sm:left-0 md:left-0 top-[3.2rem]",
        className
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          close();
        }}
        className="w-full h-full inset-0 fixed z-[70]"
      ></button>
      <div className="relative z-[80] w-[320px]">
        <DatePicker
          selected={selectedDate}
          showTimeSelect
          minDate={minimumDate || new Date()}
          onChange={(date) => {
            // console.log(formateJSDate(date!));
            form.setValue(name, formateJSDate(date!));
          }}
          inline
        />
      </div>
    </div>
  );
}
