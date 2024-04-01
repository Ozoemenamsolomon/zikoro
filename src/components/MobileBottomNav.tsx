"use client"

import {
  AgendaIcon,
  Hamburger,
  HomeIcon,
  NotificationIcon,
  UserIcon,
} from "@/components/svg/Constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dot } from "@styled-icons/bootstrap/Dot";
import {Bell} from "@styled-icons/feather/Bell"
import { getCookie } from "@/hooks";


export function MobileBottomNav({ toggleSideNav }: {  toggleSideNav:() => void }) {
  const pathname = usePathname();
  const eventId = getCookie("eventId")
  return (
    <nav className="w-full flex sm:hidden items-center justify-between border-t z-[99999] px-4 py-2 fixed bottom-0 inset-x-0 bg-white">
     
     <button
      // onClick={toggleSideNav}
      className="flex flex-col items-center justify-center">
        <Hamburger color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={10} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </button>
      
      <Link
        className="flex flex-col items-center justify-center"
        href={"/profile"}
      >
        <UserIcon color={pathname.includes("profile") ? "#001ffc" : "#000000"} />
        <Dot size={10} color={pathname.includes("profile") ? "#001ffc" : "#ffffff"} />
      </Link>
      <Link
        className="flex flex-col items-center justify-center"
        href={`/events/home/${eventId}`}
      >
        <HomeIcon
          color={pathname.includes("events/home") ? "#001ffc" : "#000000"}
        />
        <Dot
          size={10}
          color={pathname.includes("events/home") ? "#001ffc" : "#ffffff"}
        />
      </Link>
      <Link
        className="flex flex-col items-center justify-center"
        href={"/"}
      >
        <AgendaIcon color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={10} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </Link>
      <Link
        className="flex flex-col items-center justify-center"
        href={"/"}
      >
        <Bell size={22} color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={10} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </Link>
     
    </nav>
  );
}