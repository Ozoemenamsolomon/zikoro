"use client";

import Image from "next/image";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
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
  UploadTypeAnswer,
} from "./answerTypes";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formAnswerSchema } from "@/schemas/engagement";
import { generateAlias } from "@/utils";
import { useVerifyUserAccess } from "@/hooks";
import useUserStore from "@/store/globalUserStore";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";

function SubmittedModal() {
  return (
    <div className="w-full h-full inset-0 fixed bg-white">
      <div className="w-[95%] max-w-xl border rounded-lg bg-gradient-to-b gap-y-6 from-white  to-basePrimary/20  h-[400px] flex flex-col items-center justify-center shadow absolute inset-0 m-auto">
        <Image
          src="/images/facheck.png"
          alt=""
          className="w-fit h-fit"
          width={48}
          height={48}
        />
        <div className="w-fit flex flex-col items-center justify-center gap-y-2">
          <h2 className="font-semibold text-lg sm:text-2xl">Forms Submitted</h2>
          <p>Your answers have been submitted successfully</p>
        </div>
      </div>
    </div>
  );
}
function AttendeeFillFormComp({
  eventId,

  formId,
}: {
  eventId: string;
  formId: string;
}) {
  const { user } = useUserStore();
  const router = useRouter();
  const { isOrganizer, attendee } = useVerifyUserAccess(eventId);
  const params = useSearchParams();
  const attendeeId = params.get("id");
  const link = params.get("link");
  const query = params.get("redirect");
  const [currentIndexes, setCurrentIndexes] = useState(0);
  // const { isIdPresent } = useCheckTeamMember({ eventId });
  const [isSuccess, setOpenSuccess] = useState(false);
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
      attendeeAlias:
        attendeeId || attendee?.attendeeAlias || user?.userId || "user",
      formResponseAlias: generateAlias(),
      formAlias: formId,
      questions: data?.questions,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  const [currentQuestions, setCurrentQuestion] = useState(fields);

  async function onSubmit(values: z.infer<typeof formAnswerSchema>) {
    //  console.log(values);
    const { questions, ...restData } = values;

    const responses = await Promise.all(
      restData?.responses?.map(async (item) => {
        if (
          item?.type === "ATTACHMENT" &&
          item?.response &&
          item?.response instanceof File
        ) {
          const file: File = item?.response;
          const data = await uploadFile(file);
          const response = {
            name: file?.name,
            id: nanoid(),
            fileData: data,
          };
          return {
            ...item,
            response,
          };
        }

        return item;
      })
    );
    const payload: Partial<TEngagementFormAnswer> = {
      ...restData,
      responses,
    };
    await postData({ payload });

    if (query) {
      router.push(`${link}?&redirect=form&id=${attendeeId}&responseAlias=${values?.formResponseAlias}`);
      return;
    }
    setOpenSuccess(true);
  }

  useEffect(() => {
    if (data?.formSettings?.displayType === "slide") {
      const questionPerSlide = parseInt(
        data?.formSettings?.questionPerSlides || "1"
      );
      const slicedQuestion = fields.slice(
        currentIndexes,
        currentIndexes + questionPerSlide
      );
      setCurrentQuestion(slicedQuestion);
    } else {
      setCurrentQuestion(fields);
    }
  }, [data, fields, currentIndexes]);

  // console.log(form.getValues());

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
    <div
      style={{
        fontSize: data?.formSettings?.textFontSize + "px" || "14px",
        backgroundColor: data?.formSettings?.backgroundColor || "",
        color: data?.formSettings?.textColor || "",
      }}
      className={cn(
        "w-full h-full fixed inset-0 overflow-y-auto",
        isLoading && "hidden"
      )}
    >
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
        <h2
          style={{
            fontSize: data?.formSettings?.titleFontSize + "px" || "30px",
          }}
          className="text-lg mb-3 sm:text-xl lg:text-2xl"
        >
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
            {currentQuestions?.map((field, index) => (
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
                {field.selectedType === "ATTACHMENT" && (
                  <UploadTypeAnswer form={form} index={index} />
                )}
                {field.selectedType === "INPUT_MULTIPLE_CHOICE" && (
                  <MultiChoiceTypeAnswer form={form} index={index} />
                )}
              </>
            ))}

            {/* {!isOrganizer && !isIdPresent && ( */}
            {data?.formSettings?.displayType === "slide" && (
              <div className="w-full flex items-center justify-between">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const questionPerSlide = parseInt(
                      data?.formSettings?.questionPerSlides || "1"
                    );
                    if (
                      currentIndexes > parseInt(data?.formSettings?.questionPerSlides || "1") 
                      
                    ) {
                      setCurrentIndexes(currentIndexes - questionPerSlide);
                    }
                  }}
                  style={{
                    color: data?.formSettings?.buttonColor || "",
                    border: `1px solid ${
                      data?.formSettings?.buttonColor || "#001fcc"
                    }`,
                  }}
                  className="border h-12 font-medium"
                >
                  Previous
                </Button>
                { currentIndexes +
                  parseInt(data?.formSettings?.questionPerSlides || "1") >= fields?.length
                ? (
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: data?.formSettings?.buttonColor || "",
                    }}
                    className={cn(
                      "self-center  gap-x-2  text-white font-medium h-12 ",
                      !data?.formSettings?.buttonColor && "bg-basePrimary"
                    )}
                  >
                    {loading && (
                      <LoaderAlt className="animate-spin" size={20} />
                    )}
                    <p>Submit</p>
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const questionPerSlide = parseInt(
                        data?.formSettings?.questionPerSlides || "1"
                      );
                      setCurrentIndexes(currentIndexes + questionPerSlide);
                    }}
                    style={{
                      backgroundColor: data?.formSettings?.buttonColor || "",
                    }}
                    className="text-white h-12 font-medium"
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
            {data?.formSettings?.displayType !== "slide" && (
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: data?.formSettings?.buttonColor || "",
                }}
                className={cn(
                  "self-center w-[150px] gap-x-2  text-white font-medium h-12 ",
                  !data?.formSettings?.buttonColor && "bg-basePrimary"
                )}
              >
                {loading && <LoaderAlt className="animate-spin" size={20} />}
                <p>Submit</p>
              </Button>
            )}
            {/* )} */}
          </form>
        </Form>
      </div>
      {isSuccess && <SubmittedModal />}
    </div>
  );
}

export default function AttendeeFillForm({
  eventId,
  formId,
}: {
  eventId: string;
  formId: string;
}) {
  return (
    <Suspense>
      <AttendeeFillFormComp formId={formId} eventId={eventId} />
    </Suspense>
  );
}

async function uploadFile(file: File | string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", "zikoro");
  formData.append("upload_preset", "w5xbik6z");
  formData.append("folder", "ZIKORO");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/zikoro/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.secure_url;
    } else {
      console.error("Failed to upload file");
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
