import { UseFormReturn, useWatch } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoMdStar } from "react-icons/io";
import { z } from "zod";
import Image from "next/image";
import { formAnswerSchema } from "@/schemas/engagement";

type OptionItemsType = {
  id: string;
  option: string;
  optionImage: string;
};

export function CheckboxTypeAnswer({
  form,
  index,
}: {
  form: UseFormReturn<z.infer<typeof formAnswerSchema>, any, any>;
  index: number;
}) {
  const question = form.watch(`questions.${index}.question`);
  const isRequired = form.watch(`questions.${index}.isRequired`);
  const questionImage = form.watch(`questions.${index}.questionImage`);
  const selectedType = form.watch(`questions.${index}.selectedType`);
  const questionId = form.watch(`questions.${index}.questionId`);
  const optionFields  = form.watch(`questions.${index}.optionFields`) as OptionItemsType[];

  const response = useWatch({
    control: form.control,
    name: `responses.${index}.response` as const,
  })  || ''
  return (
    <div className="w-full bg-white border grid grid-cols-1 gap-4 h-fit rounded-lg p-4">
      {question && (
        <div className="w-full p-2 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end">
          <p className="w-full text-start leading-7 flex ">
            {question ?? ""}{" "}
            {isRequired && <IoMdStar size={12} className="text-red-700" />}
          </p>
        </div>
      )}
      {questionImage && (
        <div className="w-full max-w-3xl mx-auto">
          <Image
            src={questionImage}
            alt=""
            className="w-full h-[30rem] object-cover"
            width={1000}
            height={600}
          />
        </div>
      )}

      <div className="w-full flex flex-col items-start justify-start gap-y-4">
        {Array.isArray(optionFields) &&
          optionFields.map((value) => (
            <>
            <label  className="flex items-center">
              <input
                type="radio"
                onChange={(e) => {
                  e.target.checked ? form.setValue(`responses.${index}.response`, e.target.value): form.setValue(`responses.${index}.response`, '');
                  
                  form.setValue(`responses.${index}.type`, selectedType);
                  form.setValue(`responses.${index}.questionId`, questionId);
                }}
                checked={response === value?.option}
                value={value?.option}
                required={isRequired}
                className="h-[20px] pt-3 w-[20px] mr-4 accent-basePrimary"
              />
              <span className="capitalize">{value?.option}</span>
            </label>
           {value?.optionImage && <div className="w-full max-w-3xl mx-auto mt-3">
          
          <Image
            src={value?.optionImage}
            alt=""
            className="w-full h-[30rem] object-cover"
            width={1000}
            height={600}
          />
            </div>}
            </>
          ))}
      </div>
    </div>
  );
}

// <FormField
// key={value}
// control={form.control}
// name={`responses.${index}.response`}
// render={({ field }) => (

// )}
// />