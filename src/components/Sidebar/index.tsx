"use client";

import React from "react";
import Image from "next/image";
import { Home } from "@styled-icons/typicons/Home";
import { MoneyDollarBox } from "styled-icons/remix-fill";
import { MegaphoneLoud } from "@styled-icons/fluentui-system-filled/MegaphoneLoud";
import { PaperPlane } from "styled-icons/fa-regular";
import { Cog } from "styled-icons/heroicons-outline";
import { NavLinks } from "./NavLinks";
import { UserActions } from "@/components/UserActions";
import { TLink } from "@/types/links";

export const links: TLink[] = [
  {
    name: "Home",
    icon: Home,
    href: "/",
  },
  {
    name: "Billing",
    icon: MoneyDollarBox,
    href: "/billing",
  },
  {
    name: "Marketing",
    icon: MegaphoneLoud,
    href: "/marketing",
  },
  {
    name: "Published Events",
    icon: PaperPlane,
    href: "/events",
  },
  {
    name: "Settings",
    icon: Cog,
    href: "/settings",
  },
];
const Sidebar = () => {
  return (
    <div className="h-full w-[250px] bg-white flex-col flex justify-between sticky top-0">
      <div className="flex flex-col gap-8">
        <Image
          className="p-4"
          src={"/logo.png"}
          alt={"zikoro logo"}
          width={150}
          height={100}
        ></Image>
        <NavLinks />
      </div>
      <UserActions />
    </div>
  );
};

export default Sidebar;
