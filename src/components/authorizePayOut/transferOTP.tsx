"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { DialogClose } from "../ui/dialog";
import { useFinalizePayOut, useGetPayOuts } from "@/hooks/services/payout";
import { useRef } from "react";
import { getCookie } from "@/hooks";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function TransferOTP({
  transferCode,
  setStep,
  payOutRef,
}: {
  transferCode: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payOutRef: string;
}) {
  const user = getCookie("user");

  const { getPayOuts } = useGetPayOuts({
    userId: user?.id || 0,
  });
  const { finalizePayOut, isLoading } = useFinalizePayOut();

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { reference, status } = await finalizePayOut({
      payload: {
        transferCode,
        OTP: parseInt(data.pin),
        payOutRef,
        paidOutBy: user.id,
      },
    });

    if (!status) return;

    await getPayOuts();

    clsBtnRef.current?.click();

    setStep(0);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-6 flex-col flex items-center px-4"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="bg-basePrimary w-full">
          Submit OTP
        </Button>{" "}
        <DialogClose>
          <button className="hidden" ref={clsBtnRef}>
            close
          </button>
        </DialogClose>
      </form>
    </Form>
  );
}
