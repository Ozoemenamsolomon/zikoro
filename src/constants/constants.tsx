import { Home } from "@styled-icons/typicons/Home";
import { MoneyDollarBox } from "styled-icons/remix-fill";
import { MegaphoneLoud } from "@styled-icons/fluentui-system-filled/MegaphoneLoud";
import { PaperPlane } from "styled-icons/fa-regular";
import { Cog } from "styled-icons/heroicons-outline";

export const links = [
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