"use client";

import { CloseOutline } from "styled-icons/evaicons-outline";
import { Form, FormField, Input, Button } from "@/components";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { TPartner } from "@/types";
import { PlusCircle } from "styled-icons/bootstrap";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBannerSchema } from "@/schemas";
import { useAddPartnerBanner } from "@/hooks";
import InputOffsetLabel from "@/components/InputOffsetLabel";

export function AddBanners({
  close,
  partnerId,
  refetch,
  partner,
}: {
  partnerId: string;
  partner: TPartner | null;
  refetch: () => Promise<null | undefined>;
  close: () => void;
}) {
  const { loading, addPartnerBanner } = useAddPartnerBanner();
  const form = useForm<z.infer<typeof addBannerSchema>>({
    resolver: zodResolver(addBannerSchema),
    defaultValues: {
      banners: [{ file: "", link: "" }],
    },
  });
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "banners",
  });

  function appendBanner() {
    append({
      file: "",
      link: "",
    });
  }

  async function onSubmit(values: z.infer<typeof addBannerSchema>) {
    await addPartnerBanner(partnerId, values.banners, partner);

    // 
    refetch();
    close();
  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[640px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-8 px-3 sm:px-6"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">Banners</h2>
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            {fields.map((banner, index) => (
              <div
                key={banner.id}
                className="w-11/12 relative grid grid-cols-2 gap-4"
              >
                {fields?.length > 1 && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      remove(index);
                    }}
                    className="px-1 h-fit w-fit absolute -right-10 top-4"
                  >
                    <CloseOutline size={28} className="text-red-600" />
                  </Button>
                )}

                <div className="w-full flex flex-col items-start justify-start gap-y-1">
                  <InputOffsetLabel label="Banner">
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="File"
                      {...form.register(`banners.${index}.file` as const)}
                      className=" placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                    />
                  </InputOffsetLabel>

                  <p className="text-xs text-[#717171]">
                    For best result use 1080px by 1080px
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name={`banners.${index}.link` as const}
                  render={({ field }) => (
                    <InputOffsetLabel label="Attach Link">
                      <Input
                        type="text"
                        placeholder="Link"
                        {...field}
                        className=" placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />
              </div>
            ))}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                appendBanner();
              }}
              className="hover:bg-basePrimary text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-12 font-medium"
            >
              <PlusCircle size={22} />
              <p>New</p>
            </Button>

            <Button
              disabled={loading}
              className="mt-4 h-12 w-full gap-x-2 bg-basePrimary text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Add Banners</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
