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
import {
  useFinalizePayOut,
  useGetPayOuts,
  useResendOTP,
} from "@/hooks/services/payout";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "@/hooks";
import { TUser } from "@/types";
import useUserStore from "@/store/globalUserStore";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function TransferOTP({
  transferCode,
  setStep,
  payOutRef,
  isRetry,
  requestedBy,
  amount,
}: {
  transferCode: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payOutRef: string;
  isRetry: boolean;
  requestedBy: TUser;
  amount: number;
}) {
  const { user } = useUserStore();

  console.log(user, "user");

  if (!user) return null;

  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const { getPayOuts } = useGetPayOuts({
    userId: user?.id || 0,
  });
  const { finalizePayOut, isLoading } = useFinalizePayOut();

  const { resendOTP, isLoading: resendingOTP } = useResendOTP();

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  useEffect(() => {
    if (isRetry) {
      resendOTP({ payload: { transferCode } });
    }
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return null;
    const { reference, status } = await finalizePayOut({
      payload: {
        transferCode,
        OTP: parseInt(data.pin),
        payOutRef,
        paidOutBy: user.id,
        userEmail: requestedBy.userEmail,
        userName: requestedBy.firstName,
        paidOutEmail: user.userEmail,
        paidOutName: user.firstName,
        amount,
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
        <button
          type="button"
          onClick={async () => {
            const { status } = await resendOTP({ payload: { transferCode } });

            if (!status) return;

            setTimer(60);
            setIsResendDisabled(true);
          }}
          className="text-sky-600 text-sm w-full text-left disabled:text-gray-600"
          disabled={isResendDisabled || resendingOTP}
        >
          Resend OTP {isResendDisabled && `in 00:${timer}`}
        </button>
        <Button disabled={isLoading} className="bg-basePrimary w-full">
          Submit OTP
        </Button>{" "}
        <DialogClose>
          <button type="button" className="hidden" ref={clsBtnRef}>
            close
          </button>
        </DialogClose>
      </form>
    </Form>
  );
}
