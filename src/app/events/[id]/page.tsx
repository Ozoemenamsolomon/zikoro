"use client"

import Image from "next/image";
import { EventDetail } from "@/components/published";
import Link from "next/link";
import { Footer } from "@/components"
import { fetchSingleEvent } from "@/hooks";
import { Event } from "@/types";

export default async function Page({ params: { id } }: { params: { id: string } }) {
    const eventDetail:Event = await fetchSingleEvent(id)
  
    console.log({eventDetail})
  return (

    <div className="w-full h-full bg-gray-50 p-4 sm:p-6">
      <Image
        src="/images/zikoro.png"
        alt="logo"
        width={300}
        height={300}
        className="w-[150px] h-[40px]"
      />

      <div className="mt-10 sm:mt-32 mx-auto  w-[95%] sm:w-[65%] lg:w-[90%] xl:w-[70%]">
        <EventDetail event={eventDetail}/>

        <Link
          href="/events"
          className="flex mt-10 sm:mt-20 hover:underline items-center gap-x-2 text-zikoro text-sm"
        >

          <span>See All Events</span>
        </Link>
      </div>



      <Footer />
    </div>
  );
}
