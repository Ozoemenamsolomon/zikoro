"use client";
import { useGetAttendee } from "@/hooks/services/attendee";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ThirdSection from "../../_reusable/ThirdSection";
import SecondSection from "../../_reusable/SecondSection";
import { toast } from "@/components/ui/use-toast";

const page = () => {
  const router = useRouter();
  const { attendeeId } = useParams();
  console.log(attendeeId);

  const { attendee, isLoading, getAttendee } = useGetAttendee({
    attendeeId,
  });

  console.log(attendee);

  //   if (!isLoading && !attendee) {
  //     toast({ variant: "destructive", description: "attendee does not exist" });
  //     router.push("/people/all");
  //   }

  return (
    <div>
      {!isLoading && attendee ? (
        <div className="space-y-6">
          <section className="md:col-span-4 space-y-4 border-r-[1px] overflow-auto no-scrollbar max-h-full">
            <SecondSection attendee={attendee} />
          </section>
          <section className="flex flex-col md:col-span-3 pt-2">
            <ThirdSection attendee={attendee} />
          </section>
        </div>
      ) : (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <div className="animate-spin">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 1024 1024"
              height="2.5em"
              width="2.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;