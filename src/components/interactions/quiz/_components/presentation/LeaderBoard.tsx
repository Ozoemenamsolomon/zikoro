import { Minimize2 } from "@styled-icons/feather/Minimize2";
import Image from "next/image";
import { Button } from "@/components";
import { cn } from "@/lib";
export function LeaderBoard({isRightBox,isLeftBox, close}:{isLeftBox: boolean; isRightBox: boolean; close:() => void}) {
  return (
    <div className={cn("w-full col-span-3 bg-white h-[90vh] rounded-r-xl hidden  md:hidden", isRightBox && "block md:block ", !isLeftBox && "col-span-4" )}>
      <div className="flex items-center p-4 justify-between w-full border-b">
        <h2 className="font-semibold  text-base sm:text-xl">LeaderBoard</h2>
        <Button
           onClick={close}
          className="px-0 h-fit w-fit"
        >
          <Minimize2 size={20} />
        </Button>
      </div>
      <div className="font-semibold text-sm w-full grid grid-cols-2 gap-2 bg-gray-200 px-4 py-3">
        <p>Name</p>
        <p>Total</p>
      </div>
    </div>
  );
}
