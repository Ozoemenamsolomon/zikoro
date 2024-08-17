"use client";

import {
  Button,
  Form,
  FormControl,
  FormItem,
  FormField,
  Input,
  FormMessage,
  ReactSelect,
  FormLabel,
} from "@/components";
import { CloseCircle } from "styled-icons/ionicons-outline";
import { PlusCircle } from "styled-icons/bootstrap";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { TOrgEvent } from "@/types";
import { formateJSDate, parseFormattedDate } from "@/utils";
import * as z from "zod";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useMemo, useState } from "react";
import { DateRange } from "styled-icons/material-outlined";
import { cn } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import { TwitterPicker } from "react-color";
import { PartnerTextEditor } from "./_components/custom_ui/PartnerTextEditor";
import { useRouter } from "next/navigation";
import { partnerTierSchema } from "@/schemas";
import { useUpdateEvent, useFetchSingleEvent } from "@/hooks";
import {useEffect} from "react"

const colors = [
  "#4D4D4D",
  "#999999",
  "#FFFFFF",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
  "#A4DD00",
  "#68CCCA",
  "#73D8FF",
  "#AEA1FF",
  "#FDA1FF",
  "#333333",
  "#808080",
  "#cccccc",
  "#D33115",
  "#E27300",
  "#FCC400",
  "#B0BC00",
  "#68BC00",
  "#16A5A5",
  "#009CE0",
  "#7B64FF",
  "#FA28FF",
  "#000000",
  "#666666",
  "#B3B3B3",
  "#9F0500",
  "#C45100",
  "#FB9E00",
  "#808900",
  "#194D33",
  "#0C797D",
  "#0062B1",
  "#653294",
  "#AB149E",
];
function SelectDate({
  className,
  form,
  close,
  name,
  value,
  minimumDate,
}: {
  form: UseFormReturn<z.infer<typeof partnerTierSchema>, any, any>;
  close: () => void;
  className?: string;
  name: any;
  value: string;
  minimumDate?: Date;
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

function ColorPicker({
  form,
  close,
  name,
}: {
  form: UseFormReturn<z.infer<typeof partnerTierSchema>, any, any>;
  close: () => void;
  name: any;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="absolute top-12"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          close();
        }}
        className="w-full h-full inset-0 fixed z-[100]"
      ></button>
      <div className="w-[200px] relative z-[150]">
        <TwitterPicker
          color={form.watch(name)}
          colors={colors}
          onChange={(color, event) => form.setValue(name, color.hex)}
          className="h-[250px] w-[200px]"
        />
      </div>
    </div>
  );
}

