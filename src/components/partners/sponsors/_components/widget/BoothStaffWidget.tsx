"use client";

import { cn } from "@/lib";
import Image from "next/image";
import { CloseCircle } from "@styled-icons/evaicons-solid/CloseCircle";
import { Button } from "@/components";

export function BoothStaffWidget({
  image,
  name,
  profession,
  company,
  remove,
  email,
  isAddingBoothStaff,
}: {
  image?: string | null;
  name: string;
  profession?: string | null;
  email: string;
  remove?: (email: string) => void;
  company?: string | null;
  isAddingBoothStaff?: boolean;
 
}) {
  return (
    <div
      className={cn(
        "flex  items-start justify-start group gap-x-2",
        isAddingBoothStaff && "hover:bg-gray-100 relative rounded-md p-2"
      )}
    >
      <div className="flex flex-col gap-y-1 items-center justify-center">
       {image ? <Image
          alt="staff"
          width={120}
          height={120}
          className="w-12 h-12 rounded-full "
          src={image || "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"}
        />
        :
        <div className="w-12 bg-gray-100 h-12 flex items-center justify-center">
            <p className="text-gray-700">{`${name?.split(" ")[0]}${name?.split(" ")[1]}`}</p>
        </div>
      
      }
      
      </div>
      <div className="flex text-sm flex-col items-start justify-start">
        <p className="font-medium capitalize">{name || ""}</p>
        <p className="text-tiny text-[#717171]">{profession || ""}</p>
        <p className="text-tiny text-[#717171]">{company || ""}</p>
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
