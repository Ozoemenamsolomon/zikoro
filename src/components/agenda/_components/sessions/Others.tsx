"use client";

import { EditOutline } from "@styled-icons/evaicons-outline/EditOutline";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { Eye } from "@styled-icons/feather/Eye";
import { CalendarCheck } from "@styled-icons/bootstrap/CalendarCheck";
import { SessionCard } from "..";
import { Button } from "@/components";
import { CheckmarkDone } from "@styled-icons/ionicons-solid/CheckmarkDone";

export function Others({ title }: { title: string }) {
  return (
    <SessionCard>
      <div className="w-full md:col-span-8 flex flex-col items-start justify-start gap-y-2">
        <p className="font-semibold text-lg sm:text-3xl">{title}</p>
        <div className="flex items-center gap-x-3">
          <Button className="h-fit w-fit px-0">
            <CalendarCheck className="text-basePrimary" size={20} />
          </Button>

          <div className="flex items-center gap-x-2">
            <Button className="h-fit w-fit px-0">
              <CheckmarkDone className="text-basePrimary" size={18} />
            </Button>
            <p className="text-xs sm:text-sm">Checked-in</p>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Button className="h-fit w-fit px-0">
            <EditOutline size={20} />
          </Button>
          <Button className="h-fit w-fit px-0">
            <Copy size={20} />
          </Button>
          <Button className="h-fit text-red-500 w-fit px-0">
            <DeleteOutline size={20} />
          </Button>
          <Button className="h-fit  gap-x-2 w-fit px-0">
            <Eye size={20} />
            <p>0</p>
          </Button>
        </div>
      </div>
    </SessionCard>
  );
}
