"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/custom_ui/Button";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { InlineIcon } from "@iconify/react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState, useEffect, Suspense, useMemo } from "react";
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
import { FormDescriptionInput } from "../create/_components/FormDescriptionInput";

function FormSettingsComp({ eventId }: { eventId: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const prevFormId = params.get("form");
  const { data: engagements } = useGetData<TQuiz<TQuestion[]>[]>(
    `/quiz/${eventId}`
  );
  const { postData } =
    usePostRequest<Partial<TEngagementFormQuestion>>("/engagements/form");
  const { data, isLoading } = prevFormId
    ? useGetData<TEngagementFormQuestion>(`/engagements/form/${prevFormId}`)
    : { data: null, isLoading: false };
  const form = useForm<z.infer<typeof formSettingSchema>>({
    resolver: zodResolver(formSettingSchema),
    defaultValues: {
      formSettings: {
        isConnectedToEngagement: false,
        showForm: "beforeEngagement",
        redirectUrl: "",
        isCollectUserEmail: false,
        isCoverScreen: true,
        displayType: "listing",
        questionPerSlides: "1",
        titleFontSize: "36",
        headingFontSize: "24",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        buttonColor: "#001FFC",
        textFontSize: "14",
        isCoverImage: true,
        buttonText: "Submit",
        startButtonText:"Start"
      },
    },
  });
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const alias = useMemo(() => {
    return generateAlias();
  }, []);
  async function onSubmit(values: z.infer<typeof formSettingSchema>) {
    setLoading(true);
    const image = await new Promise(async (resolve) => {
      if (typeof values?.coverImage === "string") {
        resolve(values?.coverImage);
      } else if (
        values?.coverImage &&
        values?.coverImage[0] &&
        values?.coverImage instanceof FileList
      ) {
        const img = await uploadFile(values?.coverImage[0], "image");
        resolve(img);
      } else resolve(null);
    });

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
          isActive: true,
        };

    await postData({
      payload: payload,
    });
    setLoading(false);
    router.push(
      `/event/${eventId}/engagements/interactions/form/create/questions/${
        data?.formAlias || alias
      }`
    );
  }

  // console.log(form.getValues());

  useEffect(() => {
    if (data && data?.formSettings !== null) {
      form.reset({
        title: data?.title,
        description: data?.description,
        coverImage: data?.coverImage,
        formSettings: data?.formSettings,
      });

      form.setValue("formSettings",data.formSettings);
    }
  }, [data]);

  return (
    <>
      {!isLoading ? (
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
                    className=" h-11 hidden border border-basePrimary  items-center gap-x-2"
                  >
                    <InlineIcon color="#001fcc" icon="mdi:eye" fontSize={20} />
                    <p className="gradient-text bg-basePrimary font-medium">
                      Preview
                    </p>
                  </Button>
                  <Button className="font-medium text-white bg-basePrimary gap-x-2 rounded-lg h-11">
                    {loading && (
                      <LoaderAlt className="animate-spin" size={20} />
                    )}
                    <p>{prevFormId ? "Update" : "Create"}</p>
                  </Button>
                </div>
              </div>

              <div className="w-full border-gray-200 flex flex-col items-start justify-start gap-y-1  rounded-lg border p-3 sm:p-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="w-full">
                        <Input
                          {...form.register("title")}
                          className="bg-transparent border-none h-14 text-2xl placeholder:text-gray-500 placeholder:text-2xl"
                          placeholder="Form Title"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormDescriptionInput
                defaultValue={data?.description}
                placeholder="Form Description"
                onChange={(value) => {
                  form.setValue("description", value);
                }}
              />

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
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
    </>
  );
}

export default function FormSettings({ eventId }: { eventId: string }) {
  return (
    <Suspense>
      <FormSettingsComp eventId={eventId} />
    </Suspense>
  );
}
