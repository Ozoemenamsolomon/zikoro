import Image from "next/image";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CheckboxTypeAnswer,
  DateTypeAnswer,
  TextTypeAnswer,
} from "./answerTypes";
export default function AttendeeFillForm({eventId}:{eventId:string}) {
  const form = useForm({});
  return (
    <div className="w-full">
      <Image
        src="/fcoverimage.png"
        alt=""
        className="w-full h-[10rem] sm:h-[15rem] 2xl:h-[20rem]"
      />

      <div className="w-full px-4 my-10 sm:my-20 mx-auto max-w-4xl ">
        <h2 className="text-lg mb-3 sm:text-xl lg:text-2xl">Form Title</h2>
        <p className="text-sm sm:text-base">Form Description</p>

        <Form {...form}>
          <form className="w-full flex flex-col items-start justify-start gap-y-4 sm:gap-y-6 2xl:gap-y-8">
            <TextTypeAnswer form={form} />
            <DateTypeAnswer form={form} />
            <CheckboxTypeAnswer form={form} />
          </form>
        </Form>
      </div>
    </div>
  );
}
