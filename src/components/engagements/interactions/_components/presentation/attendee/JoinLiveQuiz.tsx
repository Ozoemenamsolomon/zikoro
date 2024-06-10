"use client";

import Image from "next/image";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/components";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinLiveQuizSchema } from "@/schemas";
import { usePathname } from "next/navigation";
import { useFetchQuiz } from "@/hooks";
export default function JoinLIveQuiz() {
  const { getQuiz, isLoading } = useFetchQuiz();
  const form = useForm<z.infer<typeof joinLiveQuizSchema>>({
    resolver: zodResolver(joinLiveQuizSchema),
  });

  async function onSubmit(value: z.infer<typeof joinLiveQuizSchema>) {
    // window.open(`${pathname}/${value.code}`, "_self");
   const quiz =  await getQuiz(value.code);

   window.open(
    `/quiz/${quiz?.eventAlias}/present/${quiz?.quizAlias}`,
    "_self"
  );
  }
  return (
    <div className="w-full bg-gradient-to-t from-[#001fcc]/30 fixed inset-0 h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col-reverse gap-6 items-center justify-center w-full px-8 sm:px-4 sm:flex-row h-full mx-auto max-w-4xl"
        >
          <div className="flex flex-col w-full sm:w-[50%] items-start justify-start gap-y-2">
            <h2 className="font-semibold text-lg sm:text-2xl">
              Join Event Interaction
            </h2>
            <p className="mb-4">Enter the code to join the interaction</p>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the code"
                      {...form.register("code")}
                      className=" placeholder:text-sm h-11 sm:h-12 border-basePrimary bg-transparent  placeholder:text-zinc-500 text-zinv-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-fit  mt-2 px-4 h-11 sm:h-12 text-white bg-basePrimary rounded-lg"
            >
              Join Interaction
            </Button>
          </div>

          <Image
            src="/entrypoint.png"
            alt=""
            className="w-[50%] max-h-[350px]"
            width={500}
            height={500}
          />
        </form>
      </Form>
    </div>
  );
}
