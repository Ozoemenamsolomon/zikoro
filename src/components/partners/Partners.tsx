"use client";

import { useState } from "react";
import {
  Button,
  SideBarLayout,
} from "..";
import { cn } from "@/lib";
import { Sponsors } from "./sponsors/Sponsors";


enum PartnersEnum {
  SPONSORS_TAB = 1,
  EXHIBITORS_TAB,
}

export function Partners() {
  const [active, setActive] = useState(1);

  return (
    <SideBarLayout>
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

      <Sponsors/>
     
    </SideBarLayout>
  );
}
