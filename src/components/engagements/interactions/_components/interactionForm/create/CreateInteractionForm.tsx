"use client";

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom_ui/Button";
import { Input } from "@/components/ui/input";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { useRouter } from "next/navigation";
import { AddCircle } from "@styled-icons/ionicons-sharp/AddCircle";
import { useMemo, useState } from "react";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TextType } from "./_components/optionsType/organizer";
import { InteractionLayout } from "@/components/engagements/_components";
const options = [
  { name: "Mutiple Choice", image: "/fmultiplechoice.png" },
  { name: "Text", image: "/ftext.png" },
  { name: "Date", image: "/fdate.png" },
  { name: "CheckBox", image: "/fcheckbox.png" },
  { name: "Rating", image: "/fstarr.png" },
  { name: "Likert", image: "/flikert.png" },
];



function SelectQuestionType({
  onClose,
  selectedOption,
  setSelectedOption,
}: {
  onClose: () => void;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="w-full flex flex-col to-custom-bg-gradient-end bg-gradient-to-tr  rounded-lg border from-custom-bg-gradient-start p-3 ">
      <Button
        onClick={onClose}
        className="self-end gap-x-2 w-fit h-fit px-0 text-gray-600"
      >
        <IoIosCloseCircleOutline size={18} />
        <p>Cancel</p>
      </Button>
      <div className="w-full grid grid-cols-1 sm:px-6 lg:px-8 2xl:px-10 sm:grid-cols-3 lg:grid-cols-4 items-center gap-4 justify-center">
        {options?.map((item) => (
          <button className="w-full flex border items-center gap-x-3 p-2 rounded-lg  sm:p-3">
            <Image
              src={item.image}
              alt="question-type"
              width={30}
              height={30}
            />
            <p>{item.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CreateInteractionForm({eventId}: {eventId: string}) {
  const form = useForm({});
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showSelectQuestionType, setShowSelectQuestionType] =
    useState<boolean>(false);




  async function onSubmit(values: any) {
    console.log(values);
  }

  const optionsComponents = [
    { name: "Mutiple Choice", SelectedComponent: <TextType form={form} /> },
    { name: "Text", SelectedComponent: <TextType form={form} /> },
    { name: "Date", SelectedComponent: <TextType form={form} /> },
    { name: "CheckBox", SelectedComponent: <TextType form={form} /> },
    { name: "Rating", SelectedComponent: <TextType form={form} /> },
    { name: "Likert", SelectedComponent: <TextType form={form} /> },
  ]

  const watchedImage = form.watch("coverImage");

  const image = useMemo(() => {
    if (typeof watchedImage === "string") {
      return watchedImage;
    } else if (watchedImage && watchedImage[0] && watchedImage instanceof FileList) {
      return URL.createObjectURL(watchedImage[0]);
    }
    else {
      return null
    }
  }, [watchedImage]);

  function handleToggleSelectQuestionType() {
    setShowSelectQuestionType((prev) => !prev);
  }
  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full px-4 text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-start justify-start sm:gap-y-6 gap-y-8 2xl:gap-y-10"
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
            <Button className="bg-basePrimary px-6 text-white h-12 ">Save</Button>
        </div>

            <label
              htmlFor="form-image"
              className="w-full gap-y-2 bg-gradient-to-tr h-[10rem] flex flex-col items-center justify-center relative sm:h-[15rem] border 2xl:h-[20rem] from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg"
            >
              <input
                type="file"
                {...form.register("coverImage")}
                accept="image/*"
                id="form-image"
                hidden
                className="w-full h-full inset-0 absolute z-40"
              />

              {image ? (
                <Image
                  src={image}
                  alt="cover-image"
                  width={2000}
                  height={600}
                  className="w-full h-full object-cover  rounded-lg"
                />
              ) : (
                <div className="w-[230px] flex flex-col items-center justify-center gap-y-3">
                  <p className="text-gray-500">
                    Drag and drop cover image here
                  </p>
                  <div className="w-full flex items-center gap-x-2">
                    <span className="h-[1px] w-[46%] bg-gray-500"></span>
                    <p>or</p>
                    <span className="h-[1px] w-[46%] bg-gray-500"></span>
                  </div>
                  <button className="text-basePrimary underline">
                    Click to Upload
                  </button>
                </div>
              )}
            </label>

            <div className="w-full from-custom-bg-gradient-start flex flex-col items-start justify-start gap-y-1 to-custom-bg-gradient-end bg-gradient-to-tr rounded-lg border p-3 sm:p-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-transparent border-none h-16 text-2xl placeholder:text-gray-500 placeholder:text-2xl"
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
                        {...field}
                        className="bg-transparent border-none h-12  placeholder:text-gray-500"
                        placeholder="Form Description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                <AddCircle className="text-basePrimary" size={20} />
                <p className="underline">Add Question</p>
              </Button>
            </div>
            
            {showSelectQuestionType && (
              <SelectQuestionType
                onClose={handleToggleSelectQuestionType}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            )}
          </form>
        </Form>
      </div>
    </InteractionLayout>
  );
}
