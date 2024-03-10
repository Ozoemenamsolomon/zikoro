"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import {
  industryArray,
  categories,
  locationType,
  pricingCurrency,
} from "@/utils";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { Download } from "@styled-icons/bootstrap/Download";
import { Eye } from "@styled-icons/feather/Eye";
import { Check2 } from "@styled-icons/bootstrap/Check2";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { addEvent } from "@/app/server-actions/addEvent";
import { Camera } from "@styled-icons/feather/Camera";
import { COUNTRY_CODE } from "@/utils";
import TextEditor from "@/components/content/TextEditor";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { SideBarLayout } from "@/components";
import { ContentTopNav } from "../_components";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {uploadFile} from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { updateEventSchema } from "@/validations";
import { CloseCircle } from "@styled-icons/ionicons-outline/CloseCircle";
import {
  Form,
  FormField,
  Input,
  InputOffsetLabel,
  Button,
  ReactSelect,
} from "@/components";
import { useFetchSingleEvent, useUpdateEvent } from "@/hooks";
import toast from "react-hot-toast";

interface ImageFile {
  url: string | undefined;
  file?: File;
  isValid: boolean;
}

export default function UpdateEvent({
  eventId,
}: {
  eventId: string;
}): JSX.Element {
  const {
    data,
    loading,
    refetch,
  }: { data: any; loading: boolean; refetch: () => Promise<null | undefined> } =
    useFetchSingleEvent(eventId);
  const { loading: updating, update } = useUpdateEvent();
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

  const [eventPosterArr, setEventPosterArr] = useState([] as ImageFile[]);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricing",
  });

  function appendPricing() {
    append({
      attendeeType: "",
      ticketQuantity: "",
      price: "",
      validity: "",
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
        pricing: data?.pricing,
        eventTimeZone: data?.eventTimeZone
      });
      if (Array.isArray(data?.eventPoster)) {
        const formatData = data?.eventPoster?.map((v: any) => {
          return { url: v, file: undefined, isValid: true };
        });
        setEventPosterArr(formatData);
      } else {
        setEventPosterArr([]);
      }
    }
  }, [data]);

  //
  async function onSubmit(values: z.infer<typeof updateEventSchema>) {
    // console.log(values);
    if (values.pricing?.length > 0) {
      const isNotEqualPrice = values?.pricing?.some(
        ({ ticketQuantity }) =>
          Number(ticketQuantity) !== Number(values?.expectedParticipants)
      );
      if (isNotEqualPrice) {
        toast.error(
          "Number of expected participants must equal the ticket quantity"
        );
        return;
      }
    }
    const posterUrl = eventPosterArr.map((v) => v.url);

    let poster:string[] = []

    if (posterUrl.length > 0 ) {
        posterUrl.map(async (value) => {
          if (value && value.startsWith("http")) {
            poster.push(value)
          }
          else if (value) {
            const img  = await uploadFile(value, "image")
            poster.push(img)
          }
        })
    }
    const payload = {
      ...values,
      eventPoster: poster,
    };

    // return;
    await update(payload, eventId);
    refetch();
  }

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, [COUNTRY_CODE]);

  function handleChange(value: any) {
    form.setValue("description", value);
  }

  const poster = form.watch("eventPoster");

  useEffect(() => {
    (async () => {
      if (poster && poster[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const img = document.createElement("img");

            img.onload = () => {
              setEventPosterArr((prev) => [
                ...prev,
                {
                  url: reader?.result?.toString(),
                  file: poster[0],
                  isValid: true,
                },
              ]);
            };
            img.src = URL.createObjectURL(poster[0]);

            // img.naturalHeight >= 500 && img.naturalWidth >= 1000
          }
        };
        reader.readAsDataURL(poster[0]);
      }
    })();
  }, [poster]);

  function removePoster(id: number) {
    const filtered = eventPosterArr.filter((_, index) => index !== id);
    setEventPosterArr(filtered);
  }

  // console.log(form.getValues());

  return (
    <DateAndTimeAdapter>
      <SideBarLayout
        hasTopBar
        className="px-0 sm:px-0 pt-14 sm:pt-14"
        parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
        eventId={eventId}
      >
        <ContentTopNav eventId={eventId} />
        {!loading ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full px-4 h-full "
              id="form"
            >
              <div className="w-full py-4 flex items-end justify-end">
           
                <div className="flex items-center gap-x-2">
                  <Button className="gap-x-2">
                    {updating && (
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
                  <div className=" gap-4 w-full grid grid-cols-2 items-center relative">
                    <FormField
                      control={form.control}
                      name="startDateTime"
                      render={() => (
                        <InputOffsetLabel label="Start date and time">
                          <Input
                            placeholder="Enter event title"
                            type="datetime-local"
                            defaultValue={data?.startDateTime}
                            {...form.register("startDateTime")}
                            className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                          />
                        </InputOffsetLabel>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDateTime"
                      render={({ field }) => (
                        <InputOffsetLabel label="End date and time">
                          <Input
                            placeholder="Enter event title"
                            type="datetime-local"
                            defaultValue={data?.endDateTime}
                            {...form.register("endDateTime")}
                            className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                          />
                        </InputOffsetLabel>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="eventTimeZone"
                    render={({ field }) => (
                      <InputOffsetLabel label="Event Timezone">
                        <Input
                          placeholder="Enter event timezone"
                          type="text"
                          defaultValue={data?.eventTimeZone}
                          {...form.register("eventTimeZone")}
                          className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventVisibility"
                    render={({ field }) => (
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
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
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
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventCategory"
                    render={({ field }) => (
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
                    )}
                  />
                </div>

                <div className="border col-span-full w-full border-[#f3f3f3] p-4 rounded-md space-y-5 pb-10">
                  <h5>Pricing</h5>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-10">
                    {fields.map((field, id) => (
                      <div
                        key={field.id}
                        className="w-full flex flex-col items-start gap-y-4 justify-start"
                      >
                        <div className="flex items-center gap-x-2">
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
                                placeholder="Enter the Price"
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

                          <FormField
                            control={form.control}
                            name={`pricing.${id}.validity` as const}
                            render={({ field }) => (
                              <InputOffsetLabel label="Validity">
                                <Input
                                  type="date"
                                  placeholder="Enter the Date"
                                  {...form.register(
                                    `pricing.${id}.validity` as const
                                  )}
                                  className=" placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                                />
                              </InputOffsetLabel>
                            )}
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
                    className="text-sm text-zikoro gap-x-2 h-fit w-fit"
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

                  <span className="description-text">
                    Image size should be 1080px by 1080px
                  </span>
                </div>

                <div className="flex gap-x-2 flex-wrap items-center">
                  {eventPosterArr.map(({ url, isValid }, index) => {
                    return (
                      <div className=" relative w-32 h-32" key={index}>
                        <Image
                          className="w-32 h-32 rounded-md"
                          src={url ? url : ""}
                          width={300}
                          height={300}
                          alt="image"
                        />
                        <button
                          onClick={() => removePoster(index)}
                          className="absolute top-2 right-2 bg-black rounded-full text-white w-6 h-6 flex items-center justify-center"
                        >
                          <CloseCircle size={16} />
                        </button>
                        {!isValid && (
                          <button
                            onClick={() => removePoster(index)}
                            className="text-red-500 absolute inset-0 w-full h-full"
                          >
                            <CloseCircle size={56} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          </Form>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center ">
            <LoaderAlt size={48} className="animate-spin" />
          </div>
        )}
      </SideBarLayout>
    </DateAndTimeAdapter>
  );
}
