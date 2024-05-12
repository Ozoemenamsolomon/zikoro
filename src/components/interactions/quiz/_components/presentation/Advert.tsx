import Link from "next/link";
import { FileCopy } from "@styled-icons/remix-fill/FileCopy";
import { Minimize2 } from "@styled-icons/feather/Minimize2";
import Image from "next/image";
import { Button } from "@/components";
import { cn } from "@/lib";
export function Advert({close, isLeftBox}:{isLeftBox:boolean; close:() =>  void}) {
  return (
    <div className={cn("w-full flex-col bg-white rounded-l-xl h-full col-span-3 items-start justify-between hidden md:flex md:invisible", isLeftBox && "flex md:flex visible md:visible")}>
      <h2 className="font-semibold w-full border-b p-4 text-base sm:text-xl">
        Resin Art Workshop
      </h2>
      <div className="w-full flex flex-col gap-y-4 items-center justify-center ">
        <p>Scan the QR code or use the link to join.</p>

        <p className="flex text-sm items-center gap-x-2">
          <FileCopy size={20} className="text-basePrimary" />
          <Link href={"https://www.zikoro.com"}>https://www.zikoro.com</Link>
        </p>
      </div>

      <div className="p-4 w-full flex items-end justify-between">
        <div className="space-y-1">
          <p>Powered By:</p>
          <Image
            src={"/logo.png"}
            alt="logo"
            width={300}
            height={300}
            className="w-[100px] md:w-[150px] h-[30px] md:h-[40px]"
          />
        </div>

        <Button
        onClick={close}
        className="px-0 h-fit w-fit">
          <Minimize2 size={20} />
        </Button>
      </div>
    </div>
  );
}
