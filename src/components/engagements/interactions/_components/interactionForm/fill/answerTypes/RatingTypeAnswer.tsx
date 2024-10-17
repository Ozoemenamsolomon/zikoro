import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { IoMdStar } from "react-icons/io";
import { Star } from "styled-icons/fluentui-system-regular";
import { StarFullOutline } from "styled-icons/typicons";
import { z } from "zod";
import Image from "next/image";
import { formAnswerSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
export function RatingTypeAnswer({
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
  const optionFields = form.watch(`questions.${index}.optionFields`);
  const rating = form.watch(`responses.${index}.response`) || "";

  function setRating(n: number) {
    form.setValue(`responses.${index}.response`, n);
    form.setValue(`responses.${index}.type`, selectedType);
    form.setValue(`responses.${index}.questionId`, questionId);
  }
  return (
    <div className="w-full border grid grid-cols-1 gap-4 h-fit rounded-lg p-4">
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
      <div className="w-full flex items-center gap-x-2 justify-center">
        {Array.from({ length: optionFields as number })?.map((v, index) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setRating(index + 1);
            }}
            key={index}
            className={cn(
              "text-gray-400",
              index + 1 <= rating && "text-basePrimary"
            )}
          >
            {index + 1 <= rating ? (
              <StarFullOutline size={40} />
            ) : (
              <Star size={40} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
