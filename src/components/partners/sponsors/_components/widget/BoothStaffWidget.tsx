"use client"

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
  image: string;
  name: string;
  profession: string;
  email: string;
  remove?: (email: string) => void;
  company: string;
  isAddingBoothStaff?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex  items-start justify-start group gap-x-2",
        isAddingBoothStaff && "hover:bg-gray-100 relative rounded-md p-2"
      )}
    >
      <Image
        alt="staff"
        width={120}
        height={120}
        className="w-12 h-12 rounded-full "
        src={image || "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"}
      />
      <div className="flex text-sm flex-col items-start justify-start">
        <p className="font-medium">{name || "John Doe"}</p>
        <p className="text-[#717171]">{profession || "Data Analyst"}</p>
        <p className="text-[#717171]">{company || "Oracle"}</p>
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
