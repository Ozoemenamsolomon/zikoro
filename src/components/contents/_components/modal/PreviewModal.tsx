"use client";

import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import {
  Form,
  FormField,
  Input,
  FormControl,
  FormItem,
  FormLabel,
  Button,
} from "@/components";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import copy from "copy-to-clipboard";
import { ExternalLinkOutline } from "styled-icons/evaicons-outline";
import { Copy } from "@styled-icons/feather/Copy";
import Link from "next/link";
import { useState } from "react";
import { TriangleDown } from "@styled-icons/entypo/TriangleDown";
import { getCookie } from "@/hooks";

export function PreviewModal({ close }: { close: () => void }) {
  const form = useForm({});
  const event = getCookie("currentEvent");

  // rating numbers

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">Preview</h2>
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form className="flex items-start w-full flex-col gap-y-3">
            <p className="text-mobile sm:text-sm">{`Open Link to Access ${
              event?.eventName ?? ""
            }`}</p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative w-full h-fit">
                  <FormLabel className="absolute top-0  right-4 bg-white text-gray-600 text-xs px-1">
                    Link
                  </FormLabel>
                  <div className="flex absolute top-3 right-3 items-center gap-x-2">
                    <CopyLink
                      link={`${window.location.origin}/preview/${event?.eventId}`}
                    />
                    <Link target="_blank" href={`/preview/${event?.eventId}`}>
                      <ExternalLinkOutline size={16} />
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder=""
                      defaultValue={`${window.location.origin}/preview/${event?.eventId}`}
                      readOnly
                      className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex mt-6 items-center justify-between">
              <p className="text-xs sm:text-sm">{`Scan QRCode to preview ${
                event?.eventName ?? ""
              }`}</p>
              <QRCode
                size={150}
                value={`${window.location.origin}/preview/${event?.eventId}`}
              />
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                close();
              }}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              <span>Done</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function CopyLink({ link }: { link: string }) {
  const [isCopy, setCopy] = useState(false);

  function copied() {
    copy(link);
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        copied();
      }}
    >
      <Copy size={16} />
      {isCopy && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute shadow-lg rounded-lg border top-[-2rem] flex items-center justify-center w-fit px-4 py-2 px- -right-3 bg-basePrimary"
        >
          <p className="text-gray-50 text-sm">Copied</p>

          <div className="absolute right-[38%] bottom-[-13px]">
            <TriangleDown size={18} className=" text-basePrimary" />
          </div>
        </div>
      )}
    </button>
  );
}
