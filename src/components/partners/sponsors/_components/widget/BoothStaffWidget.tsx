"use client";

import { cn } from "@/lib";
import Image from "next/image";
import { CloseCircle } from "styled-icons/evaicons-solid";
import { Button } from "@/components";

export function BoothStaffWidget({
  image,
  name,
  profession,
  company,
  remove,
  email,
  isAddingBoothStaff,
  className
}: {
  image?: string | null;
  name: string;
  profession?: string | null;
  email: string;
  remove?: (email: string) => void;
  company?: string | null;
  isAddingBoothStaff?: boolean;
 className?:string
}) {
  return (
    <div
      className={cn(
        "flex  items-start justify-start group gap-x-2",
        isAddingBoothStaff && "hover:bg-gray-50 relative rounded-md p-2",
        className
      )}
    >
      <div className="flex col-span-2  gap-y-1 items-center justify-center">
       {image ? <Image
          alt="staff"
          width={120}
          height={120}
          className="w-[3rem] h-[3rem] rounded-full "
          src={image || "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"}
        />
        :
        <div className="w-[3rem] bg-gradient-to-tr border-basePrimary from-custom-bg-gradient-start border to-custom-bg-gradient-end h-[3rem] rounded-full flex items-center justify-center">
            <p className="gradient-text  bg-basePrimary text-lg uppercase">{`${name?.split(" ")[0].charAt(0)}${name?.split(" ")[1].charAt(0)}`}</p>
        </div>
      
      }
      
      </div>
      <div className="flex col-span-5 text-sm flex-col items-start justify-start">
        <p className="font-medium capitalize text-ellipsis whitespace-nowrap overflow-hidden">{name || ""}</p>
        <p className="text-tiny text-[#717171] text-ellipsis whitespace-nowrap overflow-hidden">{profession || ""}</p>
        <p className="text-tiny text-[#717171] text-ellipsis whitespace-nowrap overflow-hidden">{company || ""}</p>
      </div>

      {isAddingBoothStaff && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (remove) remove(email);
          }}
          className="hidden group-hover:block w-fit h-fit px-0 absolute right-1 top-1 text-black"
        >
          <CloseCircle size={20} />
        </Button>
      )}
    </div>
  );
}
