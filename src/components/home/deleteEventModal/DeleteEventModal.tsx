"use client"

import { AlertTriangleOutline } from "styled-icons/evaicons-outline"
import { Button } from "@/components"
import { useDeleteEvent } from "@/hooks"
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export function DeleteEventModal({ close, id, refetch }: { refetch: () => Promise<any>, close: () => void, id: number }) {
    const { deleteEvent, loading } = useDeleteEvent()

    async function deletes() {
        await deleteEvent(id)
        refetch()
        close()
    }
    return (
        <div
            role="button"
            onClick={close}
            className="w-full h-full fixed z-[60] inset-0 bg-black/50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="button"
                className="w-[95%] sm:w-[500px] h-fit flex  box-animation  flex-col gap-y-16 sm:gap-y-20 rounded-lg bg-white m-auto absolute inset-0 py-8 px-3 sm:px-4"
            >
                <div className="w-full flex flex-col items-center justify-center gap-y-2">
                    <AlertTriangleOutline className="text-zikoro" size={72} />
                    <p>Are you sure you want to delete?</p>

                </div>

                <div className="w-full flex items-end justify-end gap-x-3">
                    <Button
                        onClick={close}
                        className="bg-gray-300 font-medium ">Cancel</Button>

                    <Button
                        onClick={deletes}
                        className="bg-zikoro text-gray-50 gap-x-2 font-medium ">
                        {loading && <LoaderAlt className="animate-spin" size={20} />}
                        <span>Delete</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}