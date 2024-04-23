"use client";

import { Button } from "@/components";
import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { Eye } from "@styled-icons/feather/Eye";
import { Star } from "@styled-icons/bootstrap/Star";
import { EventLocationType } from "@/components/composables";
import { Link } from "@styled-icons/octicons/Link";
import { LocationPin } from "@styled-icons/entypo/LocationPin";
import { CalendarCheck } from "@styled-icons/bootstrap/CalendarCheck";
import { CollapsibleWidget } from ".";
import { FilePdf } from "@styled-icons/fa-regular/FilePdf";
import Image from "next/image";
import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
export function AboutSession() {
  return (
    <div className="w-full lg:col-span-5 border-r">
      <div className="w-full h-48 sm:h-[16rem] bg-gray-200 animate-pulse"></div>
      <div className="w-full p-4 mb-2 flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-start lg:justify-between">
        <p className="text-xs text-gray-50 bg-basePrimary rounded-md  p-2 ">
          Happening Now
        </p>
        <div className="flex items-center px-4 gap-x-2">
          <Button className="h-fit w-fit px-0">
            <EditOutline size={20} />
          </Button>
          <Button className="h-fit w-fit px-0">
            <Copy size={20} />
          </Button>
          <Button className="h-fit text-red-500 w-fit px-0">
            <DeleteOutline size={22} />
          </Button>
          <Button className="h-fit  gap-x-2 w-fit px-0">
            <Eye size={20} />
            <p className="text-xs sm:text-sm text-gray-500">0</p>
          </Button>
          <Button className="h-fit gap-x-2 w-fit px-0">
            <Star size={20} />
            <div className="text-gray-500 flex items-center text-xs sm:text-sm gap-x-1">
              <p>4.5 .</p>
              <p>Reviews</p>
            </div>
          </Button>
        </div>
      </div>
      <h2 className="text-base px-4 w-full mb-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
        Introduction to Software Development
      </h2>
      <p className="mb-2 px-4 text-gray-500 text-xs">
        Wednesday 20th, November 2023 10:00AM - 12:00PM
      </p>
      <div className="flex px-4 items-center flex-wrap gap-3 mb-2 ">
        <EventLocationType locationType="Hybrid" />
        <div className="flex items-center gap-x-1">
          <LocationPin size={20} />
          <p>Room 1</p>
        </div>
        <button className="bg-[#F44444]/10 text-xs text-[#F44444] px-2 py-2 rounded-md">
          Track 1
        </button>
        <button className="flex items-center gap-x-2">
          <Link size={18} />
          <p className="text-xs">Join Live Event</p>
        </button>
      </div>

      <section className="w-full flex flex-col  pb-2">
        <div className="w-full px-3 py-3 border-y flex items-center justify-between">
          <p className="font-semibold text-base sm:text-xl">
            Session Description
          </p>
        </div>
        <div className="items-start text-[13px] sm:text-sm text-gray-600 px-3 py-4 justify-start flex w-full flex-wrap">
          when an unknown printer took a galley of type and scrambled it to make
          a type specimen book. It has survived not only five centuries, but
          also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </div>
      </section>
      <CollapsibleWidget title="Speakers">
        <div className="w-full px-3 py-4 grid grid-cols-3 items-center gap-4">
          {[1, 2, 3, 4].map((_) => (
            <BoothStaffWidget
              company={"DND"}
              image={null}
              name="Ademola Segun"
              profession={"Moderator"}
              email="ademola@gmail.com"
              key={_}
            />
          ))}
        </div>
      </CollapsibleWidget>
      <CollapsibleWidget title="Moderator">
        <div className="w-full px-3 py-4 grid grid-cols-3 items-center gap-4">
          {[1, 2, 3, 4].map((_) => (
            <BoothStaffWidget
              company={"DND"}
              image={null}
              name="Ademola Segun"
              profession={"Moderator"}
              email="ademola@gmail.com"
              key={_}
            />
          ))}
        </div>
      </CollapsibleWidget>
      <CollapsibleWidget title="Sponsors">
        <div className="w-full px-3 py-4 grid grid-cols-4 items-center gap-4">
          {[1, 2, 3, 4].map((_) => (
            <Image
              src="/logo.png"
              alt="sponsor"
              width={200}
              height={100}
              className=" w-[100px] object-contain h-[40px]"
            />
          ))}
        </div>
      </CollapsibleWidget>
      <CollapsibleWidget title="File">
        <div className="w-full px-3 py-4 grid grid-cols-2 items-center gap-4">
          {[1, 2, 3, 4].map((_) => (
            <div 
            key={_}
            className="w-full border rounded-lg p-3 flex items-start justify-start gap-x-2">
              <FilePdf size={25} className="text-red-500" />
              <div className="space-y-1">
                <p className="text-[13px] sm:text-sm text-gray-500">
                  New File.pdf
                </p>
                <p className="text-[11px] sm:text-xs text-gray-400">2MB</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleWidget>
    </div>
  );
}
