"use client";

import {
  AgendaIcon,
  Hamburger,
  HomeIcon,
  UserIcon,
} from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dot } from "styled-icons/bootstrap";
import { Bell } from "styled-icons/feather";
import { getCookie } from "@/hooks";

export function MobileBottomNav({
  toggleSideNav,
  isHaveEvent,
}: {
  isHaveEvent?: boolean;
  toggleSideNav: () => void;
}) {
  const pathname = usePathname();
  const event = getCookie("currentEvent");
  const router = useRouter();
  
  return (
    <nav className="w-full flex sm:hidden items-center justify-between border-t z-[99999] px-4 py-2 fixed bottom-0 inset-x-0 bg-white">
      <button
        onClick={toggleSideNav}
        className="flex flex-col items-center justify-center"
      >
        <Hamburger color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={10} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </button>

      <Link
        className="flex flex-col items-center justify-center"
        href={"/profile"}
      >
        <UserIcon
          color={pathname.includes("profile") ? "#001ffc" : "#000000"}
        />
        <Dot
          size={10}
          color={pathname.includes("profile") ? "#001ffc" : "#ffffff"}
        />
      </Link>
      <Link
        className="flex flex-col items-center justify-center"
        href={`/event/${event?.eventAlias}/reception`}
      >
        <HomeIcon color={pathname.includes("reception") ? "#001ffc" : "#000000"} />
        <Dot
          size={10}
          color={pathname.includes("reception") ? "#001ffc" : "#ffffff"}
        />
      </Link>
      <Link
        className="flex flex-col items-center justify-center"
        href={`/event/${event?.eventAlias}/agenda`}
      >
        <AgendaIcon
          color={pathname.includes("agenda") ? "#001ffc" : "#000000"}
        />
        <Dot
          size={10}
          color={pathname.includes("agenda") ? "#001ffc" : "#ffffff"}
        />
      </Link>
      <Link className="flex flex-col items-center justify-center" href={"/"}>
        <Bell size={22} color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={10} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </Link>
    </nav>
  );
}
