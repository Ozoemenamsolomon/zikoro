"use client"

import { usePartnersTab } from "@/context";
import { cn } from "@/lib";
import { Button } from "@/components";
import { PartnersEnum } from "@/types";

export function HeaderTab() {
    const {active, setActive} = usePartnersTab()
    return (
        <div className="flex items-center justify-start w-full py-4 border-b gap-x-8">
        <Button
          onClick={() => setActive(1)}
          className={cn(
            "bg-transparent",
            active === PartnersEnum.SPONSORS_TAB && "text-zikoro"
          )}
        >
          Sponsors
        </Button>
        <Button
          onClick={() => setActive(2)}
          className={cn(
            "bg-transparent",
            active === PartnersEnum.EXHIBITORS_TAB && "text-zikoro"
          )}
        >
          Exhibitors
        </Button>
      </div>
    )
}