function SingleTier({
  form,
  id,
  remove,
  partnerType,
  currency,
  validity: validityDate,
  description
}: {
  id: number;
  remove: () => void;
  partnerType:string
  currency:string
  validity:string
  description: string
  form: UseFormReturn<z.infer<typeof partnerTierSchema>, any, any>;
}) {
  const [isOpen, setOpen] = useState(false);
  const [colorPicker, setShowPicker] = useState(false);

 // const validityDate = form.watch(`partnerTier.${id}.validity` as const);

  const validity = useMemo(() => {
    if (validityDate) {
      form.setValue(
        `partnerTier.${id}.validity` as const,
        formateJSDate(validityDate)
      );
      return formateJSDate(validityDate);
    } else {
      form.setValue(
        `partnerTier.${id}.validity` as const,
        formateJSDate(new Date())
      );
      return formateJSDate(new Date());
    }
  }, [validityDate]);

  const currencies = ["ZAR", "GHC", "NGN", "KES", "USD"];
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-start justify-start gap-y-4">
      <div className="flex items-center gap-x-2">
        <p className="text-sm sm:text-lg font-semibold">Tier {id + 1}</p>
        {id !== 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              remove();
            }}
            className="text-red-600"
          >
            <CloseCircle size={20} />
          </button>
        )}
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`partnerTier.${id}.partnerType` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Partner Type</FormLabel>
              <FormControl>
                <ReactSelect
                  {...form.register(`partnerTier.${id}.partnerType` as const)}
                  options={[
                    { value: "exhibitor", label: "Exhibitor" },
                    { value: "sponsor", label: "Sponsor" },
                  ]}
                  defaultValue={partnerType ? {value: partnerType, label: partnerType} : ""}
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
        />
        <FormField
          control={form.control}
          name={`partnerTier.${id}.tierName` as const}
          render={({ field }) => (
            <FormItem className="w-full md:col-span-2">
              <FormLabel>Tier Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Tier Name"
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
          name={`partnerTier.${id}.quantity` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
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
          name={`partnerTier.${id}.price` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="200"
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
          name={`partnerTier.${id}.currency` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <ReactSelect
                  {...form.register(`partnerTier.${id}.currency` as const)}
                  options={currencies.map((v) => {
                    return { value: v, label: v };
                  })}
                  defaultValue={currency ? {value: currency, label: currency} : ""}
                  borderColor="#001fcc"
                  bgColor="#001fcc1a"
                  height="3rem"
                  placeHolderColor="#64748b"
                  placeHolder="Select Currency"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`partnerTier.${id}.validity` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Validity Date</FormLabel>
              <FormControl>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpen((prev) => !prev);
                  }}
                  className="w-full relative h-12"
                >
                  <button className="absolute left-3 top-[0.6rem]">
                    <DateRange size={22} className="text-gray-600" />
                  </button>
                  <Input
                    type="text"
                    placeholder="validity"
                    {...form.register(`partnerTier.${id}.validity` as const)}
                    className="placeholder:text-sm h-12 pl-10 pr-4 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                  />
                  {isOpen && (
                    <SelectDate
                      value={validity}
                      className="sm:left-0 right-0"
                      name={`partnerTier.${id}.validity` as const}
                      form={form}
                      close={() => setOpen((prev) => !prev)}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`partnerTier.${id}.color` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tier Color</FormLabel>
              <FormControl>
                <div className="w-full relative h-12">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowPicker((prev) => !prev);
                    }}
                    style={{
                      backgroundColor:
                        form.watch(`partnerTier.${id}.color` as const) ||
                        "#001ffc",
                    }}
                    className="rounded-md absolute left-[0.2rem] top-[0.2rem] w-10 h-[90%] "
                  >
                    {colorPicker && (
                      <ColorPicker
                        close={() => setShowPicker((prev) => !prev)}
                        form={form}
                        name={`partnerTier.${id}.color` as const}
                      />
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="#001FFC"
                    readOnly
                    {...form.register(`partnerTier.${id}.color` as const)}
                    className="placeholder:text-sm  pl-12 pr-4 h-12 border-basePrimary bg-[#001fcc]/10  placeholder:text-zinc-500 text-zinc-700"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full col-span-full">
          <p className="font-medium mb-2">Description</p>

          <PartnerTextEditor
            defaultValue={description}
            onChange={(value) =>
              form.setValue(`partnerTier.${id}.description` as const, value)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function CreatePartnerTiers({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { loading, update } = useUpdateEvent();
  const {
    data,
    loading: eventLoading,
    refetch,
  }: {
    data: TOrgEvent | null;
    loading: boolean;
    refetch: () => Promise<null | undefined>;
  } = useFetchSingleEvent(eventId);

  const form = useForm<z.infer<typeof partnerTierSchema>>({
    resolver: zodResolver(partnerTierSchema),
    // defaultValues: {
    //   partnerTier: [
    //     {
    //       partnerType: "",
    //       quantity: "",
    //       price: "",
    //       validity: formateJSDate(new Date()),
    //       description: "",
    //       currency: "",
    //       color: "#001ffc",
    //       tierName: "",
    //     },
    //   ],
    // },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partnerTier",
  });

  function appendTier() {
    append({
      partnerType: "",
      quantity: "0",
      price: "0",
      validity: formateJSDate(new Date()),
      description: "",
      currency: "",
      color: "#001ffc",
      tierName: "",
    });
  }

  async function onSubmit(values: z.infer<typeof partnerTierSchema>) {
     console.log({partnerDetails: values?.partnerTier});
     await update({partnerDetails: values?.partnerTier}, eventId);
  //   if (data) {
  //     const partnerDetails =
  //  data?.partnerDetails === null
  //       ? [...values?.partnerTier]
  //       : [...data?.partnerDetails, ...values?.partnerTier];
  //  
  //   };
   
  }

  useEffect(() => {
    if (data) {
      form.setValue(
        "partnerTier",
        data?.partnerDetails?.map((partner) => ({
         ...partner,
         
        })) ||  [
          {
            partnerType: "",
            quantity: "",
            price: "",
            validity: formateJSDate(new Date()),
            description: "",
            currency: "",
            color: "#001ffc",
            tierName: "",
          },
        ],
      );
    }

  },[data])

  return (
    <>
      {eventLoading ? (
        <div className="w-full flex items-center justify-center h-[20rem]">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 pt-6 pb-32">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 sm:space-y-9"
            >
              <div className="w-full flex items-center justify-between  ">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.back();
                  }}
                  className="px-0 w-fit h-fit"
                >
                  <ArrowBack size={24} />
                </Button>

                <Button
                  disabled={loading}
                  type="submit"
                  className="bg-basePrimary gap-x-2 w-[110px] text-white font-medium"
                >
                  {loading && <LoaderAlt size={20} className="animate-spin" />}
                  <p> Save</p>
                </Button>
              </div>

              <h2 className="font-semibold text-base sm:text-xl">
                Partner Tiers
              </h2>

              {fields.map((value, id) => (
                <SingleTier
                  remove={() => remove(id)}
                  id={id}
                  form={form}
                  partnerType={value?.partnerType}
                  currency={value?.currency}
                  validity={value?.validity}
                  description={value?.description}
                  key={value.id}
                />
              ))}

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  appendTier();
                }}
                className="text-sm text-basePrimary gap-x-2 h-fit w-fit"
              >
                <PlusCircle size={18} />
                <p>Add Tier Category</p>
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
