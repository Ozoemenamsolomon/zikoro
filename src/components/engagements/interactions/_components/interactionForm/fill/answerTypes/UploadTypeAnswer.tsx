import { UseFormReturn } from "react-hook-form";
// import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoMdStar } from "react-icons/io";
import { z } from "zod";
import Image from "next/image";
import { formAnswerSchema } from "@/schemas/engagement";
export function UploadTypeAnswer({
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

  return (
    <div className="w-full shadow border grid grid-cols-1 gap-4 h-fit rounded-lg p-4">
      {question && (
        <div className="w-full p-2 ">
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
      <Input
        name={`responses.${index}.response`}
     //   value={form.getValues(`responses.${index}.response`)}
        onChange={(e) => {
         if (e.target.files) {
            const files = e.target.files[0]
            form.setValue(`responses.${index}.response`, files);
            form.setValue(`responses.${index}.type`, selectedType);
            form.setValue(`responses.${index}.questionId`, questionId);
         }
        }}
        required={isRequired}
        type="file"
        
        className="w-full h-12 sm:h-14 rounded-none border-x-0 border-t-0 border-b px-2 placeholder:text-gray-500 placeholder-gray-500"
        placeholder="Enter Answer"
      />
      {/* <FormField
        control={form.control}
        
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
             
            </FormControl>
          </FormItem>
        )}
      /> */}
    </div>
  );
}