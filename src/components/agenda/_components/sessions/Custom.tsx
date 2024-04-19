"use client";

import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { Eye } from "@styled-icons/feather/Eye";
import { CalendarCheck } from "@styled-icons/bootstrap/CalendarCheck";
import { SessionCard } from "..";
import { Button } from "@/components";
import { CheckmarkDone } from "@styled-icons/ionicons-solid/CheckmarkDone";
import { Star } from "@styled-icons/bootstrap/Star";
import { EventLocationType } from "@/components/composables";
import { LocationPin } from "@styled-icons/entypo/LocationPin";
import Image from "next/image";
import { cn } from "@/lib";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { TFAgenda } from "@/types";
import { getCookie } from "@/hooks";
import {useRouter} from "next/navigation"
export function Custom({
  data,
  className,
}: {
  className?: string;
  data: TFAgenda;
}) {
  const event = getCookie("currentEvent");
  const router = useRouter()
  //max-w-[400px]

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    fade: false,
    speed: 400,
    delay: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const Comp = data?.session?.length > 1 ? Slider : "div";

  return (
    <SessionCard isOther isLive className={className}>
      <div className="w-full md:col-span-8 ">
        <Comp className="w-full agenda-slider h-full z-4" {...settings}>
          {data?.session?.map(({ title }, index) => (
            <div
              role="button"
              onClick={() => router.push(`/event/127/agenda/1`)}
              key={index}
              className={cn(
                "flex border-0 flex-col w-full  p-3 rounded-xl items-start justify-start "
              )}
            >
              <h2 className="text-base w-full mb-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
                {title ?? ""}
              </h2>
              <div className="w-full grid grid-cols-2 mb-2  gap-3">
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
              <div className="flex items-center gap-x-2 mb-2 ">
                <EventLocationType locationType="Hybrid" />
                <div className="flex items-center gap-x-1">
                  <LocationPin size={20} />
                  <p>Room 1</p>
                </div>
                <button className="bg-[#F44444]/10 text-xs text-[#F44444] px-2 py-2 rounded-md">
                  Track 1
                </button>
                <div className="flex items-center gap-x-2">
                  <Button className="h-fit w-fit px-0">
                    <CalendarCheck className="text-basePrimary" size={20} />
                  </Button>

                  <div className="flex items-center gap-x-2">
                    <Button className="h-fit w-fit px-0">
                      <CheckmarkDone className="" size={18} />
                    </Button>
                    <p className="text-xs sm:text-sm">Check-in</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-2  gap-x-2">
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
              <div className="w-full flex flex-col mb-2  items-start justify-start gap-y-2">
                <p>Sponsors</p>

                <div className="w-full flex flex-wrap items-start gap-4">
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
              </div>
            </div>
          ))}
        </Comp>
      </div>
    </SessionCard>
  );
}
