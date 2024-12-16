"use client";

import { Button, Form, FormField, Input, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { InlineIcon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { eventQaAskAndReplySchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostRequest } from "@/hooks/services/request";
import { generateAlias } from "@/utils";
import { TEventQAQuestion, TUserAccess } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useMemo } from "react";

export function AskandReplyModal({
  close,
  QandAAlias,
  refetch,
  userDetail,
  setUserAccess,
  isAttendee,
}: {
  QandAAlias: string;
  close: () => void;
  refetch?: () => void;
  userDetail: TUserAccess;
  isAttendee?: boolean;
  setUserAccess?: (c:TUserAccess | null) => void
}) {
  const form = useForm<z.infer<typeof eventQaAskAndReplySchema>>({
    resolver: zodResolver(eventQaAskAndReplySchema),
    defaultValues: {
      anonymous: false,
      userNickName: userDetail?.userNickName,
    },
  });
  const { postData, isLoading } = usePostRequest("/engagements/qa/qaQuestion");
const alias = useMemo(() => {
  return generateAlias()
},[])
  async function onSubmit(values: z.infer<typeof eventQaAskAndReplySchema>) {
    if (!values?.anonymous && !values?.userNickName) {
      return toast.error("Pls add a name");
    }

    if (values?.userNickName && values?.userNickName?.length < 2) {
      return toast.error("Name must be at least two letters");
    }

    const questionAlias = generateAlias();
    const user = {
      userId: userDetail?.userId || alias,
      userImage: userDetail?.userNickName || values?.userNickName,
      userNickName: userDetail?.userNickName || values?.userNickName,
    }
    const payload: Partial<TEventQAQuestion> = {
      ...user,
      ...values,
      QandAAlias: QandAAlias,
      questionAlias: questionAlias,
      questionStatus: isAttendee ? "pending" : "verified",
    };
    await postData({ payload });
    setUserAccess?.(user)
   
    refetch?.();
    close();
  }
  return (
    <div className="w-full h-full z-[100] inset-0 bg-black/50 fixed">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] max-w-3xl p-4 h-fit sm:p-6 m-auto absolute inset-0 bg-white rounded-lg"
      >
        <div className="w-full flex items-end mb-3 justify-end">
          <button onClick={close}>
            <MdClose size={22} />
          </button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-start flex-col justify-start gap-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <InputOffsetLabel label="">
                  <Textarea
                    placeholder="Enter the question"
                    {...form.register("content")}
                    className="placeholder:text-sm h-96  placeholder:text-gray-400 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="userNickName"
              render={({ field }) => (
                <InputOffsetLabel label="">
                  <Input
                    placeholder="Enter your nickname"
                    {...form.register("userNickName")}
                    className="placeholder:text-sm h-12 placeholder:text-gray-400 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div className="w-full flex items-center justify-between">
              <label htmlFor="anonymous" className="flex items-center gap-x-2">
                <input
                  id="anonymous"
                  name="anonymous"
                  type="checkbox"
                  onChange={(e) => form.setValue("anonymous", e.target.checked)}
                  className="accent-basePrimary h-5 w-5 rounded-lg"
                />
                <p>Ask as anyonymous</p>
              </label>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-fit bg-basePrimary gap-x-2 text-white"
              >
                <p>Send</p>
                <InlineIcon icon="prime:send" color="#ffffff" fontSize={22} />
                {isLoading && <LoaderAlt size={20} className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
