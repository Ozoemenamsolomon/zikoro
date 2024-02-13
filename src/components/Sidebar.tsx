"use client";
import Image from "next/image";
// import { Home } from "@styled-icons/typicons/Home";
import { MoneyDollarBox } from "styled-icons/remix-fill";
import { MegaphoneLoud } from "@styled-icons/fluentui-system-filled/MegaphoneLoud";
import { PaperPlane } from "styled-icons/fa-regular";
import { Cog } from "styled-icons/heroicons-outline";
import { NavLinks } from "./NavLinks";
import { UserActions } from "./UserActions";
import Home from "../../public/home.svg";
// import { Home } from "@styled-icons/octicons/Home";

export const links = [
  {
    name: "Home",
    icon: "/home.svg",
    href: "/",
  },
  {
    name: "Billing",
    icon: "/billing.svg",
    href: "/billing",
  },
  {
    name: "Marketing",
    icon: "/megaphone.svg",
    href: "/marketing",
  },
  {
    name: "Published Events",
    icon: "/paperplane.svg",
    href: "/events",
  },
  {
    name: "Notes",
    icon: "/notes.svg",
    href: "/events",
  },
  {
    name: "Settings",
    icon: "/cog.svg",
    href: "/settings",
  },
  {
    name: "Give feedback",
    icon: "/feedback.svg",
    href: "/feedback",
  },
];
const Sidebar = () => {
  return (
    <div className="h-full bg-white flex-col flex justify-between sticky top-0">
      <div className="flex flex-col gap-8 pb-14 border-r border-basebody">
        <Image
          className="pl-8 py-6"
          src={"/zikoro.svg"}
          alt={"zikoro logo"}
          width={150}
          height={100}
        ></Image>
        <NavLinks></NavLinks>
      </div>
      <UserActions></UserActions>
    </div>
  );
};

export default Sidebar;
