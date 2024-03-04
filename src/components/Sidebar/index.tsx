"use client";

import React from "react";
import Image from "next/image";
import { Home } from "styled-icons/typicons";
import { MoneyDollarBox } from "styled-icons/remix-fill";
import { MegaphoneLoud } from "styled-icons/fluentui-system-filled";
import { PaperPlane } from "styled-icons/fa-regular";
import { Cog } from "styled-icons/heroicons-outline";
import { NavLinks } from "./NavLinks";
import { UserActions } from "@/components/UserActions";

export type TLink = {
  name: string;
  href: string;
  icon?: React.FC;
};

export const links: TLink[] = [
  {
    name: "Home",
    icon: ({ ...props }) => <Home {...props} />,
    href: "/",
  },
  {
    name: "Billing",
    icon: ({ ...props }) => <MoneyDollarBox {...props} />,
    href: "/billing",
  },
  {
    name: "Marketing",
    icon: ({ ...props }) => <MegaphoneLoud {...props} />,
    href: "/marketing",
  },
  {
    name: "Published Events",
    icon: ({ ...props }) => <PaperPlane {...props} />,
    href: "/events",
  },
  {
    name: "Settings",
    icon: ({ ...props }) => <Cog {...props} />,
    href: "/settings",
  },
];
const Sidebar = () => {
  return (
    <div className="h-full w-full bg-white flex-col flex justify-between">
      <div className="flex flex-col gap-8">
        <Image
          className="p-4"
          src={"/logo.png"}
          alt={"zikoro logo"}
          width={150}
          height={100}
        ></Image>
        <NavLinks />
      <UserActions />
      </div>
    </div>
  );
};

export default Sidebar;
