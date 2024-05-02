"use client";

import Image from "next/image";
import { EventDetail } from "@/components/published";
import Link from "next/link";
import { Footer } from "@/components";
import {
  useFetchSingleEvent,
  useFetchSingleOrganization,
  getCookie,
} from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { usePathname } from "next/navigation";
import { SingleEvent } from "@/components/published";
export default function SinglePublishedEvent({ id }: { id: string }) {
  const { data: eventDetail } = useFetchSingleEvent(id);
  const org = getCookie("currentOrganization");
  const { data } = useFetchSingleOrganization(org?.id);
  const pathname = usePathname();
  // console.log(id)
  // useValidateUser()
  return (
    <>
      {eventDetail ? (
        <div className="w-full h-full bg-gray-50  overflow-y-auto ">
          <div className="w-full bg-white px-4 sm:px-6 py-4">
            <Image
              src={data?.organizationLogo || "/logo.png"}
              alt="logo"
              width={300}
              height={300}
              className="w-[100px] md:w-[150px] h-[30px] md:h-[40px]"
            />
          </div>
          <SingleEvent
            isDetail={true}
            organization={eventDetail?.organisationName}
            event={eventDetail}
            useDiv={true}
            eventId={eventDetail?.eventAlias}
            imageClassName={
              "rounded-t-none rounded-tr-none sm:rounded-tl-none sm:rounded-l-none"
            }
            className="w-full bg-none  shadow-none"
            
          />

          <div className=" mx-auto p-3 sm:p-6 w-full sm:w-[65%] lg:w-[90%] xl:w-[80%]">
            <EventDetail event={eventDetail} />

            {!pathname.includes("preview") && (
              <Link
                href={`/live-events/organization/${eventDetail?.organisationId}`}
                className="flex mt-10 sm:mt-20 hover:underline items-center gap-x-2 text-basePrimary text-sm"
              >
                <span>See All Events</span>
              </Link>
            )}
          </div>

          {!pathname.includes("preview") && <Footer />}
        </div>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
    </>
  );
}
