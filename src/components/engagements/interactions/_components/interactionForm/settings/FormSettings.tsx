"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/custom_ui/Button";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { InlineIcon } from "@iconify/react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib";
import {
  FormAppearance,
  FormGeneralSettings,
  FormIntegration,
} from "./_components";
import * as z from "zod";
import { formSettingSchema } from "@/schemas/engagement";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAlias, uploadFile } from "@/utils";
import { TEngagementFormQuestion } from "@/types/engagements";
import { usePostRequest, useGetData } from "@/hooks/services/request";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { TQuestion, TQuiz } from "@/types";

function FormSettingsComp({ eventId }: { eventId: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const prevFormId = params.get("form");
  const { data: engagements } = useGetData<TQuiz<TQuestion[]>[]>(
    `/quiz/${eventId}`
  );
  const { postData } =
    usePostRequest<Partial<TEngagementFormQuestion>>("/engagements/form");
  const { data } = prevFormId
    ? useGetData<TEngagementFormQuestion>(`/engagements/form/${prevFormId}`)
    : { data: null };
  const form = useForm<z.infer<typeof formSettingSchema>>({
    resolver: zodResolver(formSettingSchema),
    defaultValues: {
      formSettings: {
        isConnectedToEngagement: true,
        showForm: "beforeEngagement",
        connectedEngagementId: "",
        isCollectUserEmail: false,
        isCoverScreen: true,
        displayType: "listing",
        questionPerSlides: "1",
        titleFontSize: "36",
        headingFontSize: "24",
        backgroundColor: "#3383cc",
        textColor: "#000000",
        buttonColor: "#001FFC",
        textFontSize: "14",
        isCoverImage: true,
      },
    },
  });
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSettingSchema>) {
    setLoading(true);
    const image = await new Promise(async (resolve) => {
      if (typeof values?.coverImage === "string") {
        resolve(values?.coverImage);
      } else {
        const img = await uploadFile(values?.coverImage[0], "image");
        resolve(img);
      }
    });

    const alias = generateAlias();

    // console.log('values',{...values, formAlias: alias, eventAlias: eventId})
    const payload: Partial<TEngagementFormQuestion> = data?.formAlias
      ? {
          ...data,
          ...values,
          coverImage: image as string,
        }
      : {
          ...values,
          coverImage: image as string,
          formAlias: alias,
          eventAlias: eventId,
        };

    await postData({
      payload: payload,
    });
    setLoading(false);
  }

  console.log(form.getValues());

  useEffect(() => {
    if (data && data?.formSettings !== null) {
      form.reset({
        title: data?.title,
        description: data?.description,
        coverImage: data?.coverImage,
        formSettings: data?.formSettings,
      });
    }
  }, [data]);

  return (
    <div className="w-full px-4 mt-6 pb-24 sm:mt-10 sm:px-6 mx-auto max-w-[1300px] ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-start justify-start sm:gap-y-8 gap-y-8 2xl:gap-y-10 "
        >
          <div className="w-full flex items-center justify-between mb-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.back();
              }}
              className="h-fit w-fit px-0 gap-x-2"
            >
              <ArrowBack size={20} />
              <p>Back</p>
            </Button>

            <p className="font-medium ">Form Setting</p>

            <div className="flex items-center gap-x-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="flex h-11 border border-basePrimary  items-center gap-x-2"
              >
                <InlineIcon color="#001fcc" icon="mdi:eye" fontSize={20} />
                <p className="gradient-text bg-basePrimary font-medium">
                  Preview
                </p>
              </Button>
              <Button className="font-medium text-white bg-basePrimary gap-x-2 rounded-lg h-11">
                {loading && <LoaderAlt className="animate-spin" size={20} />}
                <p>Update</p>
              </Button>
            </div>
          </div>

          <div className="w-full border-gray-200 flex flex-col items-start justify-start gap-y-1  rounded-lg border p-3 sm:p-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...form.register("title")}
                      className="bg-transparent border-none h-14 text-2xl placeholder:text-gray-500 placeholder:text-2xl"
                      placeholder="Form Title"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...form.register("description")}
                      className="bg-transparent border-none h-11  placeholder:text-gray-500"
                      placeholder="Form Description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex items-center justify-center ">
            {["Appearance", "General", "Integration"].map((item, index) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActive(index);
                }}
                key={index}
                className={cn(
                  "border-b-2 text-xs sm:text-sm pb-2 px-3 ",
                  active === index && "border-basePrimary"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          {active === 2 && (
            <FormIntegration
              data={data}
              engagements={engagements}
              form={form}
            />
          )}
          {active === 1 && <FormGeneralSettings form={form} />}
          {active === 0 && <FormAppearance form={form} />}
        </form>
      </Form>
    </div>
  );
}

export default function FormSettings({ eventId }: { eventId: string }) {
  return (
    <Suspense>
      <FormSettingsComp eventId={eventId} />
    </Suspense>
  );
}
