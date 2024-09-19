"use client";

import Image from "next/image";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/custom_ui/Button";
import { useFieldArray, useForm } from "react-hook-form";
import { useGetData, usePostRequest } from "@/hooks/services/request";
import {
  TEngagementFormAnswer,
  TEngagementFormQuestion,
} from "@/types/engagements";
import {
  CheckboxTypeAnswer,
  DateTypeAnswer,
  TextTypeAnswer,
  RatingTypeAnswer,
  MultiChoiceTypeAnswer,
} from "./answerTypes";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formAnswerSchema } from "@/schemas/engagement";
import { generateAlias } from "@/utils";
import { useVerifyUserAccess, useCheckTeamMember } from "@/hooks";
import useUserStore from "@/store/globalUserStore";
export default function AttendeeFillForm({
  eventId,

  formId,
}: {
  eventId: string;
  formId: string;
}) {
  const { user } = useUserStore();
  const { isOrganizer, attendee } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { data, isLoading } = useGetData<TEngagementFormQuestion>(
    `/engagements/form/${formId}`
  );
  const { postData, isLoading: loading } = usePostRequest<
    Partial<TEngagementFormAnswer>
  >(`/engagements/form/answer`);

  const form = useForm<z.infer<typeof formAnswerSchema>>({
    resolver: zodResolver(formAnswerSchema),
    defaultValues: {
      eventAlias: eventId,
      attendeeAlias: attendee?.attendeeAlias || user?.userId || "user",
      formResponseAlias: generateAlias(),
      formAlias: formId,
      questions: data?.questions,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(values: z.infer<typeof formAnswerSchema>) {
    console.log(values);
    const { questions, ...restData } = values;
    const payload: Partial<TEngagementFormAnswer> = {
      ...restData,
      //userId: user?.userId || "",
    };
    await postData({ payload });
  }

  console.log(form.getValues());

  useEffect(() => {
    if (data) {
      form.setValue("questions", data?.questions);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-[30rem] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {data?.coverImage && (data?.coverImage as string).startsWith("https") && (
        <Image
          src={data?.coverImage}
          alt="cover-image"
          width={2000}
          height={600}
          className="w-full h-[10rem] sm:h-[15rem] object-cover 2xl:h-[20rem]"
        />
      )}

      <div className="w-full px-4 my-10 pb-20 sm:my-20 mx-auto max-w-4xl ">
        <h2 className="text-lg mb-3 sm:text-xl lg:text-2xl">
          {data?.title ?? ""}
        </h2>
        <p className="text-sm sm:text-base mb-8 sm:mb-12">
          {data?.description ?? ""}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-start justify-start gap-y-4 sm:gap-y-6 2xl:gap-y-8"
          >
            {fields?.map((field, index) => (
              <>
                {field.selectedType === "INPUT_TEXT" && (
                  <TextTypeAnswer form={form} index={index} />
                )}
                {field.selectedType === "INPUT_DATE" && (
                  <DateTypeAnswer form={form} index={index} />
                )}
                {field.selectedType === "INPUT_CHECKBOX" && (
                  <CheckboxTypeAnswer form={form} index={index} />
                )}
                {field.selectedType === "INPUT_RATING" && (
                  <RatingTypeAnswer form={form} index={index} />
                )}
                 {field.selectedType === "INPUT_MULTIPLE_CHOICE" && (
                  <MultiChoiceTypeAnswer form={form} index={index} />
                )}
              </>
            ))}

            <Button
              type="submit"
              disabled={loading}
              className="self-center w-[150px] gap-x-2 bg-basePrimary text-white font-medium h-12 "
            >
              {loading && <LoaderAlt className="animate-spin" size={20} />}
              <p>Submit</p>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
