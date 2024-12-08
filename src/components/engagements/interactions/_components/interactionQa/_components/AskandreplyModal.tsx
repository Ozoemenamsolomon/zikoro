"use client";

import { Button, Form, FormField, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { InlineIcon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { eventQaAskAndReplySchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function AskandReplyModal({close}:{close:() => void;}) {
  const form = useForm<z.infer<typeof eventQaAskAndReplySchema>>({
    resolver: zodResolver(eventQaAskAndReplySchema),
  });

  async function onSubmit() {}
  return (
    <div 
    onClick={close}
    className="w-full h-full z-[100] inset-0 bg-black/50 fixed">
      <div
      onClick={(e) => e.stopPropagation()}
      className="w-[95%] max-w-3xl p-4 h-fit sm:p-6 m-auto absolute inset-0 bg-white rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-start flex-col justify-start gap-y-4"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <InputOffsetLabel label="">
                  <Textarea
                    placeholder="Enter the question"
                    {...form.register("text")}
                    className="placeholder:text-sm h-96  placeholder:text-gray-400 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />
            <div className="w-full flex items-center justify-between">
              <label
                htmlFor="isAnonymous"
                className="flex items-center gap-x-2"
              >
                <input
                  id="isAnonymous"
                  name="isAnonymous"
                  type="checkbox"
                  onChange={(e) =>
                    form.setValue("isAnonymous", e.target.checked)
                  }
                  className="accent-basePrimary h-5 w-5 rounded-lg"
                />
                <p>Ask as anyonymous</p>
              </label>
              <Button
                type="submit"
                className="w-fit bg-basePrimary gap-x-2 text-white"
              >
                <p>Send</p>
                <InlineIcon icon="prime:send" color="#ffffff" fontSize={22} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
