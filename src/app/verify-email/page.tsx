"use client";

import { Button } from "@/components";
import { useResendLink } from "@/hooks";
import { cn } from "@/lib";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { LoaderAlt } from "styled-icons/boxicons-regular";
export default function Page() {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const { loading, resendLink } = useResendLink();
  const search = useSearchParams();
  const [code, setCode] = useState("")
  const message = search.get("message");
  const content = search.get("content");
  const link = search.get("redirect");
  const email = search.get("email");

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
        <h1 className="font-semibold text-xl w-full text-center sm:text-2xl">
          {message ?? ""}
        </h1>
        <p className="text-center w-full max-w-xl">{content ?? ""}</p>
        <div className="w-full max-w-xl flex items-center justify-center gap-y-3">
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
              onChange={(value) => {
                setCode(value);
              }}
            />
          </div>
          <Button
            disabled
            type="submit"
           
            className="bg-donkeysign gap-x-2 hover:bg-/80 text-gray-50 mt-3  font-medium flex items-center justify-center w-full  h-12 2xl:h-14 rounded-lg"
          >
            {"" && <LoaderAlt size={22} className="animate-spin" />}
            <p>Verify</p>
          </Button>
        </div>

        {secondsLeft <= 0 && (
          <div className={cn("block w-full space-y-3")}>
            <div className="flex items-center gap-x-2">
              <p>Didn't get OTP code?</p>
              <Button
              disabled={loading}
            //  onClick={() => resendLink(email, link)}
              className={cn("hidden text-basePrimary hover:underline w-fit mx-auto font-semibold", secondsLeft <= 0 && "flex")}
            >
              Resend
            </Button>
            </div>
            <p className="font-semibold text-center">{`0:${
              secondsLeft >= 10 ? "" : "0"
            }${secondsLeft}`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
