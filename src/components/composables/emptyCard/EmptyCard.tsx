import { EmptyIcon } from "@/constants";
import { ReactNode } from "react";

export function EmptyCard({
  text,
  height,
  width,
}: {
  text: string | ReactNode;
  height?: string;
  width?: string;
}) {
  return (
    <div className="w-full col-span-full items-center flex flex-col justify-center h-[300px]">
      <div className="flex items-center justify-center flex-col gap-y-2">
        <EmptyIcon width={width} height={height} />
        <p className="text-[#717171] font-medium">{text}</p>
      </div>
    </div>
  );
}
