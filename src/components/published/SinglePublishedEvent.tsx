"use client";

import Image from "next/image";
import { EventDetail } from "@/components/published";
import Link from "next/link";
import { Footer} from "@/components";
import { useFetchSingleEvent } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { usePathname } from "next/navigation";
import {useValidateUser} from "@/hooks"
export default function SinglePublishedEvent({id}: {id:string}) {
  const { data: eventDetail } = useFetchSingleEvent(id);
  const pathname = usePathname()
 // console.log(id)
 useValidateUser()
  return (
    <>
     
      <div className="w-full h-full bg-gray-50 fixed inset-0 overflow-y-auto p-3 sm:p-6">
        <Image
          src="/logo.png"
          alt="logo"
          width={300}
          height={300}
          className="w-[100px] md:w-[150px] h-[30px] md:h-[40px]"
        />

        <div className="mt-10 sm:mt-32 mx-auto  w-full sm:w-[65%] lg:w-[90%] xl:w-[80%]">
          {eventDetail ? (
            <EventDetail event={eventDetail} />
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center">
              <LoaderAlt size={50} className="animate-spin" />
            </div>
          )}

        {!pathname.includes("preview") &&  <Link
            href={`/live-events/organization/${id}`}
            className="flex mt-10 sm:mt-20 hover:underline items-center gap-x-2 text-basePrimary text-sm"
          >
            <span>See All Events</span>
          </Link>}
        </div>

      {!pathname.includes("preview")  && <Footer />}
      </div>
    </>
  );
}
