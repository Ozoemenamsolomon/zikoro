import {
  AgendaIcon,
  Hamburger,
  HomeIcon,
  NotificationIcon,
  UserIcon,
} from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dot } from "@styled-icons/bootstrap/Dot";


export function MobileBottomNav({ eventId, toggleSideNav }: { eventId?: string, toggleSideNav:() => void }) {
  const pathname = usePathname();
  return (
    <nav className="w-full flex sm:hidden items-center justify-between border-t z-[99999] px-4 py-4 fixed bottom-0 inset-x-0 bg-white">
     
     <button
      onClick={toggleSideNav}
      className="flex flex-col items-center justify-center gap-y-1">
        <Hamburger color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={18} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </button>
      
      <Link
        className="flex flex-col items-center justify-center gap-y-1"
        href={"/"}
      >
        <UserIcon color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={18} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </Link>
      <Link
        className="flex flex-col items-center justify-center gap-y-1"
        href={`/events/home/${eventId}`}
      >
        <HomeIcon
          color={pathname.includes("events/home") ? "#001ffc" : "#000000"}
        />
        <Dot
          size={18}
          color={pathname.includes("events/home") ? "#001ffc" : "#ffffff"}
        />
      </Link>
      <Link
        className="flex flex-col items-center justify-center gap-y-1"
        href={"/"}
      >
        <AgendaIcon color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={18} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </Link>
      <Link
        className="flex flex-col items-center justify-center gap-y-1"
        href={"/"}
      >
        <NotificationIcon color={pathname === "/" ? "#001ffc" : "#000000"} />
        <Dot size={18} color={pathname === "/" ? "#001ffc" : "#ffffff"} />
      </Link>
     
    </nav>
  );
}
