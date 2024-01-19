"use client";

import { AlertTriangleOutline } from "styled-icons/evaicons-outline";
import { Button } from "@/components";
import { useDeleteEvent } from "@/hooks";
import Link from "next/link";
import { EmailOutline } from "styled-icons/evaicons-outline";
import { Whatsapp } from "styled-icons/remix-fill";
import {CloseOutline} from "@styled-icons/evaicons-outline/CloseOutline"
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export function DeleteEventModal({
  close,
  id,
  refetch,
  isPublished,
}: {
  refetch: () => Promise<any>;
  close: () => void;
  isPublished: boolean;
  id: number;
}) {
  const { deleteEvent, loading } = useDeleteEvent();

  async function deletes() {
    await deleteEvent(id);
    refetch();
    close();
  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[60] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] h-fit  box-animation rounded-lg bg-white m-auto absolute inset-0 py-8 px-3 sm:px-4"
      >
      <Button
      onClick={close}
      className="px-2 absolute top-0 right-3"
      >
        <CloseOutline size={22}/>
      </Button>
        {isPublished ? (
          <div className="flex flex-col w-full gap-y-16 sm:gap-y-20">
            <div className="w-full flex flex-col items-center justify-center gap-y-2">
              <AlertTriangleOutline className="text-zikoro" size={72} />
              <p>
                You cannot delete a{" "}
                <span className="font-semibold uppercase">published</span>{" "}
                event.
              </p>
              <p>
                Contact{" "}
                <span className="font-semibold uppercase">Zikoro Admin</span>{" "}
                for support on how to handle this event
              </p>

              <div className="flex items-center gap-x-2">
                <Link
                  className="text-zikoro rounded-lg px-4 w-fit gap-x-2 flex items-center justify-center bg-transparent h-12 border border-zikoro"
                  target="blank"
                  href="/"
                >
                  <EmailOutline size={22} />
                  <span>Email</span>
                </Link>
                <Link
                  className="text-zikoro px-4 rounded-lg flex items-center justify-center w-fit bg-transparent h-12 gap-x-2 border border-zikoro"
                  target="blank"
                  href="/"
                >
                  <Whatsapp size={22} />
                  <span>WhatsApp</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-y-16 sm:gap-y-20">
            <div className="w-full flex flex-col items-center justify-center gap-y-2">
              <AlertTriangleOutline className="text-zikoro" size={72} />
              <p>Are you sure you want to delete this event?</p>
            </div>

            <div className="w-full flex items-end justify-end gap-x-3">
              <Button onClick={close} className=" font-medium ">
                Cancel
              </Button>

              <Button
                onClick={deletes}
                className="bg-zikoro text-gray-50 gap-x-2 font-medium "
              >
                {loading && <LoaderAlt className="animate-spin" size={20} />}
                <span>Delete</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
