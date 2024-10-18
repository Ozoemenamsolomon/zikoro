"use client";

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFieldArray, UseFieldArrayRemove, useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/custom_ui/Button";
import { Input } from "@/components/ui/input";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { useRouter } from "next/navigation";
import { AddCircle } from "@styled-icons/ionicons-sharp/AddCircle";
import { useState, Suspense, useEffect, useMemo } from "react";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Settings } from "styled-icons/feather";
import toast from "react-hot-toast";
import {
  TextType,
  DateType,
  CheckBoxType,
  RatingType,
  UploadType,
} from "./_components/optionsType/organizer";
import { cn } from "@/lib";
import { InteractionLayout } from "@/components/engagements/_components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { nanoid } from "nanoid";
import { useGetData, usePostRequest } from "@/hooks/services/request";
import {
  TEngagementFormAnswer,
  TEngagementFormQuestion,
} from "@/types/engagements";
import { Loader2Icon } from "lucide-react";
import { uploadFile } from "@/utils";
import { CiShare2 } from "react-icons/ci";
import { ShareModal } from "./ShareModal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

const options = [
  { name: "Mutiple Choice", image: "/fmultiplechoice.png" },
  { name: "Text", image: "/ftext.png" },
  { name: "Date", image: "/fdate.png" },
  { name: "CheckBox", image: "/fcheckbox.png" },
  { name: "Rating", image: "/fstarr.png" },
  {name:"Upload", image:""},
  { name: "Likert", image: "/flikert.png" },
];

const optionsType = [
  { name: "Mutiple Choice", type: "INPUT_MULTIPLE_CHOICE" },
  { name: "Text", type: "INPUT_TEXT" },
  { name: "Date", type: "INPUT_DATE" },
  { name: "CheckBox", type: "INPUT_CHECKBOX" },
  { name: "Rating", type: "INPUT_RATING" },
  { name: "Likert", type: "INPUT_LIKERT" },
  {name:"Upload", type:"ATTACHMENT"}

];

function Fields({
  field,
  index,
  copyQuestion,
  form,
  remove,
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  field: any;
  index: number;
  copyQuestion: (i: number) => void;
  remove: UseFieldArrayRemove
}) {
  // const { attributes, listeners, setNodeRef, transform, transition } =
  // useSortable({ id: field?.id });


  return (
    <div
    // ref={setNodeRef}
    // {...attributes}
    // {...listeners}
    // style={{
    //   transition,
    //   transform: CSS.Transform.toString(transform),
    //   touchAction: "none",
    // }}
    className="w-full">
      {field.selectedType === "INPUT_TEXT" && (
        <TextType
          form={form}
          index={index}
          remove={remove}
          append={copyQuestion}
        />
      )}
      {field.selectedType === "INPUT_DATE" && (
        <DateType
          form={form}
          index={index}
          remove={remove}
          append={copyQuestion}
        />
      )}
      {field.selectedType === "INPUT_CHECKBOX" && (
        <CheckBoxType
          form={form}
          index={index}
          remove={remove}
          append={copyQuestion}
        />
      )}
      {field.selectedType === "INPUT_MULTIPLE_CHOICE" && (
        <CheckBoxType
          form={form}
          index={index}
          remove={remove}
          append={copyQuestion}
        />
      )}
      {field.selectedType === "INPUT_RATING" && (
        <RatingType
          form={form}
          index={index}
          remove={remove}
          append={copyQuestion}
        />
      )}
      {field.selectType === "ATTACHMENT" && (
        <UploadType
          form={form}
          index={index}
          remove={remove}
          append={copyQuestion}
        />
      ) }
    </div>
  );
}

