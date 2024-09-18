"use client";

import Image from "next/image";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { useGetData } from "@/hooks/services/request";
import { TEngagementFormQuestion } from "@/types/engagements";
import {
  CheckboxTypeAnswer,
  DateTypeAnswer,
  TextTypeAnswer,
} from "./answerTypes";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useEffect } from "react";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { formAnswerSchema } from "@/schemas/engagement";
import { generateAlias } from "@/utils";
export default function AttendeeFillForm({
  eventId,

  formId,
}: {
  eventId: string;
  formId: string;
}) {
  const { data, isLoading } = useGetData<TEngagementFormQuestion>(
    `/engagements/form/${formId}`
  );

 

  const form = useForm<z.infer<typeof formAnswerSchema>>({
    resolver: zodResolver(formAnswerSchema),
    defaultValues: {
      eventAlias: eventId,
      formResponseAlias: generateAlias(),
      formAlias: formId,
      questions: data?.questions
    }
  });

  const {fields} = useFieldArray({
    control: form.control,
    name:"questions"
  })

  async function onSubmit(values: z.infer<typeof formAnswerSchema>) {
    console.log(values);
  }


  useEffect(() => {
if (data) {
  form.setValue("questions", data?.questions);
}
  },[data])

  if (isLoading) {
    return (
      <div className="w-full h-[30rem] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  }
  





  
  return (
    <div className="w-full">
      {data?.coverImage && (data?.coverImage as string).startsWith("https") && <Image
        src={data?.coverImage}
        alt="cover-image"
        width={2000}
        height={600}
        className="w-full h-[10rem] sm:h-[15rem] 2xl:h-[20rem]"
      />}

      <div className="w-full px-4 my-10 sm:my-20 mx-auto max-w-4xl ">
        <h2 className="text-lg mb-3 sm:text-xl lg:text-2xl">{data?.title ?? ''}</h2>
        <p className="text-sm sm:text-base mb-8 sm:mb-12">{data?.description ?? ''}</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-start justify-start gap-y-4 sm:gap-y-6 2xl:gap-y-8"
          >
           {fields?.map((field, index) => (
          <>
            {field.selectedType === "INPUT_TEXT" &&  <TextTypeAnswer form={form} index={index} />}
            {field.selectedType === "INPUT_DATE" && <DateTypeAnswer form={form} index={index} />}
             {field.selectedType === "INPUT_CHECKBOX" && <CheckboxTypeAnswer form={form} index={index} />}
          </>
           ))}
          </form>
        </Form>
      </div>
    </div>
  );
}
