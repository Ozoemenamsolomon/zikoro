"use client";

import { Button } from "..";
import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { Eye } from "@styled-icons/feather/Eye";
import { Star } from "@styled-icons/bootstrap/Star";
import { EventLocationType } from "../composables";
import { Link } from "@styled-icons/octicons/Link";
import { LocationPin } from "@styled-icons/entypo/LocationPin";
import { CalendarCheck } from "@styled-icons/bootstrap/CalendarCheck";
export function SingleAgenda() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start gap-3">
      <div className="w-full lg:col-span-5">
        <div className="w-full h-64 sm:h-[20.5rem] bg-gray-200 animate-pulse"></div>
        <div className="w-full mb-2 flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-start lg:justify-between">
          <p className="text-xs text-gray-50 bg-basePrimary rounded-md  p-2 ">
            Happening Now
          </p>
          <div className="flex items-center  gap-x-2">
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
        <h2 className="text-base w-full mb-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
          Introduction to Software Development
        </h2>
        <p className="mb-2 text-gray-500 text-xs">
          Wednesday 20th, November 2023 10:00AM - 12:00PM
        </p>
        <div className="flex items-center flex-wrap gap-2 mb-2 ">
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
      </div>
    </div>
  );
}