function SelectQuestionType({
  onClose,
  //selectedOption,
  setSelectedOption,
}: {
  onClose: () => void;
  // selectedOption: string;
  setSelectedOption: (selected: string) => void;
}) {
  return (
    <div className="w-full flex flex-col  rounded-lg border p-3 ">
      <Button
        onClick={onClose}
        className="self-end gap-x-2 w-fit h-fit px-0 text-gray-600"
      >
        <IoIosCloseCircleOutline size={18} />
        <p>Cancel</p>
      </Button>
      <div className="w-full flex flex-wrap  items-center px-4 mx-auto max-w-[70%] gap-6 py-4 sm:py-8 justify-start">
        {options?.map((item) => (
          <button
            onClick={() => setSelectedOption(item?.name)}
            className={cn(
              "w-full max-w-[170px] min-w-[170px] flex border hover:border-basePrimary border-gray-300 items-center gap-x-3 p-2 rounded-lg  sm:p-3"
            )}
          >
            <Image
              src={item.image}
              alt="question-type"
              width={18}
              height={18}
              className="object-cover"
            />
            <p>{item.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CreateInteractionFormComp({
  formId,
  eventId,
}: {
  formId: string;
  eventId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const { postData } =
    usePostRequest<Partial<TEngagementFormQuestion>>("/engagements/form");
  const { data } = useGetData<TEngagementFormQuestion>(
    `/engagements/form/${formId}`
  );
  const { data: formResponses } = useGetData<TEngagementFormAnswer[]>(
    `/engagements/form/answer/${formId}`
  );
  const [isShare, setShowShare] = useState(false);
  const form = useForm<z.infer<typeof formQuestionSchema>>({
    resolver: zodResolver(formQuestionSchema),
    defaultValues: {
      questions: [],
      isActive: true,
    },
  });
  const router = useRouter();
  const [showSelectQuestionType, setShowSelectQuestionType] =
    useState<boolean>(false);

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  function appendToQuestion(selected: string) {
    append({
      questionId: nanoid(),
      question: "",
      questionImage: "",
      selectedType:
        optionsType.find((option) => option.name === selected)?.type || "",
      optionFields: null,
      isRequired: false,
    });
    setShowSelectQuestionType(false);
  }

  function copyQuestion(index: number) {
    const question = form.getValues(`questions.${index}`);
    append({
      ...question,
    });
  }

  async function onSubmit(values: z.infer<typeof formQuestionSchema>) {
    if (
      !values?.questions ||
      (Array.isArray(values?.questions) && values?.questions?.length === 0)
    )
      return toast.error("Add Questions");
    setLoading(true);

    // Process questions
    const processedQuestions = await Promise.all(
      values.questions.map(async (question) => {
        // Upload question image if present
        const questionImage =
          typeof question?.questionImage === "string"
            ? question?.questionImage
            : question?.questionImage && question?.questionImage[0]
            ? await uploadFile(question.questionImage[0], "image")
            : null;

        // Process option fields if present
        let processedOptionFields = question.optionFields;
        if (question.optionFields && Array.isArray(question.optionFields)) {
          processedOptionFields = await Promise.all(
            question.optionFields.map(async (option: any) => {
              if (typeof option.optionImage === "string") {
                return { ...option };
              } else if (option?.optionImage && option?.optionImage[0]) {
                const optionImage = await uploadFile(
                  option.optionImage[0],
                  "image"
                );
                return { ...option, optionImage };
              }

              return option;
            })
          );
        }

        return {
          ...question,
          questionImage,
          optionFields: processedOptionFields,
        };
      })
    );
    const payload = data?.formAlias
      ? {
          ...data,
          ...values,
          questions: processedQuestions,
        }
      : {
          ...values,
          questions: processedQuestions,
        };

    await postData({
      payload: payload,
    });
    setLoading(false);
  }

  // console.log(form.getValues())

  useEffect(() => {
    if (data) {
      form.reset({
        title: data?.title,
        description: data?.description,
        isActive: data?.isActive == null ? true : data?.isActive,
        questions: data?.questions,
      });
    }
  }, [data]);

  function handleToggleSelectQuestionType() {
    setShowSelectQuestionType((prev) => !prev);
  }

  function onToggleShare() {
    setShowShare((p) => !p);
  }

  const formattedResponses = useMemo(() => {
    if (Array.isArray(formResponses) && formResponses?.length > 0) {
    }
  }, [formResponses]);

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 0.01,
  //     },
  //   }),
  //   useSensor(TouchSensor),
  //   useSensor(MouseSensor),
  //   useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  // );

  // get position
  // const getPosition = (id: string): number | undefined =>
  //   fields.findIndex((item) => item?.id === id);
  // async function handleDrop(e: DragEndEvent) {
  //   if (!fields) return;
  //   const { active, over } = e;

  //   if (active?.id === over?.id) return;
  //   const originPos = getPosition(active?.id as string)!;
  //   const destPos = getPosition(over?.id as string)!;
  //   const updatedFields = arrayMove(fields, originPos, destPos);

  //   form.setValue("questions", updatedFields);
  // }
  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full px-4 mx-auto max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-start justify-start  sm:gap-y-8 gap-y-8 2xl:gap-y-10"
          >
            <div className="w-full flex items-center justify-between">
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
              <div className="w-fit rounded-xl p-1 border">
                <button
                  className={cn(
                    "px-3 py-2 font-medium rounded-xl",
                    active == 0 && "bg-basePrimary text-white"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActive(0);
                  }}
                >
                  <p>Questions</p>
                </button>
                <button
                  className={cn(
                    "px-3 py-2 font-medium rounded-xl",
                    active == 1 && "bg-basePrimary text-white"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActive(1);
                  }}
                >
                  <p>Responses</p>
                </button>
              </div>
              <div className=" flex items-center gap-x-2">
                <button
                  onClick={() =>
                    router.push(
                      `/event/${eventId}/engagements/interactions/form/create?form=${formId}`
                    )
                  }
                  className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1"
                >
                  <Settings size={22} />
                </button>
                <Button
                  disabled={loading}
                  className="bg-basePrimary gap-x-2 px-6 text-white h-12 "
                >
                  {loading && (
                    <Loader2Icon size={20} className="animate-spin" />
                  )}
                  <p>Save</p>
                </Button>

                <Button
                  className="gap-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleShare();
                  }}
                >
                  <CiShare2 size={22} />
                  <p>Share</p>
                </Button>
              </div>
            </div>

            <div className="w-full  flex flex-col items-start justify-start gap-y-1 rounded-lg border p-3 sm:p-4">
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

            <div className="w-full flex flex-col items-start justify-start gap-y-6 sm:gap-y-8">
              {/* <DndContext
                collisionDetection={closestCorners}
                sensors={sensors}
                onDragEnd={handleDrop}
              >
                <SortableContext
                  items={fields}
                  strategy={verticalListSortingStrategy}
                > */}
                  {fields.map((field, index) => (
                    <Fields
                      key={field.id}
                      index={index}
                      remove={remove}
                      field={field}
                      copyQuestion={copyQuestion}
                      form={form}
                    />
                  ))}
                {/* </SortableContext>
              </DndContext> */}
            </div>

            <div className="w-full flex items-center justify-center ">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleToggleSelectQuestionType();
                }}
                className="w-fit text-basePrimary h-fit px-0 gap-x-2"
              >
                <AddCircle className="text-basePrimary" size={40} />
              </Button>
            </div>

            {showSelectQuestionType && (
              <SelectQuestionType
                onClose={handleToggleSelectQuestionType}
                //selectedOption={selectedOption}
                setSelectedOption={appendToQuestion}
              />
            )}
          </form>
        </Form>

        {isShare && (
          <ShareModal
            close={onToggleShare}
            link={`${window.location.origin}/engagements/${eventId}/form/${data?.formAlias}`}
          />
        )}
      </div>
    </InteractionLayout>
  );
}

export default function CreateInteractionForm({
  eventId,
  formId,
}: {
  eventId: string;
  formId: string;
}) {
  return (
    <Suspense>
      <CreateInteractionFormComp eventId={eventId} formId={formId} />
    </Suspense>
  );
}
