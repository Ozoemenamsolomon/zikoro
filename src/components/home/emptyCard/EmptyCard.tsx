import { EmptyIcon } from "@/constants"
import {ReactNode} from "react"

export function EmptyCard({ text }: { text: string | ReactNode }) {
    return (
        <div className="w-full col-span-full items-center flex flex-col justify-center h-[300px]">
            <div className="flex items-center justify-center flex-col gap-y-2">

                <EmptyIcon />
                <p className="text-[#717171] font-medium">{text}</p>

            </div>
        </div>
    )
}