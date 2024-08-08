"use client";

import { Button } from "@/components";
import { useResendLink, useVerifyCode } from "@/hooks";
import { cn } from "@/lib";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { LoaderAlt } from "styled-icons/boxicons-regular";
export default function Page() {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const { loading, resendLink } = useResendLink();
  const { loading: isVerifying, verifyCode } = useVerifyCode()
  const search = useSearchParams();
  const [code, setCode] = useState("")
  const message = search.get("message");
  const content = search.get("content");
  const email = search.get("email");
  const type = search.get("type");

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(countdownInterval);
        }

        return Math.max(0, prevSeconds - 1);
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  async function verify() {
    await verifyCode(email!, code, type)
  }
  return (
    <div className="w-full h-full inset-0 fixed">
      <div className="w-fit h-fit m-auto inset-0 absolute flex flex-col gap-y-2 items-center justify-center px-4">
        <Image
          src="/mail64.png"
          alt="mail"
          className="w-20 h-20"
          width={100}
          height={100}
        />
        <h1 className="font-semibold text-base w-full text-center sm:text-xl">
          {message ?? ""}
        </h1>
        <p className="text-center w-full max-w-xl">{content ?? ""}</p>
        <div className="w-full max-w-xl flex flex-col items-center justify-center gap-y-3">
          <div className="w-full flex items-center h-24 justify-center">
            <VerificationInput
              classNames={{
                character: "character",
                container: "container",
              }}
              placeholder=" "
              length={6}
            
              inputProps={{
                autoComplete: "one-time-code", // for IOS
              }}
              onChange={(value: string) => {
                setCode(value);
              }}
            />
          </div>
          <Button
            disabled={isVerifying || code === ""}
            type="submit"
            onClick={verify}
            className="bg-basePrimary gap-x-2 text-gray-50 mt-3  font-medium flex items-center justify-center w-full  h-12 2xl:h-14 rounded-lg"
          >
            {isVerifying && <LoaderAlt size={22} className="animate-spin" />}
            <p>{type === "reset-password" ? "Verify OTP": 'Verify'}</p>
          </Button>
        </div>

        {secondsLeft <= 0 && (
          <div className={cn("block w-full space-y-3")}>
            <div className="flex w-full justify-center items-center gap-x-2">
              <p>Didn't get OTP code?</p>
              <Button
                disabled={loading}
                onClick={() => resendLink(email!)}
                className={cn("hidden text-basePrimary px-2 hover:underline w-fit font-semibold", secondsLeft <= 0 && "flex")}
              >
                Resend
              </Button>
            </div>

          </div>
        )}
        <p className="font-semibold w-full text-center">{`0:${secondsLeft >= 10 ? "" : "0"
          }${secondsLeft}`}</p>
      </div>
    </div>
  );
}
